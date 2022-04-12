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

    event TransitionFired(address indexed _caller, string indexed _stateMachine, StateMachine.State indexed _newState);
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

    function fireTransition(string memory _stateMachineName) public {
        bool fired;

        fired = fireTransitionI(_stateMachineName);

        /* #Roles */
        if (!fired) fired = fireTransitionR(_stateMachineName);
        /* /Roles */

        require(fired, "Caller cannot fire transition.");

        /* #EventsEmission */
        emit TransitionFired(msg.sender, _stateMachineName, stateMachineContract.getStateMachineCurrentState(_stateMachineName));
        /* /EventsEmission */
    }

    function fireTransitionI(string memory _stateMachineName) private returns (bool) {
        if (!participantsContract.doesParticipantExist(msg.sender)) return false;

        address[] memory authorizedIndividuals = stateMachineContract.getStateMachineCurrentState(_stateMachineName).authorizedParticipants;

        bool found = Helpers.searchAddressInArray(msg.sender, authorizedIndividuals) != -1;
        if (found) stateMachineContract.fireTransition(_stateMachineName);
        return found;
    }

    /* #Roles */
    function fireTransitionR(string memory _stateMachineName) private returns (bool) {
        if (!participantsContract.doesParticipantExist(msg.sender)) return false;

        string[] memory authorizedRoles = stateMachineContract.getStateMachineCurrentState(_stateMachineName).authorizedRoles;
        bool found;

        for (uint i = 0; i < authorizedRoles.length; i++) {
            if (participantsContract.participantHasRole(msg.sender, authorizedRoles[i])) {
                found = true;
                break;
            }
        }

        if (found) stateMachineContract.fireTransition(_stateMachineName);
        return found;
    }
    /* /Roles */
}