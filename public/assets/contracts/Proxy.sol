// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "./controller/ParticipantsController.sol";
import "./controller/RecordsController.sol";
import "./data/Participants.sol";
import "./data/Records.sol";

contract RecordsProxy {
    struct Contracts {
        ParticipantsController participantsControllerContract;
        RecordsController recordsControllerContract;
        Participants participantsContract;
        Records recordsContract;
    }

    address[] owners;
    Contracts contracts;

    constructor (
        address[] memory _owners,
        Records.RecordCollectionMetadata[] memory _metadata
        /* #CreateIndividualAtSetup */
        ,Participants.Participant[] memory _participants
        /* /CreateIndividualAtSetup */
        /* #Roles */
        ,Participants.Role[] memory _roles
        /* /Roles */
    ) {
        owners = _owners;
        contracts.participantsControllerContract = new ParticipantsController(
            address(this)
            /* #CreateIndividualAtSetup */
            ,_participants
            /* /CreateIndividualAtSetup */
            /* #Roles */
            ,_roles
            /* /Roles */
        );

        contracts.participantsContract = Participants(contracts.participantsControllerContract.getParticipantsContractAddress());

        contracts.recordsControllerContract = new RecordsController(
            address(this),
            address(contracts.participantsControllerContract),
            _metadata
        );

        contracts.recordsContract = Records(contracts.recordsControllerContract.getRecordsContractAddress());
    }

    function getContractsAddresses() public view returns (Contracts memory) {
        return contracts;
    }

    // TODO: implement upgrade of contracts
    // TODO: implement function relay to controllers
}