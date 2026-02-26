import type {
  ComponentPublicInstance, InjectionKey,
  ShallowUnwrapRef,
} from 'vue'

export type ExtractComponentProps<T> = T extends { new (...args: any): any }
  ? InstanceType<T>['$props']
  : T extends (props: infer P, ...args: any) => any
    ? P
    : any

export type ExtractConfirmData<T> = ExtractComponentProps<T> extends { confirm: (data: infer D) => any }
  ? (unknown extends D ? any : D)
  : any

export type DialogCallback<P, R> = {} extends P
  ? (props?: P) => Promise<R>
  : (props: P) => Promise<R>

export interface IGDialogItem {
  component: ShallowUnwrapRef<any>
  id: number
  props: {
    modelValue: boolean
  }
  onRemoveHook?: () => void
}

type DialogAddMethod = <
  T = any,
>(
  component: T,
  props: Omit<ExtractComponentProps<T>, 'modelValue'>,
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
   * props type will be inferred from the component.
   *
   * @example
   * const $dialog = useGDialog()
   * // ..
   * $dialog.addDialog(CloneEntityDialog, {
   *  entities,
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
