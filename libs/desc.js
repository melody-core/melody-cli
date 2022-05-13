const chalk = require("chalk");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const BASE_CONFIG = require("./../config/base.json");

module.exports = async (pk) => {
  const cache = require("./../cache/index.json");
  const findItem = cache.find((item) => item.name === pk);
  if (!findItem) {
    console.log(chalk.yellow(BASE_CONFIG.lib.desc.warn.none));
    return;
  }
  const inqres = await inquirer.prompt([
    {
      type: "input",
      message: BASE_CONFIG.lib.desc.start,
      name: "desc",
    },
  ]);
  if (inqres.desc) {
    const targetIndex = cache.findIndex((item) => item.name === pk);
    cache[targetIndex]["desc"] = inqres.desc;
    try {
      await fs.promises.writeFile(
        path.resolve(__dirname, "./../cache/index.json"),
        JSON.stringify(cache, null, 4),
        { encoding: "utf-8" }
      );
      console.log(chalk.green(BASE_CONFIG.lib.desc.end));
    } catch (error) {
      console.error(
        BASE_CONFIG.lib.desc.error.cache
      );
      process.exit();
    }
  } else {
    console.log(chalk.yellow(BASE_CONFIG.lib.desc.warn.null));
  }
};
