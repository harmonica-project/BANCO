// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";

contract Participants {
    // ---- STRUCTS ---- //

    /* #Roles */
    struct Role {
        string name;
        bool isAdmin;
        string[] managedRoles;
    }
    /* /Roles */

    struct Participant {
        address addr;
        bool isAdmin;
        string[] roles;
        /* #IndividualType */
        ParticipantType pType;
        /* /IndividualType */
    }

    /* #IndividualType */
    enum ParticipantType {
        Individual
        /* #IoTSensor */
        ,IoTSensor
        /* /IoTSensor */
        /* #Service */
        ,Service
        /* /Service */
    }
    /* /IndividualType */

    // ---- STATES ---- //
    address factory;
    address controller;
    Participant[] participants;
    mapping(address => uint256) addressToParticipantId;

    /* #Roles */
    Role[] roles;
    mapping(string => uint256) roleNameToRoleId;

    /* /Roles */

    constructor(
        address _factory
        /* #CreateIndividualAtSetup */
        ,Participant[] memory _participants
        /* /CreateIndividualAtSetup */
        /* #Roles */
        ,Role[] memory _roles /* /Roles */
    ) {
        factory = _factory;

        /* #Roles */
        for (uint256 i = 0; i < _roles.length; i++) {
            roles.push(_roles[i]);
            roleNameToRoleId[_roles[i].name] = i;
        }
        /* /Roles */

        /* #CreateIndividualAtSetup */
        for (uint256 i = 0; i < _participants.length; i++) {
            participants.push(_participants[i]);
            addressToParticipantId[_participants[i].addr] = i;
        }
        /* /CreateIndividualAtSetup */
    }

    modifier onlyFactory() {
        require(factory == msg.sender, "Function caller is not the manager.");
        _;
    }

    modifier onlyController() {
        require(controller == msg.sender, "Function caller is not the manager.");
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

    // ---- PARTICIPANT MANAGEMENT ---- //

    modifier participantExists(address _participant) {
        require(
            doesParticipantExist(_participant), "Participant does not exist."
        );
        _;
    }

    function doesParticipantExist(address _participant) public view returns (bool) {
        return (participants[addressToParticipantId[_participant]].addr ==
                _participant);
    }

    function getParticipant(address _participant)
        public
        view
        participantExists(_participant)
        returns (Participant memory)
    {
        return participants[addressToParticipantId[_participant]];
    }

    /* #CreateIndividualDynamically */
    modifier participantNotExists(address _participant) {
        require(
            participants[addressToParticipantId[_participant]].addr !=
                _participant,
            "Participant does not exist."
        );
        _;
    }

    function addParticipant(address _participant, ParticipantType _pType)
        public
        onlyController
        participantNotExists(_participant)
    {
        participants.push(
            Participant(_participant, false, new string[](0), _pType)
        );
        addressToParticipantId[_participant] = participants.length - 1;
    }

    /* /CreateIndividualDynamically */

    /* #DeleteIndividual */
    function removeParticipant(address _participant)
        public
        onlyController
        participantExists(_participant)
    {
        // inverting last participant with the participant to delete to avoid any gap
        Participant memory lastParticipant = participants[
            participants.length - 1
        ];
        participants[addressToParticipantId[_participant]] = lastParticipant;
        addressToParticipantId[lastParticipant.addr] = addressToParticipantId[
            _participant
        ];
        addressToParticipantId[_participant] = 0;
        participants.pop();
    }

    /* /DeleteIndividual */

    /* #Roles */
    // ROLE MANAGEMENT

    function participantHasRole(address _participant, string memory _roleName)
        public
        view
        returns (bool)
    {
        string[] memory participantRoles = getParticipant(_participant).roles;

        for (uint256 i = 0; i < participantRoles.length; i++) {
            Participants.Role memory role = getRole(participantRoles[i]);

            if (Helpers.strCmp(role.name, _roleName)) {
                return true;
            }
        }

        return false;
    }

    function doesRoleExist(string memory _role) public view returns (bool) {
        return (Helpers.strCmp(roles[roleNameToRoleId[_role]].name, _role));
    }

    function getRole(string memory _roleName)
        public
        view
        returns (Role memory)
    {
        // mapping will return an ID of 0 for non-existing roles
        // we have to verify the role correctness by ourselves here
        require(
            Helpers.strCmp(_roleName, roles[roleNameToRoleId[_roleName]].name),
            "Role does not exist."
        );
        return roles[roleNameToRoleId[_roleName]];
    }

    /* #AddRoleDynamically */
    function addRoleToParticipant(address _participant, string memory _roleName)
        public
        onlyController
        participantExists(_participant)
    {
        participants[addressToParticipantId[_participant]].roles.push(
            _roleName
        );
    }

    /* /AddRoleDynamically */

    /* #RemoveRole */
    function removeRoleToParticipant(
        address _participant,
        string memory _roleName
    ) public onlyController participantExists(_participant) {
        string[] storage participantRoles = participants[
            addressToParticipantId[_participant]
        ].roles;
        int256 position = Helpers.searchStringInArray(
            _roleName,
            participantRoles
        );

        require(
            position > -1,
            "Participant do not own the role to be removed."
        );

        string memory lastRoleName = participantRoles[
            participantRoles.length - 1
        ];
        participantRoles[uint256(position)] = lastRoleName;
        participantRoles.pop();
    }
    /* /RemoveRole */
    /* /Roles */
}
