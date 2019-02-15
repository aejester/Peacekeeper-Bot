module.exports = (message, args) => {
    let password = args[0];
    message.author.send("Set the dashboard password to ``"+password+"``");
    return {
        g_id: message.guild.id,
        pass: password

    };
}