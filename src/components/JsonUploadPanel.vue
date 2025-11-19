<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label?: string
}>()

const emit = defineEmits<{
  (e: 'loaded', value: any[]): void
}>()

const fileName = ref<string | null>(null)
const itemCount = ref<number | null>(null)
const error = ref<string | null>(null)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  fileName.value = file.name
  error.value = null

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const raw = reader.result as string
      const json = JSON.parse(raw)
      if (!Array.isArray(json)) {
        throw new Error('Le fichier JSON doit contenir un tableau (array).')
      }
      itemCount.value = json.length
      emit('loaded', json)
    } catch (err: any) {
      error.value = err?.message ?? 'Erreur lors de la lecture du fichier.'
      itemCount.value = null
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-50">
          {{ props.label ?? 'Fichier JSON' }}
        </h2>
        <p class="text-xs text-slate-400">
          Le fichier doit contenir un tableau JSON de documents à importer.
        </p>
      </div>
    </div>

    <label
      class="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-slate-600 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 hover:border-emerald-500/70 hover:bg-slate-900/70"
    >
      <div class="flex flex-col">
        <span class="font-medium">
          {{ fileName || 'Choisir un fichier JSON…' }}
        </span>
        <span class="text-xs text-slate-400" v-if="itemCount !== null">
          {{ itemCount }} éléments chargés
        </span>
      </div>
      <span
        class="rounded-md border border-slate-500 bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100"
      >
        Parcourir
      </span>
      <input
        type="file"
        accept="application/json"
        class="hidden"
        @change="onFileChange"
      />
    </label>

    <p v-if="error" class="text-xs text-red-400">
      {{ error }}
    </p>
  </div>
</template>
