export function decodePem(value: string): Buffer {
    const pem = Buffer.from(value, "base64");

    if (
        pem.length === 0 ||
        !pem.toString("utf8").includes("-----BEGIN ")
    ) {
        throw new Error(`Invalid base64-encoded PEM`);
    }

    return pem;
}