const { execSync } = require('child_process');
const { join } = require("node:path");

exports.default = async function(context) {
    console.log(context);
    console.log('We need to some magic before pack');
    const serverPath = join(__dirname, '../server');
    console.log(serverPath);
    const serverDist = join(__dirname, 'dist-server');
    execSync('rm -rf dist-server');
    execSync('mkdir dist-server');

    execSync('cp -r ../server/dist dist-server');
    execSync('cp -r ../server/package.json dist-server');
    execSync('npm install --production', {
        cwd: serverDist,
        stdio: "inherit"
    });

    console.log('before pack magic done!')

    return Promise.resolve();
}