import Mustache from 'mustache';
import convert from 'xml-js';
import jszip from 'jszip';

function parseConfig(rawFile) {
    try {
        let rawConfig = JSON.parse(convert.xml2json(rawFile));
        let features = rawConfig['elements'][0]['elements'];
        let config = {};
    
        for (let c of features) {
            config[c.attributes.name] = (c.attributes.automatic === "selected" || c.attributes.manual === "selected");
        }
    
        console.log('Loaded configuration: ', config);

        return config;
    } catch (e) {
      console.error('Failed to retrieve and parse config: ', e);
    }
}

async function parseTemplate(contract, config) {
    const template = await (await fetch(`contracts/${contract}.sol`)).text()

    // Render template
    var output = Mustache.render(template, config);
    
    return {
        name: contract,
        output
    }
}

const bundleArtifacts = async (artifacts, xmlConfig) => {
    const zip = jszip();
    zip.file('config.xml', xmlConfig);

    const contracts = zip.folder("contracts");
    artifacts.forEach(a => contracts.file(a.name + '.sol', a.output));
    contracts.file('Helpers.sol', await (await fetch(`contracts/Helpers.sol`)).text())

    return await zip.generateAsync({type: "blob"});
}

const generateProduct = async (xmlConfig) => {
    const mustacheConfig = parseConfig(xmlConfig);

    // Using the comment feature of Solidity to both allow templating and contract development
    Mustache.tags = ['/*', '*/'];

    const artifacts = [];
    artifacts.push(await parseTemplate('Participants.', mustacheConfig));
    artifacts.push(await parseTemplate('Records', mustacheConfig));

    const bundle = await bundleArtifacts(artifacts, xmlConfig);

    return bundle;
}

export default generateProduct;