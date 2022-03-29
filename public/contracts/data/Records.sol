// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

contract Records {
    /* #StructuredRecords */
    struct Record {
        string timestamp;
        address publisher;
        bytes32 content;
    }
    /* /StructuredRecords */

    struct RecordCollection {
        bool exists;
        address[] authorizedParticipants;
        /* #Roles */
        string[] authorizedRoles;
        /* /Roles */
        /* #HashRecords */
        string[] hashRecords;
        /* /HashRecords */
    }

    struct RecordCollectionMetadata {
        string name;
        address[] authorizedParticipants;
        /* #Roles */
        string[] authorizedRoles;
        /* /Roles */
    }

    address manager;

    mapping(string => RecordCollection) recordCollectionsMapping;
    /* #StructuredRecords */
    // forced to separate this from the struct RecordCollection 
    // as struct storage arrays in another storage are not well supported
    mapping(string => Record[]) recordCollectionToRecords; 
    /* /StructuredRecords */
    string[] collectionNames;

    modifier onlyManager() {
        require(manager == msg.sender);
        _;
    }

    modifier collectionExists(string memory _collectionName) {
        require(
            recordCollectionsMapping[_collectionName].exists,
            "Collection does not exist."
        );
        _; 
    }

    constructor(address _manager, RecordCollectionMetadata[] memory _metadata) {
        manager = _manager;
        
        for (uint256 i = 0; i < _metadata.length; i++) {
            collectionNames.push(_metadata[i].name);
            recordCollectionsMapping[_metadata[i].name] = RecordCollection(
                true,
                _metadata[i].authorizedParticipants
                /* #Roles */
                ,_metadata[i].authorizedRoles
                /* /Roles */
                /* #HashRecords */
                ,new string[](0)
                /* /HashRecords */
            );
        }
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

    /* #HashRecords */
    // ---- HASH RECORDS FUNCTIONS ---- //

    function addHashRecord(string memory _collectionName, string memory _hash)
        public
        onlyManager
        collectionExists(_collectionName)
    {
        recordCollectionsMapping[_collectionName].hashRecords.push(_hash);
    }

    function getHashRecord(string memory _collectionName, uint256 _id)
        public
        view
        collectionExists(_collectionName)
        returns (string memory)
    {
        require(
            _id < recordCollectionsMapping[_collectionName].hashRecords.length,
            "Provided id out-of-bounds."
        );
        return recordCollectionsMapping[_collectionName].hashRecords[_id];
    }

    function getHashRecords(string memory _collectionName)
        public
        view
        collectionExists(_collectionName)
        returns (string[] memory)
    {
        return recordCollectionsMapping[_collectionName].hashRecords;
    }

    /* /HashRecords */

    /* #StructuredRecords */
    // ---- STRUCTURED RECORDS FUNCTIONS ---- //

    function addStructuredRecord(
        string memory _collectionName,
        Record memory _record
    ) public onlyManager collectionExists(_collectionName) {
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
    /* /StructuredRecords */
}
