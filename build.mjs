import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['./src/*.ts'],
  bundle: true,
  outdir: 'dist',
  target: 'node20',
  platform: 'node',
  format: 'esm',
  keepNames: true,
  allowOverwrite: true,
  sourcemap: true,
  minify: true
})