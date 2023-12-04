import type {
  ComponentPublicInstance, InjectionKey,
  ShallowUnwrapRef,
} from 'vue'

export interface IGDialogItem {
  component: ShallowUnwrapRef<{ new (): ComponentPublicInstance }>
  id: number
  props: {
    modelValue: boolean
  }
  onRemoveHook?: () => void
}

type DialogAddMethod = <
  T extends { new (): ComponentPublicInstance },
  P = Omit<InstanceType<T>['$props'], 'modelValue' | 'confirm'>
>(
  component: T,
  props: P,
  params?: {
    onRemoveHook?: () => void
  }) => IGDialogItem

type DialogRemoveMethod = (
  id: number,
  closeDelay?: number
) => void

interface IGDialogMethods {
  /**
   * method for adding dialog
   *
   * add first generic type for component to make props type safe. Otherwise, you can pass any props
   * without any type checking.
   *
   * `addDialog<typeof CloneEntityDialog>(CloneEntityDialog, ...)`
   *
   * @example
   * const $dialog = useGDialog()
   * // ..
   * $dialog.addDialog<typeof CloneEntityDialog>(CloneEntityDialog, {
   *  enities,
   * })
   */
  addDialog: DialogAddMethod

  removeDialog: DialogRemoveMethod
}

// Interface Dialog
export interface IGDialog extends IGDialogMethods {
  dialogs: IGDialogItem[]
}

export type IGitartDialogInjectionKey = InjectionKey<IGDialog>
