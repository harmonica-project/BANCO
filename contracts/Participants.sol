// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "./Helpers.sol";

contract Participants {
  // STRUCTS

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

  // STATES
  address manager;

  Participant[] participants;
  mapping(address => uint256) addressToParticipantId;

  /* #Roles */
  Role[] roles;
  mapping(string => uint256) roleNameToRoleId;

  /* /Roles */

  constructor(
    address _manager
    /* #CreateIndividualAtSetup */
    ,Participant[] memory _participants
    /* /CreateIndividualAtSetup */
    /* #Roles */
    ,Role[] memory _roles /* /Roles */
  ) {
    manager = _manager;

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

  modifier onlyManager() {
    require(manager == msg.sender);
    _;
  }

  // PARTICIPANT MANAGEMENT

  /* #CreateIndividualDynamically */
  function addParticipant(
    address _participant,
    address _caller,
    ParticipantType _pType
  ) public onlyManager {
    // ensure that the caller exist as if it does not, the next check will be done on participant 0
    require(
      participants[addressToParticipantId[_caller]].addr == _caller,
      "Participant does not exist."
    );

    // caller must be able to add a participant
    require(
      participants[addressToParticipantId[_caller]].isAdmin,
      "Caller cannot add participant."
    );

    participants.push(
      Participant(_participant, false, new string[](0), _pType)
    );
    addressToParticipantId[_participant] = participants.length - 1;
  }

  /* /CreateIndividualDynamically */

  /* #DeleteIndividual */
  function removeParticipant(address _addr) private {
    // At least one participant must exist
    require(participants.length > 0, "There is no participant.");

    // inverting last participant with the participant to delete to avoid any gap
    Participant memory lastParticipant = participants[participants.length - 1];
    participants[addressToParticipantId[_addr]] = lastParticipant;
    addressToParticipantId[lastParticipant.addr] = addressToParticipantId[
      _addr
    ];
    addressToParticipantId[_addr] = 0;
    participants.pop();
  }

  /* /DeleteIndividual */

  /* #DeleteIndividualByIndividual */
  function removeParticipantI(address _participant, address _caller)
    public
    onlyManager
  {
    // ensure that the caller exist as if it does not, the next check will be done on participant 0
    require(
      participants[addressToParticipantId[_caller]].addr == _caller,
      "Participant does not exist."
    );

    // caller must be able to remove a participant
    require(
      participants[addressToParticipantId[_caller]].isAdmin,
      "Caller cannot remove participant."
    );
    removeParticipant(_participant);
  }

  /* /DeleteIndividualByIndividual */

  /* #DeleteIndividualByRole */
  function removeParticipantR(address _participant, address _caller)
    public
    onlyManager
  {
    // caller must be in a group able to remove a participant
    string[] memory callerRoles = participants[addressToParticipantId[_caller]]
      .roles;
    bool found = false;

    for (uint256 i = 0; i < callerRoles.length; i++) {
      if (roles[roleNameToRoleId[callerRoles[i]]].isAdmin) {
        found = true;
        break;
      }
    }

    require(found, "User do not have any admin role.");

    removeParticipant(_participant);
  }

  /* /DeleteIndividualByRole */

  function getParticipant(address _participant)
    public
    view
    returns (Participant memory)
  {
    // mapping will return an ID of 0 for non-existing participants
    // we have to verify the participant correctness by ourselves here
    require(
      participants[addressToParticipantId[_participant]].addr == _participant,
      "Participant does not exist."
    );
    return participants[addressToParticipantId[_participant]];
  }

  /* #Roles */
  // ROLE MANAGEMENT

  function verifyRolePermission(address _caller, string memory _roleName)
    private
    view
    returns (bool)
  {
    string[] memory callerRoles = participants[addressToParticipantId[_caller]]
      .roles;

    for (uint256 i = 0; i < callerRoles.length; i++) {
      string[] memory managedRoles = roles[roleNameToRoleId[callerRoles[i]]]
        .managedRoles;

      for (uint256 j = 0; j < managedRoles.length; j++) {
        if (Helpers.strCmp(managedRoles[j], _roleName)) {
          return true;
        }
      }
    }

    return false;
  }

  function participantHasRole(address _participant, string memory _roleName)
    public
    view
    returns (bool)
  {
    string[] memory participantRoles = participants[
      addressToParticipantId[_participant]
    ].roles;

    for (uint256 i = 0; i < participantRoles.length; i++) {
      Role memory role = roles[roleNameToRoleId[participantRoles[i]]];

      if (Helpers.strCmp(role.name, _roleName)) {
        return true;
      }
    }

    return false;
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
      "Participant does not exist."
    );
    return roles[roleNameToRoleId[_roleName]];
  }

  /* /Roles */

  /* #AddRoleDynamically */
  function addRoleToParticipant(
    address _participant,
    address _caller,
    string memory _roleName
  ) public onlyManager {
    require(
      verifyRolePermission(_caller, _roleName),
      "User do not have this right through its roles."
    );
    participants[addressToParticipantId[_participant]].roles.push(_roleName);
  }

  /* /AddRoleDynamically */

  /* #RemoveRole */
  function removeRoleToParticipant(
    address _participant,
    address _caller,
    string memory _roleName
  ) public onlyManager {
    require(
      verifyRolePermission(_caller, _roleName),
      "User do not have this right through its roles."
    );

    string[] storage participantRoles = participants[
      addressToParticipantId[_participant]
    ].roles;
    int256 position = Helpers.searchStringInArray(_roleName, participantRoles);

    require(position > -1, "Participant do not own the role to be removed.");

    string memory lastRoleName = participantRoles[participantRoles.length - 1];
    participantRoles[uint256(position)] = lastRoleName;
    participantRoles.pop();
  }
  /* /RemoveRole */
}
