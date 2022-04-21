# Script execution

It is also possible to execute the project as a script, without the frontend interface.
You will get the same product at the end. However, you have to configure the product using FeatureIDE.

## Setup and usage

This project relies on NodeJS and npm.
Make sure you have the latest version installed (Node >v16 and npm >v8), then install the dependencies:

```
npm install
```

You can then generate your first product using the following command:

```
node gen.js -c default
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