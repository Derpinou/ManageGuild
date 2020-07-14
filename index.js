const { ManageGuild } = require('./Base/Client');

const client = new ManageGuild();

const mongoose = require('mongoose');

let config = require("./config");

const {promisify} = require("util"),
    fs = require('fs'),
    readdir = promisify(require("fs").readdir)

require('events').EventEmitter.prototype._maxListeners = 100;

const init = async () => {

    // Search for all commands
    fs.readdir("./commands/", (err, content) => {
        if (err) console.log(err);
        if (content.length < 1) return console.log('Please create folder in "commands" folder.');
        var groups = [];
        content.forEach(element => {
            if (!element.includes('.')) groups.push(element); // If it's a folder
        });
        groups.forEach(folder => {
            fs.readdir("./commands/" + folder, (e, files) => {
                let js_files = files.filter(f => f.split(".").pop() === "js");
                if (js_files.length < 1) return console.log('Please create files in "' + folder + '" folder.');
                if (e) console.log(e);
                js_files.forEach(element => {
                    const response = client.loadCommand('./commands/' + folder, `${element}`);
                    if (response) client.logger.error(response);
                });
            });
        });
    });

    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        // This line is awesome by the way. Just sayin'.
        client.on(eventName, (...args) => event.run(...args).catch(err => console.log(err)));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
    client.login(config.token); // Log to the discord api
    // connect to mongoose database
    mongoose.connect(client.config.mongoDB,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
        client.logger.log("Connected to the Mongodb database.", "log");
    }).catch((err) => {
        client.logger.log("Unable to connect to the Mongodb database. Error:" + err, "error");
    });
};
init();

// if there are errors, log them
client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", e => client.logger.error(e))
    .on("warn", info => client.logger.warn(info));

// if there is an unhandledRejection, log them
process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
});
module.exports = client;