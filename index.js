const path = require('path');
const fs = require('fs');
const { findEnvFile } = require('./utils');

const DEFAULT_ENV = process.env.NODE_ENV || 'development';

module.exports = (
  options = {
    includeSystemProcessEnv: false,
    filterByPrefix: null,
  }
) => ({
  name: 'env',

  setup(build) {
    build.onResolve({ filter: /^env$/ }, async (args) => {
      const rootPath = path.resolve('.');
      const env = (
        (build.initialOptions?.define || {})['process.env.NODE_ENV'] ||
        DEFAULT_ENV
      ).replace(/"/g, '');
      return {
        path: args.path,
        pluginData: {
          ...args.pluginData,
          envPath: findEnvFile(args.resolveDir, rootPath, env),
          options,
        },
        namespace: 'env-ns',
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, async (args) => {
      let envPath = args.pluginData?.envPath;
      let envConfig = {};
      let contents = '{}';
      const options = args.pluginData?.options ?? {};

      try {
        if (envPath) {
          const data = await fs.promises.readFile(envPath, 'utf8');
          envConfig = require('dotenv').parse(Buffer.from(data));
        }

        const contentsObj = options.includeSystemProcessEnv
          ? { ...process.env, ...envConfig }
          : { ...envConfig };

        if (options.filterByPrefix) {
          contents = JSON.stringify(
            Object.fromEntries(
              Object.entries(contentsObj).filter(([key]) =>
                key.startsWith(options.filterByPrefix)
              )
            )
          );
        } else {
          contents = JSON.stringify(contentsObj);
        }
      } catch (e) {
        console.warn('Exception in esbuild-envfile-plugin build.onLoad():', e);
        contents = '{}';
      }

      return {
        contents,
        loader: 'json',
      };
    });
  },
});
