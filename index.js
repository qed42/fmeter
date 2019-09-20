#!/usr/bin/env node

var program = require('commander');
var inquirer = require('inquirer');
var fs = require('fs-extra');
const dest_curr_dir=process.cwd();
var src_bin_dir='/usr/local/lib/node_modules/bin';

const questions=[
    { type: 'other', name: 'username', message: 'Specify your name :' },
    { type: 'other', name: 'useremail', message: 'Specify your email' },
];

function getFmeterFiles(){
    if (!fs.existsSync('./bin')){
        fs.mkdirSync('./bin');
        fs.copy(src_bin_dir,`${dest_curr_dir}/bin`,function(err){
            if(!err){
                console.log("copied successfully...");
            }
        })
    } 
}

async function getUserInfo(){
   return await inquirer
                .prompt(questions)
                .then(function(ans){
                    return ans;
                });
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
           getUserInfo().then(res=>{
               console.log("result is :",res);
               getFmeterFiles();
           })
        })
    })
    
program.parse(process.argv);