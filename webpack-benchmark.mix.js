const mix = require('laravel-mix')
const fileSystem = require('fs')

for (const file of fileSystem.readdirSync('./benchmark')) {
  mix.ts('benchmark/' + file, 'distribution/benchmark')
}

mix.setPublicPath('distribution')
   .disableNotifications()
   .webpackConfig({ 'target': 'node' })
