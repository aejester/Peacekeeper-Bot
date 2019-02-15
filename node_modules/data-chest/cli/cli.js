#!/usr/bin/env node
const program = require("commander");

const create = require("../src/create");
const store = require("../src/store");
const init = require("../src/init");
const get = require("../src/get");
const remove = require("../src/remove");
const search = require("../src/search");
const list = require("../src/list");
const clear = require("../src/clear");
const clearTag = require("../src/cleartag");

program
.version(require("../package.json").version)
.description("A CLI that allows you manipulate data-chest databases and data.")

program
.command("create <name>")
.description("Create a database with the given name.")
.alias("cr")
.action((name) => {
    create(name);
});

program
.command("store <key> <value> <database>")
.description("Store a value in the specific database.")
.alias("st")
.action((key, value, database) => {
    store(key, value, database);
});

program
.command("init")
.description("Initializes the project with a database folder.")
.alias("i")
.action(() => {
    init();
});

program
.command("get <key> <database>")
.option("-n, --nonexistant [value]", "Value to return if there is no tag matching the given key. Defaults to \"0\".")
.description("Gets the value from a key in the given database.")
.action((key, database, cmd) => {
    if (cmd.nonexistant) {
        console.log(get(key, database, cmd.nonexistant));
    } else {
        console.log(get(key, database));
    }
});

program
.command("remove <database>")
.description("Removes a database from the tatabase folder.")
.alias("rm")
.action((database) => {
    remove(database);
});

program
.command("search <key> [database]")
.description("Searches the given databse(s) for the key. The <database> param defaults to \"*\" if nothing is put.")
.alias("s")
.action((key, database) => {
    let x;
    if (!database) {
        x = search(key, "*");
    } else {
        x = search(key, database);
    }
    console.log(x);
});

program
.command("list")
.description("Lists all the databases in the /database/ folder")
.alias("ls")
.action(() => {
    let x = list();
    console.log(x);
});

program
.command("clear <database>")
.description("Resets the database with default values")
.alias("cl")
.action((database) => {
    clear(database);
})

program
.command("clear-tag <key> <database>")
.description("Removes the key and value from the given database.")
.alias("ct")
.action((key, database) => {
    clearTag(key, database);
})

program.parse(process.argv);