#!/usr/bin/env node

var lighthouse = require('bin/node_modules/lighthouse');
const chromeLauncher = require('bin/node_modules/chrome-launcher');
var config = require('../configs/custom.config');
const Table = require('bin/node_modules/cli-table');
var clc = require("cli-color");
let tables=[],chromeFlags=['--disable-gpu'];
let i=0;
let threshold=config.settings["threshold-scores"];
const program=require('bin/node_modules/commander');
// var exec=require('child-process').exec;

// let urls=['https://www.twitter.com','https://www.facebook.com','https://www.qed42.com/careers'];
if(config.chromeOptions.headless){
  chromeFlags.push('--headless');
}
if(!config.chromeOptions.sandboxing){
  chromeFlags.push('--no-sandbox');
}
console.log("chrome flag array :",chromeFlags);

var opts = {
  chromeFlags:chromeFlags,
  logLevel: config.chromeOptions.showLogStatus ? 'info':'silent',
  output:'json'
}

createTableStructure = () => {
    return new Table({
      head: [clc.cyanBright('Categories'), clc.cyanBright('Calculated Audits'), clc.cyanBright('Expected Audits')],
      colWidths: [30, 30, 30]
    });
  }

  createTableData = (newTable,res) => {
    try {
      if(res){
        Object.values(res).map(data => {
          newTable.push(
          [clc.yellowBright(data.id), data.score*100 >= threshold[data.id] ? clc.green(data.score*100) : clc.red(data.score*100), threshold[data.id]]
          )
        })
      }
      console.log(newTable.toString());
    } catch (err) {
      console.log("error in creating table values :", err);
    }
  }

async function launcher(url){
    return  chromeLauncher.launch(opts).then(chrome => {
        opts.port = chrome.port;
        console.log("started :",chrome.pid);
        return lighthouse(url,opts,config).then(result => {
            console.log(`${url} :`,Object.values(result.lhr.categories).map(score => score.score));
            return chrome.kill().then(() => result.lhr.categories);
        })    
     });  
}

async function auditUrls(urls){
    for(let url of urls){
        await launcher(url).then(results => {
          let table;
            table=createTableStructure();
            createTableData(table,results);
            tables.push({url:url,table:table});
        });
    }
    console.log("\n-------------all audits are-----------------\n");
    if(tables){
      tables.map(data => {
        console.log(`${data.url} :`);
        console.log(`${data.table.toString()}`);
      });
    }
}

// async function auditUrls(urls){
//    await urls.map(async (url,index) => {
//     await launcher(url).then(results => {
//         console.log(`${url} : ${results}`);
                    
//      });
//    })
// }

auditUrls(config.urls);




 