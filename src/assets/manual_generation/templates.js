const templates = [
    {
        path: '',
        contracts: [
            {
                name: 'Proxy'
            }
        ]
    },
    {
        path: 'data',
        contracts: [
            {
                name: 'Participants'
            },
            {
                name: 'Records',
                feature: 'RecordHistory'
            }
        ]
    },
    {
        path: 'controller',
        contracts: [
            {
                name: 'ParticipantsController'
            },
            {
                name: 'RecordsController',
                feature: 'RecordHistory'
            }
        ]
    },
    {
        path: 'lib',
        contracts: [
            {
                name: 'Helpers'
            }
        ]
    }
];

module.exports = templates;