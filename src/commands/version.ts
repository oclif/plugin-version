import {Command, Flags, Interfaces} from '@oclif/core'
import {Ansis} from 'ansis'
import {exec} from 'node:child_process'
import {EOL} from 'node:os'

const ansis = new Ansis()

export type VersionDetail = {
  pluginVersions?: string[]
} & Omit<Interfaces.VersionDetails, 'pluginVersions'>

type NpmDetails = {
  date: string
  'dist-tags': Record<string, string>
  name: string
  time: Record<string, string>
  version: string
  versions: string[]
}

async function getNpmDetails(pkg: string): Promise<NpmDetails | false> {
  return new Promise((resolve) => {
    exec(`npm view ${pkg} --json`, (error, stdout) => {
      if (error) {
        resolve(false)
      } else {
        resolve(JSON.parse(stdout) as NpmDetails)
      }
    })
  })
}

function daysAgo(date: string): number {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function humanReadableDate(date: string): string {
  return new Date(date).toDateString()
}

async function formatPlugins(
  config: Interfaces.Config,
  plugins: Record<string, Interfaces.PluginVersionDetail>,
): Promise<string[]> {
  const sorted = Object.entries(plugins)
    .map(([name, plugin]) => ({name, ...plugin}))
    .sort((a, b) => (a.name > b.name ? 1 : -1))

  return Promise.all(
    sorted.map(async (plugin) => {
      const base =
        `${getFriendlyName(config, plugin.name)} ${ansis.dim(plugin.version)} ${ansis.dim(`(${plugin.type})`)} ${
          plugin.type === 'link' ? ansis.dim(plugin.root) : ''
        }`.trim()
      if (plugin.type === 'user') {
        const npmDetails = await getNpmDetails(plugin.name)
        const publishedString = npmDetails
          ? ansis.dim(
              ` published ${daysAgo(npmDetails.time[plugin.version])} days ago (${humanReadableDate(npmDetails.time[plugin.version])})`,
            )
          : ''
        const notLatestWarning =
          npmDetails && plugin.version !== npmDetails['dist-tags'].latest
            ? ansis.red(` (latest is ${npmDetails['dist-tags'].latest})`)
            : ''
        return `${base}${publishedString}${notLatestWarning}`
      }

      return base
    }),
  )
}

function getFriendlyName(config: Interfaces.Config, name: string): string {
  const {scope} = config.pjson.oclif
  if (!scope) return name
  const match = name.match(`@${scope}/plugin-(.+)`)
  if (!match) return name
  return match[1]
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
      const details = await getNpmDetails(this.config.pjson.name)

      const cliPublishedString = details
        ? ansis.dim(
            ` published ${daysAgo(details.time[details.version])} days ago (${humanReadableDate(details.time[details.version])})`,
          )
        : ''
      const notLatestWarning =
        details && this.config.version !== details['dist-tags'].latest
          ? ansis.red(` (latest is ${details['dist-tags'].latest})`)
          : ''
      versionDetail.pluginVersions = await formatPlugins(this.config, pluginVersions ?? {})
      versionDetail.shell ??= 'unknown'

      output = ` ${ansis.bold('CLI Version')}:
\t${versionDetail.cliVersion}${cliPublishedString}${notLatestWarning}

 ${ansis.bold('Architecture')}:
\t${versionDetail.architecture}

 ${ansis.bold('Node Version')}:
\t${versionDetail.nodeVersion}

 ${ansis.bold('Plugin Version')}:
\t${(versionDetail.pluginVersions ?? []).join(EOL + '\t')}

 ${ansis.bold('OS and Version')}:
\t${versionDetail.osVersion}

 ${ansis.bold('Shell')}:
\t${versionDetail.shell}

 ${ansis.bold('Root Path')}:
\t${versionDetail.rootPath}
`
    }

    this.log(output)

    return flags.verbose
      ? {
          ...versionDetail,
          pluginVersions: versionDetail.pluginVersions?.map((plugin) => ansis.strip(plugin)),
        }
      : {
          architecture: versionDetail.architecture,
          cliVersion: versionDetail.cliVersion,
          nodeVersion: versionDetail.nodeVersion,
        }
  }
}
