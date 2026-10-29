import path from "node:path";

export function safeFilename(value: string) {
    const name = path
        .basename(value)
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/^\.+/, "");

    if (!name) {
        throw new Error("Invalid filename");
    }

    return name;
}