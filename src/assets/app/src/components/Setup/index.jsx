import React, { useState } from 'react';
import DisplayConfigResult from './DisplayConfigResult';
import ParticipantSetupForm from './ParticipantSetupForm';
import RecordSetupForm from './RecordSetupForm';
import RoleSetupForm from './RoleSetupForm';
import StateMachineSetupForm from './StateMachineSetupForm';
import StartConfig from './StartConfig';

const Setup = () => {
  const [current, setCurrent] = useState(0);
  const [config, setConfig] = useState({});

  const handleNextPage = (source, content = {}) => {
    setCurrent(current + 1);
    if (source) setConfig({ ...config, [source]: content });
  };

  const pages = [
    <StartConfig nextPage={handleNextPage} />,
    <RoleSetupForm nextPage={handleNextPage} />,
    <ParticipantSetupForm nextPage={handleNextPage} />,
    <RecordSetupForm nextPage={handleNextPage} />,
    <StateMachineSetupForm nextPage={handleNextPage} />,
    <DisplayConfigResult nextPage={handleNextPage} />
  ]

  return pages[current];
}

export default Setup;