// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";
import "../data/Participants.sol";

contract ParticipantsController {
    // ---- STATES ---- //
    address factory;
    Participants participantsContract;

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

    /* #CreateIndividualDynamically */
    function addParticipant(
        address _participant,
        Participants.ParticipantType _pType
    ) 
        public 
        verifyIsAdmin 
    {
        participantsContract.addParticipant(_participant, _pType);
    }

    /* /CreateIndividualDynamically */

    /* #DeleteIndividualByIndividual */
    function removeParticipantI(
        address _participant
    ) 
        public 
        verifyIsAdmin 
    {
        participantsContract.removeParticipant(_participant);
    }
    /* /DeleteIndividualByIndividual */

    /* #DeleteIndividualByRole */
    function removeParticipantR(address _participant) public {
        // caller must be in a group able to remove a participant
        string[] memory callerRoles = participantsContract
            .getParticipant(msg.sender)
            .roles;
        bool found = false;

        for (uint256 i = 0; i < callerRoles.length; i++) {
            if (participantsContract.getRole(callerRoles[i]).isAdmin) {
                found = true;
                break;
            }
        }

        require(found, "User do not have any admin role.");

        participantsContract.removeParticipant(_participant);
    }

    /* /DeleteIndividualByRole */

    /*  #Individuals */
    modifier verifyIsAdmin() {
        require(
            participantsContract.getParticipant(msg.sender).addr == msg.sender,
            "Participant does not exist."
        );

        // caller must be able to add a participant
        require(
            participantsContract.getParticipant(msg.sender).isAdmin,
            "Caller cannot add participant."
        );

        _;
    }
    /*  /Individuals */

    /* #Roles */
    // ROLE MANAGEMENT

    modifier verifyRolePermission(string memory _roleName) {
        require(participantsContract.participantHasRole(msg.sender, _roleName), "User do not have this right through its roles.");
        _;
    }

    /* /Roles */

    /* #AddRoleDynamically */
    function addRoleToParticipant(
        address _participant,
        string memory _roleName
    ) 
        public 
        verifyRolePermission(_roleName) 
    {
        participantsContract.addRoleToParticipant(_participant, _roleName);
    }

    /* /AddRoleDynamically */

    /* #RemoveRole */
    function removeRoleToParticipant(
        address _participant,
        string memory _roleName
    ) 
        public 
        verifyRolePermission(_roleName) 
    {
        participantsContract.removeRoleToParticipant(_participant, _roleName);
    }
    /* /RemoveRole */
}
