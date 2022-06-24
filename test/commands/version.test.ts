import {expect, test} from '@oclif/test'
import {EOL} from 'node:os'

// eslint-disable-next-line unicorn/prefer-module
const pjson = require('../../package.json')

describe('version', () => {
  const stdout = `@oclif/plugin-version/${pjson.version} ${process.platform}-${process.arch} node-${process.version}${EOL}${EOL}`

  test
  .stdout()
  .command('version')
  .end('runs version', output => {
    expect(output.stdout).to.equal(stdout)
  })

  test
  .stdout()
  .command(['version', '--verbose'])
  .end('runs version --verbose', output => {
    expect(output.stdout).to.equal(' CLI Version : \n' +
      '\t@oclif/plugin-version/1.1.0\n' +
      '      \n' +
      ' Architecture: \n' +
      '\tdarwin-x64\n' +
      '      \n' +
      ' Node Version : \n' +
      '\tnode-v16.14.2\n' +
      '      \n' +
      ' Plugin Version: \n' +
      '      \n' +
      ' OS and Version: \n' +
      '\tDarwin 21.5.0\n' +
      '      \n')
  })

  test
  .stdout()
  .command(['version', '--json'])
  .end('runs version --json', output => {
    expect(JSON.parse(output.stdout)).to.deep.equal({
      cliVersion: '@oclif/plugin-version/1.1.0',
      architecture: 'darwin-x64',
      nodeVersion: 'node-v16.14.2',
    })
  })

  test
  .stdout()
  .command(['version', '--json', '--verbose'])
  .end('runs version --verbose --json', output => {
    expect(JSON.parse(output.stdout)).to.deep.equal({
      architecture: 'darwin-x64',
      cliVersion: '@oclif/plugin-version/1.1.0',
      nodeVersion: 'node-v16.14.2',
      osVersion: 'Darwin 21.5.0',
      pluginVersions: [],
    })
  })
})
