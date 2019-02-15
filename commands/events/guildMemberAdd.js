module.exports = (member, joinchannel, joinmessage) => {
    member.guild.channels.get(joinchannel).send(joinmessage.replace("%user", member.user.toString()));
}