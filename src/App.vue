<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ConnectionPanel from './components/ConnectionPanel.vue'
import JsonUploadPanel from './components/JsonUploadPanel.vue'
import ImportConsole from './components/ImportConsole.vue'
import { initFirebase, importCollectionFromJson, type FirebaseConfig, type ImportResult } from './drivers/firebaseDriver'

type Provider = 'firebase'

const provider = ref<Provider>('firebase')

const firebaseConfig = ref<FirebaseConfig>({
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
})

const collectionName = ref('posts')
const useProvidedId = ref(true)
const mergeDocuments = ref(false)
const dryRun = ref(false)

const items = ref<any[] | null>(null)
const importResult = ref<ImportResult | null>(null)
const isImporting = ref(false)

const canImport = computed(
  () =>
    !!items.value &&
    Array.isArray(items.value) &&
    items.value.length > 0 &&
    !!firebaseConfig.value.apiKey &&
    !!firebaseConfig.value.authDomain &&
    !!firebaseConfig.value.projectId &&
    !!collectionName.value
)

function handleJsonLoaded(data: any[]) {
  items.value = data
  importResult.value = null
}

async function runImport() {
  if (!canImport.value || !items.value) return

  isImporting.value = true
  importResult.value = null

  try {
    if (provider.value === 'firebase') {
      const db = initFirebase(firebaseConfig.value)

      if (dryRun.value) {
        // On ne fait que simuler : compter les éléments
        importResult.value = {
          successCount: items.value.length,
          errorCount: 0,
          errors: [],
        }
      } else {
        importResult.value = await importCollectionFromJson(
          db,
          collectionName.value,
          items.value,
          {
            useProvidedId: useProvidedId.value,
            merge: mergeDocuments.value,
          }
        )
      }
    }
  } catch (err: any) {
    importResult.value = {
      successCount: 0,
      errorCount: 1,
      errors: [
        { index: -1, error: err?.message ?? 'Erreur inattendue lors de l\'import.' },
      ],
    }
  } finally {
    isImporting.value = false
  }
}

// Persist config Firebase dans localStorage (facultatif)
const STORAGE_KEY = 'efluwa-seeds-firebase-config'

// Charger au démarrage
if (typeof window !== 'undefined') {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      firebaseConfig.value = { ...firebaseConfig.value, ...parsed }
    } catch {
      // ignore
    }
  }
}

watch(
  firebaseConfig,
  (val) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <!-- Header -->
      <header class="flex flex-col gap-2 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Efluwa Seeds
          </h1>
          <p class="mt-1 text-sm text-slate-400 max-w-xl">
            Importe rapidement des fichiers JSON dans Firestore (Firebase) pour prototyper et tester tes interfaces
            sans passer par la console.
          </p>
        </div>

        <div class="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
          <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
            Beta
          </span>
          <span class="text-[11px] text-slate-400">Provider :</span>
          <span class="font-medium text-slate-100">Firebase</span>
        </div>
      </header>

      <!-- Main layout -->
      <main class="grid gap-6 md:grid-cols-3">
        <!-- Colonne gauche : connexion + options -->
        <section class="space-y-6 md:col-span-1">
          <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
            <ConnectionPanel v-model="firebaseConfig" />

            <div class="mt-4 space-y-3">
              <div class="space-y-1">
                <label class="text-xs font-medium text-slate-300">Nom de la collection</label>
                <input
                  v-model="collectionName"
                  type="text"
                  class="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                  placeholder="ex: posts, categories, authors"
                />
              </div>

              <div class="flex flex-wrap gap-3 text-xs text-slate-300">
                <label class="inline-flex items-center gap-2">
                  <input
                    v-model="useProvidedId"
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  Utiliser le champ <span class="font-mono text-[11px] text-emerald-300">id</span> du JSON comme ID
                </label>

                <label class="inline-flex items-center gap-2">
                  <input
                    v-model="mergeDocuments"
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  Fusionner avec les documents existants (merge)
                </label>

                <label class="inline-flex items-center gap-2">
                  <input
                    v-model="dryRun"
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  Mode simulation (dry run)
                </label>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Conseils d'utilisation
            </h3>
            <ul class="space-y-1 list-disc list-inside">
              <li>Utilise un projet Firebase de développement pour commencer.</li>
              <li>Le fichier JSON doit contenir un tableau d'objets (array).</li>
              <li>Si la clé <span class="font-mono text-[11px] text-emerald-300">id</span> est présente, elle sera utilisée comme ID du document.</li>
              <li>Les champs se terminant par <span class="font-mono text-[11px]">At</span> et contenant une date ISO seront convertis en <span class="font-mono text-[11px]">Date</span>.</li>
            </ul>
          </div>
        </section>

        <!-- Colonne droite : upload + résultats -->
        <section class="space-y-6 md:col-span-2">
          <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
            <JsonUploadPanel label="Fichier JSON de la collection" @loaded="handleJsonLoaded" />

            <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div class="text-xs text-slate-400">
                <p v-if="items && items.length">
                  <span class="font-semibold text-slate-100">{{ items.length }}</span>
                  éléments prêts à être importés dans
                  <span class="font-mono text-[11px] text-emerald-300">{{ collectionName }}</span>.
                </p>
                <p v-else>
                  Aucun élément chargé pour l'instant.
                </p>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40 disabled:text-emerald-900"
                :disabled="!canImport || isImporting"
                @click="runImport"
              >
                <span v-if="isImporting" class="h-3 w-3 animate-spin rounded-full border-2 border-emerald-900 border-t-transparent" />
                <span>{{ isImporting ? 'Import en cours…' : dryRun ? 'Simuler l\'import' : 'Lancer l\'import' }}</span>
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <ImportConsole :result="importResult" />
          </div>
        </section>
      </main>

      <footer class="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-500 flex items-center justify-between">
        <p>Omni Seed · Prototype Firebase</p>
        <p class="text-[11px]">
          Pensé pour accélérer le prototypage des projets web · Open source friendly
        </p>
      </footer>
    </div>
  </div>
</template>
