import {describe, testHook} from '@dxcli/dev-test'

const pjson = require('../../package.json')

describe('hooks:init', () => {
  const stdout = `@dxcli/version/${pjson.version} (${process.platform}-${process.arch}) node-${process.version}\n`
  testHook('init', {id: '-v'}, {stdout, exit: 0})
  testHook('init', {id: '--version'}, {stdout, exit: 0})
  testHook('init')
})
