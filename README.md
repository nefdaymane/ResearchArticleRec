# ResearchRec Project

Ce projet est divisé en plusieurs composants pour mieux gérer et modulariser le développement. Voici un aperçu des dossiers et leur rôle dans le projet.

## Structure du Projet

- **`reasearch-rec-api`** : Gestion des API avec NestJS. Ce composant agit comme un pont entre l'interface utilisateur et le backend.
- **`research-recommender-app`** : Interface utilisateur développée avec Next.js pour interagir avec le système.
- **`research-rec-model`** : Backend basé sur Flask pour tout ce qui concerne les modèles et la gestion des données.
- **`citeulike-a`** : Dataset utilisé pour les modèles et l'entraînement.
- **`ncf-activelearning.ipynb`** : Notebook Jupyter contenant des expérimentations et des implémentations pour l'apprentissage actif.

---

## Prérequis

Assurez-vous d'avoir installé les outils suivants avant de commencer :
- [Node.js](https://nodejs.org/) (version recommandée : 16.x ou supérieure)
- [Python](https://www.python.org/downloads/) (version 3.8 ou supérieure)
- [Git](https://git-scm.com/)

---

## Installation et Lancement

### 1. API Backend (NestJS) : `reasearch-rec-api`

1. **Naviguez dans le dossier :**
   ```bash
   cd reasearch-rec-api
   ```

2. **Installez les dépendances :**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement :**
   ```bash
   cp .env.example .env
   ```
   Modifiez le fichier `.env` selon vos besoins.

4. **Lancez le serveur en mode développement :**
   ```bash
   npm run start:dev
   ```
   Le serveur sera accessible sur `http://localhost:3000`

### 2. Frontend (Next.js) : `research-recommender-app`

1. **Naviguez dans le dossier :**
   ```bash
   cd research-recommender-app
   ```

2. **Installez les dépendances :**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement :**
   ```bash
   cp .env.example .env.local
   ```
   Modifiez le fichier `.env.local` selon vos besoins.

4. **Lancez l'application en mode développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3001`

### 3. Backend Modèles (Flask) : `research-rec-model`

1. **Naviguez dans le dossier :**
   ```bash
   cd research-rec-model
   ```

2. **Créez un environnement virtuel Python :**
   ```bash
   python -m venv venv
   ```

3. **Activez l'environnement virtuel :**
   - Windows :
     ```bash
     .\venv\Scripts\activate
     ```
   - Unix/MacOS :
     ```bash
     source venv/bin/activate
     ```

4. **Installez les dépendances :**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configurez les variables d'environnement :**
   ```bash
   cp .env.example .env
   ```
   Modifiez le fichier `.env` selon vos besoins.

6. **Fonctionnement model :**

 Ajouter le best_model.keras et interaction_matrix.npz (envoyé dans le drive) dans le dossier model

7. **Lancez le serveur Flask :**
   ```bash
   python app.py
   ```
   Le serveur sera accessible sur `http://localhost:5000`

### 4. Dataset : `citeulike-a`

1. **Naviguez dans le dossier :**
   ```bash
   cd citeulike-a
   ```
### 5. Notebook d'expérimentation : `ncf-activelearning.ipynb`

1. **Assurez-vous que Jupyter est installé :**
   ```bash
   pip install jupyter
   ```

2. **Lancez Jupyter Notebook :**
   ```bash
   jupyter notebook
   ```

3. **Ouvrez le notebook `ncf-activelearning.ipynb`** dans votre navigateur.

---

