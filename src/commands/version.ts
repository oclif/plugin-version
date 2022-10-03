import {Command, Flags} from '@oclif/core'
// eslint-disable-next-line unicorn/prefer-node-protocol
import {EOL, type as osType, release as osRelease} from 'os'

export interface VersionDetail {
  cliVersion: string;
  architecture: string;
  nodeVersion: string;
  pluginVersions?: string[];
  osVersion?: string;
  shell?: string;
  rootPath?: string;
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

    const [cliVersion, architecture, nodeVersion] = this.config.userAgent.split(' ')

    const versionDetail:VersionDetail = {cliVersion, architecture, nodeVersion}
    let output = `${this.config.userAgent}`

    if (flags.verbose) {
      const pluginVersions = []
      for (const plugin of this.config.plugins.sort((a, b) => a.name > b.name ? 1 : -1)) {
        if (this.config.name !== plugin.name) {
          pluginVersions.push(`${this.getFriendlyName(plugin.name)} ${plugin.version} (${plugin.type}) ${plugin.type === 'link' ? plugin.root : ''}`.trim())
        }
      }

      const osVersion = `${osType()} ${osRelease()}`

      versionDetail.pluginVersions = pluginVersions
      versionDetail.osVersion = osVersion
      versionDetail.shell = this.config.shell
      versionDetail.rootPath = this.config.root

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

 Shell:
\t${versionDetail.shell}

 Root Path:
\t${versionDetail.rootPath}
`
    }

    this.log(output)

    return versionDetail
  }

  private getFriendlyName(name: string): string {
    const scope = this.config.pjson.oclif.scope
    if (!scope) return name
    const match = name.match(`@${scope}/plugin-(.+)`)
    if (!match) return name
    return match[1]
  }
}
