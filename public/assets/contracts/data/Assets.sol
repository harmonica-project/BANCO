// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

contract Assets {
    // ---- STRUCTS ---- //
    struct Asset {
        address owner;
        string name;
        bytes32 desc;
        bool exists;
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

    function newAsset(string memory _assetName, bytes32 _assetDesc, address _owner) public onlyController {
        require(!assets[_assetName].exists, "Asset already exists.");

        assets[_assetName] = Asset(_owner, _assetName, _assetDesc, true);
    }

    function getAsset(string memory _assetName) public view returns (Asset memory) {
        require(assets[_assetName].exists, "Asset does not exist.");

        return assets[_assetName];
    }
}