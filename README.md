# miniprogram-compat

微信小程序 js 执行环境的兼容信息 [browserslist](https://github.com/browserslist/browserslist) 配置以及自带的 [polyfill](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/js-support.html) 信息

## 安装

```bash
npm install miniprogram-compat --save-dev
```

## api

### `getBrowsersList(version: string): string[]`

获取小程序对应基础库的 browserslist 信息

### `getPolyfillInfo(version: string): string[]`

获取小程序对应基础库的 polyfill 信息
