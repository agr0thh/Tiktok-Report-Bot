import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";
import chalk from 'chalk';
import fs from 'fs';
import gradient from 'gradient-string';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayAsciiArt() {
    console.clear();
    const asciiArt = gradient.vice(`
              ▄▄▄▄▄▪  ▄ •▄ ▄▄▄▄▄      ▄ •▄     ▄▄▄▄· ▄• ▄▌▄▄▌  ▄ •▄     ▄▄▄  ▄▄▄ . ▄▄▄·      ▄▄▄  ▄▄▄▄▄
              •██  ██ █▌▄▌▪•██  ▪     █▌▄▌▪    ▐█ ▀█▪█▪██▌██•  █▌▄▌▪    ▀▄ █·▀▄.▀·▐█ ▄█▪     ▀▄ █·•██  
              ▐█.▪▐█·▐▀▀▄· ▐█.▪ ▄█▀▄ ▐▀▀▄·    ▐█▀▀█▄█▌▐█▌██▪  ▐▀▀▄·    ▐▀▀▄ ▐▀▀▪▄ ██▀· ▄█▀▄ ▐▀▀▄  ▐█.▪
              ▐█▌·▐█▌▐█.█▌ ▐█▌·▐█▌.▐▌▐█.█▌    ██▄▪▐█▐█▄█▌▐█▌▐▌▐█.█▌    ▐█•█▌▐█▄▄▌▐█▪·•▐█▌.▐▌▐█•█▌ ▐█▌·
              ▀▀▀ ▀▀▀·▀  ▀ ▀▀▀  ▀█▄▀▪·▀  ▀    ·▀▀▀▀  ▀▀▀ .▀▀▀ ·▀  ▀    .▀  ▀ ▀▀▀ .▀    ▀█▄▀▪.▀  ▀ ▀▀▀                                                        
    `);
    console.log(asciiArt);
    console.log(chalk.grey('----------------------------------------------------------------------------------------------------------------------'));
    console.log(chalk.white('    https://github.com/agr0thh'), chalk.grey(" | "), chalk.white('https://github.com/agr0thh'), chalk.grey(" | "), chalk.white('https://github.com/agr0thh'));
    console.log(chalk.grey('----------------------------------------------------------------------------------------------------------------------\n'));
}

async function reportTikTok(url, proxies) {
    let reportCount = 0, reportsPerSecond = 0;

    setInterval(() => {
        proxies.forEach(async proxy => {
            try {
                const proxyAgent = new HttpsProxyAgent(`http://${proxy}`);
                const response = await fetch(url, { agent: proxyAgent });
                const json = await response.json();

                console.log(chalk.gray(`           ${new Date().toLocaleTimeString()}  `) + gradient.vice(` Sent report with ID: ${json.extra.logid} | Report count: ${reportCount + 1}`));
                reportCount++;
                reportsPerSecond++;
            } catch (error) {
                console.log(chalk.red(`Error reporting with proxy ${proxy}: ${error.message}`));
            }
        });
    }, 300);

    setInterval(() => {
        process.stdout.write(
            String.fromCharCode(27) + "]0;" + `TikTok Mass Report Bot | Reports: ${reportCount} | Speed: ${reportsPerSecond * 6}/m` + String.fromCharCode(7)
        );
        reportsPerSecond = 0;
    }, 10000);
}

displayAsciiArt();

rl.question(`${chalk.gray(`${new Date().toLocaleTimeString()} `) + chalk.grey(`[`) + chalk.cyan.bold(`?`) + chalk.grey(`]`)} Enter the request URL from Inspect Element: `, async function (url) {
    displayAsciiArt();

    const proxies = fs.readFileSync('proxies.txt', 'utf8').split(/\r?\n/).filter(Boolean);
    reportTikTok(url, proxies);
});