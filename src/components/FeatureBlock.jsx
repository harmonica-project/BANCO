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
    depth,
    displayPopover,
    closePopover,
    forceOpen
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
                                <ListItemText 
                                    primary={
                                        <span 
                                            style={{ cursor: 'help' }} 
                                            onMouseEnter={displayPopover}
                                            onMouseLeave={closePopover}
                                        >
                                                {feature.name}
                                        </span>
                                    } 
                                />
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
                                    <ListItemText 
                                        primary={
                                            <span 
                                                style={{ cursor: 'help' }} 
                                                onMouseEnter={displayPopover}
                                                onMouseLeave={closePopover}
                                            >
                                                    {feature.name}
                                            </span>
                                        } 
                                    />
                                    {
                                        feature.open ? 
                                            <IconButton
                                                onClick={toggleFeaturePanel.bind(this, feature.name, depth)}
                                                disabled={forceOpen}
                                            >
                                                <ExpandLess />
                                            </IconButton> : 
                                            <IconButton
                                                onClick={toggleFeaturePanel.bind(this, feature.name, depth)}
                                                disabled={forceOpen}
                                            >
                                                <ExpandMore />
                                            </IconButton>
                                    }
                                </ListItem>
                                <Collapse key={`collapse-${nameToId[featureName]}`} in={feature.open || forceOpen} timeout="auto" unmountOnExit>
                                    <FeatureBlock
                                        features={features}
                                        blockFeatures={feature.childrenForTree} 
                                        nameToId={nameToId}
                                        checkFeature={checkFeature}
                                        toggleFeaturePanel={toggleFeaturePanel}
                                        depth={depth + 1}
                                        displayPopover={displayPopover}
                                        closePopover={closePopover}
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