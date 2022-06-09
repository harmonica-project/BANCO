[![dockeri.co](https://dockeri.co/image/bladesorbonne/banco)](https://hub.docker.com/r/bladesorbonne/banco)
# The BANCO project - Blockchain ApplicatioN Configurator

<div align="center">
    <br/>
    <p>
        The design and implementation of a blockchain application are quite challenging. With BANCO, we propose a tool to simplify this step to the point that you can generate your own application with a few clicks! The generated product includes state-of-the-art blockchain design patterns and good practices, and its modularity will allow you to build new features over this solid code ground!
    </p>
    <p>
        Want to try it? <a href="https://banco.nicosix.com/">Click here to access the tool</a>.
    </p>
  <br/>
</div> 

## Summary

This repository holds the codebase of BANCO, a tool to create a blockchain product following a software product line approach.
The configurator allows the user to select the desired features for the product to build.
Each feature is present in the feature model, which describes how one feature can be combined with others.
The configurator is in charge of verifying that the configuration made by the user complies with the feature model. 

After the selection of features, a generator is able to assemble a working blockchain product based on the configuration and predefined templates.

This first project iteration will allow the creation of blockchain products for on-chain traceability of assets and processes. Future works will consist in extending this approach to other domains and address further aspects of software product line engineering, such as product updates when modifying the software product line.

A publication, currently in review, will be referenced here in the future. It describes in-depth the method used to build a software product line for blockchain applications (the feature model and the web platform introduced in this repository) and evaluates the relevancy of the approach by assessing the cost, the code quality, and the generalizability of the approach to other traceability applications. It also gives insights into the benefits of applying SPLE for blockchain applications.

## Quickstart

There are two ways to run banco: from [the sources](#how-to-start-banco-from-source) or from the prebuilt [docker image](#how-to-start-banco-from-docker).
## Repository organization

The following list enumerates the important folders of this repository.

- __/evaluation__ - contains the source code generated by BANCO to serve the evaluation part of our contribution. They are shared on this repository for reproducibility and transparency purposes, following open science principles.
- __/src__ - contains the source code of BANCO
    - __/artifacts__ - contains the template application and smart contracts that are used by the generator to create new blockchain products, based on the user configuration.
        - __/feature_model__ - contains the SPL feature model. Can be opened in Eclipse, if FeatureIDE is installed.
        - __/contracts__ - contains the smart contracts templates.
    - __/manual_generation__ - contains a script to generate a product without requiring the deployment of the web platform.

## How to start BANCO from Docker


To use our prebuilt docker image, type the following command in your terminal.

```bash
docker run -p 3000:3000 bladesorbonne/banco:splc2022
```

After a few seconds, you'll see the message `You can now view banco in the browser`. You can go to [http://localhost:3000](http://localhost:3000) and use the tool.

To build the docker image locally (for example, if you have changed the source code and want to see your patch running on docker), you can use the following command at the root of the repository.

```bash
docker build -f ./docker/Dockerfile . -t bladesorbonne/banco
```
## How to start BANCO from Source

Make sure that Node.js and NPM are installed on your computer. If it is not the case, install the [latest version of Node.js here](https://nodejs.org/en/). Then, type the following commands:

```
npm install
npm start
```

Once the application has started, you can access it locally in your browser: [localhost:3000](localhost:3000).

## Template updates and additions

If you want to modify this software product line, you have to:

1. Change the feature model in Eclipse with FeatureIDE. You can find this feature model in __/src/artifacts/feature_model__.
2. Update or add new templates in the __/src/artifacts/contracts__ folder, to reflect the changes you made in the feature model. Make sure that your changes do not conflict with existing features. To better understand the process of creating templates, please read our publication (to be added).
3. Update the __/src/lib/generator/templates.js__ and the __/src/manual_generation/templates.js__ to include your features in the generation process or modify the existing ones.
4. Execute the following script while being located in __/src__ to export your templates and feature models to the __/public__ folder of BANCO, allowing the web platform to access the templates for generation purposes:

```
node export-assets
```

5. (optional) If you wish to modify the parameters provided to existing smart contract templates, make sure to also modify the generated template web application accordingly (can be found in __src/artifacts/src__.).

We are aware that modifying the existing software product line is still a burdensome process, notably the generated frontend application. Future works will be carried out to simplify this process.