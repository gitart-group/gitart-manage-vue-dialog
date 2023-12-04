import path from 'path'
import { URL, fileURLToPath } from 'node:url'

import { defineBuildConfig } from 'unbuild'

const resolve = (str: string) => path.resolve(fileURLToPath(new URL('./', import.meta.url)), str)

export default defineBuildConfig({
  entries: [
    {
      name: 'dialog',
      input: resolve('src/index'),
    },
  ],

  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,

  externals: [
    'vue',
  ],
})
