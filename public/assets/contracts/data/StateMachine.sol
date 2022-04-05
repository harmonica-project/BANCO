// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";
import "./Participants.sol";

contract StateMachine {
    // ---- STATES ---- //
    struct State {
        string name;
        /* #Roles */
        string[] authorizedRoles;
        /* /Roles */
        address[] authorizedParticipants;
    }

    mapping(string => State[]) nameToStates;
    mapping(string => uint256) nameToCurrentState;
    Participants participantsContract;
    address factory;
    address controller;

    constructor(
        address _factory,
        address _participantsAddr,
        State[][] memory _statesCollections,
        string[] memory _collectionNames
    ) {
        factory = _factory;

        require(
            _statesCollections.length == _collectionNames.length,
            "Not exactly one unique collection name for every collection."
        );
        require(
            Helpers.doArrayHasDuplicates(_collectionNames),
            "Not exactly one unique collection name for every collection."
        );

        participantsContract = Participants(_participantsAddr);

        for (uint256 i = 0; i < _statesCollections.length; i++) {
            require(
                checkStateCollectionValidity(_statesCollections[i]),
                "Invalid state machine."
            );
            
            for (uint j = 0; j < _statesCollections[i].length; j++) {
                nameToStates[_collectionNames[i]].push(_statesCollections[i][j]);
            }
            nameToCurrentState[_collectionNames[i]] = 0;
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
                i++
            ) {
                address participant = _states[i].authorizedParticipants[j];
                if (!participantsContract.doesParticipantExist(participant))
                    return false;
            }

            /* #Roles */
            if (
                _states[i].authorizedParticipants.length == 0 &&
                _states[i].authorizedRoles.length == 0
            ) return false;

            for (uint256 j = 0; j < _states[i].authorizedRoles.length; i++) {
                string memory role = _states[i].authorizedRoles[j];
                if (!participantsContract.doesRoleExist(role)) return false;
            }
            /* /Roles */
        }

        return true;
    }

    function getStateMachineCurrentState(string memory _stateMachineName)
        public
        view
        returns (State memory)
    {
        return
            nameToStates[_stateMachineName][
                nameToCurrentState[_stateMachineName]
            ];
    }

    function getStateMachine(string memory _stateMachineName)
        public
        view
        returns (State[] memory)
    {
        return nameToStates[_stateMachineName];
    }

    function getStateMachineState(string memory _stateMachineName, uint256 _id)
        public
        view
        returns (State memory)
    {
        require(
            _id < nameToStates[_stateMachineName].length,
            "State id out-of-bounds"
        );

        return nameToStates[_stateMachineName][_id];
    }

    function fireTransition(string memory _stateMachineName)
        public
        onlyController
    {
        require(
            nameToCurrentState[_stateMachineName] <
                nameToStates[_stateMachineName].length - 1,
            "State machine is in final state."
        );

        nameToCurrentState[_stateMachineName] =
            nameToCurrentState[_stateMachineName] +
            1;
    }
}
