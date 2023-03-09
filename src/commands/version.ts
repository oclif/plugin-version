import {Command, Flags, Interfaces} from '@oclif/core'
// eslint-disable-next-line unicorn/prefer-node-protocol
import {EOL} from 'os'

export default class Version extends Command {
  static enableJsonFlag = true

  public static flags = {
    verbose: Flags.boolean({
      summary: 'Show additional information about the CLI.',
      description: 'Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.',
    }),
  }

  async run(): Promise<Partial<Interfaces.VersionDetails>> {
    const {flags} = await this.parse(Version)

    let output = `${this.config.userAgent}`
    if (flags.verbose) {
      output = ` CLI Version:
\t${this.config.versionDetails.cliVersion}

 Architecture:
\t${this.config.versionDetails.architecture}

 Node Version:
\t${this.config.versionDetails.nodeVersion}

 Plugin Version:
\t${flags.verbose ? this.formatPlugins(this.config.versionDetails.pluginVersions ?? {}).join(EOL + '\t') : ''}

 OS and Version:
\t${this.config.versionDetails.osVersion}

 Shell:
\t${this.config.versionDetails.shell}

 Root Path:
\t${this.config.versionDetails.rootPath}
`
    }

    this.log(output)

    return flags.verbose ?
      this.config.versionDetails :
      {cliVersion: this.config.versionDetails.cliVersion, architecture: this.config.versionDetails.architecture, nodeVersion: this.config.versionDetails.nodeVersion}
  }

  private formatPlugins(plugins: Record<string, Interfaces.PluginVersionDetail>): string[] {
    return Object.entries(plugins)
    .map(([name, plugin]) => ({name, ...plugin}))
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map(plugin =>
      `${this.getFriendlyName(plugin.name)} ${plugin.version} (${plugin.type}) ${
        plugin.type === 'link' ? plugin.root : ''
      }`.trim(),
    )
  }

  private getFriendlyName(name: string): string {
    const scope = this.config.pjson.oclif.scope
    if (!scope) return name
    const match = name.match(`@${scope}/plugin-(.+)`)
    if (!match) return name
    return match[1]
  }
}
