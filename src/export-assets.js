const fse = require('fs-extra');

function main() {
    try {
        const srcDir = `./artifacts/contracts`;
        const destDir = `../public/artifacts/contracts`;

        console.log('Exporting artifacts to /public ...');

        fse.copySync(srcDir, destDir, { overwrite: true });
        console.log('/contracts successfully exported to /public/artifacts/contracts');

        fse.copySync('./artifacts/feature_model/model.xml', '../public/artifacts/model.xml');
        console.log('model.xml successfully exported to /public/artifacts/model.xml');
    } catch (e) {
        console.error('Failed to export artifacts to /public: ')
        console.error(e);
    }
}

main();