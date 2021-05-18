# miniprogram-compat

[在线支持度列表](https://wechat-miniprogram.github.io/miniprogram-compat/)

微信小程序 js 执行环境的兼容信息 [browserslist](https://github.com/browserslist/browserslist) 配置以及自带的 [polyfill](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/js-support.html) 信息

## 安装

```bash
npm install miniprogram-compat --save-dev
```

## api

### `getBrowsersList(version: string): string[]`

获取小程序对应基础库的 browserslist 信息

### `getPolyfillInfo(version: string): { coreJsVersion: string; coreJsModules: string[] }`

获取小程序对应基础库的 polyfill 信息
- `coreJsVersion` 基础库内置的 core-js 版本号
- `coreJsModules` 基础库内置的 core-js 模块列表 (对应 core-js 3)
