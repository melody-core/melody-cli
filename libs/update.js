
const path = require('path');
const chalk = require('chalk')
const fs = require('fs');
const ora = require('ora');
const { shell } = require('./shell')
const getPackageInfo = require('./getPackageInfo');


const rootPath = path.resolve(__dirname, '../');



async function updateSingle(pk){
    const cache = require('./../cache/index.json')
    const spinner = ora('正在更新中，请等待...');
    const spinner2 = ora('正在检索中，请等待...');
    if(pk){
        const cacheItem = cache.find(item => item.name === pk);
        const  { dependencies } = require('../package.json');
        if(!dependencies[pk] && !cacheItem){
            console.log(chalk.yellow('检测到您尚未安装过此套件,您可以运行以下命令安装该套件:'));
            console.log(chalk.blue(`melody install ${pk}`));
            return ;
        }
        if(!cacheItem){
            spinner.start();
            try {
                await shell(`yarn upgrade ${pk}`, { 
                    cwd: rootPath
                });
                spinner.stop();
            } catch (error) {
                spinner.stop();
                console.error(error);
                console.error('更新失败，您的网络环境是否正常?');
                return 
            }
            return ;
        }
        const { version } = cacheItem;
        let info = {};
        spinner2.start();
        try {
            info = await getPackageInfo(pk);
            spinner2.stop();
            console.log(chalk.green('检索完毕'))
        } catch (error) {
            spinner2.stop();
            console.error(error);
            console.error('检索失败，您的网络环境是否正常?');
            return ;

        }
        // 比对version
        if(version === info.version){
            console.log(chalk.green(`套件: ${pk} 已是最新版本，version: ${info.version}`))
            return ;
        }else{
            // 更新这个包呀
            spinner.start();
            try {
                await shell(`yarn upgrade ${pk}`, {
                    cwd: rootPath
                })
            } catch (error) {
                spinner.stop();
                console.log(chalk.yellow(`套件${pk} 更新失败，请检测网络环境`));
                return 
            }
            // 写入缓存
            try {
                const cacheIndex = cache.findIndex(item => item.name === pk);
                const targetPackage = require(`./../node_modules/${pk}/package.json`) 
                const newCacheItem = {
                    ...cacheItem,
                    ...info,
                } 
                if(targetPackage.bin){
                    // 有可能会更新命令;
                    newCacheItem.bin = targetPackage.bin;
                }
                cache[cacheIndex]  = newCacheItem;
                fs.writeFileSync(path.resolve(__dirname, './../cache/index.json'), JSON.stringify(cache, null, 4));
            } catch (error) {
                spinner.stop();
                console.error(error);
                console.log(chalk.yellow(`套件${pk} 写入缓存失败，请使用命令: melody doctor以修复melody-cli。`));
            }
            spinner.stop();
            console.log(chalk.green(`套件:${pk} 更新成功。`))
        }
    
    }
}

module.exports = async function update(pg){
    if(pg) {
        const res = await updateSingle(pg);
        return res;
    }
    const cache = require('./../cache/index.json');
    for(let i = 0; i < cache.length; i++){
        await updateSingle(cache[i].name);
    }
    return ;
      
}