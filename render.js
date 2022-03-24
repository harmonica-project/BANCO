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

  console.log('Loaded configuration: ', config);
  return config;
};

function saveProduct(contract, output) {
  try {
    if (!fs.existsSync('./product')){
      fs.mkdirSync('./product');
    }
  
    if (!fs.existsSync('./product/contracts')){
      fs.mkdirSync('./product/contracts');
    }

    fs.writeFileSync(`./product/contracts/${contract}.sol`, output);

    console.log(`Contract ${contract} written in /product/contracts`);
  } catch (e) {
    console.error(`Failed to save the contract ${contract}: `, e);
    exit();
  }
}

function finalizeProduct() {
  // Move dependencies into product
  fs.copyFileSync('./contracts/Helpers.sol', './product/contracts/Helpers.sol');
  // Prettify the result to erase blank spaces left by the template engine
  exec("npx prettier --write './product/contracts/**/*.sol'");
  console.log('Done.');
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

function parseTemplate(contract, config) {
  // Read template
  var template = fs.readFileSync(`./contracts/${contract}.sol`).toString();

  // Render template
  var output = Mustache.render(template, config);
  saveProduct(contract, output);
}

async function main() {
  if (!argv.c) {
    console.error('You need to provide a valid configuration filename.');
    exit();
  }

  mustacheConfig = await getConfiguration(argv.c);

  // Using the comment feature of Solidity to both allow templating and contract development
  Mustache.tags = ['/*', '*/'];

  parseTemplate('Participants', mustacheConfig);
  parseTemplate('Records', mustacheConfig);

  finalizeProduct();
}

main();