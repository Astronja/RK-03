import { createTable } from '../utils.js';
import { client } from '../index.js';

import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var helpFile = await readFile('help.json');

export async function help (command) {
    const commandList = command.replace('help', '').trim().split(' ');
    let directory = helpFile;
    let message = '';
    let string = '';
    if (commandList[0] != '') {
        for (var i = 0; i < commandList.length; i++) {
            if (directory['subc'][commandList[i]] != undefined) {
                directory = directory['subc'][commandList[i]];
                string+=`${commandList[i]} `
            } else {
                for (var j = 0; j < i; j++) {
                    string+=`${commandList[j]} `
                }
                string=string.trim();
                message = `Command "${string} ${commandList[i]}" not found, showing subcommands of "${string}".`;
                break;
            }
        }
    } else {
        message = directory.desc;
        return {
            message: message,
            type: 'table',
            table: createTable(createHelpList(directory))
        }
    }
    if (directory["subc"] == undefined) {
        message = `Command "${string}" has no subcommands available, double check before continue.`;
        return message;
    } else {
        if (message == '') {
            message = `Subcommands of "${string}" as follows:`
        }
        return {
            message: message,
            type: 'table',
            table: createTable(createHelpList(directory))
        }
    }
}

function createHelpList (directory) {
    let data = [
        ['Command', 'Description', 'Subcommands']
    ];
    for (let key in directory['subc']) {
        let subc = 'no';
        if (directory['subc'][key]['subc'] != undefined) {
            subc = 'yes'
        }
        data.push([key, directory['subc'][key]['desc'], subc]);
    }
    return data;
}

export async function about () {
    const attributions = [
        'Github - /Kengxxiao/ArknightsGameData_YoStar',
        'Github - /Kengxxiao/ArknightsGameData',
        'Penguin Statistics - penguin-stats.io',
        'Art components - Arknights《明日方舟》',
        'Arknights Terra Wiki - arknights.wiki.gg',
        'discord.js v14'
    ]
    return {
        embeds: [
            {
                color: 0xdc3838,
                title: 'Exusiai',
                author: {
                    name: 'Noel A.',
                    icon_url: (await client.users.fetch('1023608069063717035')).displayAvatarURL({ format: 'png', dynamic: true })
                },
                description: 'A service platform that provides \"Arknights\" game data analysis and related contents.',
                thumbnail: {
                    url: 'https://arknights.wiki.gg/images/8/82/Exusiai_the_New_Covenant_icon.png',
                },
                fields: [
                    {
                        name: 'Prefix',
                        value: 'e/',
                        inline: true
                    },
                    {
                        name: 'Version',
                        value: '0.2',
                        inline: true
                    },
                    {
                        name: 'Liscence',
                        value: 'CC BY-NC-SA 4.0',
                        inline: true
                    },
                    {
                        name: 'Attributions',
                        value: attributions.join('\n')
                    }
                ]
            }
        ]
    }
}

async function readFile (name) {
    switch (name) {
        case 'help.json':
            return JSON.parse(await fs.readFile(`${__dirname}/help.json`, 'utf8'));
    }
}