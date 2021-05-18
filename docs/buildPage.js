const pug = require("pug");
const fs = require("fs");
const path = require('path')
const {getCategories, getSupportInfoMap} = require('./unsupportedList')

const browsers = [
  { id: "1_0_0", name: "1.0.0" },
  { id: "1_8_0", name: "1.8.0" },
  { id: "2_5_0", name: "2.5.0" },
  { id: "2_11_0", name: "2.11.0" },
  { id: "2_14_4", name: "2.14.4" },
  { id: "2_16_1", name: "2.16.1" },
];

const categories = getCategories()
const supportInfos = new Map()

browsers.forEach(browser => {
  supportInfos.set(browser.id, getSupportInfoMap(browser.name))
})

fs.writeFileSync(
  path.resolve(__dirname, "./index.html"),
  pug.renderFile(path.resolve(__dirname, "./skeleton.pug"), {
    browsers,
    categories,
    supportInfos,
  })
);
