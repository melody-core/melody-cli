const getPackageInfo = require("./getPackageInfo");
const ora = require("ora");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { shell } = require("./shell");
const package = require("./../package.json");
const inquirer = require("inquirer");
const timeoutPromise = require("./timeoutPromise");
const getPlugins = require("./getPlugins");
const cache = require("./../cache/index.json");
const install = require("./install");
const help2Doc = require("./helpToDoc");
const LAST_UPDATE_DATE = require("./../cache/last_update_date.json");
const BASE_CONFIG = require("./../config/base.json");

module.exports = async () => {
  const cuDate = Date.now();
  if (cuDate - LAST_UPDATE_DATE.date < 172800000) {
    return;
  }
  const spinner = ora(BASE_CONFIG.spinner.check.start);
  spinner.start();
  let info;
  try {
    info = await Promise.race([
      getPackageInfo("@melody-core/melody-cli"),
      timeoutPromise(3000),
    ]);
    if (!info) {
      spinner.stop();
      console.log(chalk.yellow(BASE_CONFIG.spinner.check.warn.timeout));
      console.log(chalk.yellow(BASE_CONFIG.spinner.check.warn.network));
      return;
    }
  } catch (error) {
    spinner.stop();
    console.log(chalk.yellow(BASE_CONFIG.spinner.check.warn.network));
    return;
  }
  const { version } = info || {};
  spinner.stop();
  if (version === package.version) {
    console.log(
      chalk.green(BASE_CONFIG.spinner.check.success.versionCu + version)
    );
    return;
  }
  console.log(chalk.green(BASE_CONFIG.spinner.check.success.version));
  if (package.version > version) {
    return;
  }
  const isNeedUpdate = version ? version !== package.version : false;
  if (isNeedUpdate) {
    const iqres = await inquirer.prompt([
      {
        type: "confirm",
        message:
          BASE_CONFIG.spinner.check.ques.version.l +
          version +
          BASE_CONFIG.spinner.check.ques.version.r,
        name: "update",
      },
    ]);
    if (!iqres.update) {
      return;
    }
    const spinner2 = ora(BASE_CONFIG.spinner.lvUp.start);
    spinner2.start();
    try {
      await shell(
        `yarn global upgrade ${BASE_CONFIG.pkname} ${
          BASE_CONFIG.registry.url
            ? "--registry=" + BASE_CONFIG.registry.url
            : ""
        }`
      );
    } catch (error) {
      spinner2.stop();
      console.log(chalk.yellow(BASE_CONFIG.spinner.lvUp.warn.network));
      return;
    }
    spinner2.stop();
    const spinner3 = ora(BASE_CONFIG.spinner.lvUp.pendding);
    spinner3.start();
    try {
      const packageList = await getPlugins();
      for (let i in cache) {
        await install(cache[i].name, packageList, cache);
      }
      spinner3.stop();
    } catch (error) {
      spinner3.stop();
      console.error(error);
      console.log(chalk.yellow(BASE_CONFIG.spinner.lvUp.warn.network));
      return;
    }
    const newLastUpdateDate = JSON.stringify(
      {
        date: Date.now(),
      },
      null,
      4
    );
    try {
      const targetPath = path.resolve(
        __dirname,
        "./../cache/last_update_date.json"
      );
      await fs.promises.writeFile(targetPath, newLastUpdateDate, "utf-8");
      console.log(chalk.green(BASE_CONFIG.spinner.lvUp.end));
    } catch (error) {
      console.warn(error);
      console.warn(BASE_CONFIG.spinner.lvUp.error.jurisdiction);
    }
    help2Doc();
    process.exit();
  }
  return;
};
