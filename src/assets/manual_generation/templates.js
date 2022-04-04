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