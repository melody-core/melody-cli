const fetch = require('node-fetch');
const chalk = require('chalk');
const log = console.log;
// 搜索melody-core包接口地址
const url = 'https://www.npmjs.com/org/melody-core'

/**
 * @description: 获取npm包的信息
 * @param {*}
 * @return {*}
 */
function getPlugins() {
  fetch(url, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
      "x-spiferack": 1
    }
  })
  .then(res=>res.json())
  .then(json => {
    // 取出包信息
    const list = json.packages.objects;
    const pluginList = list.map(item => {
      return {
        name: item.name,
        version: item.version,
        description: item.description
      }
    })
    console.table(pluginList);
  })
}

getPlugins();
