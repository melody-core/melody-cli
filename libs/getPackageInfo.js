const fetch = require("node-fetch");

const getUrl = (pk) => `https://www.npmjs.com/package/${pk}`;
module.exports = function getPackageInfo(pk) {
  return fetch(getUrl(pk), {
    headers: {
      "x-requested-with": "XMLHttpRequest",
      "x-spiferack": 1,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      // 取出包信息
      const { package, packageVersion = {} } = json || {};
      const { version = "???", description = "" } = packageVersion;
      return {
        name: package,
        version,
        desc: description,
      };
    });
};
