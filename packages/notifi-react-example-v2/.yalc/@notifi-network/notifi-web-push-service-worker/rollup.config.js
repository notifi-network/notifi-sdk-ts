import typescript from '@rollup/plugin-typescript';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'lib/notifi-service-worker.js',
    output: {
      file: 'dist/notifi-service-worker.js',
      format: 'iife'
    },
    plugins: [
      nodeResolve({
        // use "jsnext:main" if possible
        // see https://github.com/rollup/rollup/wiki/jsnext:main
        jsnext: true,
        moduleDirectories: ["/Users/kaitotrias/Developer/notifi-sdk-ts/packages/notifi-web-push-service-worker/node_modules", "/Users/kaitotrias/Developer/notifi-sdk-ts/node_modules"]
      })
    ]
  }
];
