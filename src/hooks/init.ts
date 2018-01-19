import {Hooks, IHook} from '@dxcli/config'
import cli from 'cli-ux'

import Version from '../commands/version'

const hook: IHook<Hooks['init']> = async opts => {
  if (['-v', '--version'].includes(opts.id)) {
    await Version.run([], opts)
    cli.exit(0)
  }
}

export default hook
