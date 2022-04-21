// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

contract Records {
    struct Record {
        uint256 timestamp;
        address publisher;
        bytes32 content;
    }

    struct RecordCollection {
        bool exists;
        string name;
        address[] authorizedParticipants;
        string[] authorizedRoles;
    }

    address factory;
    address controller;
    
    mapping(string => RecordCollection) recordCollectionsMapping;
    mapping(string => Record[]) recordCollectionToRecords; 
    string[] collectionNames;

    constructor(address _factory, RecordCollection[] memory _metadata) {
        factory = _factory;
        
        for (uint256 i = 0; i < _metadata.length; i++) {
            collectionNames.push(_metadata[i].name);
            recordCollectionsMapping[_metadata[i].name] = _metadata[i];
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

    modifier collectionExists(string memory _collectionName) {
        require(
            recordCollectionsMapping[_collectionName].exists,
            "Collection does not exist."
        );
        _; 
    }

    function getCollectionNames() public view returns (string[] memory) {
        return collectionNames;
    }

    function getCollectionMetadata(string memory _collectionName) 
        public 
        view
        collectionExists(_collectionName)
        returns(RecordCollection memory) 
    {
        return recordCollectionsMapping[_collectionName];
    }


    // ---- STRUCTURED RECORDS FUNCTIONS ---- //

    function addStructuredRecord(
        string memory _collectionName,
        Record memory _record
    ) public onlyController collectionExists(_collectionName) {
        _record.timestamp = block.timestamp;
        recordCollectionToRecords[_collectionName].push(_record);
    }

    function getStructuredRecord(string memory _collectionName, uint256 _id)
        public
        view
        collectionExists(_collectionName)
        returns (Record memory)
    {
        require(
            _id < recordCollectionToRecords[_collectionName].length,
            "Provided id out-of-bounds."
        );
        return recordCollectionToRecords[_collectionName][_id];
    }

    function getStructuredRecords(string memory _collectionName)
        public
        view
        collectionExists(_collectionName)
        returns (Record[] memory)
    {
        return recordCollectionToRecords[_collectionName];
    }
}
