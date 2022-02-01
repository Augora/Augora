// https://github.com/svg/svgo/blob/main/README.md#built-in-plugins

module.exports = {
  // multipass: true, // boolean. false by default
  // datauri: 'enc', // 'base64' (default), 'enc' or 'unenc'.
  // js2svg: {
  //   indent: 2, // string with spaces or number of spaces. 4 by default
  //   pretty: true, // boolean, false by default
  // },
  plugins: [
    // set of built-in plugins enabled by default
    // 'preset-default',

    // enable built-in plugins by name
    // 'prefixIds',

    // or by expanded notation which allows to configure plugin
    // {
    //   name: 'inlineStyles',
    //   params: {
    //     xmlnsOrder: 'alphabetical',
    //   },
    // },

    {
      name: "preset-default",
      params: {
        overrides: {
          // customize default plugin options
          inlineStyles: false,
          // inlineStyles: {
          //   onlyMatchedOnce: false,
          // },

          // or disable plugins
          // removeDoctype: false,
        },
      },
    },
  ],
}
