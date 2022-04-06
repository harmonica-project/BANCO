import React, { useState } from 'react';
import DisplayConfig from './DisplayConfig';
import ParticipantSetupForm from './ParticipantSetupForm';
import RecordSetupForm from './RecordSetupForm';
import RoleSetupForm from './RoleSetupForm';
import StateMachineSetupForm from './StateMachineSetupForm';

const Setup = () => {
  const [currentForm, setCurrentForm] = useState(0);

  const pages = [
    {
      name: 'Participants',
      component: <ParticipantSetupForm />
    },
    {
      name: 'Roles',
      component: <RoleSetupForm />
    },
    {
      name: 'Records collections',
      component: <RecordSetupForm />
    },
    {
      name: 'State machine',
      component: <StateMachineSetupForm />
    },
  ]

  return currentForm < pages.length ?
    (
      <div>
        <h1>Current form: {pages[currentForm].name}</h1>
        {pages[currentForm].component}
        <button onClick={() => setCurrentForm(currentForm + 1)}>Next</button>
      </div>
    ) :
    (
      <DisplayConfig />
    )
}

export default Setup;