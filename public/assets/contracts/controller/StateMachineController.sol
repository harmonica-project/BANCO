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

    function fireTransitionI(string memory _stateMachineName) public {
        require(participantsContract.doesParticipantExist(msg.sender), "Caller is not a participant");
        address[] memory authorizedIndividuals = stateMachineContract.getStateMachineCurrentState(_stateMachineName).authorizedParticipants;
        require(Helpers.searchAddressInArray(msg.sender, authorizedIndividuals) != -1, "Caller cannot fire this transition");

        stateMachineContract.fireTransition(_stateMachineName);
    }
}