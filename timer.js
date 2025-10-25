import { setInterval } from 'timers/promises';

import { client } from './index.js';
import { birthday, updateBirthday } from './birthday/birthday.js';
import { updateGuessData } from './guess-op/guess.js';

let today = (new Date()).getDate();


export async function dailyTask () {
    const channel = client.channels.cache.get('1369953457188114462');
    if (channel) {
        const result = await birthday('bday');
        if (result != `It's nobody's birthday today~`) await channel.send({ embeds: [result.embed] });
        else console.log('Daily task trail');
    } else {
        console.log('Channel not found.');
    }
    await updateBirthday();
    await updateGuessData();
}

function newDay () {
    if (today == (new Date()).getDate()) return false;
    else today = (new Date()).getDate(); return true;
}

(async () => {
	for await (const _ of setInterval(600000)) {
        console.log('loop!');
        if (newDay()) {
            await dailyTask();
        }
    }
})();