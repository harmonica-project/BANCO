// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

contract Participants {
  // STRUCTS
  struct Role {
    string name;
    string[] manageRoles;
  }

  struct Participant {
    address addr;
    bool canAddParticipant;
    string[] roles;
  }

  // STATES
  address manager;
  
  Participant[] participants;
  Role[] roles;

  mapping (address => uint) addressToParticipantId;
  mapping (string => uint) roleNameToRoleId;
  mapping (string => address) roleNameToAddress;

  // Add if participants can be statically added
  constructor(Participant[] memory _participants, Role[] memory _roles) {
    manager = msg.sender;

    for (uint i = 0; i < _roles.length; i++) {
      roles.push(_roles[i]);
      roleNameToRoleId[_roles[i].name] = i;
    }

    for (uint i = 0; i < _participants.length; i++) {
      participants.push(_participants[i]);
      addressToParticipantId[_participants[i].addr] = i;

      for (uint j = 0; j < _participants[i].roles.length; j++) {
        roleNameToAddress[_participants[i].roles[j]] = _participants[i].addr;
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
    
    participants.push(Participant(_individual, false, new string[](0), new string[](0)));
    addressToParticipantId[_individual] = participants.length - 1;
  }
}