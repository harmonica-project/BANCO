// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../data/StateMachine.sol";
import "../data/Participants.sol";
import "../lib/Helpers.sol";

contract StateMachineController {
      // ---- STATES ---- //
    address factory;
    StateMachine stateMachineContract;
    Participants participantsContract;


    constructor(
        address _factory, 
        address _stateMachineAddr,
        address _participantsAddr
    )
    {
        factory = _factory;
        stateMachineContract = StateMachine(_stateMachineAddr);
        participantsContract = Participants(_participantsAddr);
    }

    function getFactory() public view returns (address) {
        return factory;
    }

    function createStateMachineInstance(string memory _model) public returns (uint) {
        // TODO: implement an access-control system to let only specific individuals/roles create instances

        return stateMachineContract.createStateMachineInstance(_model);
    }

    function fireTransition(uint _instanceId, bytes32 _attachedData) public {
        bool fired;

        fired = fireTransitionI(_instanceId, _attachedData);

        if (!fired) fired = fireTransitionR(_instanceId, _attachedData);

        require(fired, "Caller cannot fire transition.");

    }

    function fireTransitionI(uint _instanceId, bytes32 _attachedData) private returns (bool) {
        if (!participantsContract.doesParticipantExist(msg.sender)) return false;

        address[] memory authorizedIndividuals = stateMachineContract.getStateMachineCurrentState(_instanceId).authorizedParticipants;

        bool found = Helpers.searchAddressInArray(msg.sender, authorizedIndividuals) != -1;
        if (found) stateMachineContract.fireTransition(_instanceId, _attachedData);
        return found;
    }

    function fireTransitionR(uint _instanceId, bytes32 _attachedData) private returns (bool) {
        if (!participantsContract.doesParticipantExist(msg.sender)) return false;

        string[] memory authorizedRoles = stateMachineContract.getStateMachineCurrentState(_instanceId).authorizedRoles;
        bool found;

        for (uint i = 0; i < authorizedRoles.length; i++) {
            if (participantsContract.participantHasRole(msg.sender, authorizedRoles[i])) {
                found = true;
                break;
            }
        }

        if (found) stateMachineContract.fireTransition(_instanceId, _attachedData);
        return found;
    }
}