const Discord = require("discord.js");
const client = new Discord.Client();
const DB = require("data-chest");

let config = require("./config.json");

let member_add = require("./commands/events/guildMemberAdd");
let set_join = require("./commands/joinChannel");
let set_join_message = require("./commands/joinMessage");
let set_modlog = require("./commands/modlog");
let set_modmail = require("./commands/modmail");
let respond = require("./commands/respond");
let lock_channel = require("./commands/lockChannel");
let unlock_channel = require("./commands/unlockChannel");
let dash_pass = require("./commands/dashPass");

client.on("ready", () => {
    console.log("Ready!");
    client.user.setActivity("for @Peacekeeper help", {type:"WATCHING"});
})

client.on("guildMemberAdd", (member) => {
    let channel_id = DB.get(member.guild.id, "joinchannels");
    let join_message = DB.get(member.guild.id, "joinmessage", `Welcome **${member.user.username}#${member.user.discriminator}** to LegacyStudios! Please remember to read #rules!`)
    member_add(member, channel_id, join_message);
});

client.on("guildCreate", (guild) => {
    let key = "";
    let last = DB.get("latest_code", "ref_code");
    last = parseInt(last);
    last += 1;
    if (last.toString().length == 1) {
        last = "000"+last;
    } else if (last.toString().length == 2) {
        last = "00"+last;
    } else if (last.toString().length == 3) {
        last = "0"+last;
    }
    DB.store(last, guild.id, "ref_code");
    DB.store("latest_code", last, "ref_code");
    guild.owner.user.send("Hi there! Just to let you know, I come with a ModMail feature! You need an ref code for this feature to work! Pin this in an important channel!\nYour code: `"+last+"`\nIt goes at the end of the message in this format: `<Question or complaint> %your_ref_code`")
});

