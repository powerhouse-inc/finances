import { syncDocuments } from "./apply-changes/syncDocuments.js";

const PORT = process.env.PORT || 4001;
// Reactor where the documents will be synchronized to
const GQL_ENDPOINT = `http://localhost:${PORT}`;

// Drive that the documents will be added/updated to. Will be created if it does not yet exist
const DRIVE_NAME =
  "finances_" +
  new Date()
    .toISOString()
    .substring(0, 16)
    .replaceAll(/[\-:]/g, "")
    .replace("T", "_");

// Preferred editor for the drive when it's created
const PREFERRED_EDITOR = "FinancesDriveExplorer";

// Max. number of document to process
const PROCESS_LIMIT = 200;

// Which scope documents to skip or include
const SKIP_NODES: { [id: string]: boolean } = {
 
};

// Set to true in order to update the index.json file with
// auto-complete values of the parent document field.
const SAVE_CACHE_FILE = false;

async function main() {
  await syncDocuments({
    driveName: DRIVE_NAME,
    gqlEndpoint: GQL_ENDPOINT,
    preferredEditor: PREFERRED_EDITOR,
    processLimit: PROCESS_LIMIT,
    skipNodes: SKIP_NODES,
    saveToFile: SAVE_CACHE_FILE
      ? "./scripts/apply-changes/data/index.json"
      : undefined,
  });
}

await main();
