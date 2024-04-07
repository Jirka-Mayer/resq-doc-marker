// This script sets up the package.json file from the cloned
// RES-Q+ customization repository

const { readFileSync, writeFileSync } = require("fs")

// read the existing package.json
const jsonText = readFileSync("./resq-customization/package.json")
const jsonData = JSON.parse(jsonText)

// change the "name" field
jsonData.name = "resq-doc-marker-joint-development-setup"

// point parcel "source" field into the cloned RES-Q+ customization
jsonData.source = "resq-customization/" + jsonData.source

// remove "doc-marker" from dependencies
delete jsonData.devDependencies["doc-marker"]

// add the cloned "doc-marker" as a workspace
jsonData.workspaces = ["doc-marker"]

// write the modified package.json
writeFileSync(
  "./package.json",
  JSON.stringify(jsonData, null, 2)
)
