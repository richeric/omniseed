<script setup lang="ts">
const props = defineProps<{
  result: {
    successCount: number
    errorCount: number
    errors: { index: number; error: string }[]
  } | null
}>()
</script>

<template>
  <div class="space-y-2">
    <h2 class="text-lg font-semibold text-slate-50">
      Résultats de l'import
    </h2>

    <div
      v-if="props.result"
      class="rounded-md border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm"
    >
      <p class="text-slate-100">
        Documents importés avec succès :
        <span class="font-semibold text-emerald-400">{{ props.result.successCount }}</span>
      </p>
      <p class="text-slate-100">
        Documents en erreur :
        <span class="font-semibold text-rose-400">{{ props.result.errorCount }}</span>
      </p>

      <div v-if="props.result.errors.length" class="mt-3 space-y-1 max-h-40 overflow-auto text-xs">
        <p class="text-slate-300 font-medium">Détails des erreurs :</p>
        <ul class="space-y-1">
          <li
            v-for="(err, idx) in props.result.errors"
            :key="idx"
            class="text-rose-300/90"
          >
            #{{ err.index }} — {{ err.error }}
          </li>
        </ul>
      </div>
    </div>

    <p v-else class="text-sm text-slate-400">
      Aucune opération d'import effectuée pour l'instant.
    </p>
  </div>
</template>
