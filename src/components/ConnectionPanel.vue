<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  modelValue: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket?: string
    messagingSenderId?: string
    appId?: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const localConfig = reactive({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(localConfig, val)
  }
)

watch(
  () => localConfig,
  (val) => {
    emit('update:modelValue', { ...val })
  },
  { deep: true }
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-slate-50">
        Configuration Firebase
      </h2>
      <p class="text-xs text-slate-400 max-w-xs text-right">
        Renseigne ici la configuration de ton projet Firebase (mode client). Utilise de préférence un
        projet de développement.
      </p>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">apiKey</label>
        <input
          v-model="localConfig.apiKey"
          type="text"
          class="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          placeholder="API key"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">authDomain</label>
        <input
          v-model="localConfig.authDomain"
          type="text"
          class="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          placeholder="ex: mon-projet.firebaseapp.com"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">projectId</label>
        <input
          v-model="localConfig.projectId"
          type="text"
          class="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          placeholder="ID du projet Firebase"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">storageBucket (optionnel)</label>
        <input
          v-model="localConfig.storageBucket"
          type="text"
          class="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          placeholder="ex: mon-projet.appspot.com"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">messagingSenderId (optionnel)</label>
        <input
          v-model="localConfig.messagingSenderId"
          type="text"
          class="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          placeholder=""
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">appId (optionnel)</label>
        <input
          v-model="localConfig.appId"
          type="text"
          class="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          placeholder=""
        />
      </div>
    </div>
  </div>
</template>
