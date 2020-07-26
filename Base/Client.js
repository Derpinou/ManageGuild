const { Client, Collection} = require('discord.js');
const path = require("path")
module.exports = class ManageGuild extends Client {
    constructor(options) {
        super(options);
        this.prefix = require("../config").prefix
        this.config = require("../config.js"); // Load the config file
        this.commands = new Collection(); // Creates new commands collection
        this.aliases = new Collection(); // Creates new command aliases collection
        this.logger = require("../utils/Logger"); // Load the logger file
        this.wait = require("util").promisify(setTimeout); // client.wait(1000) - Wait 1 second
        this.functions = require('../utils/functions.js'); // Load the functions file
        this.errors = require('../utils/errors');
        this.guildsData = require("./Guild.js");
        this.usersData = require("./User.js");
    }
    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }
}

