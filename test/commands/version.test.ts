import {expect, test} from '@dxcli/dev-test'

const pjson = require('../../package.json')

describe('version', () => {
  const stdout = `@dxcli/version/${pjson.version} (${process.platform}-${process.arch}) node-${process.version}\n`

  test
  .stdout()
  .command('version')
  .end('runs version', output => {
    expect(output.stdout).to.equal(stdout)
  })
})
