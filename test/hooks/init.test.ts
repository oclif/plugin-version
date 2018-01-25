import {expect, test} from '@dxcli/dev-test'

const pjson = require('../../package.json')

describe('hooks:init', () => {
  const stdout = `@dxcli/version/${pjson.version} (${process.platform}-${process.arch}) node-${process.version}\n`

  test()
  .stdout()
  .hook('init', {id: '-v'})
  .exit(0)
  .end('catches -v', output => {
    expect(output.stdout).to.equal(stdout)
  })

  test()
  .stdout()
  .hook('init', {id: '--version'})
  .exit(0)
  .end('catches --version', output => {
    expect(output.stdout).to.equal(stdout)
  })

  test()
  .stdout()
  .hook('init', {id: 'foobar'})
  .end('does nothing', output => {
    expect(output.stdout).to.equal('')
  })
})
