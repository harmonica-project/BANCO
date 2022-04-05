const fse = require('fs-extra');

try {
    const srcDir = `../assets/contracts`;
    const destDir = `../../public/assets/contracts`;

    console.log('Exporting assets to /public ...');
    fse.copySync(srcDir, destDir, { overwrite: true });
    console.log('/contracts successfully exported to /public/assets/contracts');
    fse.copySync('../assets/feature_model/model.xml', '../../public/assets/model.xml');
    console.log('model.xml successfully exported to /public/assets/model.xml');
} catch (e) {
    console.error('Failed to export assets to /public: ')
    console.error(e);
}