import {watchFile} from "node:fs";
import {readAcmeStore} from "./read-acme-store.ts";
import {exportCertificates} from "./exporter";
import {clearOldCertificateFiles} from "./utils/clear-old-certificate-files.ts";

const inputFile = "/input/acme.json";
const outputDir = "/output";

let updateInProgress = false;


async function main() {
    console.log("Removing old certificate files...")
    await clearOldCertificateFiles(outputDir);

    console.log("Exporting new certificate files...")
    const store = await readAcmeStore(inputFile);
    const count = await exportCertificates(store, {inputFile, outputDir});

    if (count === 0) {
        throw new Error(
            "No certificates were exported, check the file and its format.",
        );
    }

    console.log(`Exported ${count} certificate(s) to ${outputDir}`);
}

// Always run on startup
await main().catch((error) => {
    console.error("Error occurred during startup:", error);
});

// Uses watchFile with polling instead of default watch, because most filesystem events don't go through bind-mounts
watchFile(inputFile, {interval: 5_000}, async () => {

    // Avoid overlapping exports if another change arrives mid-run.
    if (updateInProgress) return;
    updateInProgress = true;

    try {
        console.log(`Detected a change in ${inputFile}`);

        await main();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
    } finally {
        updateInProgress = false;
    }
});