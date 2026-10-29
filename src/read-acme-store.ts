import type {AcmeStore} from "./types/types.ts";

export async function readAcmeStore(inputFile: string): Promise<AcmeStore> {
    const file = Bun.file(inputFile);

    if (!(await file.exists())) {
        throw new Error(`Input file not found: ${inputFile}`);
    }

    let parsed: unknown;
    try {
        parsed = await file.json();
    } catch (error) {
        throw new Error(`Could not parse JSON in ${inputFile}`, {cause: error});
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error(`${inputFile} must contain a JSON object`);
    }

    return parsed as AcmeStore;
}