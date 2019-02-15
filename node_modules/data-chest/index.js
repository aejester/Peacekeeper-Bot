const create = require("./src/create");
const store = require("./src/store");
const init = require("./src/init");
const get = require("./src/get");
const remove = require("./src/remove");
const search = require("./src/search");
const list = require("./src/list");
const clear = require("./src/clear");
const clearTag = require("./src/cleartag");

const lib = {
    create: create,
    store: store,
    init: init,
    get: get,
    remove: remove,
    search: search,
    list: list,
    clear: clear,
    clearTag: clearTag
};

module.exports = lib;