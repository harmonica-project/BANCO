// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

import "../data/Records.sol";
import "../controller/ParticipantsController.sol";

contract RecordsController {
    // ---- STATES ---- //
    address manager;
    Records recordsContract;
    ParticipantsController participantsControllerContract;

    constructor(
        address _manager,
        address _participantsControllerAddr,
        Records.RecordCollection[] memory _metadata
    )
    {
        manager = _manager;
        participantsControllerContract = ParticipantsController(_participantsControllerAddr);

        recordsContract = new Records(
            address(this),
            _metadata
        );
    }

    modifier onlyManager() {
        require(manager == msg.sender);
        _;
    }

    function getRecordsContractAddress() public view returns (address) {
        return address(recordsContract);
    }

    modifier canModifyRecordCollection(address _caller, string memory _collectionName) {
        require(participantsControllerContract.doesParticipantExists(_caller), "Participant does not exist.");

        Records.RecordCollection memory col = recordsContract.getCollectionMetadata(_collectionName);
        bool authorized;

        if (Helpers.searchAddressInArray(_caller, col.authorizedParticipants) != -1) authorized = true;

        /* #Roles */
        for (uint i = 0; i < col.authorizedRoles.length; i++) {
            if (participantsControllerContract.participantHasRole(_caller, col.authorizedRoles[i])) {
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
        address _caller,
        string memory _collectionName,
        Records.Record memory _record
    ) 
        public 
        onlyManager
        canModifyRecordCollection(_caller, _collectionName)
    {
        recordsContract.addStructuredRecord(_collectionName, _record);
    }
    /* /StructuredRecords */

    /* #HashRecords */
    // ---- HASH RECORDS FUNCTIONS ---- //

    function addHashRecord(
        address _caller,
        string memory _collectionName,
        string memory _record
    ) 
        public 
        onlyManager
        canModifyRecordCollection(_caller, _collectionName)
    {
        recordsContract.addHashRecord(_collectionName, _record);
    }
    /* /HashRecords */
}