module.exports = (message, id, args) => {
    args.shift();
    let msg = args.join(" ");
    message.guild.members.get(id).send("**Moderator("+message.author.username+")**: "+msg);
}