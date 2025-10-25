import { executeCommand, executeInteraction } from './execute.js';
import { interactUser } from './users/user.js';

import { setInterval } from 'timers/promises';
import { GatewayIntentBits, Client, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ActivityType, PresenceUpdateStatus, MessageManager } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + '/.env' });

const prefix = 'e/';

export const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const dcToken = process.env.token;
client.login(dcToken);

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}`);
    if (dcToken == process.env.ada){
        client.user.setPresence({
            activities: [{ 
                name: `🤓 · Testing as ${__dirname.replace('/root/MiLa/', '')}`, 
                type: ActivityType.Custom
            }],
            status: 'dnd'
        });
    } else for await (const _ of setInterval(60000)) await updateStatus();
});

client.on('messageCreate', async (message) => {
    if (message.mentions.has(client.user) && message.content.includes("about")) {
        await message.reply(await executeCommand('about', message.author));
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) {
        await interactUser(message.author.id);
        const command = message.content.replace(prefix, '');
        const response = await executeCommand(command, message.author);
        if (response == false) return;
        if (response.type === 'attachment') {
            await message.reply(replyAttachment(response));
        } else if (response.type === 'buffer') {
            await message.reply(replyBuffer(response));
        } else if (response.type === 'table') {
            await message.reply(replyTable(response));
        } else if (response.type === 'embed') {
            await message.reply(replyEmbed(response));
        } else if (response.type === 'components'){
            await message.reply(replyComponents(response));
        } else if (response.type === 'original') {
            await message.reply(response.orig);
        } else {
            await message.reply(response);
        }
    }
});

async function updateStatus () {
    //const latestVersion = Object.keys(this.config.versions)[Object.keys(this.config.versions).length - 1];
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const statusString = `😇 · v____: ${days}d ${hours}h ${minutes}m`;
    client.user.setPresence({
        activities: [{ 
            name: statusString,
            type: ActivityType.Custom 
        }]
    });
}


client.on('interactionCreate', async (interaction) => {
    console.log(interaction);
    if (!interaction.isButton()) return;
    const response = executeInteraction(interaction);
    if (response.edit == true) {
        await interaction.message.edit(response.messsage);
    } else {
        await interaction.reply(response.messsage);
    }
});



function replyBuffer (response) {
    const attachment = new AttachmentBuilder(response.path, {name: `file.${response.filetype}`});
    return {
        content: response.content,
        files: [
            attachment
        ]
    };
}
function replyAttachment (response) {
    const attachment = new AttachmentBuilder(response.path);
    return {
        content: response.content,
        files: [
            attachment
        ]
    };
}
function replyTable (response) {
    try {
        return response.message + response.table;
    } catch (err) {
        const errorMessage = String(err);
        if (errorMessage.startsWith("DiscordAPIError[50035]: Invalid Form Body\ncontent[BASE_TYPE_MAX_LENGTH]: Must be 4000 or fewer in length.")) {
            const bufferResponse = Buffer.from(response.table);
            return replyBuffer({
                path: bufferResponse,
                filetype: 'txt',
                content: response.message
            });
        } else {
            console.error(err);
        }
    }
}
function replyEmbed (response) {
    if (response.message != undefined) {
        return {
            content: response.messsage,
            embeds: [
                response.embed
            ]
        }
    } else {
        return {
            embeds: [
                response.embed
            ]
        }
    }
}
function replyComponents (response) {
    let buttons = [];
    for (let button of response.buttons) {
        buttons.push(new ButtonBuilder()
            .setCustomId(button.id)
            .setLabel(button.content)
            .setStyle(button.style)
        );
    }
    return { 
        content: response.messsage, 
        components: [
            new ActionRowBuilder().addComponents(buttons)
        ]
    }
}