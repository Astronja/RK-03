import { client } from '../index.js';

import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function interactUser (userId) {
    const existedUsers = await getExistedUsers(__dirname);
    if (!existedUsers.includes(userId)) {
        await registerUser(userId);
    }
    const data = await readUserFile(userId);
    const change = {
        interaction: data['interaction'] + 1
    }
    await updateUserFile(userId, change);
}

export async function readUserFile (userId) {
    const existedUsers = await getExistedUsers(__dirname);
    if (!existedUsers.includes(userId)) {
        await registerUser(userId);
    }
    return JSON.parse(await fs.readFile(`${__dirname}/${userId}.json`, 'utf8'));
}

export async function updateUserFile (userId, data) {
    let origData = readUserFile(userId);
    for (let key in data) {
        origData[key] = data[key];
    }
    await fs.writeFile(`${__dirname}/${userId}.json`, JSON.stringify(origData, null, 2), 'utf8');
}

async function registerUser (userId) {
    const data = await userTemplate(userId);
    await fs.writeFile(`${__dirname}/${userId}.json`, JSON.stringify(data, null, 2), 'utf8');
}

async function getExistedUsers(directoryPath) {
    try {
        const files = await fs.readdir(directoryPath);
        const fileNames = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stats = await fs.stat(filePath);
            if (stats.isFile() && file.endsWith('.json')) {
                fileNames.push(file.replace('.json', ''));
            }
        }
        return fileNames;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

async function userTemplate (userId) {
    const userData = await client.users.fetch(userId);
    return {
        id: userData.id,
        username: userData.username,
        interaction: 0,
        server: 'US'
    }
}