// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";
import "../data/Participants.sol";

contract ParticipantsController {
    // ---- STATES ---- //
    address factory;
    Participants participantsContract;

    // ---- EVENTS ---- //

    event ParticipantAdded(address indexed _caller, address indexed _newParticipant);
    event ParticipantRemoved(address indexed _caller, address indexed _deletedParticipant);
    event RoleAdded(address indexed _caller, address indexed _participant, string indexed _role);
    event RoleRemoved(address indexed _caller, address indexed _participant, string indexed _role);

    constructor(
        address _factory,
        address _participantsContract
    )
    {
        factory = _factory;
        participantsContract = Participants(_participantsContract);
    }

    function getFactory() public view returns (address) {
        return factory;
    }

    function getParticipantsContractAddress() public view returns (address) {
        return address(participantsContract);
    }

    function doesParticipantExists(address _participant) public view returns(bool) {
        return participantsContract.doesParticipantExist(_participant);
    }

    // PARTICIPANT MANAGEMENT

    function addParticipant(
        address _participant
    ) 
        public 
    {
        if (verifyIsAdmin()) {
            participantsContract.addParticipant(_participant);

            emit ParticipantAdded(msg.sender, _participant);
        }
    }


    function removeParticipant(address _participant) public {
        bool deleted;

        deleted = removeParticipantI(_participant);


        require(deleted, "Caller cannot remove participant.");

        emit ParticipantRemoved(msg.sender, _participant);
    }

    function removeParticipantI(
        address _participant
    ) 
        private 
        returns (bool)
    {
        bool isAdmin = verifyIsAdmin();
        if (isAdmin) participantsContract.removeParticipant(_participant);
        return isAdmin;
    }


    function verifyIsAdmin() private view returns (bool) {
        if (!(participantsContract.getParticipant(msg.sender).addr == msg.sender)) return false;

        // caller must be able to add a participant
        return participantsContract.getParticipant(msg.sender).isAdmin;
    }



}
