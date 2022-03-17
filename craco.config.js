const CracoLessPlugin = require('craco-less');
const path = require('path');

const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolvePath('./src/'),
    },
  },
};
