
# gitart-manage-vue-dialog

Vue 3 dialog management utilities that let you open and control dialogs **programmatically** — no need to place dialog components in every template. Works with any dialog component that accepts a `modelValue` boolean prop.

## Features

- Open dialogs from anywhere — components, composables, or even Pinia stores
- Full **TypeScript** support with automatic prop inference
- Works with any dialog component (Vuetify, Quasar, custom, etc.) as long as it uses `modelValue` / `update:modelValue`
- Built-in helpers for confirmation dialogs and dialogs that return data
- Lightweight with zero dependencies beyond Vue 3

## Installation

```bash
npm install gitart-manage-vue-dialog
# or
pnpm add gitart-manage-vue-dialog
```

**Peer dependency:** Vue >= 3.2.47

## Quick Start

### 1. Install the plugin

```ts
// main.ts
import { createApp } from 'vue'
import { gitartDialogPlugin } from 'gitart-manage-vue-dialog'
import App from './App.vue'

const app = createApp(App)

app.use(gitartDialogPlugin)
// or with options:
app.use(gitartDialogPlugin, {
  closeDelay: 500, // ms to wait before removing the DOM element after closing (default: 500)
  props: {},       // default props merged into every dialog
})

app.mount('#app')
```

### 2. Place the spawn point

Add `GDialogSpawn` once in your root component (e.g. `App.vue`). This is where dialog components will be rendered.

```vue
<script setup lang="ts">
import { GDialogSpawn } from 'gitart-manage-vue-dialog'
</script>

<template>
  <router-view />
  <GDialogSpawn />
</template>
```

### 3. Open a dialog

```vue
<script setup lang="ts">
import { useGDialog } from 'gitart-manage-vue-dialog'
import MyDialog from './MyDialog.vue'

const $dialog = useGDialog()

function openDialog() {
  $dialog.addDialog(MyDialog, {
    title: 'Hello!',
  })
}
</script>
```

Props are **type-checked** against the component's prop definitions — `modelValue` is automatically managed and omitted from the required props.

## API Reference

Everything below is exported from `gitart-manage-vue-dialog`.

### `gitartDialogPlugin`

Vue plugin that provides the dialog controller to the entire app via `provide` / `inject`.

```ts
app.use(gitartDialogPlugin)
// or
app.use(gitartDialogPlugin, {
  closeDelay: 300,  // delay (ms) between setting modelValue to false and removing the component
  props: {},        // default props merged into every dialog
})
```

---

### `GDialogSpawn`

Renderless component that renders all active dialogs. Place it once near the root of your app.

```vue
<GDialogSpawn />
```

When a dialog's `update:modelValue` event fires, `GDialogSpawn` automatically calls `removeDialog` for that dialog.

---

### `useGDialog()`

Composable that returns the dialog controller (`IGDialog`). Must be called inside a `setup()` function (or another composable).

```ts
const $dialog = useGDialog()
```

#### `$dialog.addDialog(component, props, params?)`

Opens a dialog.

| Parameter | Type | Description |
|---|---|---|
| `component` | Component | The dialog component to render |
| `props` | `Omit<ComponentProps, 'modelValue'>` | Props forwarded to the component (type-inferred, `modelValue` excluded) |
| `params.onRemoveHook` | `() => void` | Optional callback invoked when the dialog is removed |

Returns an `IGDialogItem` containing the `id` of the dialog (useful for manual removal).

```ts
const { id } = $dialog.addDialog(ConfirmDialog, {
  title: 'Are you sure?',
}, {
  onRemoveHook() {
    console.log('Dialog removed')
  },
})
```

#### `$dialog.removeDialog(id, closeDelay?)`

Closes and removes a dialog by id.

| Parameter | Type | Description |
|---|---|---|
| `id` | `number` | The dialog's id (from `addDialog` return value) |
| `closeDelay` | `number` | Override the default close delay (ms) |

```ts
$dialog.removeDialog(id) // uses plugin's default closeDelay
$dialog.removeDialog(id, 0) // remove immediately
```

#### `$dialog.dialogs`

Reactive array of currently active `IGDialogItem` objects.

---

### `useDialogConfirm(component, $dialog?)`

Composable that wraps a "confirm" dialog pattern. The dialog component must accept a `confirm` prop (a callback function). Returns an async function that resolves to `true` if confirmed, or `false` if the dialog was closed without confirming.

