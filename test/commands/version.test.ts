import {runCommand} from '@oclif/test'
import {Ansis} from 'ansis'
import {expect} from 'chai'
import {readFileSync} from 'node:fs'
import {release as osRelease, type as osType, userInfo as osUserInfo} from 'node:os'
import {resolve, sep} from 'node:path'

const ansis = new Ansis()

const pjson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))

const getShell = () => osUserInfo().shell?.split(sep)?.pop() || 'unknown'

describe('version', () => {
  it('runs version', async () => {
    const {stdout} = await runCommand('version')
    expect(stdout).to.equal(
      `@oclif/plugin-version/${pjson.version} ${process.platform}-${process.arch} node-${process.version}\n`,
    )
  })

  it('runs version --verbose', async () => {
    const {stdout} = await runCommand('version --verbose')
    const stripped = ansis.strip(stdout)
    expect(stripped).to.contain(' CLI Version:')
    expect(stripped).to.contain(`\t@oclif/plugin-version/${pjson.version}`)
    expect(stripped).to.contain(' Architecture:')
    expect(stripped).to.contain(`\t${process.platform}-${process.arch}`)
    expect(stripped).to.contain(' Node Version:')
    expect(stripped).to.contain(`\tnode-${process.version}`)
    expect(stripped).to.contain(' Plugin Version:')
    expect(stripped).to.contain(' OS and Version:')
    expect(stripped).to.contain(`\t${osType()} ${osRelease()}`)
    expect(stripped).to.contain(' Shell:')
    expect(stripped).to.contain(`\t${getShell()}`)
    expect(stripped).to.contain(' Root Path:')
    expect(stripped).to.contain(`\t${process.cwd()}`)
  })

  it('runs version --json', async () => {
    const {stdout} = await runCommand('version --json')
    const json = JSON.parse(stdout)
    expect(json).to.have.keys(['cliVersion', 'architecture', 'nodeVersion'])
  })

  it('runs version --json --verbose', async () => {
    const {stdout} = await runCommand('version --json --verbose')
    const json = JSON.parse(stdout)
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
