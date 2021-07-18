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
    const list2 = []
    list.map(item => {
      const obj = {
        name: item.name,
        version: item.version,
        description: item.name
      }
      list2.push(obj);
    })
    console.table(list2);
  })
}

getPlugins();
