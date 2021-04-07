/**
 * 获取小程序对应基础库的 browserslist 信息
 * @param version 小程序基础库版本
 */
export function getBrowsersList(version: string): string[] | null

/**
 * 获取小程序对应基础库的 polyfill 信息
 * @param version 小程序基础库版本
 */
export function getPolyfillInfo(version: string): { coreJsVersion: string; coreJsModules: string[] } | null
