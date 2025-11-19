# 📦 **Omni Seed**
*Import JSON → Firebase Firestore en un clic.*  
*MVP – v0.1.0*

Omni Seed est un outil open-source conçu pour permettre aux développeurs de **charger rapidement des données JSON dans Firebase Firestore** (et prochainement Supabase, Directus, Strapi, Bases de données SQL et NoSQL...), sans passer par la console Firebase, sans scripts, sans backend.

Il offre une interface simple pour :

- charger un fichier JSON contenant vos données,  
- prévisualiser le contenu,  
- importer dans une collection Firestore,  
- fusionner ou remplacer les documents existants,  
- simuler l’import (dry run),  
- accélérer le prototypage visuel et la création d’interfaces dynamiques.

Idéal pour tous les projets qui nécessitent de **tester rapidement du contenu dynamique**, notamment les blogs, FAQ, listes d’articles, ressources, etc.

---

## 🚀 **Fonctionnalités**

- ✔ Import JSON → Firestore (Firebase Web SDK)
- ✔ Interface simple et ergonomique (Vue 3 + TailwindCSS)
- ✔ Lecture de fichiers JSON (array)
- ✔ Import avec IDs personnalisés
- ✔ Merge / overwrite
- ✔ Conversion automatique des dates `xxxAt`
- ✔ Mode **Dry Run** (simulation sans écrire)
- ✔ Sauvegarde locale de la configuration Firebase
- ✔ Zéro backend → tourne entièrement dans le navigateur

---

## 🛠 **Stack**

- **Vue 3 + Composition API**
- **Vite**
- **TypeScript**
- **TailwindCSS**
- **Firebase JS SDK (Firestore)**

---

# 📥 **Installation**

Clone ce repo :

```bash
git clone https://github.com/richeric/omniseed.git
cd omniseed
```

Installe les dépendances :

```bash
pnpm install
# ou
npm install
```

Lance l'application en développement :

```bash
pnpm run dev
```

Ouvre ensuite :  
👉 **http://localhost:5173**

---

# ⚙️ **Configuration Firebase**

Tu dois récupérer la configuration Web de ton projet Firebase :

Firebase Console → **Paramètres du projet** → **Configuration SDK Web**

Copie les champs suivants :

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}
```

Colle-les dans l’interface sous **Configuration Firebase**.

---

# 📤 **Comment utiliser Omni Seed**

### 1️⃣ Choisis ton provider  
👉 Pour l’instant : **Firebase Firestore**

### 2️⃣ Renseigne la configuration Firebase dans l’interface

### 3️⃣ Tape le nom de la collection  
Exemples :
- `posts`
- `categories`
- `authors`
- `etc.`

### 4️⃣ Charge ton fichier JSON  
Le fichier doit contenir un **tableau d’objets**, par exemple :

```json
[
  {
    "id": "article-1",
    "title": "Mon premier article",
    "publishedAt": "2025-01-10T09:00:00.000Z"
  }
]
```

### 5️⃣ Paramétrage optionnel
- Utiliser le champ `id` comme ID Firestore  
- Fusionner les documents existants  
- Mode Dry Run

### 6️⃣ Clique sur **Lancer l’import**

---


# 🤝 **Contribuer**

Les contributions sont les bienvenues !  
Que tu veuilles :

- ajouter un driver (Supabase, Directus, MongoDB…),
- améliorer l’UI,
- optimiser le code,
- corriger un bug,
- proposer un exemple JSON,

…ouvre une **issue** ou une **pull request**.

---

# 🧭 **Feuille de route**

- 🔜 Driver Supabase  
- 🔜 Drivers externes (Directus, Strapi…)  
- 🔜 Mapping JSON → Firestore  
- 🔜 Import multiple  
- 🔜 Export Firestore → JSON  
- 🔜 Version desktop (Tauri)

---

# ⭐ **Support**

Si l’outil t’aide, laisse une ⭐ sur GitHub pour soutenir le projet.
