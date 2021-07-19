#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const getPlugins = require('./libs/getPlugins');
const install = require('./libs/install');
const cache = require('./cache/index.json');
const path = require('path')
const { shell } = require('./libs/shell')

class Leo {
   start() {
    // 版本
    program
      .version(require("./package.json").version)
      .option("-v, --version", "查看当前版本");
    
    // 查看套件列表命令
    program.command("search")
        .description("列出官方所有套件")
        .action(async () => {
          try {
            const packageList = await getPlugins();
            const pluginList = packageList.map(item => {
                return {
                  plugin: item.name,
                  version: item.version,
                  desc: item.description,
                  authors: item.maintainers
                }
              })
            console.table(pluginList);
            process.exit();
          } catch (error) {
            console.log(error)
            console.error('获取远端套件列表失败，请检测网络环境是否友好。');
            process.exit();
          }
        })


    // 安装套件
    program.command("install <package>")
        .description("安装套件")
        .action(async (pk) => {
            console.log(pk)
            let packageList = [] 
            try {
                packageList = await getPlugins();
            } catch (error) {
                console.error('获取远端套件列表失败，请检测网络环境是否友好。');
                process.exit();
            }
            try {
                await install(pk, packageList);
            } catch (error) {
                console.error(error);
                console.error('安装失败，请运行命令: melody doctor, 以修复你的melody-cli。');
                process.exit();
            }
        })

    // 套件扩展命令
    cache.forEach(item => {
        const { bin, desc, name } = item;
        let binString = '';
        if(typeof bin === 'string'){
            binString = bin;
        }else{
            binString = Object.keys(bin)[0] || '???';
        }
        program.command(binString, desc, {
          executableFile: path.resolve(__dirname, `./node_modules/${name}/index.js`)
        })
    })
    program.parse(process.argv);
  }
}


new Leo().start();
