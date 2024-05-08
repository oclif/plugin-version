import {expect, test} from '@oclif/test'
import {Ansis} from 'ansis'
import {readFileSync} from 'node:fs'
import {release as osRelease, type as osType, userInfo as osUserInfo} from 'node:os'
import {resolve, sep} from 'node:path'

const ansis = new Ansis()

const pjson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))

const getShell = () => osUserInfo().shell?.split(sep)?.pop() || 'unknown'

describe('version', () => {
  const stdout = `@oclif/plugin-version/${pjson.version} ${process.platform}-${process.arch} node-${process.version}
`

  test
    .stdout()
    .command('version')
    .end('runs version', (output) => {
      expect(output.stdout).to.equal(stdout)
    })

  test
    .stdout()
    .command(['version', '--verbose'])
    .end('runs version --verbose', (output) => {
      const stdout = ansis.strip(output.stdout)
      expect(stdout).to.contain(' CLI Version:')
      expect(stdout).to.contain(`\t@oclif/plugin-version/${pjson.version}`)
      expect(stdout).to.contain(' Architecture:')
      expect(stdout).to.contain(`\t${process.platform}-${process.arch}`)
      expect(stdout).to.contain(' Node Version:')
      expect(stdout).to.contain(`\tnode-${process.version}`)
      expect(stdout).to.contain(' Plugin Version:')
      expect(stdout).to.contain(' OS and Version:')
      expect(stdout).to.contain(`\t${osType()} ${osRelease()}`)
      expect(stdout).to.contain(' Shell:')
      expect(stdout).to.contain(`\t${getShell()}`)
      expect(stdout).to.contain(' Root Path:')
      expect(stdout).to.contain(`\t${process.cwd()}`)
    })

  test
    .stdout()
    .command(['version', '--json'])
    .end('runs version --json', (output) => {
      const json = JSON.parse(output.stdout)
      expect(json).to.have.keys(['cliVersion', 'architecture', 'nodeVersion'])
    })

  test
    .stdout()
    .command(['version', '--json', '--verbose'])
    .end('runs version --verbose --json', (output) => {
      const json = JSON.parse(output.stdout)
      expect(json).to.have.property('architecture', `${process.platform}-${process.arch}`)
      expect(json).to.have.property('cliVersion', `@oclif/plugin-version/${pjson.version}`)
      expect(json).to.have.property('nodeVersion', `node-${process.version}`)
      expect(json).to.have.property('osVersion', `${osType()} ${osRelease()}`)
      expect(json).to.have.property('pluginVersions')
      expect(json.pluginVersions).to.an('array')
      expect(json).to.have.property('shell')
      expect(json.shell).to.be.equal(getShell(), `json.shell: ${json.shell} getShell(): ${getShell()}`)
      expect(json).to.have.property('rootPath', process.cwd())
    })
})
// {"uid":1001,"gid":123,"username":"runner","homedir":"/home/runner","shell":"/bin/bash"}
