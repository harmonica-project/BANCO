import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListSubheader,
    Chip,
    Stack
} from '@mui/material/';
import $ from 'jquery';
import FeatureBlock from './FeatureBlock';
import { XmlModel, Model } from '../lib/feature-configurator/model';
import { Configuration } from '../lib/feature-configurator/configuration';

const Configurator = ({ setExtConfiguration, actions, setActions }) => {
    const [configuration, setConfiguration] = useState({});

    // fired when the user clicks on a checkbox
    const checkFeature = (name) => {
        // ignore if the checkbox is supposed to be filled automatically
        if (!configuration.isActivated(name) && !configuration.isDeactivated(name)) {
            try {
                const newModel = new Model(configuration.model.xmlModel);
                newModel['nameToId'] = configuration.model.nameToId;
                newModel.features = structuredClone(configuration.model.features);
                let newSelectedFeatures = structuredClone(configuration.selectedFeatures);
                let newDeselectedFeatures = structuredClone(configuration.deselectedFeatures);

                const fId = newModel.nameToId[name];
                
                if (newModel.features[fId].checked) {
                    newModel.features[fId].unchecked = true;
                    newModel.features[fId].checked = false;
                    newDeselectedFeatures.push(newModel.features[fId]);
                    newSelectedFeatures = newSelectedFeatures.filter(f => f.name !== newModel.features[fId].name);
                } else if (newModel.features[fId].unchecked) {
                    newModel.features[fId].unchecked = false;
                    newDeselectedFeatures = newDeselectedFeatures.filter(f => f.name !== newModel.features[fId].name);
                }
                else {
                    newModel.features[fId].checked = true;
                    newSelectedFeatures.push(newModel.features[fId]);
                }

                const newConfiguration = renderFeaturesSelection(
                    new Configuration(newModel, newSelectedFeatures, newDeselectedFeatures)
                );
                setConfiguration(newConfiguration);    
            } catch (e) {
                console.log(e);
            }
        }
        
    }

    // display/hide the subfeatures of a feature if clicked
    const toggleFeaturePanel = (name) => {
        console.log(configuration);
        const id = configuration.model.nameToId[name];
        const newFeatures = JSON.parse(JSON.stringify(configuration.model.features));
        newFeatures[id].open = !newFeatures[id].open;

        setConfiguration({
            ...configuration,
            model: {
                ...configuration.model,
                features: newFeatures
            }
        })
    }

    // render the feature checkboxes based on their three states: activated, deactivated, and selected
    const renderFeaturesSelection = (newConfiguration) => {
        const activatedFeatures = newConfiguration.getActivatedFeatures();
        const deactivatedFeatures = newConfiguration.getDeactivatedFeatures();

        newConfiguration.model.features.forEach((f, i) => {
            newConfiguration.model.features[i].activated = !!activatedFeatures.find(af => af.name === f.name);
            newConfiguration.model.features[i].deactivated = !!deactivatedFeatures.find(df => df.name === f.name);
        });
        return newConfiguration;
    }

    // append children to every feature to render them as a tree
    const setupCheckboxTree = (newConfiguration) => {
        newConfiguration.model.nameToId = {};

        newConfiguration.model.features = newConfiguration.model.features.map(
            (f, i) => {
                newConfiguration.model.nameToId[f.name] = i;

                return { 
                    ...f, 
                    childrenForTree: [], 
                    activated: false,
                    deactivated: false,
                    checked: false,
                    unchecked: false
                };
            }
        );

        newConfiguration.model.features.forEach(f => {
            if (f['parent'] !== null) {
                newConfiguration.model.features[
                    newConfiguration.model.nameToId[
                        f.parent.name
                    ]
                ].childrenForTree.push(f.name);
            }
        })

        try {
            newConfiguration = renderFeaturesSelection(newConfiguration);
        } catch (e) { 
            // catch rendering issues
            console.log(e)
        }
        
        return newConfiguration;
    };

    const unfoldFeatures = () => {
        let newFeatures = JSON.parse(JSON.stringify(configuration.model.features));
        newFeatures = newFeatures.map(f => ({ ...f, open: true }));
        setConfiguration({
            ...configuration,
            model: {
                ...configuration.model,
                features: newFeatures
            }
        })
    };

    const foldFeatures = () => {
        let newFeatures = JSON.parse(JSON.stringify(configuration.model.features));
        newFeatures = newFeatures.map(f => ({ ...f, open: false }));
        setConfiguration({
            ...configuration,
            model: {
                ...configuration.model,
                features: newFeatures
            }
        })
    };

    const renderFeatures = () => {
        if ('model' in configuration) {
            return (
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    component="nav"
                >
                    <FeatureBlock 
                        features={configuration.model.features}
                        blockFeatures={[configuration.model.features[0].name]}
                        nameToId={configuration.model.nameToId}
                        checkFeature={checkFeature}
                        toggleFeaturePanel={toggleFeaturePanel}
                        depth={0}
                    />
                </List>
            );
        }

        return <span>Loading ...</span>
    }

    useEffect(() => {
        fetch("model.xml")
        .then((response) => response.text())
        .then(xml => {
            let parsedXml = $.parseXML(xml);
            try {
                setConfiguration(
                    setupCheckboxTree(
                        new Configuration(new Model(new XmlModel(parsedXml)))
                    )
                );
            } catch (e) {
                console.error(e)
            }
        });
    }, []);

    useEffect(() => {
        setExtConfiguration(configuration);
    }, [configuration]);

    useEffect(() => {
        if (actions.unfoldAll) {
            unfoldFeatures();
            setActions({ ...actions, unfoldAll: false });
        }
    }, [actions.unfoldAll]);

    useEffect(() => {
        if (actions.foldAll) {
            foldFeatures();
            setActions({ ...actions, foldAll: false });
        }
    }, [actions.foldAll]);

    return (
        <Box>
            <Stack direction="row" spacing={1}>
                <Chip
                    color={!!configuration.isValid && configuration.isValid() ? 'success' : 'error'}
                    label={!!configuration.isValid && configuration.isValid() ? 'Valid' : 'Invalid'}
                />
                <Chip
                    color={!!configuration.isComplete && configuration.isComplete() ? 'success' : 'error'}
                    label={!!configuration.isComplete && configuration.isComplete() ? 'Complete' : 'Incomplete'}
                />
            </Stack>
            {renderFeatures()}
        </Box>
    )
}

export default Configurator;