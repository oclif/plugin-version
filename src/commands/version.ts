// tslint:disable no-console

import Command from '@dxcli/command'

export default class Version extends Command {
  variableArgs: true

  async run() {
    console.log(this.config.userAgent)
  }
}
