import { delay } from '../utils.js';

import { ButtonStyle } from 'discord.js';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function penguin (interaction, user) {
    const server = await userPref(user);
    const commandList = interaction.customId.split('_');
    console.log(commandList);
    switch (commandList[2]) {
        case 'searchmaterial':
            await searchMaterial(commandList[3], server);
            break;
        case 'searchstage':
            await searchStage(commandList[3], server);
            break;
        case 'formula':
            await materialFormula(commandList[3]);
            break;
    }
}

export async function startPenguin () {
    return {
        type: 'components',
        message: 'Choose one of the following functions:',
        buttons: [
            {
                id: 'button_penguin_searchmaterial',
                content: 'Material',
                style: ButtonStyle.Primary
            },
            {
                id: 'button_penguin_searchstage',
                content: 'Stage',
                style: ButtonStyle.Primary
            },
            {
                id: 'button_penguin_formula',
                content: 'Formula',
                style: ButtonStyle.Primary
            },
            {
                id: 'button_penguin_server',
                content: 'Server',
                style: ButtonStyle.Secondary
            }
        ]
    }
}

async function userPref (user) {
    
}






async function searchStage (stageId, server) {

}

async function searchMaterial (materialId, server) {
    const matrix = await readFile(`penguin${server}.json`);
    let data = [];
    for (let item of matrix) {
        if (item.itemId == materialId && item.times >= 1000) {
            data.push(item);
        }
    }
    console.log('Button successfully activated!');
}

async function materialFormula (materialId) {

}



async function updatePenguin () {
    const materialTable = await readFile('material.json');
    const materialIdList = Object.keys(materialTable);
    const serverList = ['CN', 'US', 'JP', 'KR'];
    for (let server of serverList) {
        delay(500);
        const penguinMatrix = await (await fetch(`https://penguin-stats.io/PenguinStats/api/v2/result/matrix?server=${server}`)).json();
        let data = [];
        for (let item of penguinMatrix['matrix']) {
            if (materialIdList.includes(item.itemId)) {
                data.push(item);
            }
        }
        await writeFile(`penguin${server}.json`, data);
    }
}


async function updateMaterialId () {
    //await writeFile('material.json', await (await fetch('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/refs/heads/main/en_US/gamedata/excel/item_table.json')).json())
    //console.log('Update finished');
    const item_table = await (await fetch('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/refs/heads/main/en_US/gamedata/excel/item_table.json')).json();
    let data = {};
    for (let key in item_table['items']) {
        if (item_table['items'][key]['classifyType'] == 'MATERIAL' 
            && item_table['items'][key]['itemType'] == 'MATERIAL' 
            && !key.includes('_char_')
            && !key.includes('mod_')
            && !key.includes('tier')
            && key != '32001'
        ) {
            data[key] = {
                id: key,
                name: item_table['items'][key]['name'],
                rarity: item_table['items'][key]['rarity']
            };
        }
    }
    await writeFile('material.json', data);
}


async function readFile (name) {
    switch (name) {
        case 'penguinCN.json':
            return JSON.parse(await fs.readFile(`${__dirname}/matrix-cn.json`, 'utf8'));
        case 'penguinUS.json':
            return JSON.parse(await fs.readFile(`${__dirname}/matrix-us.json`, 'utf8'));
        case 'penguinJP.json':
            return JSON.parse(await fs.readFile(`${__dirname}/matrix-jp.json`, 'utf8'));
        case 'penguinKR.json':
            return JSON.parse(await fs.readFile(`${__dirname}/matrix-kr.json`, 'utf8'));
        case 'material.json':
            return JSON.parse(await fs.readFile(`${__dirname}/material-id.json`, 'utf8'));
    }
}

async function writeFile (name, data) {
    switch (name) {
        case 'penguinCN.json':
            await fs.writeFile(`${__dirname}/matrix-cn.json`, JSON.stringify(data, null, 2), 'utf8');
            return;
        case 'penguinUS.json':
            await fs.writeFile(`${__dirname}/matrix-us.json`, JSON.stringify(data, null, 2), 'utf8');
            return;
        case 'penguinJP.json':
            await fs.writeFile(`${__dirname}/matrix-jp.json`, JSON.stringify(data, null, 2), 'utf8');
            return;
        case 'penguinKR.json':
            await fs.writeFile(`${__dirname}/matrix-kr.json`, JSON.stringify(data, null, 2), 'utf8');
            return;
        case 'material.json':
            await fs.writeFile(`${__dirname}/material-id.json`, JSON.stringify(data, null, 2), 'utf8');
            return;
    }
}


