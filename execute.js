import { birthday } from './birthday/birthday.js';
import { guess } from './guess-op/guess.js';
import { help, about } from './help/help.js';
import { startPenguin, penguin } from './penguin/penguin.js';


export async function executeCommand (command, author) {
    const primary = command.split(' ')[0];
    switch (primary) {
        case 'guess':
            return await guess(command);
        case 'bday':
            return await birthday(command);
        case 'help':
            return await help(command);
        case 'about':
            return await about();
        //case 'stat':
            return await startPenguin();
        //case 'test':
            return;
        default:
            return 'Command not found, type e/help for help.';
    }
}


export async function executeInteraction (interaction, user) {
    const type = interaction.customId.split('_')[0];
    const primary = interaction.customId.split('_')[1]
    if (type == 'button') {
        switch (primary) {
            case 'penguin':
                return await penguin(interaction, user);
        }
    }
}