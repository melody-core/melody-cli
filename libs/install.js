const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const ora = require("ora");
const { shell } = require("./shell");
const BASE_CONFIG = require("./../config/base.json");

module.exports = async function installPackage(
  pluginName,
  packageList,
  cuCache
) {
  if (!pluginName) {
    console.error(BASE_CONFIG.lib.install.error.noPkArgs);
    process.exit();
  }
  const rootPath = path.resolve(__dirname, "../");
  // 1 获取ceche
  const cache = cuCache ? cuCache : require("./../cache/index.json");
  const pkj = require("./../package.json");
  const { dependencies = {} } = pkj;
  if (!cuCache && dependencies[pluginName]) {
    console.log(`${chalk.yellow(BASE_CONFIG.lib.install.warn.update)}`);
    return;
  }
  const spinner = ora(BASE_CONFIG.lib.install.pedding);
  spinner.start();
  try {
    await shell(
      `yarn add ${pluginName} ${
        BASE_CONFIG.registry.url ? "--registry=" + BASE_CONFIG.registry.url : ""
      }`,
      {
        cwd: rootPath,
      }
    );
  } catch (error) {
    spinner.stop();
    console.error(error);
    console.error(BASE_CONFIG.lib.install.error.network);
    process.exit();
  }
  const targetPlugin = packageList.find((item) => item.name === pluginName);
  const targetPackage = require(`./../node_modules/${pluginName}/package.json`);
  console.log('targetPackage', targetPackage)
  if (!cuCache) {
    cache.push({
      name: pluginName,
      version: targetPackage.version,
      desc:
        targetPlugin ? targetPlugin.description : (targetPackage.description ||
        `${BASE_CONFIG.lib.install.help.noDesc.l} ${pluginName} ${BASE_CONFIG.lib.install.help.noDesc.r}`),
      bin: targetPackage.bin || "???",
    });
  }

  try {
    fs.writeFileSync(
      path.resolve(__dirname, "./../cache/index.json"),
      JSON.stringify(cache, null, 4)
    );
  } catch (error) {
    console.error(
      BASE_CONFIG.lib.install.error.cache
    );
    process.exit();
  }
  spinner.stop();
  const afterContent = cuCache
    ? `🎵 同步${pluginName}成功！`
    : `🎵 安装${pluginName}成功！执行${BASE_CONFIG.bin}即可查看您新增的命令!`;
  console.log(chalk.green(afterContent));
};
