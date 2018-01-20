import {testCommand} from '@dxcli/dev-test'

const pjson = require('../../package.json')

describe('version', () => {
  const stdout = `@dxcli/version/${pjson.version} (${process.platform}-${process.arch}) node-${process.version}\n`
  testCommand(['version'], {stdout})
})
