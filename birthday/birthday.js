import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUrl = 'https://arknights.wiki.gg/api.php?';

import { delay } from '../utils.js';


export async function birthday (message) {
    const date = formatDate();
    const command = message.replace(`bday`, '').trim();
    const data = await readFile('birthday.json');
    if (command == 'update') {
        await updateBirthday();
        return 'Update process has been finished.';
    } else if (command != '') {
        if (data[command] != undefined) {
            return `Birthdate of ${command} is ${data[command]}`;
        } else return "Operator not found~ Note that alter ops are excluded in the database.";
    } else {
        let birthdayOps = [];
        let string = ''
        for (let key in data) {
            if (data[key] == date) {
                birthdayOps.push(key);
            }
        }
        if (birthdayOps.length == 0) return `It's nobody's birthday today~`;
        if (birthdayOps.length > 1) {
            for (let item of birthdayOps) {
                if (birthdayOps.indexOf(item) == birthdayOps.length) {
                    string+=`and **${item}**`;
                }
                string+=`**${item}**, `;
            }
        } else {
            string = `**${birthdayOps[0]}**`;
        }
        const thumbnailRes = await (await fetch(baseUrl + new URLSearchParams({
            action: 'query',
            prop: 'imageinfo',
            iiprop: 'url',
            titles: `File:${birthdayOps[0]}_icon.png`,
            format: 'json'
        }))).json();
        console.log(thumbnailRes['query']['pages'][Object.keys(thumbnailRes.query.pages)[0]]);
        const result = {
            type: 'embed',
            embed: {
                color: 0x0099ff,
                title: `${date} :birthday:`,
                url: '',
                description: `Today is birthday of ${string}!`,
                thumbnail: {
                    url: `${thumbnailRes['query']['pages'][Object.keys(thumbnailRes.query.pages)[0]]['imageinfo'][0]['url']}`
                }
            }
        }
        return result;
    }
}

export async function updateBirthday () {
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
        if (!(item.title.includes('the') || item.title.includes('š'))) {
            wikitexts = wikitexts.split('\n');
            try {
                let bdate = wikitexts.filter((wikitext) => wikitext.startsWith('|birthdate'))[0].replace('|birthdate', '').replace('=', '').trim()
                if (bdate.includes(',')) {
                    bdate = bdate.split(',')[0];
                }
                data[item.title] = bdate;
            } catch (err) {
                let bdate = wikitexts.filter((wikitext) => wikitext.startsWith('|releasedate'))[0].replace('|releasedate', '').replace('=', '').trim();
                if (bdate.includes(',')) {
                    bdate = bdate.split(',')[0];
                }
                data[item.title] = bdate;
            }
            console.log(`Fetching for operator ${item.title} is done.`);
        }
    }
    await writeFile('birthday.json', data);
    return 'Update process has been finished.';
}


function getOrdinalSuffix(day) {
    const j = day % 10;
    const k = day % 100;
    
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
}

function formatDate() {
    const date = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    
    return `${month} ${day}${suffix}`;
}





async function readFile (name) {
    switch (name) {
        case 'birthday.json':
            return JSON.parse(await fs.readFile(`${__dirname}/birthday.json`, 'utf8'));
    }
}

async function writeFile (name, data) {
    switch (name) {
        case 'birthday.json':
            await fs.writeFile(`${__dirname}/birthday.json`, JSON.stringify(data, null, 2), 'utf8'); 
    }
}