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
    {
        if (verifyIsAdmin()) participantsContract.addParticipant(_participant, _pType);
    }

    /* /CreateIndividualDynamically */

    /* #DeleteIndividual */
    function removeParticipant(address _participant) public {
        bool deleted;

        /* #DeleteIndividualByIndividual */
        deleted = removeParticipantI(_participant);
        /* /DeleteIndividualByIndividual */

        /* #DeleteIndividualByRole */
        // Might revert if removeParticipantR is still evaluated even if deleted = true
        deleted = deleted || removeParticipantR(_participant);
        /* /DeleteIndividualByRole */

        require(deleted, "Caller cannot remove participant.");
    }
    /* /DeleteIndividual */

    /* #DeleteIndividualByIndividual */
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
    /* /DeleteIndividualByIndividual */

    /* #DeleteIndividualByRole */
    function removeParticipantR(address _participant) private returns (bool) {
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

        if (found) participantsContract.removeParticipant(_participant);
        return found;
    }

    /* /DeleteIndividualByRole */

    /*  #Individuals */
    function verifyIsAdmin() private view returns (bool) {
        if (!(participantsContract.getParticipant(msg.sender).addr == msg.sender)) return false;

        // caller must be able to add a participant
        return participantsContract.getParticipant(msg.sender).isAdmin;
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
