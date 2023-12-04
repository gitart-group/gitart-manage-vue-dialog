import type { ComponentPublicInstance } from 'vue'

import type { IGDialog } from './types'

import { inject } from 'vue'

import { gitartDialogInjectionKey } from './constants'

export const useGDialog = (): IGDialog => {
  const $dialog = inject(gitartDialogInjectionKey)!
  return $dialog || {}
}

/**
 * helper composables for dialogs that confirm something
 * @param component - dialog componen
 * @param _$dialog - dialog controller. If we don't use it inside the setup function, we should pass it manually
 *
 * add first generic type for component to make props type safe. Otherwise, you can pass any props
 * without any type checking.
 *
 * The dialog component should also have modelValue(boolean) prop and emit 'update:modelValue' event.
 * It will be used to close the dialog.
 *
 * @example
 * const confirmIt = useDialogReturnData<typeof ConfirmDialog>(ConfirmDialog)
 * ...
 * const data = await confirmIt({ title: 'Confirm it' }) // data is boolean
 * @returns {Promise<boolean>} - true if the user confirmed the dialog, false if the user canceled the dialog
 */
export const useDialogConfirm = <
  T extends { new (): ComponentPublicInstance },
  P = Omit<InstanceType<T>['$props'], 'modelValue' | 'confirm'>
>(
  component: T,
  _$dialog?: IGDialog,
): (props: P) => Promise<boolean> => {
  const $dialog = _$dialog || useGDialog()

  return (props: P = {} as P): Promise<boolean> => {
    return new Promise((resolve) => {
      let confirmed = false

      $dialog.addDialog(component, {
        ...props,
        confirm: () => {
          confirmed = true
          resolve(true)
        },
      },
      {
        onRemoveHook() {
          if (!confirmed) {
            resolve(false)
          }
        },
      })
    })
  }
}

/**
 * helper composables for dialogs that return some data

 * @param component - dialog component. Should accept 'confirm' prop and run it on confirm.
 * @param _$dialog - dialog controller. If we don't use it inside the setup function, we should pass it manually
 *
 * Pass first generic type to specify the type of data that the dialog returns. Second generic type is the type of the dialog component.
 *
 * The dialog component should also have modelValue(boolean) prop and emit 'update:modelValue' event.
 * It will be used to close the dialog.
 *
 * @example
 * const confirmIt = useDialogReturnData<number, typeof ConfirmDialog>(ConfirmDialog)
 * ...
 * const data = await confirmIt({ title: 'Confirm it' }) // data is number or null
 * @returns Promise<T | null> - data that the dialog returns or null if the user canceled the dialog
 */
export const useDialogReturnData = <
  D,
  T extends { new (): ComponentPublicInstance },
  P = Omit<InstanceType<T>['$props'], 'confirm' | 'modelValue'>
>(
  component: T,
  _$dialog?: IGDialog,
): (props: P) => Promise<D | null> => {
  const $dialog = _$dialog || useGDialog()

  return (props: P): Promise<D | null> => {
    return new Promise((resolve) => {
      let confirmed = false

      $dialog.addDialog(component, {
        ...props,
        confirm: (data: D) => {
          confirmed = true
          resolve(data)
        },
      },
      {
        onRemoveHook() {
          if (!confirmed) {
            resolve(null)
          }
        },
      })
    })
  }
}
