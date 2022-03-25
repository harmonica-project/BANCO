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

function saveProduct(contracts, folder) {
  try {
    if (!fs.existsSync('./products')){
      fs.mkdirSync('./products');
    }

    fs.mkdirSync(`./products/product-${folder}`);
    fs.mkdirSync(`./products/product-${folder}/contracts`);

    for (let contract of contracts) {
      fs.writeFileSync(`./products/product-${folder}/contracts/${contract.name}.sol`, contract.output);
      console.log(`Contract ${contract.name} written in /product/contracts`);
    }
  } catch (e) {
    console.error(`Failed to save contracts ${contracts}: `, e);
    exit();
  }
}

function purgeProducts() {
  fs.rmSync('./products', { recursive: true, force: true });
}

function finalizeProduct(configName, folder) {
  // Move dependencies into product
  fs.copyFileSync('./contracts/Helpers.sol', `./products/product-${folder}/contracts/Helpers.sol`);
  // Saving config used to generate the product
  fs.copyFileSync(`./feature_model/configs/${configName}.xml`, `./products/product-${folder}/config.xml`);
  // Prettify the result to erase blank spaces left by the template engine
  exec(`npx prettier --write './products/product-${folder}/contracts/**/*.sol'`);
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
  
  return {
    name: contract,
    output
  }
}

async function generateProduct(configName) {
  mustacheConfig = await getConfiguration(configName);

  // Using the comment feature of Solidity to both allow templating and contract development
  Mustache.tags = ['/*', '*/'];

  const contracts = [
    parseTemplate('Participants', mustacheConfig),
    parseTemplate('Records', mustacheConfig)
  ];

  const folder = new Date().toISOString();

  saveProduct(contracts, folder);
  finalizeProduct(configName, folder);
}

function displayHelp() {
  console.log('-c <config_name> - generate a product based on provided configuration.');
  console.log('-p - remove existing products from folder.');
}

function main() {
  if (argv.p) {
    purgeProducts();
  }
  
  if (argv.c) {
    generateProduct(argv.c);
  }

  if (!argv.c && !argv.p) {
    console.error('No argument provided.');
    displayHelp();
  }
}

main();