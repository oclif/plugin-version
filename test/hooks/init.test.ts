import * as Config from '@dxcli/config'
import {describe, expect, it, output} from '@dxcli/dev-test'
import {inspect} from 'util'

import init from '../../src/hooks/init'

const pjson = require('../../package.json')

export interface RunHookOptions {
  description?: string
  stdout?: string
  stderr?: string
  exit?: number
}
const testHook = (_: string, hookOpts: object = {}, opts: RunHookOptions = {}) => {
  const description = opts.description || `run hook with opts: ${inspect(hookOpts)}`
  let test = it
  if (opts.stdout) test = test.stdout
  if (opts.stderr) test = test.stderr
  test(description, async () => {
    const config = await Config.read()
    const run = () => init({config, ...hookOpts} as any)
    if (typeof opts.exit === 'number') await expect(run()).to.be.rejectedWith(`EEXIT: ${opts.exit}`)
    else await run()
    if (opts.stdout) expect(output.stdout).to.equal(opts.stdout)
    if (opts.stderr) expect(output.stderr).to.equal(opts.stderr)
  })
}

describe('hooks:init', () => {
  const stdout = `@dxcli/version/${pjson.version} (${process.platform}-${process.arch}) node-${process.version}\n`
  testHook('init', {id: '-v'}, {stdout, exit: 0})
  testHook('init', {id: '--version'}, {stdout, exit: 0})
  testHook('init')
})
