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

    /* #EventsEmission */
    // ---- EVENTS ---- //

    event TransitionFired(address indexed _caller, uint indexed _stateMachine, StateMachine.State indexed _newState);
    /* /EventsEmission */

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

        /* #Roles */
        if (!fired) fired = fireTransitionR(_instanceId, _attachedData);
        /* /Roles */

        require(fired, "Caller cannot fire transition.");

        /* #EventsEmission */
        emit TransitionFired(msg.sender, _instanceId, stateMachineContract.getStateMachineCurrentState(_instanceId));
        /* /EventsEmission */
    }

    function fireTransitionI(uint _instanceId, bytes32 _attachedData) private returns (bool) {
        if (!participantsContract.doesParticipantExist(msg.sender)) return false;

        address[] memory authorizedIndividuals = stateMachineContract.getStateMachineCurrentState(_instanceId).authorizedParticipants;

        bool found = Helpers.searchAddressInArray(msg.sender, authorizedIndividuals) != -1;
        if (found) stateMachineContract.fireTransition(_instanceId, _attachedData);
        return found;
    }

    /* #Roles */
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
    /* /Roles */
}