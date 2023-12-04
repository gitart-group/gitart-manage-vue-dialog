
# `gitart-manage-vue-dialog`

The dialog utilities allow you to manage dialogs consistently without putting the components in the template. Or even launch dialogs from a store.

Works with any dialog component. The component should have `modelValue` prop that is used to open and close the dialog.

You can import all these properties from the `gitart-manage-vue-dialog` module.

  - `gitartDialogInjectionKey` - vue injection key for the dialog controller
  - `gitartDialogPlugin` - vue plugin. Usage below
  - `DialogSpawn` - component to use with plugin. Usage below
  - `IGDialog` - read the codebase for more information
  - `IGDialogItem` - read the codebase for more information
  - `useDialogConfirm` - read the codebase for more information
  - `useDialogReturnData` - read the codebase for more information
  - `useGDialog` - helper to use the dialog controller. Usage below

### Installation

App.vue
```ts
import { DialogSpawn } from 'gitart-manage-vue-dialog'
```

```html
<DialogSpawn />
```

main.ts
```ts
import { gitartDialogPlugin } from 'gitart-manage-vue-dialog'

app.use(gitartDialogPlugin)
```

### Usage

You can receive the dialog controller by injection or by using the `useGDialog` function.

```ts
  import { gitartDialogInjectionKey } from 'gitart-manage-vue-dialog'

  const $dialog = inject(gitartDialogInjectionKey)!

  const openDialog = () => {
    $dialog.addDialog({
      component: MyDialog,
      props: {
        title: 'My dialog',
      },
    })
  }
 ```

```ts
  import { useGDialog } from 'gitart-manage-vue-dialog'

  const $dialog = useGDialog()

  const openDialog = () => {
    $dialog.addDialog({
      component: MyDialog,
      props: {
        title: 'My dialog',
      },
    })
  }
 ```

 `$dialog` has the following methods and properties:
  - `addDialog` - add a dialog to the queue
  - `dialogs` - list of dialogs
  - `removeDialog` - remove a dialog from the queue
