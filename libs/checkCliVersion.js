

const getPackageInfo = require('./getPackageInfo');
const ora = require('ora');
const chalk = require('chalk');
const shell = require('./shell');
const package = require('./../package.json');
const inquirer = require('inquirer');
const timeoutPromise = require('./timeoutPromise');

module.exports = async () => {
    const spinner = ora('🎵正在进行版本检索，请等待...');
    spinner.start();
    let info;
    try {
        info = await Promise.race([getPackageInfo("@melody-core/melody-cli"), timeoutPromise(5000)]);
        if(!info){
            spinner.stop();
            console.log(chalk.yellow('🎵检索超时！'))
            console.log(chalk.yellow('🎵来自音巢的提醒: 您的网络环境不太友好，可能会导致melody相关命令执行失败。'))
            return;
        }
    } catch (error) {
        spinner.stop();
        console.log(chalk.yellow('🎵来自音巢的提醒: 您的网络环境不太友好，可能会导致melody相关命令执行失败。'))
        return;
    }
    const { version } = info || {};
    spinner.stop();
    if(version === package.version){
        console.log(chalk.green(`🎵版本检索完毕, 已是最新版本: ${version}`));
        return 
    }
    console.log(chalk.green(`🎵版本检索完毕`));
    const isNeedUpdate = version ? version !== package.version : false;
    if(isNeedUpdate){
        const iqres = await inquirer.prompt([{
            type: "confirm",
            message: `🎵检测到全新版本-${version},是否进行升级?`,
            name: "update"
        }])
        if(!iqres.update){
            return ;
        }
        const spinner2 = ora('🎵版本升级中...');
        spinner2.start();
        try {
            await shell(`yarn global upgrade @melody-core/melody-cli`);
        } catch (error) {
            spinner2.stop();
            console.log(chalk.yellow('🎵来自音巢的提醒: 您的网络环境不太友好，可能会导致melody相关命令执行失败。'))
            return;
        }
        spinner2.stop();
        console.log(chalk.green(`🎵升级完毕!请重新使用melody命令吧～`));
        process.exit();
    }
    return ;
}