import NodeCache, { Options } from 'node-cache'

export class CacheService extends NodeCache {
  constructor(options: Options = { stdTTL: 720 }) {
    super(options)
  }
}
