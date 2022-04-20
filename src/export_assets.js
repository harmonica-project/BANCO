const fse = require('fs-extra');

try {
    const srcDir = `artifacts`;
    const destDir = `../public/artifacts`;

    console.log('Exporting artifacts to /public ...');
    fse.copySync(srcDir, destDir, { overwrite: true });
    console.log('/artifacts successfully exported to /public/artifacts');
} catch (e) {
    console.error('Failed to export artifacts to /public: ')
    console.error(e);
}