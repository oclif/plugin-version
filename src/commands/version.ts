import {Command, Flags} from '@oclif/core'
import {EOL, type as osType, release as osRelease} from 'node:os'

export default class Version extends Command {
  public static flags = {
    verbose: Flags.boolean({
      summary: 'Show additional information about the CLI.',
      description: 'Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.',
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Version)
    let output = `${this.config.userAgent}${EOL}`

    if (flags.verbose) {
      const versions = this.config.userAgent.split(' ')
      const cliVersion: string = versions[0]
      const architecture: string = versions[1]
      const nodeVersion: string = versions[2]

      let pluginVersions = ''
      for (const plugin of this.config.plugins) {
        pluginVersions += `${EOL}\t${plugin.name}@${plugin.version} (${plugin.type})`
      }

      const osVersion = `${osType()} ${osRelease()}`

      output = ` CLI Version : ${EOL}\t${cliVersion}
${EOL} Architecture: ${EOL}\t${architecture}
${EOL} Node Version : ${EOL}\t${nodeVersion}
${EOL} Plugin Version: ${pluginVersions}
${EOL} OS and Version: ${EOL}\t${osVersion}
`
    }

    process.stdout.write(output)
  }
}
