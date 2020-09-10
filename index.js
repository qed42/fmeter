#!/usr/bin/env node

var program = require('commander');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var merge = require('merge'),original,cloned;
const dest_curr_dir=process.cwd();
var src_dir='/usr/local/lib/node_modules/bin';
let template = {
    name: "fmeter-cli",
    version: "1.0.0",
    description: "Get project Info though CLI ",
    bin: {
        fmeter: "index.js"
    },
    scripts: {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
}

const questions=[
    { type: 'other', name: 'username', message: 'Specify your name :' },
    { type: 'other', name: 'useremail', message: 'Specify your email' },
];

function getFmeterFiles(){
    if (!fs.existsSync('./bin')){
        fs.mkdirSync('./bin');
        fs.copySync(src_dir,`${dest_curr_dir}/bin`);
        console.log("copied successfully...");
        return true; 
    } 
}

async function getUserInfo(){
   return await inquirer
                .prompt(questions)
                .then(function(ans){
                    return ans;
                });
}

function mergeDependancies(){
    if(fs.exists(`${__dirname}/bin`)){
        let originalFile=JSON.parse(fs.readFileSync('./package.json'));
        let bin_jsonFile=JSON.parse(fs.readFileSync('./bin/package.json'));
        original=originalFile["dependencies"];
        bin_json=bin_jsonFile["dependencies"];
        // console.log("original :",original["dependencies"]);
        // console.log("bin :",bin_json["dependencies"]);
        dependencies=merge(original,bin_json);
        console.log("dependencies",dependencies);
        template={...template,dependencies:dependencies}
        console.log(template);
        let data=JSON.stringify(template);
        fs.unlinkSync('./package.json');
        fs.createFileSync("./package.json");
        fs.writeFileSync('hi.json',data);
        console.log("files created successfully.");
    }else{
        console.log("first get the fmeter files.");
    }
}

program
    .command('init')
    .description('configuring fmeter on local')
    .action(()=>{
        console.log("-------configuring fmeter----------");
        fs.access(`${__dirname}/bin`,function(err){
            if(!err){
                console.log("File exits");
                return; 
            }
           getUserInfo().then(async res=>{
               console.log("result is :",res);
               getFmeterFiles();
               mergeDependancies();
           })
        })
    })
    
program.parse(process.argv);