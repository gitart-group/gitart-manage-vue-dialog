import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, PropType } from 'vue'

import {
  GDialogSpawn,
  gitartDialogPlugin,
  useGDialog,
  useDialogReturnData,
  useDialogConfirm,
} from './index'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const DialogComponent = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Number,
      required: true,
    },
  },
  setup(_, { emit }) {
    return () => {
      return h('div', {
        class: 'app-dialog',
      }, [
        'Title',
        h('button', {
          onClick: () => {
            emit('update:modelValue', false)
          },
        }, 'Close'),
      ])
    }
  },
})

describe('dialog plugin', () => {
  it('test required props', async() => {
    const component = defineComponent(() => {
      const $dialog = useGDialog()
      // @ts-expect-error should require id
      const { id } = $dialog.addDialog<typeof DialogComponent>(DialogComponent, {})
      $dialog.removeDialog(id)

      return () => {
        return [
          h('div'),
        ]
      }
    })

    mount(component, {
      global: {
        plugins: [gitartDialogPlugin],
      },
    })
  })

  it('test base functionality', async() => {
    const component = defineComponent(() => {
      const $dialog = useGDialog()
      $dialog.addDialog<typeof DialogComponent>(DialogComponent, {
        data: 1,
      })

      return () => {
        return [
          h('div'),
          h(GDialogSpawn),
        ]
      }
    })

    const wrapper = mount(component, {
      global: {
        plugins: [gitartDialogPlugin],
      },
    })

    expect(wrapper.find('.app-dialog').exists())
      .toBe(true)

    const closeButton = wrapper.find('button')
    expect(closeButton.exists())
      .toBe(true)

    await closeButton.trigger('click')

    await wait(500)

    expect(wrapper.find('.app-dialog').exists())
      .toBe(false)
  })

  it('test onRemoveHook', async() => {
    const onRemoveHookFn = vi.fn()

    const component = defineComponent(() => {
      const $dialog = useGDialog()
      $dialog.addDialog<typeof DialogComponent>(DialogComponent, {
        data: 1,
      }, {
        onRemoveHook: onRemoveHookFn,
      })

      return () => {
        return [
          h('div'),
          h(GDialogSpawn),
        ]
      }
    })

    const wrapper = mount(component, {
      global: {
        plugins: [gitartDialogPlugin],
      },
    })

    expect(onRemoveHookFn)
      .toBeCalledTimes(0)

    const closeButton = wrapper.find('button')
    await closeButton.trigger('click')

    await wait(500)

    expect(onRemoveHookFn)
      .toBeCalledTimes(1)
  })

  it('test type usage for useDialogReturnData and useDialogConfirm', () => {
    const TestComponent = defineComponent({
      props: {
        modelValue: {
          type: Boolean,
          required: true,
        },
        confirm: {
          type: Function as PropType<(data: string) => void>,
          required: true,
        },
        otherProp: {
          type: String,
          required: true,
        },
        optionalProp: {
          type: Number,
        },
      },
    })

    const TestComponentNoProps = defineComponent({
      props: {
        modelValue: Boolean,
        confirm: Function as PropType<(data: number) => void>,
      },
    })

    // Generic inference check
    const dialogWithResult = useDialogReturnData<string, typeof TestComponent>(TestComponent)
    // @ts-expect-error otherProp is required
    dialogWithResult({})
    dialogWithResult({ otherProp: 'test' })

    const dialogNoProps = useDialogReturnData<number, typeof TestComponentNoProps>(TestComponentNoProps)
    // Should work without arguments if props are optional
    dialogNoProps()
    dialogNoProps({})

    const confirmWithProps = useDialogConfirm(TestComponent)
    // @ts-expect-error otherProp is required
    confirmWithProps({})
    confirmWithProps({ otherProp: 'test' })

    const confirmNoProps = useDialogConfirm(TestComponentNoProps)
    confirmNoProps()
  })
})
