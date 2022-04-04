// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";
import "../controller/ParticipantsController.sol";

contract StateMachine {
  struct State {
    string name;
    /* #Roles */
    string[] authorizedRoles;
    /* /Roles */
    address[] authorizedParticipants;
  }

  mapping(string => State[]) nameToStates;
  mapping(string => uint) nameToCurrentState;
  ParticipantsController participantsControllerContract;
  address manager;

  constructor (address _manager, address _participantsControllerAddr, State[][] memory _statesCollections, string[] memory _collectionNames) {
    manager = _manager;

    require(_statesCollections.length == _collectionNames.length, "Not exactly one unique collection name for every collection.");
    require(Helpers.doArrayHasDuplicates(_collectionNames), "Not exactly one unique collection name for every collection.");

    participantsControllerContract = ParticipantsController(_participantsControllerAddr);

    for (uint i = 0; i < _statesCollections.length; i++) {
      require(checkStateCollectionValidity(_statesCollections[i]), "Invalid state machine.");
      nameToStates[_collectionNames[i]] = _statesCollections[i];
      nameToCurrentState[_collectionNames[i]] = 0;
    }
  }

  modifier onlyManager() {
      require(manager == msg.sender, "Function caller is not the manager.");
      _;
  }

  function checkStateCollectionValidity(State[] memory _states) private view returns (bool) {
    // the state machine must contain at least two states to be relevant
    if (_states.length < 2) return false;

    // the last state being final, it is not checked as only its name is relevant
    for (uint i = 0; i < _states.length - 1; i++) {
      // each transition must have at least one existing participant
      if (_states[i].authorizedParticipants.length == 0) return false;

      for (uint j = 0; j < _states[i].authorizedParticipants.length; i++) {
        address participant = _states[i].authorizedParticipants[j];
        if (!participantsControllerContract.doesParticipantExists(participant)) return false;
      }

      /* #Roles */
      if (_states[i].authorizedParticipants.length == 0 && _states[i].authorizedRoles.length == 0) return false;

      for (uint j = 0; j < _states[i].authorizedRoles.length; i++) {
        string memory role = _states[i].authorizedRoles[j];
        if (!participantsControllerContract.doesRoleExists(role)) return false;
      }
      /* /Roles */
    }

    return true;
  }

  function getStateMachineCurrentState(string memory _stateMachineName) public view returns (State memory) {
    return nameToStates[_stateMachineName][nameToCurrentState[_stateMachineName]];
  }

  function getStateMachine(string memory _stateMachineName) public view returns (State[] memory) {
    return nameToStates[_stateMachineName];
  }

  function getStateMachineState(string memory _stateMachineName, uint _id) public view returns (State memory) {
    require(_id < nameToStates[_stateMachineName].length, "State id out-of-bounds");

    return nameToStates[_stateMachineName][_id];
  }

  function fireTransition(string memory _stateMachineName) public onlyManager {
    require(nameToCurrentState[_stateMachineName] < nameToStates[_stateMachineName].length - 1, "State machine is in final state.");

    nameToCurrentState[_stateMachineName] = nameToCurrentState[_stateMachineName] + 1;
  }
}
