import {expect, test} from '@oclif/test'

// eslint-disable-next-line unicorn/prefer-module
const pjson = require('../../package.json')

describe('version', () => {
  const stdout = `@oclif/plugin-version/${pjson.version} ${process.platform}-${process.arch} node-${process.version}\n`

  test
  .stdout()
  .command('version')
  .end('runs version', output => {
    expect(output.stdout).to.equal(stdout)
  })
})
