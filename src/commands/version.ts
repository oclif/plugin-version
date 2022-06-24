import {CliUx, Command, Flags} from '@oclif/core'
import {EOL, type as osType, release as osRelease} from 'node:os'
import {exec} from 'shelljs'

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
    let output = `${cliVersion} ${architecture} ${nodeVersion}`

    if (flags.verbose) {
      const pluginVersion: string = exec('./bin/run plugins --core', {
        silent: true,
      }).toString()
      const pluginVersions: string[] = pluginVersion.split('\n')
      pluginVersions.pop()
      const osVersion = `${osType()} ${osRelease()}`

      versionDetail.pluginVersions = pluginVersions
      versionDetail.osVersion = osVersion

      output = ` CLI Version : ${EOL}\t${cliVersion}
      ${EOL} Architecture: ${EOL}\t${architecture}
      ${EOL} Node Version : ${EOL}\t${nodeVersion}
      ${EOL} Plugin Version: ${pluginVersions.join('\n\t')}
      ${EOL} OS and Version: ${EOL}\t${osVersion}
      `
    }

    if (!flags.json) {
      CliUx.ux.log(output)
    }

    return versionDetail
  }
}
