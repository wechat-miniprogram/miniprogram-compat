var browserslist = require("./data/browserslist.json");
var polyfill = require("./data/polyfill.json");
var semver = require("semver");

/**
 * 获取小程序对应基础库的 browserslist 信息
 * @param {string} version 小程序基础库版本
 * @return {string[]}
 */
function getBrowsersList(version) {
  var satisfiedVersion = semver.maxSatisfying(
    Object.keys(browserslist),
    "<=" + version
  );
  return browserslist[satisfiedVersion];
}

/**
 * 获取小程序对应基础库的 polyfill 信息
 * @param {string} version 小程序基础库版本
 * @return {{coreJsVersion: string, exclude?: string[]}}
 */
function getPolyfillInfo(version) {
  var satisfiedVersion = semver.maxSatisfying(
    Object.keys(polyfill),
    "<=" + version
  );
  return polyfill[satisfiedVersion];
}

module.exports = {
  getBrowsersList,
  getPolyfillInfo,
};
