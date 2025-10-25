import { delay, createTable } from '../utils.js';

import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let game = false;
let answer = '';
let accumTable = [['name', 'race', 'region', 'rarity', 'profession', 'position']];

const prefix = 'e/';



export async function guess (message) {
    let command = message.replace(`guess`, '').trim();
    if (command == 'update') {
        return await updateGuessData();
    } else if (command == 'start') {
        if (game) {
            return 'There is a game in process right now.';
        } else {
            resetGlobal();
            game = true;
            assignAnswer();
            return `You have 8 chances to guess the opeartor, type \"${prefix}guess xxx\" to guess.`;
        }
    } else if (command == 'end') {
        if (game) {
            resetGlobal();
            return 'The game has been ended.';
        } else {
            return 'The game is already ended.'
        }
    } else if (command == 'help' || command == '') {
        return `Type "${prefix}help guess" to see the subcommands of "${prefix}guess".`;
    } else {
        if (!game) {
            return `You have to \"${prefix}guess start\" to start a game first.`;
        }
        var data = await readFile('guess.json');
        let keys = [];
        for (let key in data) {
            keys.push(key);
        }
        if (!keys.includes(command)) {
            if (keys.includes(command.charAt(0).toUpperCase() + command.slice(1))) {
                command = command.charAt(0).toUpperCase() + command.slice(1);
            } else return 'Unknown operator, please check your spelling.';
        }
        accumTable.push(compare(data[command], data[answer]));
        if (command == answer) {
            game = false;
            return `Congrats! The answer is revealed: ${answer}.${createTable(accumTable)}`;
        } else if (accumTable.length - 1 < 8) {
            return `${9 - accumTable.length} chance(s) left.${createTable(accumTable)}`;
        } else {
            game = false;
            return `No chances left, answer: ${answer}.${createTable(accumTable)}`;
        }
    }
}

function compare (guess, ans) {
    let race = '';
    if (guess.race == ans.race) {
        race = correct();
    } else {
        race = wrong();
    }

    let region = '';
    if (guess.region == ans.region) {
        region = correct();
    } else {
        switch (guess.region) {
            case 'Yan':
                if (ans.region == 'Sui') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Sui':
                if (ans.region == 'Yan') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            
            case 'Lungmen': 
                if (ans.region == 'Lee\'s Detective Agency') {
                    region = close();
                    break;
                } else if (ans.region == 'Penguin Logistics') {
                    region = close();
                    break;
                } else if (ans.region == 'Lungmen Guard Department') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Lee\'s Detective Agency':
                if (ans.region == 'Lungmen') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Penguin Logistics':
                if (ans.region == 'Lungmen') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Lungmen Guard Department':
                if (ans.region == 'Lungmen') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            
            case 'Rhodes Island':
                if (ans.region == 'Op A4') {
                    region = close();
                    break;
                } else if (ans.region == 'Op Reserve A1') {
                    region = close();
                    break;
                } else if (ans.region == 'Op Reserve A4') {
                    region = close();
                    break;
                } else if (ans.region == 'Op Reserve A6') {
                    region = close();
                    break;
                } else if (ans.region == 'Elite Op') {
                    region = close();
                    break;
                } else if (ans.region == 'S.W.E.E.P.') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Op A4':
                if (ans.region == 'Rhodes Island') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Op Reserve A1':
                if (ans.region == 'Rhodes Island') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Op Reserver A4':
                if (ans.region == 'Rhodes Island') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Op Reserve A6':
                if (ans.region == 'Rhodes Island') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Elite Op':
                if (ans.region == 'Rhodes Island') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'S.W.E.E.P.':
                if (ans.region == 'Rhodes Island') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }

            case 'Columbia':
                if (ans.region == 'Siesta') {
                    region = close();
                    break;
                } else if (ans.region == 'Rhine Lab') {
                    region = close();
                    break;
                } else if (ans.region == 'Blacksteel') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Siesta':
                if (ans.region == 'Columbia') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Rhine Lab':
                if (ans.region == 'Columbia') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Blacksteel':
                if (ans.region == 'Columbia') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }

            case 'Victoria':
                if (ans.region == 'Glasgow') {
                    region = close();
                    break;
                } else if (ans.region == 'Tara') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Glasgow':
                if (ans.region == 'Victoria') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Tara':
                if (ans.region == 'Victoria') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }

            case 'Aegir':
                if (ans.region == 'Abyssal Hunters') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Abyssal Hunters':
                if (ans.region == 'Aegir') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }

            case 'Kazimierz':
                if (ans.region == 'Pinus Sylvestris') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Pinus Sylvestris':
                if (ans.region == 'Kazimierz') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }

            case 'Ursus':
                if (ans.region == 'Ursus Student Self-Governing Group') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Ursus Student Self-Governing Group':
                if (ans.region == 'Ursus') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }

            case 'Siracusa':
                if (ans.region == 'Chiave\'s Gang') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            case 'Chiave\'s Gang':
                if (ans.region == 'Siracusa') {
                    region = close();
                    break;
                } else {
                    region = wrong();
                    break;
                }
            default:
                region = wrong();
                break;
        }
    }

    let rarity = '';
    if (guess.rarity == ans.rarity) {
        rarity = correct();
    } else {
        if (guess.rarity > ans.rarity) {
            rarity = down();
        } else {
            rarity = up();
        }
    }

    let profession = '';
    if (guess.class == ans.class) {
        if (guess.branch == ans.branch) {
            profession = correct();
        } else {
            profession = close();
        }
    } else {
        profession = wrong();
    }

    let position = '';
    if (guess.position == ans.position) {
        position = correct();
    } else {
        if (ans.position == 'both') {
            position = close();
        } else {
            position = wrong();
        }
    }



    function up () {
        return '↑';
    }
    function down () {
        return '↓';
    }
    function wrong () {
        return '✘'
    }
    function close () {
        return '?';
    }
    function correct () {
        return '✓'
    }
    return [
        guess.name,
        race,
        region,
        rarity,
        profession,
        position
    ]
}

