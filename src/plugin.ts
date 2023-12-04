import type { Plugin } from 'vue'

import type {
  IGDialog, IGDialogItem,
} from './types'

import { reactive, shallowReactive } from 'vue'

import { gitartDialogInjectionKey } from './constants'

/**
 * Plugin to install
 */
export const gitartDialogPlugin: Plugin = {
  install: (app, options) => {
    const defaultCloseDelay = options?.closeDelay ?? 500
    const defaultProps = options?.props ?? {}
    const dialogs = shallowReactive<IGDialogItem[]>([])

    const $dialog: IGDialog = {
      dialogs,

      addDialog: (component, props, { onRemoveHook } = {}) => {
        const item = {
          component,
          id: Date.now() + Math.random(),

          props: reactive({
            modelValue: true,
            ...defaultProps,
            ...props,
          }),

          onRemoveHook,
        }

        dialogs.push(item)

        return item
      },

      removeDialog: (id, closeDelay) => {
        const dialog = dialogs.find(d => d.id === id)

        if (!dialog || !dialog.props.modelValue) {
          return
        }

        dialog.props.modelValue = false

        if (dialog.onRemoveHook) {
          dialog.onRemoveHook()
        }

        setTimeout(() => {
          dialogs.splice(dialogs.indexOf(dialog), 1)
        }, closeDelay ?? defaultCloseDelay)
      },
    }

    app.provide(gitartDialogInjectionKey, $dialog)
    app.config.globalProperties.$dialog = $dialog
  },
}
