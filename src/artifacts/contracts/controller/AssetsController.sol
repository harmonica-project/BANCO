// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../data/Assets.sol";
import "../data/Participants.sol";

contract AssetsController {
    // ---- STATES ---- //
    address factory;
    Assets assetsContract;
    Participants participantsContract;

    /* #EventsEmission */
    // ---- EVENTS ---- //
    event NewOwner(string indexed assetName, address indexed newOwner);
    event NewAsset(Assets.Asset indexed asset);
    event NewAttachedData(Assets.Asset indexed asset, string indexed key, string indexed value);
    event NewDetachedData(Assets.Asset indexed asset, string indexed key);
    /* /EventsEmission */

    constructor(
        address _factory,
        address _participantsAddr,
        address _assetsContractAddr
    )
    {
        factory = _factory;
        participantsContract = Participants(_participantsAddr);
        assetsContract = Assets(_assetsContractAddr);
    }

    function getFactory() public view returns (address) {
        return factory;
    }

    function getAssetsContractAddress() public view returns (address) {
        return address(assetsContract);
    }

    function changeOwner(string memory _assetName, address _newOwner) public {
        address currentOwner = assetsContract.getAsset(_assetName).owner;
        require(currentOwner == msg.sender, "Sender is not the owner of the asset.");

        assetsContract.changeOwner(_assetName, _newOwner);

        /* #EventsEmission */
        emit NewOwner(_assetName, _newOwner);
        /* /EventsEmission */
    }

    function newAsset(string memory _assetName, bytes32 _assetDesc, string[2][] memory _attachedData) public {
        require(participantsContract.doesParticipantExist(msg.sender), "Participant does not exist.");

        assetsContract.newAsset(_assetName, _assetDesc, msg.sender, _attachedData);
        /* #EventsEmission */
        emit NewAsset(assetsContract.getAsset(_assetName));
        /* /EventsEmission */
    }

    function attachData(string memory _assetName, string memory _key, string memory _value) public {
        address currentOwner = assetsContract.getAsset(_assetName).owner;
        require(currentOwner == msg.sender, "Sender is not the owner of the asset.");

        assetsContract.attachData(_assetName, _key, _value);

        /* #EventsEmission */
        emit NewAttachedData(assetsContract.getAsset(_assetName), _key, _value);
        /* /EventsEmission */
    }

    function detachData(string memory _assetName, string memory _key) public {
        address currentOwner = assetsContract.getAsset(_assetName).owner;
        require(currentOwner == msg.sender, "Sender is not the owner of the asset.");

        assetsContract.detachData(_assetName, _key);

        /* #EventsEmission */
        emit NewDetachedData(assetsContract.getAsset(_assetName), _key);
        /* /EventsEmission */
    }

    function getAttachedData(string memory _assetName, string memory _key) public view returns (string memory) {
        return assetsContract.getAttachedData(_assetName, _key);
    }
}