import { describe, it } from 'vitest'
import { defineComponent, PropType } from 'vue'
import { useDialogReturnData, useDialogConfirm, useGDialog } from './composables'

interface AnswerFormat {
  id: number
  name: string
}

const DialogWithConfirm = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    confirm: {
      type: Function as PropType<(data: AnswerFormat) => void>,
      required: true,
    },
  },
})

const DialogWithConfirmAndProps = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    confirm: {
      type: Function as PropType<(data: AnswerFormat) => void>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
})

const SimpleDialog = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
})

describe('Type inference tests', () => {
  it('addDialog should infer props correctly', () => {
    const $dialog = useGDialog()

    // Should work without explicit generics
    $dialog.addDialog(SimpleDialog, {
      title: 'test',
    })

    // @ts-expect-error - title is required
    $dialog.addDialog(SimpleDialog, {})

    // @ts-expect-error - unknown prop
    $dialog.addDialog(SimpleDialog, { title: 'test', unknown: 1 })
  })

  it('addDialog should require confirm prop if it exists', () => {
    const $dialog = useGDialog()

    // Should work when confirm is provided
    $dialog.addDialog(DialogWithConfirm, {
      confirm: (data: AnswerFormat) => console.log(data),
    })

    // @ts-expect-error - confirm is required
    $dialog.addDialog(DialogWithConfirm, {})
  })

  it('useDialogConfirm should omit confirm and modelValue', () => {
    // Should work with no props
    const confirm1 = useDialogConfirm(DialogWithConfirm)
    confirm1()

    const confirm2 = useDialogConfirm(DialogWithConfirmAndProps)
    confirm2({ title: 'test' })

    // @ts-expect-error - title is required
    confirm2({})

    // @ts-expect-error - confirm should not be passed
    confirm2({ title: 'test', confirm: () => {} })
  })

  it('useDialogReturnData should infer return type and omit props', () => {
    // Should work with explicit return data type
    const returnData1 = useDialogReturnData<AnswerFormat>(DialogWithConfirm)
    returnData1().then((res) => {
      if (res) {
        // res should be AnswerFormat
        const _check: AnswerFormat = res
      }
    })

    const returnData2 = useDialogReturnData(DialogWithConfirmAndProps)
    returnData2({ title: 'test' })

    // @ts-expect-error - title is required
    returnData2({})

    // @ts-expect-error - confirm should not be passed
    returnData2({ title: 'test', confirm: () => {} })
  })

  it('functional components should also work', () => {
    const $dialog = useGDialog()
    const FunctionalDialog = (props: { title: string, modelValue: boolean }) => props.title

    $dialog.addDialog(FunctionalDialog, {
      title: 'test',
    })

    // @ts-expect-error - title is required
    $dialog.addDialog(FunctionalDialog, {})
  })
})
