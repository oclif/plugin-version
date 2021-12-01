import {Command} from '@oclif/core'

export default class Version extends Command {
  async run(): Promise<void> {
    process.stdout.write(this.config.userAgent + '\n')
  }
}
