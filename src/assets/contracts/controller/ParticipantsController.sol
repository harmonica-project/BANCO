// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";
import "../data/Participants.sol";

contract ParticipantsController {
    // ---- STATES ---- //
    address manager;
    Participants participantsContract;

    constructor(
        address _manager
        /* #CreateIndividualAtSetup */
        ,Participants.Participant[] memory _participants
        /* /CreateIndividualAtSetup */
        /* #Roles */
        ,Participants.Role[] memory _roles
        /* /Roles */
    )
    {
        manager = _manager;

        participantsContract = new Participants(
            address(this)
            /* #CreateIndividualAtSetup */
            ,_participants
            /* /CreateIndividualAtSetup */
            /* #Roles */
            ,_roles
            /* /Roles */
        );
    }

    modifier onlyManager() {
        require(manager == msg.sender, "Function caller is not the manager.");
        _;
    }

    function getManager() public view returns (address) {
        return manager;
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
        address _caller,
        Participants.ParticipantType _pType
    ) public onlyManager verifyIsAdmin(_caller) {
        participantsContract.addParticipant(_participant, _pType);
    }

    /* /CreateIndividualDynamically */

    /* #DeleteIndividualByIndividual */
    function removeParticipantI(address _participant, address _caller)
        public
        verifyIsAdmin(_caller)
        onlyManager
    {
        participantsContract.removeParticipant(_participant);
    }

    /* /DeleteIndividualByIndividual */

    /* #DeleteIndividualByRole */
    function removeParticipantR(address _participant, address _caller)
        public
        onlyManager
    {
        // caller must be in a group able to remove a participant
        string[] memory callerRoles = participantsContract
            .getParticipant(_caller)
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
    modifier verifyIsAdmin(address _caller) {
        require(
            participantsContract.getParticipant(_caller).addr == _caller,
            "Participant does not exist."
        );

        // caller must be able to add a participant
        require(
            participantsContract.getParticipant(_caller).isAdmin,
            "Caller cannot add participant."
        );

        _;
    }
    /*  /Individuals */

    /* #Roles */
    // ROLE MANAGEMENT

    modifier verifyRolePermission(address _participant, string memory _roleName) {
        require(participantHasRole(_participant, _roleName), "User do not have this right through its roles.");
        _;
    }

    function participantHasRole(address _participant, string memory _roleName)
        public
        view
        returns (bool)
    {
        string[] memory participantRoles = participantsContract
            .getParticipant(_participant)
            .roles;

        for (uint256 i = 0; i < participantRoles.length; i++) {
            Participants.Role memory role = participantsContract.getRole(
                participantRoles[i]
            );

            if (Helpers.strCmp(role.name, _roleName)) {
                return true;
            }
        }

        return false;
    }

    /* /Roles */

    function doesRoleExists(string memory _role) public view returns(bool) {
        return participantsContract.doesRoleExist(_role);
    }

    /* #AddRoleDynamically */
    function addRoleToParticipant(
        address _participant,
        address _caller,
        string memory _roleName
    ) public onlyManager verifyRolePermission(_caller, _roleName) {
        participantsContract.addRoleToParticipant(_participant, _roleName);
    }

    /* /AddRoleDynamically */

    /* #RemoveRole */
    function removeRoleToParticipant(
        address _participant,
        address _caller,
        string memory _roleName
    ) public onlyManager verifyRolePermission(_caller, _roleName) {
        participantsContract.removeRoleToParticipant(_participant, _roleName);
    }
    /* /RemoveRole */
}
