# Evaluation

## Summary

This folder contains the configuration and source code of the generated products that have been configured compared to the reference studies implementations in our paper. The following subsection will explain how to start them.

## Setup

At first, make sure Truffle CLI, Ganache CLI, npm, and node are installed on your computer. If it is not the case, install the [latest version of Node.js](https://nodejs.org/en/), then type the following command:

```
npm install truffle -g
npm install ganache -g
```

Now that truffle is installed, you can try to deploy the product. Start by creating a blockchain test environment with Ganache:

```
ganache
```

Then, deploy the smart contracts by executing the following command:

```
truffle migrate
```

Finally, you can enter in a Truffle CLI to interact with deployed smart contracts:

```
truffle console
```

Please read the [documentation](documentation) from Ganache to understand how to interact with your contracts using the CLI.
