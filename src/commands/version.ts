import {Command, Flags} from '@oclif/core'
import {EOL, type as osType, release as osRelease} from 'node:os'

interface VersionDetail {
  cliVersion: string;
  architecture: string;
  nodeVersion: string;
  pluginVersions?: string[];
  osVersion?: string;
}

export default class Version extends Command {
  static enableJsonFlag = true

  public static flags = {
    verbose: Flags.boolean({
      summary: 'Show additional information about the CLI.',
      description: 'Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.',
    }),
  }

  async run(): Promise<VersionDetail> {
    const {flags} = await this.parse(Version)

    const versions = this.config.userAgent.split(' ')
    const cliVersion = versions[0]
    const architecture = versions[1]
    const nodeVersion = versions[2]

    const versionDetail:VersionDetail = {cliVersion, architecture, nodeVersion}
    let output = `${this.config.userAgent}`

    if (flags.verbose) {
      const pluginVersions = []
      for (const plugin of this.config.plugins) {
        if (this.config.name !== plugin.name) {
          pluginVersions.push(`${plugin.name} ${plugin.version} (${plugin.type})`)
        }
      }

      const osVersion = `${osType()} ${osRelease()}`

      versionDetail.pluginVersions = pluginVersions
      versionDetail.osVersion = osVersion

      output = ` CLI Version:
\t${cliVersion}

 Architecture:
\t${architecture}

 Node Version:
\t${nodeVersion}

 Plugin Version:
\t${pluginVersions.join(`${EOL}\t`)}

 OS and Version:
\t${osVersion}
`
    }

    this.log(output)

    return versionDetail
  }
}
