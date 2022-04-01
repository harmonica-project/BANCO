// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";

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

  constructor (State[][] memory _statesCollections, string[] memory _collectionNames) {
    require(_statesCollections.length == _collectionNames.length, "Not exactly one unique collection name for every collection.");
    require(checkCollectionNameUniqueness(_collectionNames), "Not exactly one unique collection name for every collection.");

    for (uint i = 0; i < _statesCollections.length; i++) {
      require(checkStateCollectionValidity(_statesCollections[i]), "Invalid state machine.");
      nameToStates[_collectionNames[i]] = _statesCollections[i];
      nameToCurrentState[_collectionNames[i]] = 0;
    }
  }

  function checkStateCollectionValidity(State[] memory _states) private view returns (bool) {
    // the state machine must contain at least two states to be relevant
    if (_states.length < 2) return false;

    for (uint i = 0; i < _states.length; i++) {
      // TODO: verify states and transitions validity
    }
  }

  // TODO: replace this function by a generic string[] to string[] comparison function in Helpers
  function checkCollectionNameUniqueness(string[] memory _collectionNames) private pure returns (bool) {
    for (uint i = 0; i < _collectionNames.length; i++) {
      for (uint j = 0; j < _collectionNames.length; j++) {
        if (Helpers.strCmp(_collectionNames[i], _collectionNames[j]) && i != j) return false;
      }
    }

    return true;
  }
}
