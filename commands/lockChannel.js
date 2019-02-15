module.exports = (message, args) => {
    let channel_id = message.guild.channels.find(c => c.name == args[0]).id;
    message.guild.channels.get(channel_id).overwritePermissions(message.guild.defaultRole, {SEND_MESSAGES: false});
    message.reply("Locked ``"+channel_id+"``.");
}  