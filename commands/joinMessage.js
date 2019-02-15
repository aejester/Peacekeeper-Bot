module.exports = (message, args) => {
    let joinmessage = args.join(" ");
    message.reply(`Set the joinmessage to \`${joinmessage}\`!`);
    return {
        msg: joinmessage,
        id: message.guild.id
    };
}