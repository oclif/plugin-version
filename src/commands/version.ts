// tslint:disable no-console

import Command from '@anycli/command'

export default class Version extends Command {
  variableArgs: true

  async run() {
    console.log(this.config.userAgent)
  }
}
