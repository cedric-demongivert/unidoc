const mix = require('laravel-mix')
const fileSystem = require('fs')

for (const file of fileSystem.readdirSync('./benchmark')) {
  mix.ts('benchmark/' + file, 'dist/benchmark')
}

mix.setPublicPath('dist')
   .disableNotifications()
   .webpackConfig({ 'target': 'node' })
