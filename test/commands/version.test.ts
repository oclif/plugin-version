import {describe, expect, it, output} from '@dxcli/dev-test'

import cmd from '../../src/commands/version'

const pjson = require('../../package.json')

describe.stdout('version', () => {
  it('shows version', async () => {
    await cmd.run([])
    expect(output.stdout).to.equal(`@dxcli/version/${pjson.version} (${process.platform}-${process.arch}) node-${process.version}\n`)
  })
})
