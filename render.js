const Mustache = require('mustache');
const parseStringPromise = require('xml2js').parseStringPromise;
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const { exit } = require('process');
const { exec } = require("child_process");

function parseConfigFile(file) {
  let rawConfig = file['configuration']['feature'];
  let config = {};

  for (let c of rawConfig) {
    config[c.$.name] = (c.$.automatic == "selected" || c.$.manual == "selected");
  }

  return config;
};

function saveProduct(output) {
  try {
    if (!fs.existsSync('./product')){
      fs.mkdirSync('./product');
    }
  
    if (!fs.existsSync('./product/contracts')){
      fs.mkdirSync('./product/contracts');
    }

    fs.writeFileSync('./product/contracts/Participants.sol', output);
    fs.copyFileSync('./contracts/Helpers.sol', './product/contracts/Helpers.sol');
    exec("npx prettier --write './product/contracts/**/*.sol'");

    console.log('Results written in /product/contracts');
  } catch (e) {
    console.error('Failed to save the product: ', e);
    exit();
  }
}

async function getConfiguration(filename) {
  try {
    let rawFile = fs.readFileSync(`./feature_model/configs/${filename}.xml`).toString();
    let rawConfig = await parseStringPromise(rawFile);
    
    return parseConfigFile(rawConfig);
  } catch (e) {
    console.error('Failed to retrieve and parse config: ', e);
    exit();
  }
}

async function main() {
  if (!argv.c) {
    console.error('You need to provide a valid configuration filename.');
    exit();
  }

  mustacheConfig = await getConfiguration(argv.c);
  console.log('Loaded configuration: ', mustacheConfig);

  // Using the comment feature of Solidity to both allow templating and contract development
  Mustache.tags = ['/*', '*/'];

  // Read template
  var template = fs.readFileSync('./contracts/Participants.sol').toString();

  // Render template
  var output = Mustache.render(template, mustacheConfig);
  saveProduct(output);
}

main();