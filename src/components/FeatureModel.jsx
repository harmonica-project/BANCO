import React from 'react';
import Graphviz from 'graphviz-react';
import ModelViz from '../lib/feature-configurator/model-viz';

const FeatureModel = ({ configuration }) => {
    const renderGraph = () => {
        if (!!configuration && !!configuration.model) {
            // convert the JSON configuration into a DOT file
            const viz = ModelViz(configuration.model);
            return (
                // displays the DOT file in a React component
                <Graphviz
                    dot={viz.toDot(configuration)}
                    options={{
                        width: '100%'
                    }}
                />)
        }
        return (<span>Loading ...</span>)
    }

    return renderGraph();
}

export default FeatureModel;