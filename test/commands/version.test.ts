import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {readFileSync} from 'node:fs'
import {release, type} from 'node:os'
import {resolve} from 'node:path'

const pjson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))

describe('version', () => {
  it('runs version', async () => {
    const {stdout} = await runCommand('version')
    expect(stdout).to.equal(
      `@oclif/plugin-version/${pjson.version} ${process.platform}-${process.arch} node-${process.version}\n`,
    )
  })

  it('runs version --verbose', async () => {
    const {stdout} = await runCommand('version --verbose')
    expect(stdout).to.contain(' CLI Version:')
    expect(stdout).to.contain(`\t@oclif/plugin-version/${pjson.version}`)
    expect(stdout).to.contain(' Architecture:')
    expect(stdout).to.contain(`\t${process.platform}-${process.arch}`)
    expect(stdout).to.contain(' Node Version:')
    expect(stdout).to.contain(`\tnode-${process.version}`)
    expect(stdout).to.contain(' Plugin Version:')
    expect(stdout).to.contain(' OS and Version:')
    expect(stdout).to.contain(`\t${type()} ${release()}`)
    expect(stdout).to.contain(' Shell:')
    expect(stdout).to.contain(' Root Path:')
    expect(stdout).to.contain(`\t${process.cwd()}`)
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
    expect(json).to.have.property('osVersion', `${type()} ${release()}`)
    expect(json).to.have.property('pluginVersions')
    expect(json.pluginVersions).to.an('array')
    expect(json).to.have.property('shell')
    expect(json).to.have.property('rootPath', process.cwd())
  })
})