**Dialog component requirements:**
- `modelValue: boolean` — controls open/close
- `confirm: () => void` — called when the user confirms

```ts
import { useDialogConfirm } from 'gitart-manage-vue-dialog'
import ConfirmDialog from './ConfirmDialog.vue'

const confirm = useDialogConfirm(ConfirmDialog)

async function handleDelete() {
  const ok = await confirm({ title: 'Delete this item?' })
  if (ok) {
    // user confirmed
  }
}
```

The `confirm` and `modelValue` props are excluded from the required props — you only pass the remaining props.

A second argument `$dialog` can optionally be provided if you're calling outside of `setup()` (e.g. from a Pinia store):

```ts
const confirm = useDialogConfirm(ConfirmDialog, storeDialog)
```

---

### `useDialogReturnData<D>(component, $dialog?)`

Similar to `useDialogConfirm`, but for dialogs that return arbitrary data. The dialog component's `confirm` prop should accept data of type `D`. Returns an async function that resolves to `D` on confirm, or `null` if the dialog was closed without confirming.

**Dialog component requirements:**
- `modelValue: boolean` — controls open/close
- `confirm: (data: D) => void` — called with the return data when confirmed

```ts
import { useDialogReturnData } from 'gitart-manage-vue-dialog'
import SelectColorDialog from './SelectColorDialog.vue'

interface ColorChoice {
  hex: string
  name: string
}

const selectColor = useDialogReturnData<ColorChoice, typeof SelectColorDialog>(
  SelectColorDialog,
)

async function pickColor() {
  const color = await selectColor({ palette: 'material' })
  if (color) {
    // color is ColorChoice
    console.log(color.hex)
  }
  // color is null if the user closed the dialog
}
```

---

### `gitartDialogInjectionKey`

Vue `InjectionKey<IGDialog>` symbol. Use with `inject()` as an alternative to `useGDialog()`.

```ts
import { inject } from 'vue'
import { gitartDialogInjectionKey } from 'gitart-manage-vue-dialog'

const $dialog = inject(gitartDialogInjectionKey)!
```

---

## Types

### `IGDialog`

The dialog controller interface.

```ts
interface IGDialog {
  dialogs: IGDialogItem[]
  addDialog: <T>(component: T, props: Omit<ExtractComponentProps<T>, 'modelValue'>, params?: { onRemoveHook?: () => void }) => IGDialogItem
  removeDialog: (id: number, closeDelay?: number) => void
}
```

### `IGDialogItem`

Represents a single active dialog instance.

```ts
interface IGDialogItem {
  component: ShallowUnwrapRef<any>
  id: number
  props: { modelValue: boolean }
  onRemoveHook?: () => void
}
```

## Writing a Dialog Component

Any component works as long as it has a `modelValue` prop and emits `update:modelValue`. Here's a minimal example:

```vue
<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div v-if="modelValue" class="dialog-overlay">
    <div class="dialog">
      <h2>{{ title }}</h2>
      <button @click="$emit('update:modelValue', false)">Close</button>
    </div>
  </div>
</template>
```

### Confirm dialog

For use with `useDialogConfirm` or `useDialogReturnData`, add a `confirm` prop:

```vue
<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
  confirm: (data: boolean) => void
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div v-if="modelValue" class="dialog-overlay">
    <div class="dialog">
      <h2>{{ title }}</h2>
      <button @click="props.confirm(true)">Yes</button>
      <button @click="$emit('update:modelValue', false)">No</button>
    </div>
  </div>
</template>
```

## Using Outside of `setup()`

Both `useDialogConfirm` and `useDialogReturnData` accept an optional `$dialog` parameter. This allows usage from Pinia stores or other non-component contexts where `inject()` is not available:

```ts
// stores/myStore.ts
import { useDialogConfirm } from 'gitart-manage-vue-dialog'
import type { IGDialog } from 'gitart-manage-vue-dialog'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export function useMyStore($dialog: IGDialog) {
  const confirm = useDialogConfirm(ConfirmDialog, $dialog)

  async function deleteItem(id: string) {
    const ok = await confirm({ title: 'Delete?' })
    if (ok) {
      // proceed
    }
  }

  return { deleteItem }
}
```

## License

MIT
