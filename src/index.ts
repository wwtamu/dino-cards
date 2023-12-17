#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const clear = require('clear');
const fs = require('fs');
const figlet = require('figlet');
const program = require('commander');

import { exit } from 'process';
import { parse } from 'node-html-parser';

import { config } from './config';

const CONF_DIR = 'configs';

if (!fs.existsSync(CONF_DIR)) {
  fs.mkdirSync(CONF_DIR)
}

program
  .version('0.0.1')
  .usage('[options]')
  .option('-c, --config', 'show current configuration', () => {
    console.log(JSON.stringify(config.store, null, 2));
    exit();
  })
  .description('A CLI for scrapping dino cards');

program
  .command('config <action> [property/name] [value]')
  .description('get/set/delete/reset/save/load config value or reset all config to defaults')
  .action((action: 'get' | 'set' | 'delete' | 'reset' | 'save' | 'load', property?: string, value?: string) => {
    switch (action) {
      case 'get':
        if (property) {
          console.log(config.get(property));
        } else {
          console.log('get requires a property');
        }
        break;
      case 'set':
        if (property) {
          if (value) {
            try {
              config.set(property, value);
            } catch (error) {
              config.set(property, Number(value));
            }
            console.log(`set ${property} to ${value}`);
          } else {
            console.log('set requires a value');
          }
        } else {
          console.log('set requires a property');
        }
        break;
      case 'reset':
        if (property) {
          config.reset(property);
          console.log(`reset ${property} to ${config.get(property)}`);
        } else {
          config.clear();
          console.log('reset config to default');
          console.log(JSON.stringify(config.store, null, 2));
        }
        break;
      case 'delete':
        if (property) {
          config.delete(property);
          console.log(`deleted ${property}`);
        } else {
          console.log('delete reset a property');
        }
        break;
      case 'save':
        if (property) {
          const path = `${CONF_DIR}/${property}.conf`;
          fs.writeFileSync(path, JSON.stringify(config.store, null, 2));
          console.log(`stored the following config to ${path}`);
          console.log(JSON.stringify(config.store, null, 2));
        } else {
          console.log('config save requires name for the stored config');
        }
        break;
      case 'load':
        if (property) {
          const path = `${CONF_DIR}/${property}.conf`;
          const conf = JSON.parse(fs.readFileSync(path, 'utf8'));
          config.set(conf);
          console.log(`loaded config from ${path}`);
          console.log(JSON.stringify(config.store, null, 2));
        } else {
          console.log('config load requires name for the stored config');
        }
        break;
      default:
        console.log(`${action} not a valid action. <get/set/delete/reset>`);
    }
  });


program
  .command('get [set] [url]')
  .description('harvest images from html')
  .action((set: string, url: string) => {
    console.log(url);
    axios.get(url).then((htmlRes: any) => {
      if (htmlRes.status === 200) {
        const root = parse(htmlRes.data);
        root.querySelectorAll('img')
          .map(image => image.getAttribute('src')?.trim())
          .filter(imagePath => imagePath && imagePath.indexOf('..') < 0)
          .forEach(imagePath => {
            const imageUrl = `${config.get('baseUrl')}${imagePath}`;
            const cardsPath = config.get('cards');
            if (!fs.existsSync(cardsPath)) {
              fs.mkdirSync(cardsPath)
            }
            const cardSetPath = `${cardsPath}/${set}`;
            if (!fs.existsSync(cardSetPath)) {
              fs.mkdirSync(cardSetPath)
            }
            const cardPath = `${cardSetPath}/${imageUrl.substring(imageUrl.lastIndexOf('/') + 1)}`
            axios({
              url: imageUrl,
              method: "GET",
              responseType: "stream"
            }).then((imgRes: any) => {
              if (imgRes.status === 200) {
                imgRes.data.pipe(fs.createWriteStream(cardPath));
              }
            }).catch((error: any) => {
              // console.error(error);
            });;
          });
      }
    }).catch((error: any) => {
      // console.error(error);
    });
  });

if (process.argv.length === 2) {
  clear();
  console.log(chalk.red(figlet.textSync('dinocards-cli', { horizontalLayout: 'full' })));
}

program
  .parse(process.argv);
