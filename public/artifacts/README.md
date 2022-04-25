# My traceability app

## Overview

Welcome to your blockchain traceability application. 

## Setup

### Application directory setup

This .zip archive contains four different files:

- the __README.md__ you are reading
- __/contracts__, that contains all the smart contracts Solidity files
- __app.zip__, that contains the web app for the setup and interacting with the blockchain application
- __config-app.js__, to inject the configuration you made into the web app

Follow these instructions to set up the app directory:
1. Unzip the __app.zip__. You should see new files appearing in your folder, such as the /public and /src folder.
2. Move the __config-app.js__ file into the newly created /src folder.

If everything went well, your directory should be organized as the following:

- *some other files and folders*
- README.md
- /contracts
- /migrations (will be used later)
- /src
    - *some other files and folders*
    - config-app.js
- model.xml

### Installing and launching the app

Make sure Truffle CLI, Ganache CLI, Node.js, and NPM are installed on your computer. If it is not the case, install the [latest version of Node.js](https://nodejs.org/en/), then type the following in your terminal:

```
npm install truffle -g
npm install ganache -g
```

Then, type the following commands to install the dependencies and start the setup application locally:

```
npm install
npm start
```

Once the application has started, you can access it locally: [localhost:3000](localhost:3000).

The app contains two important pages: __Setup__ and __App__.
For now, please go to the __Setup__ page.
Indeed, the frontend page application is up and running, yet your smart contracts aren't deployed, thus you cannot perform any traceability operation for the moment.

Follow the different steps proposed by the web application to specify the participants, roles, state machines, records collections, and assets of your application. In the end, you will be able to export a file named __contracts_params.json__. Please save this file into the /migrations folder, along __1_deploy_contracts.js__. 

### Deploying smart contracts and blockchain network setup

Now that everything is ready, it is time to start a blockchain test network and deploy your contracts.
A script named __start.js__ has been created to bundle all the required operations. To execute it, type the following:

```
node start
```

This will launch the blockchain network in your current terminal session and deploy the smart contracts.

### Interacting with my smart contracts for traceability

For the moment, the traceability features to interact with your smart contracts by directly using your web application are still in development. If you want, you can already interact with the deployed smart contracts by using the Truffle CLI.

In a new terminal process and in the same folder as the application, type the following command:

```
truffle console
```

This will open a CLI to interact with your smart contracts. Please read the [documentation](documentation) from Ganache to understand how to interact with your contracts using the CLI.