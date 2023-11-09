// babel.config.js

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs", // Transpile ES6 modules to CommonJS
      },
    ],
  ],
};
