const FactoryContract = artifacts.require("Factory");
const HelpersContract = artifacts.require("Helpers");
const config = require('./config.json');

/*
const parameters = [
  ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"],
  [
    [true, "Products", ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"], []]
  ],
  [
    ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE", true, []]
  ],
  [
    ["Admin", true, ["Admin", "Stakeholder"]], 
    ["Stakeholder", false, []]
  ],
  [
    [
      ["QualityControl","0x0000000000000000000000000000000000000000000000000000000000000000",["Admin"],["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"]],
      ["MilkWeightingAndFiltering","0x0000000000000000000000000000000000000000000000000000000000000000",["Admin"],["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"]],
      ["MovingMilkToProduction","0x0000000000000000000000000000000000000000000000000000000000000000",["Admin"],["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"]],
      ["OrderPreparationAndLoading","0x0000000000000000000000000000000000000000000000000000000000000000",["Admin"],["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"]],
      ["Control","0x0000000000000000000000000000000000000000000000000000000000000000",["Admin"],["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"]],
      ["Transportation","0x0000000000000000000000000000000000000000000000000000000000000000",["Admin"],["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE"]]
    ]
  ],
  ["Process"],
  [
    ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE", "Milk", "0x3230302c20436f77206d696c6b2c2066726f6d20636f77204944203030313233", true, []],
    ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE", "Yogurt", "0x3230302c20436f77206d696c6b2c2066726f6d20636f77204944203030313233", true, []],
    ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE", "Graviera cCheese", "0x3230302c20436f77206d696c6b2c2066726f6d20636f77204944203030313233", true, []],
    ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE", "Graviera cheese", "0x3230302c20436f77206d696c6b2c2066726f6d20636f77204944203030313233", true, []],
    ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE", "Feta cheese", "0x3230302c20436f77206d696c6b2c2066726f6d20636f77204944203030313233", true, []],
    ["0x79277e4eb7734F5533cB9D9b15bB5c130915ADAE", "Milk", "0x3230302c20436f77206d696c6b2c2066726f6d20636f77204944203030313233", true, []]
  ]
];*/

/*
    struct FactoryParameters {
      address[] owners;
      Records.RecordCollection[] recordsMetadata;
      Participants.Participant[] participants;
      Participants.Role[] roles;
      StateMachine.State[][] statesCollections;
      string[] collectionNames;
      Assets.Asset[] assets;
    }
    */

function extractRoles() {
  const parsedRoles = [];

  for (let role of config.roles) {
    parsedRoles.push([role.name, role.isAdmin, role.managedRoles]);
  }

  return parsedRoles;
}

function extractParticipants() {
  const parsedParticipants = [];

  for (let p of config.participants) {
    parsedParticipants.push([p.address, p.isAdmin, p.roles]);
  }

  return parsedParticipants;
}

function getParameters() {
  const parameters = [];

  // owners
  parameters.push([]);

  /* #RecordRegistration */
  parameters.push();
  /* /RecordRegistration */

  /* #CreateIndividualAtSetup */
  parameters.push(extractParticipants());
  /* /CreateIndividualAtSetup */

  /* #Roles */
  parameters.push(extractRoles());
  /* /Roles */

  /* #StateMachine */
  parameters.push();
  parameters.push();
  /* /StateMachine */

  /* #AssetTracking */
  parameters.push();
  /* /AssetTracking */

  console.log('Configuration', parameters);
  return parameters;
}

module.exports = async function(deployer) {
  await deployer.deploy(HelpersContract);
  await deployer.link(HelpersContract, FactoryContract);
  await deployer.deploy(FactoryContract, getParameters(), { gas: 30000000 });
};
