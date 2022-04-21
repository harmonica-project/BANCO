// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";

contract Participants {
    // ---- STRUCTS ---- //


    struct Participant {
        address addr;
        bool isAdmin;
        string[] roles;
    }

    // Note: improve later with a better formulation

    // ---- STATES ---- //
    address factory;
    address controller;
    Participant[] participants;
    mapping(address => uint256) addressToParticipantId;


    constructor(
        address _factory
        ,Participant[] memory _participants

    ) {
        factory = _factory;


        for (uint256 i = 0; i < _participants.length; i++) {
            participants.push(_participants[i]);
            addressToParticipantId[_participants[i].addr] = i;
        }
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

    modifier participantNotExists(address _participant) {
        require(
            participants[addressToParticipantId[_participant]].addr !=
                _participant,
            "Participant does not exist."
        );
        _;
    }

    function addParticipant(address _participant)
        public
        onlyController
        participantNotExists(_participant)
    {
        participants.push(
            Participant(_participant, false, new string[](0))
        );
        addressToParticipantId[_participant] = participants.length - 1;
    }


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


}
