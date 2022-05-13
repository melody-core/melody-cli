#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const getPlugins = require("./libs/getPlugins");
const install = require("./libs/install");
const cache = require("./cache/index.json");
const path = require("path");
const remove = require("./libs/remove");
const update = require("./libs/update");
const checkCliVersion = require("./libs/checkCliVersion");
const desc = require("./libs/desc");
const help2Doc = require("./libs/helpToDoc");
const chalk = require("chalk");
const timeoutPromise = require("./libs/timeoutPromise");
const { shell } = require("./libs/shell");
const BASE_CONFIG = require("./config/base.json");

class Melody {
  async start() {
    // 检测本地cli版本是否是最新版本
    await checkCliVersion();

    // 版本
    program
      .version(require("./package.json").version)
      .option("-v, --version", BASE_CONFIG.help.commanders.version.option);

    // doc命令
    program
      .command("doc")
      .description(BASE_CONFIG.help.commanders.doc.description)
      .action(async (pk) => {
        help2Doc();
        try {
          await shell(`open ${require("./package.json").homepage}`);
        } catch (error) {
          process.exit();
        }
      });

    // 查看官方套件列表命令
    program
      .command("search [pkname]")
      .description(BASE_CONFIG.help.commanders.search.description)
      .action(async (pkname) => {
        try {
          shell(
            `open ${
              pkname
                ? BASE_CONFIG.registry.origin + "/" + pkname
                : BASE_CONFIG.registry.scopeHome
            }`
          );
        } catch (error) {
          console.error(error);
          process.exit();
        }
        try {
          const packageList =
            (await await Promise.race([getPlugins(), timeoutPromise(5000)])) ||
            [];
          const pluginList = packageList.map((item) => {
            return {
              plugin: item.name,
              version: item.version,
              desc: item.description,
              install: cache.find((cacheItem) => cacheItem.name === item.name)
                ? BASE_CONFIG.spinner.check.status.has
                : BASE_CONFIG.spinner.check.status.none,
            };
          });

          if (pluginList && pluginList.length) {
            console.table(pluginList);
          } else {
            console.warn("warn: 网络不太行呢！");
          }
          process.exit();
        } catch (error) {
          console.log(error);
          console.error(BASE_CONFIG.help.commanders.search.error.network);
          process.exit();
        }
      });

    // 查看已安装的套件列表
    program
      .command("list")
      .description(BASE_CONFIG.help.commanders.list.description)
      .action(() => {
        try {
          if (!cache.length) {
            console.log(
              chalk.yellow(BASE_CONFIG.help.commanders.list.help.noCache)
            );
            help2Doc();
            return;
          }
          const logList = cache.map((item) => ({
            pluginName: item.name,
            version: item.version,
            desc: item.desc,
          }));
          console.table(logList);
          help2Doc();
          process.exit();
        } catch (error) {
          console.log(error);
          process.exit();
        }
      });
    // 安装套件
    program
      .command("install <package>")
      .alias("i")
      .description(BASE_CONFIG.help.commanders.install.description)
      .action(async (pk) => {
        let packageList = [];
        try {
          help2Doc();
          packageList =
            (await Promise.race([getPlugins(), timeoutPromise(5000)])) || [];
        } catch (error) {
          console.warn(error);
          console.error(
            chalk.red(BASE_CONFIG.help.commanders.install.error.network)
          );
          process.exit();
        }
        try {
          await install(pk, packageList);
        } catch (error) {
          console.error(error);
          console.error(BASE_CONFIG.help.commanders.install.error.install);
        }
        process.exit();
      });

    // 删除套件
    program
      .command("remove <package>")
      .alias("delete")
      .description(BASE_CONFIG.help.commanders.remove.description)
      .action(async (pk) => {
        try {
          await remove(pk);
          help2Doc();
        } catch (error) {
          console.error(error);
          console.error(BASE_CONFIG.help.commanders.remove.error.remove);
        }
        process.exit();
      });

    // 更新套件
    program
      .command("update [package]")
      .description(BASE_CONFIG.help.commanders.update.description)
      .action(async (pk) => {
        try {
          await update(pk);
          help2Doc();
        } catch (error) {
          console.error(error);
          console.error(BASE_CONFIG.help.commanders.update.error.update);
        }
        process.exit();
      });

    // 更改套件描述
    program
      .command("desc <package>")
      .description(BASE_CONFIG.help.commanders.desc.description)
      .action(async (pk) => {
        try {
          await desc(pk);
        } catch (error) {
          console.error(error);
          console.error(BASE_CONFIG.help.commanders.desc.error.desc);
        }
        process.exit();
      });

    // 套件扩展命令
    cache.forEach((item) => {
      const { bin, desc, name } = item;
      let binString = "";
      let filePath = "./index.js";
      if (typeof bin === "string") {
        binString = bin;
      } else {
        binString = Object.keys(bin)[0] || "???";
        filePath = bin[binString];
      }
      program.command(binString, desc, {
        executableFile: path.resolve(
          __dirname,
          `./node_modules/${name}`,
          filePath
        ),
      });
    });
    program.parse(process.argv);
  }
}

new Melody().start();
