# The BANCO project - Blockchain ApplicatioN Configurator

## Summary

This repository holds the codebase of BANCO, a tool to create a blockchain product following a software product line approach.
The configurator allows the user to select its desired features for the product to build.
Each feature is present in the feature model, that describe how one feature can be combined with others.
The configurator is in charge of verifying that the configuration made by the user complies with the feature model. 

After the selection of features, a generator is able to assemble a working blockchain product based on the configuration and predefined templates.

This first project iteration will allow the creation of blockchain products for on-chain traceability of assets and processes. 
This is still a WiP project, at the moment there is only a small prototype to configure a smart-contract managing the participants of such a product. 