client.on("message", (message) => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") {
        let g_id = DB.get(message.content.split("%")[message.content.split("%").length-1], "ref_code");
        let c_id = DB.get(g_id, "modmail");
        if (c_id == "0") {
            message.reply("No ModMail set up for this server. Contact the server administrators if you believe this is an error.");
            return;
        } else {
            message.reply("The moderators have recieved your message. They will get back to you as soon as possible.");
            client.guilds.get(g_id).channels.get(c_id).send(`**User**: ${message.author.id}\n**Message**: ${message.content}`);
        }

    }
    if (!message.mentions.users.first()) return;
    if ((message.mentions.users.first().username != "Peacekeeper" && message.mentions.users.first().discriminator != "6507")) {
        return;
    }
    let msg = message.content.replace("<@513489106731532291> ", "");
    let array = msg.split(" ");
    console.log(array);
    let command = array[0];
    array.shift();
    let args = array;
    if (command == "") {
        return;
    }
    if (command == "help") {
        message.reply("**Help for Peacekeeper**:\n__Prefix__:\nPing peacekeeper with your command and arguments!\n\n__Moderation__:\npurge <number> - Deletes the specified amount of messages\nlock <channel> - locks the channel until unlocked\nunlock <channel> - unlocks the channel\nban <user> [reason] - bans a user for the specified reason\nkick <user> [reason] - kicks the user for the specified reason\nwarn <user> [reason] - warns the user for the specified reason\n\n__Settings__:\njoinchannel - set the channel for the join message\njoinmessage - set the join message for the server\nmodlog - set the channel for moderation reports\nmodmail - set the channel for moderator mail")
        return;
    }
    if (command == "kick") {
        if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) {
            message.reply("You do not have permission to use this command.");
            return;
        } else {
            if (!message.mentions.users.first()) return message.reply("Please mention a user to kick.");
            if (message.guild.member(message.mentions.users.first()).hasPermission("ADMINISTRATOR")) return message.reply("You cannot kick this user.")
            args.shift();
            let reason = args.join(" ");
            let kicks = DB.get("kicks", "kicks", []);
            kicks.push({
                user: message.mentions.users.first().username+"#"+message.mentions.users.first().discriminator,
                reason: reason,
                date: (new Date().getMonth()+1)+"/"+new Date().getDate()+"/"+new Date().getFullYear()
            })
            DB.store("kicks", kicks, "kicks");
            let modlogid = DB.get(message.guild.id, "modlog", false);
            if (modlogid == false) {
                message.guild.member(message.mentions.users.first()).kick();
                return message.reply("Done, but there is no modlog channel specified")
            } else {
                message.guild.member(message.mentions.users.first()).kick();
                message.reply("Done.")
                message.guild.channels.get(modlogid).send(`Kicked \`\`${message.guild.member(message.mentions.users.first()).user.username}#${message.guild.member(message.mentions.users.first()).user.discriminator}\`\` on \`\`${(new Date().getMonth()+1)+"/"+new Date().getDate()+"/"+new Date().getFullYear()}\`\` for reason \`\`${reason}\`\``)
            }
        }
    }
    if (command == "ban") {
        if (!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) {
            message.reply("You do not have permission to use this command.");
            return;
        } else {
            if (!message.mentions.users.first()) return message.reply("Please mention a user to ban.");
            if (message.guild.member(message.mentions.users.first()).hasPermission("ADMINISTRATOR")) return message.reply("You cannot ban this user.")
            args.shift();
            let reason = args.join(" ");
            let kicks = DB.get("bans", "bans", []);
            kicks.push({
                user: message.mentions.users.first().username+"#"+message.mentions.users.first().discriminator,
                reason: reason,
                date: (new Date().getMonth()+1)+"/"+new Date().getDate()+"/"+new Date().getFullYear()
            })
            DB.store("bans", kicks, "bans");
            let modlogid = DB.get(message.guild.id, "modlog", false);
            if (modlogid == false) {
                message.guild.member(message.mentions.users.first()).ban();
                return message.reply("Done, but there is no modlog channel specified");
            } else {
                message.guild.member(message.mentions.users.first()).ban();
                message.reply("Done.")
                message.guild.channels.get(modlogid).send(`Banned \`\`${message.guild.member(message.mentions.users.first()).user.username}#${message.guild.member(message.mentions.users.first()).user.discriminator}\`\` on \`\`${(new Date().getMonth()+1)+"/"+new Date().getDate()+"/"+new Date().getFullYear()}\`\` for reason \`\`${reason}\`\``)
            }
        }
    }
    if (command == "warn") {
        if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) {
            message.reply("You do not have permission to use this command.");
            return;
        } else {
            if (!message.mentions.users.first()) return message.reply("Please mention a user to warn.");
            if (message.guild.member(message.mentions.users.first()).hasPermission("ADMINISTRATOR")) return message.reply("You cannot warn this user.")
            args.shift();
            let reason = args.join(" ");
            let warns = DB.get("warns", "warns", []);
            warns.push({
                id: message.guild.id,
                user: message.mentions.users.first().username+"#"+message.mentions.users.first().discriminator,
                reason: reason,
                date: (new Date().getMonth()+1)+"/"+new Date().getDate()+"/"+new Date().getFullYear()
            })
            DB.store("warns", warns, "warns");
            let modlogid = DB.get(message.guild.id, "modlog", false);
            if (modlogid == false) {
                return message.reply("There is no modlog channel specified");
            } else {
                message.reply("Done.")
                message.guild.channels.get(modlogid).send(`Warned \`\`${message.guild.member(message.mentions.users.first()).user.username}#${message.guild.member(message.mentions.users.first()).user.discriminator}\`\` on \`\`${(new Date().getMonth()+1)+"/"+new Date().getDate()+"/"+new Date().getFullYear()}\`\` for reason \`\`${reason}\`\``)
            }
        }
    }
    
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) {
        message.reply("You do not have permission to use this command.");
        return;
    }
    if (command == "purge") {
        const x = async () => {
           let fetched = await message.channel.fetchMessages({limit: parseInt(args[0])});
           message.channel.bulkDelete(fetched).catch(error => message.reply("Error: "+error)).then(m => message.reply("Done."));
       }
       x();
   }
    if (command == "joinchannel") {
        let to_store = set_join(message, args);
        DB.store(to_store.id, to_store.c_id, "joinchannels");
    }
    if (command == "joinmessage") {
        let to_store = set_join_message(message, args);
        DB.store(to_store.id, to_store.msg, "joinmessage");
    }
    if (command == "modlog") {
        let to_store = set_modlog(message, args);
        DB.store(to_store.id, to_store.c_id, "modlog");
    }
    if (command == "modmail") {
        let to_store = set_modmail(message, args);
        DB.store(to_store.id, to_store.c_id, "modmail");
    }
    if (command == "respond") {
        respond(message, args[0], args);
    }
    if (command == "lock") {
        lock_channel(message, args);
    }
    if (command == "unlock") {
        unlock_channel(message, args);
    }
    if (command == "password") {
        let to_store = dash_pass(message, args);
        message.delete();
        DB.store(to_store.g_id, to_store.pass, "dash_pass");
    }
});

