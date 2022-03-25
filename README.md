# The BANCO project - Blockchain ApplicatioN Configurator

## Summary

This repository holds the codebase of BANCO, a tool to create a blockchain product following a software product line approach.
The configurator allows the user to select its desired features for the product to build.
Each feature is present in the feature model, that describe how one feature can be combined with others.
The configurator is in charge of verifying that the configuration made by the user complies with the feature model. 

After the selection of features, a generator is able to assemble a working blockchain product based on the configuration and predefined templates.

This first project iteration will allow the creation of blockchain products for on-chain traceability of assets and processes. 
This is still a WiP project, at the moment there is only a small prototype to configure a smart-contract managing the participants of such a product. 

## Setup and usage

This project relies on NodeJS and npm.
Make sure you have the latest version installed (Node >v16 and npm >v8), then install the dependencies:

```
npm install
```

You can then generate your first product using the following command:

```
npm test
```

This command uses the configuration file named little.xml in _feature_model/configs_. 

If you want to try it with your own configuration file, store it into this folder and then type the following (replace filename by your own file):

```
node gen.js -c <filename>
```

You can also use the purge command to remove old products, using the argument -p. 
If included along the -c argument, it will delete all the products and generate a new one (convenient if you don't want to create too much products).

```
node gen.js -p
```

## How to edit the feature model

The _feature_model_ folder is an Eclipse project that can be opened in this editor, if you have FeatureIDE installed. 

In FeatureIDE, you will be able to edit the feature model and create configuration files that are automatically verified by the plugin.

Be careful when editing the feature model, as you also have to edit the templates accordingly!