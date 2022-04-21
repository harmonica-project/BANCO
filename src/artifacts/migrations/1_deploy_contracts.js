const FactoryContract = artifacts.require("Factory");
const HelpersContract = artifacts.require("Helpers");
const config = require('./contracts_params.json');

/* #RecordRegistration */
function extractRecords() {
  const parsedRecords = [];

  for (let record of config.recordsCols) {
    parsedRecords.push([true, record.name, record.participants, record.roles, []]);
  }

  return parsedRecords;
}
/* /RecordRegistration */

/* #AssetTracking */
function extractAssets() {
  const parsedAssets = [];

  for (let asset of config.assets) {
    parsedAssets.push([asset.owner, asset.name, asset.data, true, []]);
  }

  return parsedAssets;
}
/* /AssetTracking */

/* #Roles */
function extractRoles() {
  const parsedRoles = [];

  for (let role of config.roles) {
    parsedRoles.push([role.name, role.isAdmin, role.managedRoles]);
  }

  return parsedRoles;
}
/* /Roles */

/* #CreateIndividualAtSetup */
function extractParticipants() {
  const parsedParticipants = [];

  for (let p of config.participants) {
    parsedParticipants.push([p.address, p.isAdmin, p.roles, p.type]);
  }

  return parsedParticipants;
}
/* /CreateIndividualAtSetup */

/* #StateMachine */
function extractStateMachine() {
  const parsedStates = [[]];

  for (let s of config.stateMachine) {
    parsedStates[0].push([s.name, "0x0000000000000000000000000000000000000000000000000000000000000000", s.roles, s.participants]);
  }

  console.log(parsedStates)
  return parsedStates;
};
/* /StateMachine */

function getParameters(account) {
  const parameters = [];

  // owners
  parameters.push(account ? [account] : []);

  /* #RecordRegistration */
  parameters.push(extractRecords());
  /* /RecordRegistration */

  /* #CreateIndividualAtSetup */
  parameters.push(extractParticipants());
  /* /CreateIndividualAtSetup */

  /* #Roles */
  parameters.push(extractRoles());
  /* /Roles */

  // Must be upgraded
  /* #StateMachine */
  parameters.push(extractStateMachine());
  parameters.push(['My collection']);
  /* /StateMachine */

  /* #AssetTracking */
  parameters.push(extractAssets());
  /* /AssetTracking */

  return parameters;
}

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(HelpersContract);
  await deployer.link(HelpersContract, FactoryContract);
  await deployer.deploy(FactoryContract, getParameters(accounts[0]), { gas: 30000000 });
};
