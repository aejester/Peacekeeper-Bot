module.exports = (message, args) => {
    let channel_id = message.guild.channels.find(c => c.name == args[0]).id;
    let guild_id = message.guild.id;
    message.reply(`Set the modlog channel to \`${channel_id}\`!`);
    return {
        id: guild_id,
        c_id: channel_id
    }
}