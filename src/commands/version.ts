// tslint:disable no-console

import Command from '@anycli/command'

export default class Version extends Command {
  async run() {
    console.log(this.config.userAgent)
  }
}
