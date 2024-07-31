export default {
  presets: [
    '@babel/preset-env',
    [
      "@babel/preset-typescript",
      {
        "isJSX": true,
        "allExtensions": true,
        "jsxPragma": "jsx",
        "jsxPragmaFrag": "'jsx.Fragment'"
      }
    ]
  ],
  plugins: [
    // ['babel-plugin-jsx-dom-expressions', { moduleName: './packages/jsx/jsx-runtime' }],
    ["babel-plugin-jsx-dom-expressions", { moduleName: "dom-expressions" }]
  ]
};
