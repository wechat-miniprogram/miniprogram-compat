const miniprogramCompat = require("../dist/index");
const semver = require("semver");

const browserAlias = {
  chrome: "chrome",
  ios: "safari_ios",
};

const moduleAlias = {
  "builtins.AggregateError.AggregateError": "aggregate-error",
  "builtins.Array.keys": "array.iterator",
  "builtins.Array.values": "array.iterator",
  "builtins.Array.entries": "array.iterator",
};

const featureKeyToCoreJsModule = (featureKey) => {
  if (!moduleAlias[featureKey]) {
    moduleAlias[featureKey] = featureKey
      .replace(/^builtins\./, "")
      .replace(/(?:^|\.)([A-Z])/g, (m) => m.toLowerCase())
      .replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());
  }
  return moduleAlias[featureKey];
};

const checkSupported = (featureKey, support, browsers, coreJsModules) => {
  return (
    coreJsModules.has(featureKeyToCoreJsModule(featureKey)) ||
    Object.keys(browsers).every((browser) => {
      const supportBrowserInfo = Array.isArray(support[browser])
        ? support[browser][0]
        : support[browser];
      const supportBrowserVersion = supportBrowserInfo.version_added;
      return (
        supportBrowserVersion &&
        semver.gte(
          semver.coerce(browsers[browser]),
          semver.coerce(supportBrowserVersion)
        )
      );
    })
  );
};

const ignoreModules = [/^builtins.Intl/, /^builtins.WebAssembly/];

const _getSupportInfoMap = (jsonData, browsers, coreJsModules) => {
  const supportInfo = new Map();
  const internalProcess = (featureKey, data) => {
    if (ignoreModules.some((ignoreModule) => ignoreModule.test(featureKey)))
      return;

    if (data.__compat) {
      const compat = data.__compat;
      if (
        compat.status.experimental === false &&
        compat.status.standard_track === true &&
        compat.status.deprecated === false
      ) {
        supportInfo.set(
          featureKey,
          checkSupported(featureKey, compat.support, browsers, coreJsModules)
        );
      }
    }
    for (const key of Object.keys(data)) {
      if (key === "__compat") continue;
      internalProcess(featureKey ? `${featureKey}.${key}` : key, data[key]);
    }
  };
  internalProcess("", jsonData);
  return supportInfo;
};

const _getCategories = (jsonData) => {
  const categories = [
    {
      id: "unknown",
      name: "Unknown",
      features: [],
    },
  ];

  const getCategory = (featureKey) => categories[0];

  const getParentFeature = (featureKey) => {
    const category = getCategory(featureKey);
    for (let i = 1; i <= 2; ++i) {
      const parentFeatureKey = featureKey.split(".").slice(0, i).join(".");
      const find = category.features.find(
        (feature) => feature.id === parentFeatureKey
      );
      if (find) return find;
    }
  };

  const ensureParentFeature = (feature) => {
    const parentFeature = getParentFeature(feature.id);
    if (parentFeature) return;
    const category = getCategory(feature.id);
    category.features.push({ ...feature, subFeatures: [] });
  };

  const forceParentFeature = (featureKey) => {
    return ['operators', 'statements', 'grammar'].includes(featureKey)
  }

  const internalProcess = (featureKey, data) => {
    if (ignoreModules.some((ignoreModule) => ignoreModule.test(featureKey)))
      return;
    if (
      data.__compat &&
      !(
        data.__compat.status.experimental === false &&
        data.__compat.status.standard_track === true &&
        data.__compat.status.deprecated === false
      )
    )
      return;

    const compat = data.__compat;
    const currentFeature = compat
      ? {
          id: featureKey,
          name: compat.description || featureKey.replace(/^\w+\./, ""),
          mdn_url: compat.mdn_url,
          subFeatures: [],
        }
      : {
          id: featureKey,
          name: featureKey.replace(/^\w+\./, ""),
          subFeatures: [],
        };

    if (compat || featureKey.includes('.') || forceParentFeature(featureKey)) ensureParentFeature(currentFeature)

    if (compat) {
      const parentFeature = getParentFeature(featureKey);
      if (!parentFeature)
        throw new Error("cannot find parentFeature for " + featureKey);
      parentFeature.subFeatures.push(currentFeature);
    }

    for (const key of Object.keys(data)) {
      if (key === "__compat") continue;
      internalProcess(
        featureKey ? `${featureKey}.${key}` : key,
        data[key],
      );
    }
  };
  internalProcess("", jsonData);
  return categories;
};

const getSupportInfoMap = (miniprogramVersion) => {
  const browsers = miniprogramCompat
    .getBrowsersList(miniprogramVersion)
    .reduce((browsers, info) => {
      const [browser, version] = info.split(" ");
      browsers[browserAlias[browser]] = version;
      return browsers;
    }, {});

  const coreJsModules = new Set(
    miniprogramCompat
      .getPolyfillInfo(miniprogramVersion)
      .coreJsModules.filter((moduleName) => /^es(next)?\./.test(moduleName))
      .map((moduleName) => moduleName.replace(/^es(next)?\./, ""))
  );

  const supportInfo = _getSupportInfoMap(
    require("@mdn/browser-compat-data").javascript,
    browsers,
    coreJsModules
  );

  return supportInfo;
};

const getCategories = () => {
  return _getCategories(require("@mdn/browser-compat-data").javascript);
};

module.exports = {
  getSupportInfoMap,
  getCategories,
};
