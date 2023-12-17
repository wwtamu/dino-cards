#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios');
var chalk = require('chalk');
var clear = require('clear');
var fs = require('fs');
var figlet = require('figlet');
var program = require('commander');
var process_1 = require("process");
var node_html_parser_1 = require("node-html-parser");
var config_1 = require("./config");
var CONF_DIR = 'configs';
if (!fs.existsSync(CONF_DIR)) {
    fs.mkdirSync(CONF_DIR);
}
program
    .version('0.0.1')
    .usage('[options]')
    .option('-c, --config', 'show current configuration', function () {
    console.log(JSON.stringify(config_1.config.store, null, 2));
    process_1.exit();
})
    .description('A CLI for scrapping dino cards');
program
    .command('config <action> [property/name] [value]')
    .description('get/set/delete/reset/save/load config value or reset all config to defaults')
    .action(function (action, property, value) {
    switch (action) {
        case 'get':
            if (property) {
                console.log(config_1.config.get(property));
            }
            else {
                console.log('get requires a property');
            }
            break;
        case 'set':
            if (property) {
                if (value) {
                    try {
                        config_1.config.set(property, value);
                    }
                    catch (error) {
                        config_1.config.set(property, Number(value));
                    }
                    console.log("set " + property + " to " + value);
                }
                else {
                    console.log('set requires a value');
                }
            }
            else {
                console.log('set requires a property');
            }
            break;
        case 'reset':
            if (property) {
                config_1.config.reset(property);
                console.log("reset " + property + " to " + config_1.config.get(property));
            }
            else {
                config_1.config.clear();
                console.log('reset config to default');
                console.log(JSON.stringify(config_1.config.store, null, 2));
            }
            break;
        case 'delete':
            if (property) {
                config_1.config.delete(property);
                console.log("deleted " + property);
            }
            else {
                console.log('delete reset a property');
            }
            break;
        case 'save':
            if (property) {
                var path = CONF_DIR + "/" + property + ".conf";
                fs.writeFileSync(path, JSON.stringify(config_1.config.store, null, 2));
                console.log("stored the following config to " + path);
                console.log(JSON.stringify(config_1.config.store, null, 2));
            }
            else {
                console.log('config save requires name for the stored config');
            }
            break;
        case 'load':
            if (property) {
                var path = CONF_DIR + "/" + property + ".conf";
                var conf = JSON.parse(fs.readFileSync(path, 'utf8'));
                config_1.config.set(conf);
                console.log("loaded config from " + path);
                console.log(JSON.stringify(config_1.config.store, null, 2));
            }
            else {
                console.log('config load requires name for the stored config');
            }
            break;
        default:
            console.log(action + " not a valid action. <get/set/delete/reset>");
    }
});
program
    .command('get [set] [url]')
    .description('harvest images from html')
    .action(function (set, url) {
    console.log(url);
    axios.get(url).then(function (htmlRes) {
        if (htmlRes.status === 200) {
            var root = node_html_parser_1.parse(htmlRes.data);
            root.querySelectorAll('img')
                .map(function (image) { var _a; return (_a = image.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.trim(); })
                .filter(function (imagePath) { return imagePath && imagePath.indexOf('..') < 0; })
                .forEach(function (imagePath) {
                var imageUrl = "" + config_1.config.get('baseUrl') + imagePath;
                var cardsPath = config_1.config.get('cards');
                if (!fs.existsSync(cardsPath)) {
                    fs.mkdirSync(cardsPath);
                }
                var cardSetPath = cardsPath + "/" + set;
                if (!fs.existsSync(cardSetPath)) {
                    fs.mkdirSync(cardSetPath);
                }
                var cardPath = cardSetPath + "/" + imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                axios({
                    url: imageUrl,
                    method: "GET",
                    responseType: "stream"
                }).then(function (imgRes) {
                    if (imgRes.status === 200) {
                        imgRes.data.pipe(fs.createWriteStream(cardPath));
                    }
                }).catch(function (error) {
                    // console.error(error);
                });
                ;
            });
        }
    }).catch(function (error) {
        // console.error(error);
    });
});
if (process.argv.length === 2) {
    clear();
    console.log(chalk.red(figlet.textSync('dinocards-cli', { horizontalLayout: 'full' })));
}
program
    .parse(process.argv);
