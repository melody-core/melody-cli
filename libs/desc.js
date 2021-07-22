


const chalk = require("chalk");
const inquirer = require("inquirer");

const fs = require('fs');


module.exports = async (pk) => {
    const cache = require('./../cache/index.json');
    const findItem = cache.find(item => item.name === pk);
    if(!findItem){
        console.log(chalk.yellow("🎵检测到您尚未安装此套件,请先安装该套件"));
        return ;
    }
    const inqres = await inquirer.prompt([{
        type: 'input',
        message: `🎵请输入对${pk}的描述:`,
        name: "desc",
        default: findItem.desc
    }])
    if(inqres.desc){
        const targetIndex = cache.findIndex(item => item.name === pk);
        cache[targetIndex]['desc'] = inqres.desc;
    }
    try {
        await fs.promises.writeFile(path.resolve(__dirname, './../cache/index.json'), JSON.stringify(cache, null, 4));
    } catch (error) {
        console.error('🎵缓存写入失败！请运行命令: melody doctor 以修复melody-cli');
        process.exit();
    }
    
}