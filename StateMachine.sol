// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

contract StateMachine {
    // CONTRACT VARIABLES 

    struct Transition {
        string name;
        string previousState;
        string nextState;
        address[] authorized;
        bool exists;
    }

    mapping (string => Transition) transitions;
    mapping (string => bool) existingStates;
    string currentState;

    // CONSTRUCTOR
    constructor (string memory _startState, string[] memory _states, Transition[] memory _transitions) {
        for (uint i = 0; i < _states.length; i++) {
            existingStates[_states[i]] = true;
        }

        require(existingStates[_startState]);
        currentState = _startState;
        
        for (uint i = 0; i < _transitions.length; i++) {
            require(existingStates[_transitions[i].previousState]);
            require(existingStates[_transitions[i].nextState]);
            require(!transitions[_transitions[i].name].exists);
            require(_transitions[i].authorized.length > 0);
            require(_transitions[i].exists);
            transitions[_transitions[i].name] = _transitions[i];
        }
    }

    // MODIFIERS

    modifier isAuthorized(string memory _name) {
        bool found;

        for (uint i = 0; i < transitions[_name].authorized.length; i++) {
            if (transitions[_name].authorized[i] == msg.sender) {
                found = true;
                break;
            }
        }

        require(found);
        _;
    }

    // FUNCTIONS

    function fireTransition(string memory _name) public isSetupCompleted isAuthorized(_name) {
        require(transitions[_name].exists);
        require(keccak256(abi.encode(transitions[_name].previousState)) == keccak256(abi.encode(currentState)));
        currentState = transitions[_name].nextState;
    }

    function getCurrentState() public view returns (string memory) {
        return currentState;
    }
}