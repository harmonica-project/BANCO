import React from 'react';
import {
    Checkbox,
    Collapse,
    ListItem,
    ListItemText,
    IconButton,
    ListItemIcon
} from '@mui/material/';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const FeatureBlock = ({
    features, 
    blockFeatures, 
    nameToId, 
    checkFeature, 
    toggleFeaturePanel,
    depth
}) => {
    // recursively display features by depth
    return (
        <>
            {
                blockFeatures.map(featureName => {
                    let feature = features[nameToId[featureName]];

                    if (feature.childrenForTree.length === 0) {
                        return (
                            <ListItem
                                key={`item-${nameToId[featureName]}`}
                                disablePadding
                                sx={{ pl: 2 * depth }}
                            >
                                <ListItemIcon>
                                    <Checkbox 
                                        disabled={feature.deactivated || feature.activated}
                                        checked={feature.checked || feature.unchecked || feature.activated}
                                        indeterminate={feature.deactivated || feature.unchecked}
                                        onChange={checkFeature.bind(this, feature.name)}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={feature.name} />
                            </ListItem>
                        )
                    } else {
                        return (
                            <>
                                <ListItem
                                    key={`item-${nameToId[featureName]}`}
                                    disablePadding
                                    sx={{ pl: 2 * depth }}
                                >
                                    <ListItemIcon>
                                        <Checkbox 
                                            disabled={feature.deactivated || feature.activated}
                                            checked={feature.checked || feature.unchecked || feature.activated}
                                            indeterminate={feature.deactivated || feature.unchecked}
                                            onChange={checkFeature.bind(this, feature.name)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={feature.name} />
                                    {
                                        feature.open ? 
                                            <IconButton
                                                onClick={toggleFeaturePanel.bind(this, feature.name)}
                                            >
                                                <ExpandLess />
                                            </IconButton> : 
                                            <IconButton
                                            onClick={toggleFeaturePanel.bind(this, feature.name)}
                                            >
                                                <ExpandMore />
                                            </IconButton>
                                    }
                                </ListItem>
                                <Collapse key={`collapse-${nameToId[featureName]}`} in={feature.open} timeout="auto" unmountOnExit>
                                    <FeatureBlock
                                        features={features}
                                        blockFeatures={feature.childrenForTree} 
                                        nameToId={nameToId}
                                        checkFeature={checkFeature}
                                        toggleFeaturePanel={toggleFeaturePanel}
                                        depth={depth + 1}
                                    />
                                </Collapse>
                            </>
                        )
                    }
                })
            }
        </>
    )
}

export default FeatureBlock;