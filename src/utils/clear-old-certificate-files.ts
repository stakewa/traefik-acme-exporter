export async function clearOldCertificateFiles(dir: string): Promise<void> {
    const glob = new Bun.Glob("**/*.{key,crt}");

    for await (const path of glob.scan({cwd: dir, onlyFiles: true})) {
        await Bun.file(`${dir}/${path}`).delete();
    }
}