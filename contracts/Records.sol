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
    string[] authorizedParticipants;
    /* #Roles */
    string[] authorizedRoles;
    /* /Roles */
    /* #HashRecords */
    string[] hashRecords;
    /* /HashRecords */
    /* #StructuredRecords */
    Record[] records;
    /* /StructuredRecords */
  }

  struct RecordCollectionMetadata {
    string name;
    string[] authorizedParticipants;
    /* #Roles */
    string[] authorizedRoles;
    /* /Roles */
  }

  address manager;

  mapping (string => RecordCollection) recordCollectionsMapping;

  modifier onlyManager() {
    require(manager == msg.sender);
    _;
  }

  constructor (address _manager, RecordCollectionMetadata[] memory _metadata) {
    manager = _manager;

    for (uint i = 0; i < _metadata.length; i++) {
      recordCollectionsMapping[_metadata[i].name] = RecordCollection(
        true,
        _metadata[i].authorizedParticipants
        /* #Roles */
        ,_metadata[i].authorizedRoles
        /* /Roles */
        /* #HashRecords */
        ,new string[](0)
        /* /HashRecords */
        /* #StructuredRecords */
        ,new Record[](0)
        /* /StructuredRecords */
      );
    }
  }

  /* #HashRecords */
  // HASH RECORDS FUNCTIONS

  /* #Roles */
  function addHashRecordByRole(address _caller, string memory _hash) onlyManager public {

  }
  /* /Roles */

  function addHashRecordByIndividual(address _caller, string memory _hash) onlyManager public {

  }
  /* /HashRecords */

  /* #StructuredRecords */
  // STRUCTURED RECORDS FUNCTIONS

  /* #Roles */
  function addStructuredRecordByRole(address _caller, Record memory _record) onlyManager public {

  }
  /* /Roles */

  function addStructuredRecordByIndividual(address _caller, Record memory _record) onlyManager public {

  }
  /* /StructuredRecords */
}