const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const ora = require("ora");
const { shell } = require("./shell");
const BASE_CONFIG = require("./../config/base.json")

const rootPath = path.resolve(__dirname, "../");

module.exports = async function remove(pk) {
  if (!pk) {
    console.error("🎵 缺少package参数！");
    process.exit();
  }
  const cache = require("./../cache/index.json");
  const { dependencies } = require("./../package.json");
  const targetPlugin = cache.find((item) => item.name === pk);
  if (!targetPlugin && !dependencies[pk]) {
    console.log(chalk.yellow("🎵 您并没有安装过此套件，无须删除。"));
    process.exit();
  }
  const spinner = ora("🎵 正在卸载中，请等待...");
  spinner.start();

  try {
    await shell(`yarn remove ${pk}`, {
      cwd: rootPath,
    });
    spinner.stop();
    const index = cache.findIndex((item) => item.name === pk);
    if (index >= 0) {
      cache.splice(index, 1);
    }
    try {
      fs.writeFileSync(
        path.resolve(__dirname, "./../cache/index.json"),
        JSON.stringify(cache, null, 4)
      );
    } catch (error) {
      console.error(
        BASE_CONFIG.lib.remove.error.cache
      );
      process.exit();
    }
    console.log(chalk.green("🎵 卸载成功!"));
  } catch (error) {
    spinner.stop();
    console.error(error);
    console.error(BASE_CONFIG.lib.remove.error.env);
    process.exit();
  }
};
