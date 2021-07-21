const fetch = require('node-fetch');
// 搜索melody-core包接口地址
const url = 'https://www.npmjs.com/org/melody-core'
const ora = require('ora');
const chalk = require('chalk')

/**
 * @description: 获取npm包的信息
 * @param {*}
 * @return {*}
 */
function getPlugins() {
  const spinner = ora('🎵正在进行检索音巢官方套件列表，请等待...');
  spinner.start();
  return fetch(url, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
      "x-spiferack": 1
    }
  })
  .then(res=>res.json())
  .then(json => {
    // 取出包信息
    spinner.stop();
    console.log(chalk.green('🎵音巢官方套件列表检索完毕!'))
    const { packages = {} } = json || {};
    const { objects = [] } = packages;
    return objects.filter(item => item.name !== "@melody-core/melody-cli");
  })
}

module.exports = getPlugins;
