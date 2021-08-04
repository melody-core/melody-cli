const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const ora = require("ora");
const { shell } = require("./shell");

let registry = "https://mirrors.huaweicloud.com/repository/npm/";

module.exports = async function installPackage(
  pluginName,
  packageList,
  cuCache
) {
  if (!pluginName) {
    console.error("🎵 缺少package参数！");
    process.exit();
  }
  const rootPath = path.resolve(__dirname, "../");
  // 1 获取ceche
  const cache = cuCache ? cuCache : require("./../cache/index.json");
  const pkj = require("./../package.json");
  const { dependencies = {} } = pkj;
  if (!cuCache && dependencies[pluginName]) {
    console.log(
      `${chalk.yellow(
        "🎵 检测您已经安装过此套件，无须再次安装，如果需要更新套件版本，请执行命令：melody update"
      )}`
    );
    return;
  }
  const spinner = ora("🎵 正在安装中，请等待...");
  spinner.start();
  try {
    await shell(`yarn add ${pluginName} --registry="${registry}"`, {
      cwd: rootPath,
    });
  } catch (error) {
    spinner.stop();
    console.error(error);
    console.error("🎵 安装失败，请检测网络环境，以及要安装的套件名称是否正确。");
    process.exit();
  }
  const targetPlugin = packageList.find((item) => item.name === pluginName);
  const targetPackage = require(`./../node_modules/${pluginName}/package.json`);
  // console.log('targetPackage', targetPackage)
  if (!cuCache) {
    cache.push({
      name: pluginName,
      version: targetPackage.version,
      desc: targetPlugin
        ? targetPlugin.description
        : `未知套件, 您可以通过命令 melody desc ${pluginName} 来更改它的描述`,
      bin: targetPackage.bin || "???",
    });
  }

  try {
    fs.writeFileSync(
      path.resolve(__dirname, "./../cache/index.json"),
      JSON.stringify(cache, null, 4)
    );
  } catch (error) {
    console.error("🎵 缓存写入失败！请运行命令: melody doctor 以修复melody-cli");
    process.exit();
  }
  spinner.stop();
  const afterContent = cuCache ? `🎵 同步${pluginName}成功！` : `🎵 安装${pluginName}成功！执行melody即可查看您新增的命令!`
  console.log(chalk.green(afterContent));
};
