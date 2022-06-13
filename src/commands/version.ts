import {Command, Flags} from '@oclif/core'
import {type as osType, release as osRelease} from 'node:os'

export default class Version extends Command {
  public static flags = {
    verbose: Flags.boolean({
      summary: 'Show additional information about the CLI.',
      description: 'Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.',
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Version)
    let output = `${this.config.userAgent} \n`

    if (flags.verbose) {
      const versions = this.config.userAgent.split(' ')
      const cliVersion: string = versions[0]
      const architecture: string = versions[1]
      const nodeVersion: string = versions[2]

      const pluginVersions: string = this.config.plugins.reduce((accumulator, plugin) => {
        accumulator += `\n\t${plugin.name}@${plugin.version} (${plugin.type})`
        return accumulator
      }, '')

      const osVersion = `${osType()} ${osRelease()}`

      output = ` CLI Version : \n\t${cliVersion}
\n Architecture: \n\t${architecture}
\n Node Version : \n\t${nodeVersion}
\n Plugin Version: ${pluginVersions}
\n OS and Version: \n\t${osVersion}
`
    }

    this.log(output)
  }
}
