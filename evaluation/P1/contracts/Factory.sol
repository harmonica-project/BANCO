// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "./controller/ParticipantsController.sol";
import "./data/Participants.sol";


import "./data/StateMachine.sol";
import "./controller/StateMachineController.sol";

import "./data/Assets.sol";
import "./controller/AssetsController.sol";

contract Factory {
    struct Contracts {
        ParticipantsController participantsControllerContract;
        Participants participantsContract;
        StateMachine stateMachineContract;
        StateMachineController stateMachineControllerContract;
        Assets assetsContract;
        AssetsController assetsControllerContract;
    }

    // Reduces the number of template-used comments
    struct FactoryParameters {
        address[] owners;
        Participants.Participant[] participants;
        StateMachine.State[][] statesCollections;
        string[] collectionNames;
        Assets.Asset[] assets;
    }

    address[] owners;
    Contracts contracts;

    constructor (FactoryParameters memory factoryParameters) {
        owners = factoryParameters.owners;

        participantsFactory(factoryParameters);


        stateMachineFactory(factoryParameters);

        assetsFactory(factoryParameters);
    }

    function participantsFactory(FactoryParameters memory factoryParameters) private {
        contracts.participantsContract = new Participants(
            address(this)
            ,factoryParameters.participants
        );

        contracts.participantsControllerContract = new ParticipantsController(
            address(this),
            address(contracts.participantsContract)
        );

        contracts.participantsContract.assignController(address(contracts.participantsControllerContract));
    }


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

    function assetsFactory(FactoryParameters memory factoryParameters) private {
        contracts.assetsContract = new Assets(
            address(this),
            factoryParameters.assets
        );

        contracts.assetsControllerContract = new AssetsController(
            address(this),
            address(contracts.participantsContract),
            address(contracts.assetsContract)
        );

        contracts.assetsContract.assignController(address(contracts.assetsControllerContract));
    }

    function getContractsAddresses() public view returns (Contracts memory) {
        return contracts;
    }

    // TODO: create a Proxy and implement features as below
    // TODO: implement upgrade of contracts
    // TODO: implement function relay to controllers
}