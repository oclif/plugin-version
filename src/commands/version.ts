import {Command} from '@oclif/core'
import {cli} from 'cli-ux'

export default class Version extends Command {
  async run(): Promise<void> {
    cli.log(this.config.userAgent)
  }
}
