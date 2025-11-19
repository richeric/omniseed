import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  type Firestore
} from 'firebase/firestore'

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

let appInstance: FirebaseApp | null = null
let dbInstance: Firestore | null = null

export function initFirebase(config: FirebaseConfig): Firestore {
  if (!getApps().length) {
    appInstance = initializeApp(config)
  }
  if (!dbInstance) {
    dbInstance = getFirestore(appInstance!)
  }
  return dbInstance
}

export interface ImportResult {
  successCount: number
  errorCount: number
  errors: { index: number; error: string }[]
}

export async function importCollectionFromJson(
  db: Firestore,
  collectionName: string,
  items: any[],
  options?: { useProvidedId?: boolean; merge?: boolean }
): Promise<ImportResult> {
  const useProvidedId = options?.useProvidedId ?? true
  const merge = options?.merge ?? false

  let successCount = 0
  let errorCount = 0
  const errors: { index: number; error: string }[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      let ref
      if (useProvidedId && item.id) {
        const { id, ...data } = item
        ref = doc(collection(db, collectionName), id as string)
        await setDoc(ref, normalizeItem(data), { merge })
      } else {
        ref = doc(collection(db, collectionName))
        await setDoc(ref, normalizeItem(item), { merge })
      }
      successCount++
    } catch (err: any) {
      console.error('Erreur sur un document :', err)
      errorCount++
      errors.push({ index: i, error: err?.message ?? String(err) })
    }
  }

  return { successCount, errorCount, errors }
}

// Convertit certains champs (ex: dates ISO) si besoin
function normalizeItem(item: any) {
  const result: any = { ...item }
  // Exemple : convertir les champs se terminant par "At" en Date si c'est une string ISO
  for (const key of Object.keys(result)) {
    const value = result[key]
    if (
      typeof value === 'string' &&
      /At$/.test(key) &&
      !Number.isNaN(Date.parse(value))
    ) {
      result[key] = new Date(value)
    }
  }
  return result
}
