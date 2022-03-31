import React, { useEffect, useState } from 'react';
import {
    Paper,
    List,
    Chip,
    Stack
} from '@mui/material/';
import Draggable from 'react-draggable';
import $ from 'jquery';
import FeatureBlock from './FeatureBlock';
import { XmlModel, Model } from '../lib/feature-configurator/model';
import { Configuration } from '../lib/feature-configurator/configuration';
import FeaturePopover from './FeaturePopover';

const Configurator = ({ configuration, setConfiguration, actions, setActions, draggableMode }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    
    // fired when the user clicks on a checkbox
    const checkFeature = (name) => {
        // ignore if the checkbox is supposed to be filled automatically
        if (!configuration.isActivated(name) && !configuration.isDeactivated(name)) {
            try {
                var newConfiguration = new Configuration(configuration.model, configuration.selectedFeatures, configuration.deselectedFeatures)
                const fId = newConfiguration.model.nameToId[name];

                if (newConfiguration.model.features[fId].checked) {
                    newConfiguration.model.features[fId].unchecked = true;
                    newConfiguration.model.features[fId].checked = false;
                    newConfiguration.deselectedFeatures.push(newConfiguration.model.features[fId]);
                    newConfiguration.selectedFeatures = newConfiguration.selectedFeatures.filter(f => f.name !== newConfiguration.model.features[fId].name);
                } else if (newConfiguration.model.features[fId].unchecked) {
                    newConfiguration.model.features[fId].unchecked = false;
                    newConfiguration.deselectedFeatures = newConfiguration.deselectedFeatures.filter(f => f.name !== newConfiguration.model.features[fId].name);
                }
                else {
                    newConfiguration.model.features[fId].checked = true;
                    newConfiguration.selectedFeatures.push(newConfiguration.model.features[fId]);
                }

                newConfiguration = renderFeaturesSelection(newConfiguration);
                setConfiguration(newConfiguration);    
            } catch (e) {
                console.error(e);
            }
        }
        
    }

    // display/hide the subfeatures of a feature if clicked
    const toggleFeaturePanel = (name) => {
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

        newConfiguration = renderFeaturesSelection(newConfiguration);
        
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
                    displayPopover={handlePopoverOpen}
                    closePopover={handlePopoverClose}
                    depth={0}
                />
            </List>
        );
    }

    const selectFeaturesAfterImport = (newConfiguration) => {
        newConfiguration.selectedFeatures.forEach(sf => {
            const id = newConfiguration.model.features.findIndex(f => f.name === sf.name);
            newConfiguration.model.features[id].checked = true;
        });

        newConfiguration.deselectedFeatures.forEach(sf => {
            const id = newConfiguration.model.features.findIndex(f => f.name === sf.name);
            newConfiguration.model.features[id].unchecked = true;
        });

        return newConfiguration;
    };

    useEffect(() => {
        fetch("./assets/model.xml")
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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (actions.unfoldAll) {
            unfoldFeatures();
            setActions({ ...actions, unfoldAll: false });
        }
    }, [actions.unfoldAll]); // eslint-disable-line react-hooks/exhaustive-deps
 
    useEffect(() => {
        if (actions.foldAll) {
            foldFeatures();
            setActions({ ...actions, foldAll: false });
        }
    }, [actions.foldAll]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (actions.updateFeatureRender) {
            let newConfiguration = new Configuration(configuration.model, configuration.selectedFeatures, configuration.deselectedFeatures);
            newConfiguration = selectFeaturesAfterImport(newConfiguration);
            newConfiguration = renderFeaturesSelection(newConfiguration);
            setConfiguration(newConfiguration);
            setActions({ ...actions, updateFeatureRender: false });
        }
    }, [actions.updateFeatureRender]); // eslint-disable-line react-hooks/exhaustive-deps

    const renderConfigurator = () => {
        const featureList = (
            <Paper style={{ padding: '20px' }}>
                <Stack direction="row" spacing={1} style={{ paddingBottom: '10px' }}>
                    <Chip
                        color={!!configuration.isValid && configuration.isValid() ? 'success' : 'error'}
                        label={!!configuration.isValid && configuration.isValid() ? 'Valid' : 'Invalid'}
                    />
                    <Chip
                        color={!!configuration.isComplete && configuration.isComplete() ? 'success' : 'error'}
                        label={!!configuration.isComplete && configuration.isComplete() ? 'Complete' : 'Incomplete'}
                    />
                </Stack>
                <FeaturePopover 
                    anchorEl={anchorEl} 
                    closePopover={handlePopoverClose} 
                    configuration={configuration}
                />
                {renderFeatures()}
            </Paper>
        )

        if (draggableMode) {
            return (
                <Draggable>
                    <Paper 
                        style={{ 
                            cursor: (draggableMode ? 'move' : 'auto'),
                            position: 'absolute',
                            backgroundColor: 'white',
                            zIndex: '999',
                            top: '20px'
                        }}
                    >
                        {featureList}
                        <FeaturePopover 
                            anchorEl={anchorEl} 
                            closePopover={handlePopoverClose}
                            configuration={configuration} 
                        />
                    </Paper>
                </Draggable>
            )
        } else {
            return featureList;
        }
    }

    return ('model' in configuration ? renderConfigurator() : <span>Loading ...</span>);
}

export default Configurator;