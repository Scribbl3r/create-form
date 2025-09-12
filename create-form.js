#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
const program = new Command();

/* === VAR === */
let ROOT_DIR = '';
let JSON_LOC = '';

/* === ============== === */
/* === OPTIONS LAUNCH === */
/* === ============== === */

program
    .option('--json <path>', 'path to jsonfile s directory')
    .option('--y', 'Your are in the root directory') //done
    .option('--file <name>', 'name of the json file used for the script');
program.parse(process.argv);
const options = program.opts();

/* === ============= === */
/* === ALL FUNCTIONS === */
/* === ============= === */

/* === MAIN FUNCTION === */
async function main() {
    // proposer formik & yup =>  Après, une autre option, d'abord, faire marcher juste en html
    console.log('creation of a form from a JSON file');

    //define root
    await ensureRootDirectory();

    //locate JSON file
    JSON_LOC = await searchJsonFile();

    //JSON file valid
    const JSON_DATA = isFileValid();

    //process data
    let contentHTML = dataProcessing(JSON_DATA);

    const title = JSON_DATA.title;
    //create js file
    createFile(contentHTML, title);

    //  créer input dans fichier JS/TS en fonction choix formik

    console.log(`Done ! Your file is there : ${ROOT_DIR}/${title}.html`);
    //fin script
}

/* === COG FUNCTIONS === */

/*root dir*/
async function ensureRootDirectory() {
    if (options.y) {
        ROOT_DIR = process.cwd();
    } else {
        const alreadyInRootFolder = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'inRoot',
                message: "you already are in your 'rootfolder', I can create everything here",
                default: false
            }
        ]);

        if (alreadyInRootFolder.inRoot) {
            ROOT_DIR = process.cwd();
        } else {
            const creationRootFolder = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'rootFolderName',
                    message: "what's the name of your folder ?"
                }
            ]);
            ROOT_DIR = path.resolve(creationRootFolder.rootFolderName);
            fs.mkdirSync(`${creationRootFolder.rootFolderName}`, { recursive: true });
        }
    }
}

/* Search for json file */
async function searchJsonFile() {
    let json_loc = '';
    let json_file = '';
    if (options.json && options.file) {
        json_loc = path.join(options.json, `${options.file}.json`);
        if (!checkFilExists(json_loc)) {
            return await searchJsonFile();
        }
        return json_loc;
    } else if (options.json && !options.file) {
        const nameJsonFile = await inquirer.prompt([
            { type: 'input', name: 'nameJson', message: "what's its name ? (no extension)" }
        ]);
        json_file = `${nameJsonFile.nameJson}.json`;
        json_loc = path.join(options.json, `${json_file}.json`);
        if (!checkFilExists(json_loc)) {
            return await searchJsonFile();
        }
        return json_loc;
    } else if (!options.json && options.file) {
        const locationJsonHere = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isHere',
                message: 'is the json file, used as a base, is in this folder ?',
                default: false
            }
        ]);
        if (locationJsonHere.isHere) {
            json_loc = path.join(process.cwd(), `${options.file}.json`);
        } else {
            const locationJsonThere = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newlocationjson',
                    message: 'give me its path'
                }
            ]);
            json_loc = path.join(locationJsonThere.newlocationjson, `${options.file}.json`);
            if (!checkFilExists(json_loc)) {
                return await searchJsonFile();
            }
        }

        if (!checkFilExists(json_loc)) {
            return await searchJsonFile();
        }
        return json_loc;
    } else {
        const locationJsonHere = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isHere',
                message: 'is the json file, used as a base, is in this folder ?',
                default: false
            }
        ]);

        if (locationJsonHere.isHere) {
            const nameJsonFile = await inquirer.prompt([
                { type: 'input', name: 'nameJson', message: "what's its name ? (no extension)" }
            ]);
            json_file = `${nameJsonFile.nameJson}.json`;
            json_loc = path.join(ROOT_DIR, json_file);

            if (checkFilExists(json_loc)) await searchJsonFile();

            return json_loc;
        } else {
            const locationJsonThere = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newlocationjson',
                    message: 'give me its path'
                },
                { type: 'input', name: 'nameJson', message: "what's its name ? (no extension)" }
            ]);
            json_file = `${locationJsonThere.nameJson}.json`;
            json_loc = path.join(locationJsonThere.newlocationjson, json_file);

            if (!checkFilExists(json_loc)) {
                return await searchJsonFile();
            }
            return json_loc;
        }
    }
}

function checkFilExists(location) {
    if (fs.existsSync(location)) {
        return true; // fichier trouvé
    } else {
        console.log("didn't find the file there:", location);
        return false; // fichier non trouvé
    }
}

/* validation json file */
function isFileValid() {
    try {
        const data = fs.readFileSync(JSON_LOC, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        process.exit(1);
    }
}

/* data processing */
function dataProcessing(jsonData) {
    let content = '<Form>\n';
    jsonData.fields.forEach((field) => {
        content += generatedHtml(field);
    });
    content += '</Form>';
    return content;
}

/* html generation */
function generatedHtml(object) {
    let html = '';

    if (object.label) {
        html += `<label for="${object.name}">${object.label}</label>`;
    }

    html += `<input name="${object.name}" type="${object.type || 'text'}"`;

    //options
    if (object.placeholder) html += `placeholder="${object.placeholder}"`;
    if (object.minLength) html += `minlength="${object.minLength}"`;
    if (object.maxLength) html += `maxlength="${object.maxLength}"`;
    if (object.size) html += `size="${object.size}"`;
    if (object.min) html += `min="${object.min}"`;
    if (object.max) html += `max="${object.max}"`;
    if (object.step) html += `step="${object.step}"`;

    const attributes = ['required', 'autofocus', 'disabled', 'readonly'];
    attributes.forEach((attr) => {
        if (object[attr] !== undefined) {
            html += ` ${attr}`;
        }
    });
    // end
    html += '/> \n';
    return html;
}

/* file creation */
function createFile(content, title) {
    try {
        fs.writeFileSync(`${ROOT_DIR}/${title}.html`, content, 'utf8');
    } catch (error) {
        console.log('error while trying to create the html file : ', error);
    }
}

/* === ================== === */
/* === CALL MAIN FUNCTION === */
/* === ================== === */

main();
