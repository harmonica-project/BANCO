import Mustache from 'mustache';
import convert from 'xml-js';
import jszip from 'jszip';
import templates from './templates';

function parseConfig(rawFile) {
    try {
        let rawConfig = JSON.parse(convert.xml2json(rawFile));
        let features = rawConfig['elements'][0]['elements'];
        let config = {};
    
        for (let c of features) {
            config[c.attributes.name] = (c.attributes.automatic === "selected" || c.attributes.manual === "selected");
        }

        return config;
    } catch (e) {
      console.error('Failed to retrieve and parse config: ', e);
    }
}

async function parseTemplate(path, contract, config) {
    const template = await (await fetch(`./artifacts/contracts/${path}/${contract.name}.sol`)).text()

    // Render template
    var output = Mustache.render(template, config);
    
    return {
        name: contract.name,
        path,
        output
    }
}

const bundleArtifacts = async (artifacts, xmlConfig) => {
    const zip = jszip();
    const appZip = await (await fetch('./artifacts/app.zip')).blob()
    
    zip.file('config.xml', xmlConfig);
    zip.file('app.zip', appZip);

    const contracts = zip.folder("contracts");
    artifacts.forEach(a => {
        let folder = contracts.folder(a.path);
        folder.file(`${a.name}.sol`, a.output);
    });

    return await zip.generateAsync({type: "blob"});
}

const generateProduct = async (xmlConfig) => {
    const mustacheConfig = parseConfig(xmlConfig);

    // Using the comment feature of Solidity to both allow templating and contract development
    Mustache.tags = ['/*', '*/'];

    const artifacts = [];
    
    for (let template of templates) {
        for (let contract of template.contracts) {
            if (contract.feature === undefined || mustacheConfig[contract.feature]) {
                artifacts.push(await parseTemplate(template.path, contract, mustacheConfig));
            }
        }
    }

    const bundle = await bundleArtifacts(artifacts, xmlConfig);

    return bundle;
}

export default generateProduct;