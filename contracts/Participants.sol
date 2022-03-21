// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

contract Participants {
  // STRUCTS
  struct Role {
    string name;
    string[] manageRoles;
    string[] manageGroups; 
  }

  struct Group {
    string name;
    string[] manageRoles;
    string[] manageGroups; 
  }

  struct Participant {
    address addr;
    bool canAddParticipant;
    string[] roles;
    string[] groups;
    string[] manageRoles;
  }

  // STATES
  address manager;
  
  Participant[] participants;
  Role[] roles;
  Group[] groups;

  mapping (address => uint) addressToParticipantId;
  mapping (string => uint) roleNameToRoleId;
  mapping (string => uint) groupNameToGroupId;
  mapping (string => address) roleNameToAddress;
  mapping (string => address[]) groupNameToAddresses;

  // Add if participants can be statically added
  constructor(Participant[] memory _participants, Role[] memory _roles, Group[] memory _groups) {
    manager = msg.sender;

    for (uint i = 0; i < _roles.length; i++) {
      roles.push(_roles[i]);
      roleNameToRoleId[_roles[i].name] = i;
    }

    for (uint i = 0; i < _groups.length; i++) {
      groups.push(_groups[i]);
      groupNameToGroupId[_groups[i].name] = i;
    }

    for (uint i = 0; i < _participants.length; i++) {
      participants.push(_participants[i]);
      addressToParticipantId[_participants[i].addr] = i;

      for (uint j = 0; j < _participants[i].roles.length; j++) {
        roleNameToAddress[_participants[i].roles[j]] = _participants[i].addr;
      }

      for (uint j = 0; j < _participants[i].groups.length; j++) {
        groupNameToAddresses[_participants[i].groups[j]].push(_participants[i].addr);
      }
    }
  }

  modifier onlyManager() {
    require(manager == msg.sender);
    _;
  }

  function isStringInArray(string memory _str, string[] memory _strs) pure private returns (bool) {
    for (uint i = 0; i < _strs.length; i++) {
      if (keccak256(abi.encode(_strs[i])) == keccak256(abi.encode(_str))) return true;
    }

    return false;
  }

  function addParticipant(address _individual, address _caller) public onlyManager {
    // caller must be able to add a participant
    require(participants[addressToParticipantId[_caller]].canAddParticipant, "Caller cannot add participant.");
    
    participants.push(Participant(_individual, false, new string[](0), new string[](0), new string[](0)));
    addressToParticipantId[_individual] = participants.length - 1;
  }

  function addIndividualToGroup(address _caller, address _individual, string memory _groupName) public onlyManager {
    
  }

  /*
  function canParticipantBeAdded(Participant memory _newParticipant) view private returns (bool) {
    // check if new roles in available role array
    for (uint i = 0; i < _newParticipant.roles.length; i++) {
      if (!isStringInArray(_newParticipant.roles[i], availableRoles)) return false;
    }

    // and all managed roles in available role array
    for (uint i = 0; i < _newParticipant.manageRoles.length; i++) {
      if (!isStringInArray(_newParticipant.manageRoles[i], availableRoles)) return false;
    }

    // and participant do not already exist
    if (addressToParticipantId[_newParticipant.addr] == 0 && participants.length != 0) return false;

    return true;
  }

  function canAddParticipant(Participant memory _newParticipant, address _caller) view private returns (bool) {
    Participant memory callerP = participants[addressToParticipantId[_caller]];

    // if caller can manage this type of participant
    for (uint i = 0; i < _newParticipant.roles.length; i++) {
      if (!isStringInArray(_newParticipant.roles[i], callerP.manageRoles)) return false;
    }

    // and the manageRoles of the new participant are bounded in the roles of the caller
    for (uint i = 0; i < _newParticipant.manageRoles.length; i++) {
      if (!isStringInArray(_newParticipant.manageRoles[i], callerP.manageRoles)) return false;
    }

    return true;
  }

  // Add if participants can be dynamically added
  function addParticipant(Participant memory _newParticipant, address _caller) public onlyManager {
    // if participant can be added (checks by checkParticipant)
    require(canParticipantBeAdded(_newParticipant));

    // and caller is a participant that can add this new participant
    require(canAddParticipant(_newParticipant, _caller));

    // then add participant
    participants.push(_newParticipant);
    addressToParticipantId[_newParticipant.addr] = participants.length - 1;
    for (uint i = 0; i < _newParticipant.roles.length; i++) {
      roleToAddress[_newParticipant.roles[i]] = _newParticipant.addr;
    }
  }*/
}