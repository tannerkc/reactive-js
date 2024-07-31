export default {
  presets: [
    '@babel/preset-env'
  ],
  plugins: [
    ['babel-plugin-jsx-dom-expressions', { moduleName: './packages/jsx/jsx-runtime' }]
  ]
};