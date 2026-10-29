import path from "node:path";
import type {AcmeStore, ExportOptions} from "./types/types.ts";
import {safeFilename} from "./utils/safe-filename.ts";
import {decodePem} from "./utils/decode-pem.ts";

export async function exportCertificates(
    store: AcmeStore,
    {outputDir}: ExportOptions,
): Promise<number> {
    let exported = 0;

    for (const [resolverName, resolver] of Object.entries(store)) {
        const certificates = resolver?.Certificates;
        if (!Array.isArray(certificates)) continue;

        for (const [index, entry] of certificates.entries()) {
            if (!entry?.certificate || !entry.key) {
                console.warn(
                    `Skipping ${resolverName} certificate ${index + 1}: certificate or key is missing`,
                );
                continue;
            }

            const commonName = entry.domain?.main?.replace(/^\*\./, "wildcard-") ?? `certificate-${index + 1}`;
            const filename = safeFilename(`${resolverName}_${commonName}`);

            const certPath = path.join(outputDir, `${filename}.crt`);
            const keyPath = path.join(outputDir, `${filename}.key`);

            const certificate = decodePem(entry.certificate,);
            const privateKey = decodePem(entry.key);

            await Bun.write(certPath, certificate);
            await Bun.write(keyPath, privateKey);

            console.log(`Exported ${resolverName}/${filename}`);
            exported++;
        }
    }

    return exported;
}