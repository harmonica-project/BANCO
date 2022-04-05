const Mustache = require('mustache');
const parseStringPromise = require('xml2js').parseStringPromise;
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const templates = require('./templates');
const { exit } = require('process');
const { exec } = require("child_process");

function parseConfigFile(file) {
  let rawConfig = file['configuration']['feature'];
  let config = {};

  for (let c of rawConfig) {
    config[c.$.name] = (c.$.automatic === "selected" || c.$.manual === "selected");
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
      if (!fs.existsSync(`./products/product-${folder}/contracts/${contract.path}`))
        fs.mkdirSync(`./products/product-${folder}/contracts/${contract.path}`);
      fs.writeFileSync(`./products/product-${folder}/contracts/${contract.path}${contract.path ? '/' : ''}${contract.name}.sol`, contract.output);
      console.log(`Contract ${contract.name} written in /product/contracts`);
    }
  } catch (e) {
    console.error(`Failed to save contracts: `, e);
    exit();
  }
}

function purgeProducts() {
  fs.rmSync('./products', { recursive: true, force: true });
}

function finalizeProduct(configName, folder) {
  fs.copyFileSync(`../assets/feature_model/configs/${configName}.xml`, `./products/product-${folder}/config.xml`);
  // Prettify the result to erase blank spaces left by the template engine
  exec(`npx prettier --write './products/product-${folder}/contracts/**/*.sol' --tab-width 4`);
  console.log('Done.');
}

async function getConfiguration(filename) {
  try {
    let rawFile = fs.readFileSync(`../assets/feature_model/configs/${filename}.xml`).toString();
    let rawConfig = await parseStringPromise(rawFile);
    
    return parseConfigFile(rawConfig);
  } catch (e) {
    console.error('Failed to retrieve and parse config: ', e);
    exit();
  }
}

function parseTemplate(path, contract, config) {
  console.log(`Parsing ${contract.name} ...`);
  
  // Read template
  var template = fs.readFileSync(`../assets/contracts/${path}${path ? '/' : ''}${contract.name}.sol`).toString();

  // Render template
  var output = Mustache.render(template, config);
  
  return {
    name: contract.name,
    path,
    output
  }
}

async function generateProduct(configName) {
  let mustacheConfig = await getConfiguration(configName);
  const artifacts = [];

  // Using the comment feature of Solidity to both allow templating and contract development
  Mustache.tags = ['/*', '*/'];

  for (let template of templates) {
    for (let contract of template.contracts) {
        if (contract.feature === undefined || mustacheConfig[contract.feature]) {
            artifacts.push(parseTemplate(template.path, contract, mustacheConfig));
        }
    }
}

  const folder = new Date().toISOString();

  saveProduct(artifacts, folder);
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