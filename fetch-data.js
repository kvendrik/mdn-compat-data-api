const fetch = require('isomorphic-fetch');
const xml = require('xml2js');
const childProcess = require('child_process');
const package = require('./package.json');

const PACKAGE_NAME = 'mdn-browser-compat-data';
const USER = 'mdn';

const currentPackageVersion = package.dependencies[PACKAGE_NAME];

function fetchNewVersion() {
  console.log(`${new Date()} Fetching new ${PACKAGE_NAME} version... (current version: ${currentPackageVersion || 'none'})`);
  childProcess.execSync(`npm remove --save ${PACKAGE_NAME} && npm install --save ${PACKAGE_NAME}`);
}

if (!currentPackageVersion) {
  fetchNewVersion();
  return;
}

fetch(`https://github.com/${USER}/${PACKAGE_NAME}/releases.atom`)
  .then((res) => res.text())
  .then((body) => {
    xml.parseString(body, (error, {feed: {entry}}) => {
      const {title: [latestVersion]} = entry[0];
      const currentVersionString = `v${currentPackageVersion.replace('^', '')}`;
      console.log(`Current version: ${currentVersionString}. Latest version: ${latestVersion}.`);
      if (currentVersionString !== latestVersion) {
        fetchNewVersion();
        return;
      }
    });
  });