client.login(config.token);

//TODO: BEGIN DASHBOARD
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(require("body-parser")());

app.get("/", (req, res) => {
    res.render(__dirname+"/views/index");
});

app.get("/public/peacekeeper.svg", (req, res) => {
    res.sendFile(__dirname+"/public/peacekeeper.svg");
})

app.get("/login", (req, res) => {
    res.render(__dirname+"/views/login", {notfound: false, incorrect: false});
});

app.post("/dashboard", (req, res) => {
    let pass1 = DB.get(req.body.id, "dash_pass", "");
    if (pass1 == "") {
        res.render(__dirname+"/views/login", {notfound: true, incorrect: false});
    } else {
        if (pass1 == req.body.password) {
            let term = "";
            let channels = []
            let users = [];
            let roles = [];
            let sortable = client.guilds.get(req.body.id).members;
            sortable.map(userx => {
                if (userx.user.username.includes(term)) {
                    users.push({
                        name: userx.user.username,
                        nickname: client.guilds.get(req.body.id).member(userx).nickname,
                        discriminator: userx.user.discriminator
                    })
                }
            })
            let siftable = client.guilds.get(req.body.id).channels;
            siftable.map(channel => {
                if (channel.name.includes(term)) {
                    channels.push({
                        name: channel.name,
                        type: channel.type,
                        id: channel.id
                    })
                }
            });
            let shakable = client.guilds.get(req.body.id).roles;
            shakable.forEach((role) => {
                if (role.name.includes(term)) {
                    roles.push({
                        name: role.name,
                        color: role.hexColor
                    })
                }
            });
            let joinchannel = DB.get(req.body.id, "joinchannels", undefined);
            let joinmessage = DB.get(req.body.id, "joinmessage", undefined);
            let modlog = DB.get(req.body.id, "modlog", undefined);
            let modmail = DB.get(req.body.id, "modmail", undefined);
            let dash_pass = DB.get(req.body.id, "dash_pass", undefined);
            res.render(__dirname+"/views/dashboard", { dash_pass: dash_pass, joinchannel: joinchannel, joinmessage: joinmessage, modlog: modlog, modmail: modmail, users: users, channels: channels, roles: roles, id: req.body.id })
        } else {
            res.render(__dirname+"/views/login", {notfound: false, incorrect: true});
        }
    }
});

io.on("connection", (socket) => {
    socket.on("set", (setting, value, id) => {
        DB.store(id, value, setting);
    }); 
});

app.get("/dashboard", (req, res) => {
    res.redirect("/login");
})

app.post("/:id/search", (req, res) => {
    let term = req.body.term;
    let channels = []
    let users = [];
    let roles = [];
    let sortable = client.guilds.get(req.params.id).members;
    sortable.map(userx => {
        if (userx.user.username.includes(term)) {
            users.push({
                name: userx.user.username,
                nickname: client.guilds.get(req.params.id).member(userx).nickname,
                discriminator: userx.user.discriminator
            })
        }
    })
    let siftable = client.guilds.get(req.params.id).channels;
    siftable.forEach((channel) => {
        if (channel.name.includes(req.body.term)) {
            channels.push({
                name: channel.name,
                type: channel.type,
                id: channel.id
            })
        }
    });
    let shakable = client.guilds.get(req.params.id).roles;
    shakable.forEach((role) => {
        if (role.name.includes(term)) {
            roles.push({
                name: role.name,
                color: role.hexColor
            })
            console.log(role.hexColor)
        }
    });
    res.render(__dirname+"/views/results", {users: users, channels: channels, roles: roles, id: req.params.id});
});

app.get("/invite", (req, res) => {
    res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=513489106731532291&permissions=8&scope=bot")
})

http.listen(8000, () => {
    console.log("Listening on *:8000");
});

