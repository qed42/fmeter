#!/usr/bin/env node

var exec = require('child_process').exec;
var clc = require("cli-color");
const Table = require('cli-table');
const program = require('commander');
const fs = require('fs');
var table = new Table({
  head: [clc.blue('Categories'), clc.blue('Calculated Audits'), clc.blue('Expected Audits')],
  colWidths: [20, 20, 20]
});

runShell = async (cmd) => {
  return await new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
      if (err)
        reject(err);
      else
        resolve({ stdout, stderr });
    });
  });
};

checkThreshold = () => {
  try {
    const reportJson = fs.readFileSync('./report.json');
    const report = JSON.parse(reportJson);

    const thresholdJson = fs.readFileSync('./threshold.json')
    const threshold = JSON.parse(thresholdJson);

    var pref = report.categories.performance.score * 100;
    var acc = report.categories.accessibility.score * 100;
    var bpract = report.categories['best-practices'].score * 100;
    var seo = report.categories.seo.score * 100;

    console.log(' Web Performance : ', report.categories.performance.score * 100);
    if ((report.categories.performance.score * 100) >= threshold.performance) {
      console.log("Congrats!! Your web Performace is good.: ");
    } else {
      console.log("Your web performance is low. Please increase it.");
    }

    console.log(' Web Accessibility:', report.categories.accessibility.score * 100);
    if ((report.categories.accessibility.score * 100) >= threshold.accessibility) {
      console.log("Congrats!! Your web accessibility is good.");
    } else {
      console.log("our web accessibility is low. Please improve it.");
    }

    console.log('web best - practices :', report.categories['best-practices'].score * 100);
    if ((report["categories"]['best-practices'] * 100) >= threshold["best-practices"]) {
      console.log("Congrats!! Your web best - practices is good.");
    } else {
      console.log("Your web best - practices is low. Please increase it.");
    }

    table.push(
      [clc.yellowBright('Performance'), pref >= threshold.performance ? clc.green(pref) : clc.red(pref), threshold.performance],
      [clc.yellowBright('Accessibility'), acc >= threshold.accessibility ? clc.green(acc) : clc.red(acc), threshold.accessibility],
      [clc.yellowBright('Best-Practices'), bpract >= threshold["best-practices"] ? clc.green(bpract) : clc.red(bpract), threshold["best-practices"]],
      [clc.yellowBright('SEO'), seo >= threshold.seo ? clc.green(seo) : clc.red(seo), threshold.seo]
    )
    console.log(table.toString());
  } catch (err) {
    console.log("Config fire error :", err);
  }
}

program
  .command('check <url>')
  .description('check url performance')
  .action(() => {
    console.log("Checking Performance");
    console.log("----------------------------");
    var urlInput = 'lighthouse ' + program.args[0] + ' --output-path=./report.json --output json';

    if (urlInput) {
      runShell(urlInput)
        .then(res => {
          checkThreshold();
        }).catch(err => {
          console.log(err);
        })
    }
  });

program.parse(process.argv);