module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "cjs",
        loose: true,
        targets: { node: 10 },
      },
    ],
  ],
};
