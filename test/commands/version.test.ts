import {expect, test} from '@anycli/test'

const pjson = require('../../package.json')

describe('version', () => {
  const stdout = `@anycli/plugin-version/${pjson.version} (${process.platform}-${process.arch}) node-${process.version}\n`

  test
  .stdout()
  .command('version')
  .end('runs version', output => {
    expect(output.stdout).to.equal(stdout)
  })
})
