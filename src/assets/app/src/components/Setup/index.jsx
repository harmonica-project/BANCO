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

  const handlePreviousPage = () => {
    setCurrent(current - 1);
  };

  const pages = [
    <StartConfig nextPage={handleNextPage} previousPage={handlePreviousPage} />,
    <RoleSetupForm nextPage={handleNextPage} previousPage={handlePreviousPage} configRoles={config.roles} />,
    <ParticipantSetupForm nextPage={handleNextPage} previousPage={handlePreviousPage} />,
    <RecordSetupForm nextPage={handleNextPage} previousPage={handlePreviousPage} />,
    <StateMachineSetupForm nextPage={handleNextPage} previousPage={handlePreviousPage} />,
    <DisplayConfigResult nextPage={handleNextPage} previousPage={handlePreviousPage} />
  ]

  return pages[current];
}

export default Setup;