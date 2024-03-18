import { defineComponent, h, inject } from 'vue'

import {
  errorLogger,
  gitartDialogInjectionFallback,
  gitartDialogInjectionKey,
} from './constants'

export default defineComponent(() => {
  const {
    dialogs,
    removeDialog,
  } = inject(gitartDialogInjectionKey, gitartDialogInjectionFallback)

  // inject returned default value, so plugin is not installed
  if (dialogs === gitartDialogInjectionFallback.dialogs) {
    errorLogger.pluginIsNotInitialized()
  }

  const onClose = (id: number) => {
    removeDialog(id)
  }

  return () => {
    return dialogs.map((dialog) => {
      return h(dialog.component, {
        ...dialog.props,
        'key': dialog.id,
        'onUpdate:modelValue': () => {
          onClose(dialog.id)
        },
      })
    })
  }
})
