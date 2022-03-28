// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "./controller/ParticipantsController.sol";
import "./controller/RecordsController.sol";
import "./data/Participants.sol";
import "./data/Records.sol";

contract RecordsRegistration {
    ParticipantsController participantsControllerContract;
    RecordsController recordsControllerContract;
    Participants participantsContract;
    Records recordsContract;

    constructor (
        Records.RecordCollectionMetadata[] memory _metadata
        /* #CreateIndividualAtSetup */
        ,Participants.Participant[] memory _participants
        /* /CreateIndividualAtSetup */
        /* #Roles */
        ,Participants.Role[] memory _roles
        /* /Roles */
    ) {
        participantsControllerContract = new ParticipantsController(
            address(this)
            /* #CreateIndividualAtSetup */
            ,_participants
            /* /CreateIndividualAtSetup */
            /* #Roles */
            ,_roles
            /* /Roles */
        );

        participantsContract = Participants(participantsControllerContract.getParticipantsContractAddress());

        recordsControllerContract = new RecordsController(
            address(this),
            address(participantsControllerContract),
            _metadata
        );

        recordsContract = Records(recordsControllerContract.getRecordsContractAddress());
    }
}