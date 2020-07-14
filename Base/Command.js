exports = class Command {
    constructor(client, {
        name = null,
        description = false,
        dirname = false,
        usage = false,
        enabled = true,
        guildOnly = false,
        aliases = new Array(),
        permission = new Array(),
        botpermissions = new Array(),
        examples = false,
        owner = false
    }) {
        let category = 'Other';
        if(dirname){
            category = dirname.split(/\\/g)[dirname.split(/\\/g).length-1]
        }     // Linux dirname.split(/\//g)[dirname.split(/\//g).length-1]
        //Windows a!eval __dirname.split(/\\/g)[__dirname.split(/\\/g).length-1]
        this.client = client;
        this.conf = { enabled, guildOnly, aliases, permission, botpermissions, owner};
        this.help = { name, description, category, usage, examples };
        this.functions = require('../utils/functions')
    }
}
