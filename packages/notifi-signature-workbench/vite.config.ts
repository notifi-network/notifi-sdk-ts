import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import inject from '@rollup/plugin-inject';
import path, { join } from 'path';
import postcssNesting from 'postcss-nesting';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd());
  const processEnvValues = {
    'process.env': Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      };
    }, {}),
  };

  if (mode.mode === 'development') {
    return {
      define: Object.assign(processEnvValues, { global: {} }),
      resolve: {
        alias: {
          '@': join(__dirname, 'src'),
          util: 'rollup-plugin-node-polyfills/polyfills/util',
          stream: 'rollup-plugin-node-polyfills/polyfills/stream',
          process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
          // 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
        },
      },
      plugins: [postcssNesting],
    };
  }

  return {
    // define: Object.assign(processEnvValues, { global: {} }),
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
        // 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          // can't use this
          // https://github.com/intlify/vue-i18n-next/issues/970
          // global: "globalThis",
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      rollupOptions: {
        plugins: [inject({ Buffer: ['buffer/', 'Buffer'] }), nodePolyfills()],
      },
    },
    plugins: [
      // eslint(),
      // VueI18nPlugin({
      //   include: path.resolve(__dirname, './src/locales/**'), // PUT YOUR OWN PATH TO LOCALES HERE
      // }),
      postcssNesting,
    ],
  };
});
