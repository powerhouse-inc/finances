
// import { DocumentsCache } from "./common/DocumentsCache.js";
import { ReactorClient } from "./common/ReactorClient.js";
import { SystemGraphClient } from "./SystemGraphClient.js";
// import { type ParsedNotionDocument } from "./atlas-base/NotionTypes.js";
// import {
//   getPNDTitle,
//   documentIndex as notionDocsIndex,
// } from "../../document-models/utils.js";

export type DocumentSyncConfig = {
  gqlEndpoint: string;
  driveName: string;
  preferredEditor: string;
  processLimit: number;
  skipNodes: { [id: string]: boolean };
  saveToFile?: string;
};

export const syncDocuments = async (config: DocumentSyncConfig) => {
  const readClient = new ReactorClient(config.gqlEndpoint, config.driveName);
  const driveIds = await readClient.getDriveIds();

  if (driveIds.includes(config.driveName)) {
    console.log(`Drive ${config.driveName} already exists.`);
  } else {
    const systemClient = new SystemGraphClient(
      new URL("./system", config.gqlEndpoint).href
    );
    console.log(`Creating drive ${config.driveName}...`);
    const newDriveResult = await systemClient.createDrive(
      config.driveName,
      config.preferredEditor,
      config.driveName,
      config.driveName,
    );
    console.log(newDriveResult);
  }

  // console.log("Loading drive documents cache...");
  // const driveNodes = await readClient.getDriveNodes();
  // const documentsCache = new DocumentsCache(driveNodes);

  // const clients = {
  //   scopes: new AtlasScopeClient(
  //     new URL("./atlas-scope", config.gqlEndpoint).href,
  //     documentsCache,
  //     readClient,
  //     config.driveName,
  //   ),
  //   foundation: new AtlasFoundationClient(
  //     new URL("./atlas-foundation", config.gqlEndpoint).href,
  //     documentsCache,
  //     readClient,
  //     config.driveName,
  //   ),
  // };

  // for (const client of Object.values(clients)) {
  //   await client.loadDriveDocumentCache();
  // }

  // console.log(documentsCache.getDocumentsCount());
  // console.log("\nProcessing Notion documents...");

  // const queue = Object.values(notionDocsIndex)
  //   .filter((pnd) => pnd!.type == "scope")
  //   .sort((a, b) => (a!.docNo < b!.docNo ? -1 : 1));

  // let processed = 0,
  //   skipped = 0,
  //   notionDoc: ParsedNotionDocument | undefined;

  // while ((notionDoc = queue.shift())) {
  //   if (processed >= config.processLimit) {
  //     console.log(`\nProcess limit reached.`);
  //     break;
  //   }

  //   if (config.skipNodes[notionDoc.id]) {
  //     console.log(
  //       `SKIP [${notionDoc.id}]: ${getPNDTitle(notionDoc)} (${notionDoc.type})`,
  //     );
  //     skipped++;
  //     continue;
  //   }

  //   console.log(
  //     `>> ${processed + 1} [${notionDoc.id}]: ${getPNDTitle(notionDoc)} (${notionDoc.type})`,
  //   );

  //   try {
  //     if (notionDoc.type === "scope") {
  //       const newDocumentId = await clients.scopes.update(notionDoc);
  //     } else if (
  //       ["article", "section", "core", "activeDataController"].includes(
  //         notionDoc.type,
  //       )
  //     ) {
  //       const newDocumentId = await clients.foundation.update(notionDoc);
  //     } else {
  //       console.log(`Update for type ${notionDoc.type} not implemented yet.`);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }

  //   notionDoc.children.forEach((childNotionId) => {
  //     if (!notionDocsIndex[childNotionId]) {
  //       //console.warn(`Cannot find notion document ${childNotionId} (child ref of scope ${notionDoc?.name})`);
  //     } else {
  //       const item = { ...notionDocsIndex[childNotionId] };
  //       if (!item.parents?.includes(notionDoc!.id)) {
  //         item.parents = [...(item.parents || []), notionDoc!.id];
  //       }
  //       queue.push(item);
  //     }
  //   });

  //   processed++;
  // }

  // console.log(
  //   `Processed: ${processed}. Skipped: ${skipped}. Queued: ${queue.length}.`,
  // );

  // if (config.saveToFile) {
  //   documentsCache.saveToFile(config.saveToFile);
  //   console.log(`Document cache saved to file.`);
  // }

  const driveUrl = new URL(`./d/${config.driveName}`, config.gqlEndpoint).href;
  console.log(`Documents loaded in drive: ${driveUrl}`);
};