function resetGlobal () {
    game = false;
    answer = '';
    accumTable = [['name', 'race', 'region', 'rarity', 'profession', 'position']];
}

async function assignAnswer () {
    var data = await readFile('guess.json');
    let keys = [];
    for (let key in data) {
        keys.push(key);
    }
    answer = keys[Math.round(Math.random()*keys.length)];
}


//setTimeout(updateGuessData, 86400000);

const baseUrl = 'https://arknights.wiki.gg/api.php?';

export async function updateGuessData () {
    let data = {};
    const response = await fetch(baseUrl + new URLSearchParams({
        action: 'query',
        list: 'categorymembers',
        cmlimit: 500,
        cmtitle: 'Category:Operator',
        format: 'json'
    }));
    const responseObject = await response.json();
    for (let item of responseObject.query.categorymembers) {
        await delay(500);
        const res = await fetch(baseUrl + new URLSearchParams({
            action: 'parse',
            prop: 'wikitext',
            page: item.title,
            format: 'json'
        }));
        const dat = await res.json();
        let wikitexts = dat.parse.wikitext['*'];
        wikitexts = wikitexts.split('\n');
        data[item.title] = {
            name: wikitexts.filter((wikitext) => wikitext.startsWith('|name'))[0].replace('|name', '').replace('=', '').trim(),
            class: wikitexts.filter((wikitext) => wikitext.startsWith('|class'))[0].replace('|class', '').replace('=', '').trim(),
            branch: wikitexts.filter((wikitext) => wikitext.startsWith('|branch'))[0].replace('|branch', '').replace('=', '').trim(),
            position: wikitexts.filter((wikitext) => wikitext.startsWith('|position'))[0].replace('|position', '').replace('=', '').trim(),
            region: wikitexts.filter((wikitext) => wikitext.startsWith('|faction'))[0].replace('|faction', '').replace('=', '').trim(),
            rarity: parseInt(wikitexts.filter((wikitext) => wikitext.startsWith('|rarity'))[0].replace('|rarity', '').replace('=', '').trim()),
            race: wikitexts.filter((wikitext) => wikitext.startsWith('|race'))[0] 
                ? wikitexts.filter((wikitext) => wikitext.startsWith('|race'))[0]
                .replace('|race', '')
                .replace('=', '')
                .replace('[[', '')
                .replace(']]', '')
                .trim()
                : "Undefined"
        }
        console.log(`Fetching for operator ${item.title} is done.`);
    }
    await writeFile('guess.json', data);
    await guessModification();
    return 'Update process has been finished.';
}


async function guessModification () {
    let data = await readFile('guess.json');
    for (let key in data) {
        if (data[key]['race'].includes('Ursus')) {
            data[key]['race'] = 'Ursus';
        } else if (data[key]['race'].includes('Undisclosed')) {
            data[key]['race'] = 'Undisclosed';
        } else if (data[key]['race'].includes('Unknown')) {
            data[key]['race'] = 'Unknown';
        } else if (data[key]['race'].includes('Manticore')) {
            data[key]['race'] = ('Manticore');
        } else if (data[key]['race'.includes('fandom')] || data[key]['race'].includes('Self-declared') || data[key]['race'].includes('Delicious in Dungeon')) {
            data[key]['race'] = 'Delicious on Terra';
        } else if (data[key]['race'].includes('Sarkaz')) {
            data[key]['race'] = 'Sarkaz';
        } else if (data[key]['race'].includes('Elafia')) {
            data[key]['race'] = 'Elafia';
        } else if (data[key]['race'].includes('Kuranta')) {
            data[key]['race'] = 'Kuranta';
        } else if (data[key]['race'].includes('Aegir')) {
            data[key]['race'] = 'Aegir';
        } else if (data[key]['race'].includes('Liberi')) {
            data[key]['race'] = 'Liberi';
        } else if (data[key]['race'].includes('Durin')) {
            data[key]['race'] = 'Durin';
        } else if (data[key]['race'].includes('Vulpo')) {
            data[key]['race'] = 'Vulpo';
        } else if (data[key]['race'].includes('Feline')) {
            data[key]['race'] = 'Feline';
        } else if (data[key]['race'].includes('Archosauria')) {
            data[key]['race'] = 'Archosauria'
        } else if (data[key]['race'].includes('Perro')) {
            data[key]['race'] = 'Perro'
        } else if (data[key]['race'].includes('Cautus')) {
            data[key]['race'] = 'Cautus'
        }
        if (data[key]['branch'] == 'Push Stroker' || data[key]['branch'] == 'Hookmaster') {
            data[key]['position'] = 'Both';
        }
    }
    await writeFile('guess.json', data);
    return 'Guess.json has been modified.';
}



async function readFile (name) {
    switch (name) {
        case 'guess.json':
            return JSON.parse(await fs.readFile(`${__dirname}/guess.json`, 'utf8'));
    }
}

async function writeFile (name, data) {
    switch (name) {
        case 'guess.json':
            await fs.writeFile(`${__dirname}/guess.json`, JSON.stringify(data, null, 2), 'utf8'); 
    }
}