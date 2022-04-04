// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "./controller/ParticipantsController.sol";
import "./data/Participants.sol";

/* #RecordRegistration */
import "./data/Records.sol";
import "./controller/RecordsController.sol";
/* /RecordRegistration */

/* #StateMachine */
import "./data/StateMachine.sol";
import "./controller/StateMachineController.sol";
/* /StateMachine */

contract Factory {
    struct Contracts {
        ParticipantsController participantsControllerContract;
        Participants participantsContract;
        /* #RecordRegistration */
        Records recordsContract;
        RecordsController recordsControllerContract;
        /* /RecordRegistration */
        /* #StateMachine */
        StateMachine stateMachineContract;
        StateMachineController stateMachineControllerContract;
        /* /StateMachine */
    }

    // Reduces the number of template-used comments
    struct FactoryParameters {
        address[] owners;
        /* #RecordRegistration */
        Records.RecordCollection[] recordsMetadata;
        /* /RecordRegistration */
        /* #CreateIndividualAtSetup */
        Participants.Participant[] participants;
        /* /CreateIndividualAtSetup */
        /* #Roles */
        Participants.Role[] roles;
        /* /Roles */
        /* #StateMachine */
        StateMachine.State[][] statesCollections;
        string[] collectionNames;
        /* /StateMachine */

    }

    address[] owners;
    Contracts contracts;

    constructor (FactoryParameters memory factoryParameters) {
        owners = factoryParameters.owners;

        participantsFactory(factoryParameters);

        /* #RecordCollection */
        recordsFactory(factoryParameters);
        /* /RecordCollection */

         /* #StateMachine */
        stateMachineFactory(factoryParameters);
        /* /StateMachine */
    }

    function participantsFactory(FactoryParameters memory factoryParameters) private {
        contracts.participantsContract = new Participants(
            address(this)
            /* #CreateIndividualAtSetup */
            ,factoryParameters.participants
            /* /CreateIndividualAtSetup */
            /* #Roles */
            ,factoryParameters.roles
            /* /Roles */
        );

        contracts.participantsControllerContract = new ParticipantsController(
            address(this),
            address(contracts.participantsContract)
        );

        contracts.participantsContract.assignController(address(contracts.participantsControllerContract));
    }

    /* #RecordCollection */
    function recordsFactory(FactoryParameters memory factoryParameters) private {
        contracts.recordsContract = new Records(
            address(this),
            factoryParameters.recordsMetadata
        );

        contracts.recordsControllerContract = new RecordsController(
            address(this),
            address(contracts.participantsContract),
            address(contracts.recordsContract)
        );

        contracts.recordsContract.assignController(address(contracts.recordsControllerContract));
    }
    /* /RecordCollection */

    /* #StateMachine */
    function stateMachineFactory(FactoryParameters memory factoryParameters) private {
        contracts.stateMachineContract = new StateMachine(
            address(this),
            address(contracts.participantsContract),
            factoryParameters.statesCollections,
            factoryParameters.collectionNames
        );

        contracts.stateMachineControllerContract = new StateMachineController(
            address(this),
            address(contracts.stateMachineContract),
            address(contracts.participantsContract)
        );

        contracts.stateMachineContract.assignController(address(contracts.stateMachineControllerContract));
    }
    /* /StateMachine */

    function getContractsAddresses() public view returns (Contracts memory) {
        return contracts;
    }

    // TODO: create a Proxy and implement features as below
    // TODO: implement upgrade of contracts
    // TODO: implement function relay to controllers
}