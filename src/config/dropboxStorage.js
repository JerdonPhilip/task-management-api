import { Dropbox } from "dropbox";
import fetch from "node-fetch";

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });

export async function uploadJSON (fileName, data) {
    const path = `/${fileName}.json`;
    await dbx.filesUpload({
        path,
        contents: JSON.stringify(data, null, 2),
        mode: { ".tag": "overwrite" }
    });
}

export async function downloadJSON (fileName) {
    const path = `/${fileName}.json`;
    try {
        const response = await dbx.filesDownload({ path });
        const text = response.result.fileBinary.toString();
        return JSON.parse(text);
    } catch (error) {
        if (error.status === 409) return {}; // file not found
        throw error;
    }
}
