import {expect, test} from '@oclif/test'
import {type as osType, release as osRelease} from 'node:os'

// eslint-disable-next-line unicorn/prefer-module
const pjson = require('../../package.json')

describe('version', () => {
  const stdout = `@oclif/plugin-version/${pjson.version} ${process.platform}-${process.arch} node-${process.version}
`

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
    expect(output.stdout).to.equal(` CLI Version:
\t@oclif/plugin-version/${pjson.version}

 Architecture:
\t${process.platform}-${process.arch}

 Node Version:
\tnode-${process.version}

 Plugin Version:
\t

 OS and Version:
\t${osType()} ${osRelease()}

`)
  })

  test
  .stdout()
  .command(['version', '--json'])
  .end('runs version --json', output => {
    expect(JSON.parse(output.stdout)).to.deep.equal({
      cliVersion: `@oclif/plugin-version/${pjson.version}`,
      architecture: `${process.platform}-${process.arch}`,
      nodeVersion: `node-${process.version}`,
    })
  })

  test
  .stdout()
  .command(['version', '--json', '--verbose'])
  .end('runs version --verbose --json', output => {
    expect(JSON.parse(output.stdout)).to.deep.equal({
      architecture: `${process.platform}-${process.arch}`,
      cliVersion: `@oclif/plugin-version/${pjson.version}`,
      nodeVersion: `node-${process.version}`,
      osVersion: `${osType()} ${osRelease()}`,
      pluginVersions: [],
    })
  })
})
