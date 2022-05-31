require('dotenv').config()
const { Client, Intents } = require('discord.js');

const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ]}
);

client.login(process.env.DISCORD_TOKEN)

let botId = "979064801005301761"
let numberEmotes = {0: "0️⃣", 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣", 6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣", 10: "🔟"}
let reactionEmote = '👀'
let reactionRequirement = 5
let timeLimit = 1200000
let role = "@pacepal"

const  filter = (reaction, user) => {
    return reaction.emoji.name === reactionEmote && user.id != botId;
};
const numberFilter = (reaction, user) => {
    return Object.values(numberEmotes).find(emote => emote === reaction.emoji.name) != undefined && user.id === botId;
};

const numberTrollFilter = (reaction, user) => {
    return Object.values(numberEmotes).find(emote => emote === reaction.emoji.name) != undefined && user.id != botId;
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.on('messageCreate', async message => {
    if(message.content.includes("https://www.twitch.tv/") && !message.author.bot && message.channelId == '979065282683363371') {
        message.react(reactionEmote) 

        const collector = message.createReactionCollector( {filter: filter, time: timeLimit});
        const numberCollector = message.createReactionCollector( {filter: numberFilter, time: timeLimit});
        const numberTrollCollector = message.createReactionCollector( {filter: numberTrollFilter, time: timeLimit});
        
        let i = reactionRequirement;
        let users =  [];
        let previousReaction;
        collector.on('collect', (reaction, user) =>  {
            //check if user has already reacted
            if (users.length === 0 || users.find(o => o.id === user.id) === undefined) {
                //give extra value for users with the pacepal role
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.some(r => r.name === 'pacepal')) {
                    //i--
                }
                users.push(user)
                i--
                if (i >= 0) {
                    message.react(numberEmotes[i])
                    if (i != reactionRequirement -1) {
                        message.reactions.cache.find(reaction => reaction.emoji.name === previousReaction.emoji.name).users.remove(botId);
                    }
                }
                if (i === 0){
                    message.channel.send(`${role} Dear pacepals our time has come!`)
                }
            }
        })

        numberCollector.on('collect', (reaction, user) =>  {
            previousReaction = reaction 
        })

        numberTrollCollector.on('collect', (reaction, user) =>  {
            message.reactions.cache.find(r => r.emoji.name === reaction.emoji.name).users.remove(user.id);
        })
    };
});