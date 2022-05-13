const fetch = require("node-fetch");
// 搜索melody-core包接口地址
const url = "https://www.npmjs.com/org/melody-core";
const ora = require("ora");
const chalk = require("chalk");
const BASE_CONFIG = require("./../config/base.json");

/**
 * @description: 获取npm包的信息
 * @param {*}
 * @return {*}
 */
function getPlugins() {
  const spinner = ora(BASE_CONFIG.lib.getPlugins.start);
  spinner.start();
  return fetch(url, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
      "x-spiferack": 1,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      // 取出包信息
      spinner.stop();
      console.log(chalk.green(BASE_CONFIG.lib.getPlugins.end));
      const { packages = {} } = json || {};
      const { objects = [] } = packages;
      return objects.filter((item) => item.name !== BASE_CONFIG.pkname);
    })
    .catch((error) => {
      spinner.stop();
      console.error(error);
      process.exit();
    });
}

module.exports = getPlugins;
