import browserslist from "../data/browserslist.json";
import polyfill from "../data/polyfill.json";
import semver from "semver";

/**
 * 获取小程序对应基础库的 browserslist 信息
 * @param {string} version 小程序基础库版本
 * @return {string[] | null}
 */
export function getBrowsersList(version) {
  const satisfiedVersion = semver.maxSatisfying(
    Object.keys(browserslist),
    "<=" + version
  );
  return satisfiedVersion ? browserslist[satisfiedVersion] : null;
}

/**
 * 获取小程序对应基础库的 polyfill 信息
 * @param {string} version 小程序基础库版本
 * @return {{ coreJsVersion: string; exclude?: string[] } | null}
 */
export function getPolyfillInfo(version) {
  const satisfiedVersion = semver.maxSatisfying(
    Object.keys(polyfill),
    "<=" + version
  );
  return satisfiedVersion ? polyfill[satisfiedVersion] : null;
}
