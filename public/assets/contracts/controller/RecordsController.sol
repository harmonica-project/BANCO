// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../data/Records.sol";
import "../data/Participants.sol";

contract RecordsController {
    // ---- STATES ---- //
    address factory;
    Records recordsContract;
    Participants participantsContract;

    /* #EventsEmission */
    // ---- EVENTS ---- //

    /* #HashRecords */
    event HashRecordAdded(address indexed _caller, string indexed _record);
    /* /HashRecords */
    /* #StructuredRecords */
    event StructuredRecordAdded(address indexed _caller, Records.Record indexed _record);
    /* /StructuredRecords */
    /* /EventsEmission */

    constructor(
        address _factory,
        address _participantsAddr,
        address _recordsContractAddr
    )
    {
        factory = _factory;
        participantsContract = Participants(_participantsAddr);
        recordsContract = Records(_recordsContractAddr);
    }

    function getFactory() public view returns (address) {
        return factory;
    }

    function getRecordsContractAddress() public view returns (address) {
        return address(recordsContract);
    }

    modifier canModifyRecordCollection(string memory _collectionName) {
        require(participantsContract.doesParticipantExist(msg.sender), "Participant does not exist.");

        Records.RecordCollection memory col = recordsContract.getCollectionMetadata(_collectionName);
        bool authorized;

        if (Helpers.searchAddressInArray(msg.sender, col.authorizedParticipants) != -1) authorized = true;

        /* #Roles */
        for (uint i = 0; i < col.authorizedRoles.length; i++) {
            if (participantsContract.participantHasRole(msg.sender, col.authorizedRoles[i])) {
                authorized = true;
                break;
            }
        }
        /* /Roles */
        
        require(authorized, "Caller not authorized to modify the record collection.");
        _;
    }

    /* #StructuredRecords */
    // ---- STRUCTURED RECORDS FUNCTIONS ---- //

    function addStructuredRecord(
        string memory _collectionName,
        Records.Record memory _record
    ) 
        public 
        canModifyRecordCollection(_collectionName)
    {
        recordsContract.addStructuredRecord(_collectionName, _record);

        /* #EventsEmission */
        emit StructuredRecordAdded(msg.sender, _record);
        /* /EventsEmission */
    }
    /* /StructuredRecords */

    /* #HashRecords */
    // ---- HASH RECORDS FUNCTIONS ---- //

    function addHashRecord(
        string memory _collectionName,
        string memory _record
    ) 
        public 
        canModifyRecordCollection(_collectionName)
    {
        recordsContract.addHashRecord(_collectionName, _record);

        /* #EventsEmission */
        emit HashRecordAdded(msg.sender, _record);
        /* /EventsEmission */
    }
    /* /HashRecords */
}