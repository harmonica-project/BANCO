// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";
import "./Participants.sol";

contract StateMachine {
    // ---- STATES ---- //
    struct State {
        string name;
        bytes32 attachedData;
        string[] authorizedRoles;
        address[] authorizedParticipants;
    }

    mapping(uint => State[]) stateMachineInstances;
    mapping(string => State[]) stateMachineModels;
    mapping(uint => uint256) currentStates;
    
    Participants participantsContract;
    address factory;
    address controller;
    uint maxInstanceId = 0;

    constructor(
        address _factory,
        address _participantsAddr,
        State[][] memory _stateMachineModels,
        string[] memory _stateMachineModelsNames
    ) {
        factory = _factory;
        
        require(
            _stateMachineModelsNames.length == _stateMachineModelsNames.length,
            "Not exactly one unique model name for every model."
        );
        require(
            Helpers.doArrayHasDuplicates(_stateMachineModelsNames),
            "Not exactly one unique model name for every model."
        );

        participantsContract = Participants(_participantsAddr);

        for (uint256 i = 0; i < _stateMachineModels.length; i++) {
            require(
                checkStateCollectionValidity(_stateMachineModels[i]),
                "Invalid state machine model."
            );
            
            for (uint j = 0; j < _stateMachineModels[i].length; j++) {
                stateMachineModels[_stateMachineModelsNames[i]].push(_stateMachineModels[i][j]);
            }
        }
    }

    modifier onlyFactory() {
        require(factory == msg.sender, "Function caller is not the manager.");
        _;
    }

    modifier onlyController() {
        require(
            controller == msg.sender,
            "Function caller is not the manager."
        );
        _;
    }

    function getFactory() public view returns (address) {
        return factory;
    }

    function getController() public view returns (address) {
        return controller;
    }

    function assignController(address _controller) public onlyFactory {
        controller = _controller;
    }

    function createStateMachineInstance(string memory _model) public onlyController returns (uint) {
        require(stateMachineModels[_model].length > 0, "State machine model does not exist.");

        uint newInstanceId = maxInstanceId;
        maxInstanceId = maxInstanceId + 1;

        stateMachineInstances[newInstanceId] = stateMachineModels[_model];

        return newInstanceId;
    }

    function checkStateCollectionValidity(State[] memory _states)
        private
        view
        returns (bool)
    {
        // TODO: verify that even if a role exist, someone has it or can grant it to others

        // the state machine must contain at least two states to be relevant
        if (_states.length < 2) return false;

        // the last state being final, it is not checked as only its name is relevant
        for (uint256 i = 0; i < _states.length - 1; i++) {
            // each transition must have at least one existing participant
            if (_states[i].authorizedParticipants.length == 0) return false;

            for (
                uint256 j = 0;
                j < _states[i].authorizedParticipants.length;
                j++
            ) {
                address participant = _states[i].authorizedParticipants[j];
                if (!participantsContract.doesParticipantExist(participant))
                    return false;
            }

            if (
                _states[i].authorizedParticipants.length == 0 &&
                _states[i].authorizedRoles.length == 0
            ) return false;

            for (uint256 j = 0; j < _states[i].authorizedRoles.length; j++) {
                string memory role = _states[i].authorizedRoles[j];
                if (!participantsContract.doesRoleExist(role)) return false;
            }
        }

        return true;
    }

    function getStateMachineCurrentState(uint _instanceId)
        public
        view
        returns (State memory)
    {
        return
            stateMachineInstances[_instanceId][
                currentStates[_instanceId]
            ];
    }

    function getStateMachine(uint _instanceId)
        public
        view
        returns (State[] memory)
    {
        return stateMachineInstances[_instanceId];
    }

    function getStateMachineState(uint _instanceId, uint256 _id)
        public
        view
        returns (State memory)
    {
        require(
            _id < stateMachineInstances[_instanceId].length,
            "State id out-of-bounds"
        );

        return stateMachineInstances[_instanceId][_id];
    }

    function fireTransition(uint _instanceId, bytes32 _attachedData)
        public
        onlyController
    {
        require(
            currentStates[_instanceId] <
                stateMachineInstances[_instanceId].length - 1,
            "State machine is in final state."
        );

        uint currState = currentStates[_instanceId];
        stateMachineInstances[_instanceId][currState].attachedData = _attachedData;
        currentStates[_instanceId] = currState + 1;
    }
}
