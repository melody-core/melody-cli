const chalk = require("chalk");
const BASE_CONFIG = require("./../config/base.json");

module.exports = () => {
  console.log();
  console.log(chalk.green(BASE_CONFIG.lib.help2doc.remind));
  console.log(chalk.blue(BASE_CONFIG.registry.baseHome));
  console.log();
};
