const templates = [
    {
        path: '',
        contracts: [
            {
                name: 'Factory'
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
            },
            {
                name: 'StateMachine',
                feature: 'StateMachine'
            },
            {
                name: 'Assets',
                feature: 'AssetTracking'
            },
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
            },
            {
                name: 'StateMachineController',
                feature: 'StateMachine'
            },
            {
                name: 'AssetsController',
                feature: 'AssetTracking'
            },
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