export type Configuration = {
  regex: RegExp,
  api: Object,
  version: Object
}

export type ConcourseConfiguration = {
  source: {
    filter: string,
    telegram_key: string,
    flags: RegExp$flags
  },
  version: Object
}

export type ReadConfiguration = (...rest: Array<any>) => Promise<Configuration>

export type Metadata = { name: string, value: string }
