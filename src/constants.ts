import type { IGDialog, IGitartDialogInjectionKey } from './types'

export const errorLogger = {
  pluginIsNotInitialized(): void {
    console.error('The dialog plugin is not initialized.')
  },
}

/**
 * Injection key
 *
 * Provides access to plugin methods and properties using the vue inject method
 *
 * https://gitart-vue-dialog.gitart.org/guide/usage/plugin-usage.html#usage
 *
 * @example Usage
 * const {
 *   dialogs,
 *   removeDialog,
 * } = inject(gitartDialogInjectionKey)!
 */
export const gitartDialogInjectionKey: IGitartDialogInjectionKey = Symbol('GDialog')

/**
 * fallback object that contains all the methods and properties of the plugin.
 * could be used to prevent errors when the plugin is not initialized
 */
export const gitartDialogInjectionFallback: IGDialog = {
  dialogs: [],
  addDialog: () => {
    errorLogger.pluginIsNotInitialized()
    return null as any
  },
  removeDialog: () => {
    errorLogger.pluginIsNotInitialized()
  },
}
