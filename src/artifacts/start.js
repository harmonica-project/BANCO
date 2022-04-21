const fs = require('fs');
const { exit } = require('process');
const { spawn } = require('child_process');
const ganache = require("ganache");

function main() {
  if (!fs.existsSync('./migrations/contracts_params.js')) {
    console.error('Error: configuration file not found. Generate it by launching the React application in this folder.');
    exit();
  }

  const options = {};
  const server = ganache.server(options);
  const PORT = 8545;
  server.listen(PORT, async err => {
    if (err) throw err;

    console.log(`Ganache listening on port ${PORT}...`);
    console.log('Deploying contracts ...');

    const migration = spawn('truffle', ['migrate']);

    migration.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    
    migration.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
    
    migration.on('close', (code) => {
      console.log('Migration has ended!');
      console.log('If the deployment has failed, check if truffle is installed globally (npm i truffle -g).');
    });
  });
}

main();