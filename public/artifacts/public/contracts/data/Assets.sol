// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../lib/Helpers.sol";

contract Assets {
    // ---- STRUCTS ---- //
    struct Asset {
        address owner;
        string name;
        bytes32 desc;
        bool exists;
        string[2][] attachedData;
    }

    struct AssetTransferRecord {
        uint256 timestamp;
        address previousOwner;
        address newOwner;
    }

    // ---- STATES ---- //
    address factory;
    address controller;
    mapping(string => AssetTransferRecord[]) assetsHistories;
    mapping(string => Asset) assets;

    constructor(
        address _factory,
        Asset[] memory _assets
    ) {
        factory = _factory;

        for (uint i = 0; i < _assets.length; i++) {
            assets[_assets[i].name] = _assets[i];
        }
    }

    modifier onlyFactory() {
        require(factory == msg.sender, "Function caller is not the factory.");
        _;
    }

    modifier onlyController() {
        require(controller == msg.sender, "Function caller is not the controller.");
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

    function changeOwner(string memory _assetName, address _newOwner) public onlyController {
        require(assets[_assetName].exists, "Asset does not exist.");

        address previousOwner = assets[_assetName].owner;
        assets[_assetName].owner = _newOwner;
        assetsHistories[_assetName].push(AssetTransferRecord(block.timestamp, previousOwner, _newOwner));
    }

    function newAsset(string memory _assetName, bytes32 _assetDesc, address _owner, string[2][] memory _attachedData) public onlyController {
        require(!assets[_assetName].exists, "Asset already exists.");

        assets[_assetName] = Asset(_owner, _assetName, _assetDesc, true, _attachedData);
    }

    function getAsset(string memory _assetName) public view returns (Asset memory) {
        require(assets[_assetName].exists, "Asset does not exist.");

        return assets[_assetName];
    }

    function attachData(string memory _assetName, string memory _key, string memory _value) public {
        require(assets[_assetName].exists, "Asset does not exist.");

        for (uint i = 0; i < assets[_assetName].attachedData.length; i++) {
            if (Helpers.strCmp(assets[_assetName].attachedData[i][0], _key)) {
                assets[_assetName].attachedData[i][1] = _value;
                return;
            }
        }

        assets[_assetName].attachedData.push([_key, _value]);
    }

    function detachData(string memory _assetName, string memory _key) public {
        require(assets[_assetName].exists, "Asset does not exist.");

        for (uint i = 0; i < assets[_assetName].attachedData.length; i++) {
            if (Helpers.strCmp(assets[_assetName].attachedData[i][0], _key)) {
                // moving the last item of the array to the item to delete then pop the old one at the end of the array
                assets[_assetName].attachedData[i] = assets[_assetName].attachedData[assets[_assetName].attachedData.length - 1];
                assets[_assetName].attachedData.pop();
            }
        }

        revert("Key not found in array.");
    }

    function getAttachedData(string memory _assetName, string memory _key) public view returns (string memory) {
        require(assets[_assetName].exists, "Asset does not exist.");

        for (uint i = 0; i < assets[_assetName].attachedData.length; i++) {
            if (Helpers.strCmp(assets[_assetName].attachedData[i][0], _key)) {
                return assets[_assetName].attachedData[i][1];
            }
        }

        revert("Key not found in array.");
    }
}