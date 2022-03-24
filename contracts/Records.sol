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
    string[] authorizedRoles;
    string[] authorizedParticipants;
    /* #HashRecords */
    string[] hashRecords;
    /* /HashRecords */
    /* #StructuredRecords */
    Record[] records;
    /* /StructuredRecords */
  }

  struct RecordCollectionMetadata {
    string name;
    string[] authorizedRoles;
    string[] authorizedParticipants;
  }

  address manager;

  mapping (string => RecordCollection) recordCollectionsMapping;

  constructor (address _manager, RecordCollectionMetadata[] memory _metadata) {
    manager = _manager;

    for (uint i = 0; i < _metadata.length; i++) {
      recordCollectionsMapping[_metadata[i].name] = RecordCollection(
        true,
        _metadata[i].authorizedRoles,
        _metadata[i].authorizedParticipants
        /* #HashRecords */
        ,new string[](0)
        /* /HashRecords */
        /* #StructuredRecords */
        ,new Record[](0)
        /* /StructuredRecords */
      );
    }
  }
}