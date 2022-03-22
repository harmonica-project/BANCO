// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

contract StateMachine {
    // CONTRACT VARIABLES

    struct Transition {
        string name;
        string previousState;
        string nextState;
        string[] authorized;
        bool exists;
    }

    struct Participant {
        string name;
        address addr;
    }

    mapping(string => Transition) transitions;
    mapping(string => address) participants;
    mapping(string => bool) existingStates;
    string currentState;

    // CONSTRUCTOR
    constructor(
        string memory _startState,
        string[] memory _states,
        Transition[] memory _transitions,
        Participant[] memory _participants
    ) {
        for (uint256 i = 0; i < _states.length; i++) {
            existingStates[_states[i]] = true;
        }

        // Add if participants are statically added
        for (uint256 i = 0; i < _participants.length; i++) {
            participants[_participants[i].name] = _participants[i].addr;
        }

        require(existingStates[_startState], "Start state does not exist.");
        currentState = _startState;

        for (uint256 i = 0; i < _transitions.length; i++) {
            require(
                existingStates[_transitions[i].previousState],
                "previousState of transition does not exist."
            );
            require(
                existingStates[_transitions[i].nextState],
                "nextState of transition does not exist."
            );
            require(
                !transitions[_transitions[i].name].exists,
                "Transition duplicate."
            );
            require(
                checkAuthorized(_transitions[i].authorized),
                "Transaction participant do not exist or no participant specified."
            );
            require(
                _transitions[i].exists,
                "Transaction exists field must be set to true."
            );
            transitions[_transitions[i].name] = _transitions[i];
        }
    }

    // MODIFIERS

    modifier isAuthorized(string memory _txname) {
        bool found;

        for (uint256 i = 0; i < transitions[_txname].authorized.length; i++) {
            if (
                participants[transitions[_txname].authorized[i]] == msg.sender
            ) {
                found = true;
                break;
            }
        }

        require(found, "Participant not authorized.");
        _;
    }

    // FUNCTIONS

    function checkAuthorized(string[] memory authorized)
        private
        pure
        returns (bool)
    {
        // checks if all participants authorized exists, and if they are at least one
        return (authorized.length > 0);
    }

    function fireTransition(string memory _txname)
        public
        isAuthorized(_txname)
    {
        require(transitions[_txname].exists, "Transition does not exist.");
        require(
            keccak256(abi.encode(transitions[_txname].previousState)) ==
                keccak256(abi.encode(currentState)),
            "Current state does not allow firing this transition."
        );
        currentState = transitions[_txname].nextState;
    }

    function getCurrentState() public view returns (string memory) {
        return currentState;
    }

    function getParticipantAddr(string memory _name)
        public
        view
        returns (address)
    {
        return participants[_name];
    }
}
