import {Hook} from '@anycli/config'
import cli from 'cli-ux'

import Version from '../commands/version'

const hook: Hook<'init'> = async opts => {
  if (['-v', '--version'].includes(opts.id)) {
    await Version.run([], opts.config)
    cli.exit(0)
  }
}

export default hook
