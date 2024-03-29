import {Command, Flags, Interfaces} from '@oclif/core'
import {EOL} from 'node:os'

export type VersionDetail = Omit<Interfaces.VersionDetails, 'pluginVersions'> & {
  pluginVersions?: string[]
}

export default class Version extends Command {
  static enableJsonFlag = true

  public static flags = {
    verbose: Flags.boolean({
      description:
        'Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.',
      summary: 'Show additional information about the CLI.',
    }),
  }

  async run(): Promise<VersionDetail> {
    const {flags} = await this.parse(Version)
    const {pluginVersions, ...theRest} = this.config.versionDetails
    const versionDetail: VersionDetail = {...theRest}

    let output = `${this.config.userAgent}`
    if (flags.verbose) {
      versionDetail.pluginVersions = this.formatPlugins(pluginVersions ?? {})
      versionDetail.shell ??= 'unknown'

      output = ` CLI Version:
\t${versionDetail.cliVersion}

 Architecture:
\t${versionDetail.architecture}

 Node Version:
\t${versionDetail.nodeVersion}

 Plugin Version:
\t${flags.verbose ? (versionDetail.pluginVersions ?? []).join(EOL + '\t') : ''}

 OS and Version:
\t${versionDetail.osVersion}

 Shell:
\t${versionDetail.shell}

 Root Path:
\t${versionDetail.rootPath}
`
    }

    this.log(output)

    return flags.verbose
      ? versionDetail
      : {
          architecture: versionDetail.architecture,
          cliVersion: versionDetail.cliVersion,
          nodeVersion: versionDetail.nodeVersion,
        }
  }

  private formatPlugins(plugins: Record<string, Interfaces.PluginVersionDetail>): string[] {
    return Object.entries(plugins)
      .map(([name, plugin]) => ({name, ...plugin}))
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((plugin) =>
        `${this.getFriendlyName(plugin.name)} ${plugin.version} (${plugin.type}) ${
          plugin.type === 'link' ? plugin.root : ''
        }`.trim(),
      )
  }

  private getFriendlyName(name: string): string {
    const {scope} = this.config.pjson.oclif
    if (!scope) return name
    const match = name.match(`@${scope}/plugin-(.+)`)
    if (!match) return name
    return match[1]
  }
}
