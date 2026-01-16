# 🎓 Projet Veliseo — Architecture Académique & Refonte Système

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Architecture-336791)
![Status](https://img.shields.io/badge/Status-POC%20Avancé-orange)

---

## 📖 Introduction

**Veliseo** est une plateforme de gestion académique (emplois du temps, scolarité, utilisateurs) développée dans le cadre d’un **travail d’audit technique et de refonte architecturale**.

L’objectif n’était pas uniquement de produire une application fonctionnelle, mais de :
- analyser une base existante (prototype permissif),
- identifier ses failles structurelles,
- proposer une **architecture robuste, cohérente et sécurisée**,
- garantir l’intégrité des données académiques sur le long terme.

---

## 🧠 Philosophie Générale

Le projet repose sur un principe fondamental :

> **L’intégrité des données ne doit jamais dépendre uniquement du frontend.**

Ainsi :
- le **frontend valide**, assiste et guide l’utilisateur,
- le **backend normalise et sécurise**,
- la **base de données garantit** (contraintes SQL fortes).

---

## 🏗 Architecture de la Base de Données (PostgreSQL)

La base repose sur une **architecture relationnelle modulaire**, organisée en **schémas PostgreSQL** afin de séparer clairement les responsabilités.

### 🔹 1. Séparation en Schémas (Couches Logiques)

#### Schéma `sys` — Système & Administration
Couche **maître** contenant les données sensibles et structurelles :
- Identité (`user`)
- Spécialisations (`prof`, `eling`)
- Authentification (`account`, `session`)
- Ressources humaines et logistique (`salle`, départements)

➡️ **Ce schéma est volontairement verrouillé** et ne peut être modifié que par un rôle administrateur dédié.

#### Schéma `scol` — Scolarité & Pédagogie
Couche **métier** contenant :
- Organisation pédagogique (UE, séquences, leçons)
- Évaluations (évaluations, notes)
- Suivi des absences et du planning

➡️ Ce schéma **dépend** de `sys` via des clés étrangères, mais l’inverse est interdit.

---

### 🔹 2. Modélisation des Utilisateurs (Héritage Relationnel)

Le modèle utilisateur repose sur un **héritage pseudo-physique** :

- `sys.user` : données communes (identité, contact, statut)
- `sys.prof` : extension RH (contrat, département)
- `sys.eling` : extension scolaire (formation, promotion, tuteur)

Chaque spécialisation partage le **même UUID** que l’utilisateur parent.

✅ Avantages :
- Pas de duplication
- Intégrité forte
- Modèle fidèle à la réalité métier

⚠️ Contrainte assumée :
- Un utilisateur ne peut pas être simultanément `prof` et `eling` sans refonte explicite (choix volontaire).

---

### 🔹 3. Contraintes & Intégrité des Données

La base applique une politique de **Strong Consistency**.

#### 🛡 Contraintes SQL (Regex)
Les données sont validées **avant insertion** :
- Noms / Prénoms : capitalisation stricte, accents gérés
- Téléphones : format international E.164
- Emails institutionnels :
  - Professeurs → `@eseo.fr`
  - Élèves → `@reseau.eseo.fr`
- Groupes, salles, promotions : formats normés

➡️ La base refuse toute donnée incohérente, même en cas d’erreur applicative.

#### 🔑 Intégrité Référentielle
- UUID générés via `gen_random_uuid()`
- Clés étrangères inter-schémas avec `GRANT REFERENCES`
- Aucune relation circulaire

#### 🚦 Types ENUM
Les états métier (rôles, semestres, types de salle) sont sécurisés par des types énumérés PostgreSQL afin d’empêcher toute valeur invalide.

---

### 🔹 4. Sécurité & Rôles PostgreSQL

Deux rôles principaux :
- `adminsys` : propriétaire du schéma `sys`
- `adminscol` : propriétaire du schéma `scol`, avec droits limités sur `sys`

➡️ Le schéma pédagogique ne peut **ni modifier ni créer** d’utilisateurs système.

---

## 📝 Module d’Inscription Avancé (Frontend)

Le formulaire d’inscription n’est pas une simple saisie, mais un **contrôleur d’intégrité précoce**.

### Validation Isomorphe (Zod + React-Hook-Form)
- Les contraintes SQL sont **reproduites côté client**
- Feedback immédiat à l’utilisateur
- Réduction drastique des erreurs serveur

### Interface Dynamique
Le formulaire s’adapte selon le rôle :
- **Vacataire** → tarif, type de contrat
- **Élève (ELING)** → formation, année, niveau
- Calcul automatique de la promotion

### UX Avancée
- Masque téléphone avec gestion du curseur
- Autocomplétion d’adresse via API interne
- Données normalisées dès la saisie

---

## 🔐 Logique Serveur (Server Actions)

Le fichier `register_actions.ts` agit comme un **sas de sécurité** entre le frontend et la base.

### Normalisation
- Capitalisation intelligente des prénoms
- Suppression des accents pour les identifiants
- Génération déterministe des emails institutionnels

### Gestion de l’Unicité
- Boucles de retry contrôlées (`SELECT 1`)
- Ajout automatique de suffixes numériques en cas d’homonymie

### Transactions SQL
Toutes les inscriptions critiques sont encapsulées dans :


➡️ Aucun état intermédiaire incohérent n’est possible.

---

## 📅 Module Planning Interactif

- Interface type Google Calendar (`react-big-calendar`)
- Drag & Drop sécurisé
- Code couleur par type de cours
- Modales contextuelles

### Sécurité Temporelle
Les conflits sont détectés **côté serveur** via :


➡️ Impossible de planifier deux cours dans la même salle au même moment.

---

## 🔒 Gestion des Permissions (RBAC)

Configuration via `Better-Auth` :
- Rôles distincts (`USER`, `ADMIN`)
- Permissions par ressource et par action
- Exemple :
  - `update:own` autorisé
  - `update:any` réservé aux administrateurs

---

## 🧪 De l’Audit à la Refonte

| Domaine | Prototype | Veliseo |
|------|---------|--------|
| Typage | `any` | TypeScript strict |
| Données | Faiblement contraintes | Contraintes SQL fortes |
| Sécurité | Inserts directs | Transactions |
| Groupes | Chaînes concaténées | Relations N–N |
| Planning | Non sécurisé | Détection mathématique |

---

## 🛠 Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Base** : PostgreSQL
- **Validation** : Zod, React-Hook-Form
- **Planning** : react-big-calendar

---

## 👥 Auteurs

Projet réalisé dans le cadre du cursus ingénieur.

- **Sabri Messaoudi** — Architecture Backend, Base de Données & Sécurité  
- **Chrisphen Ringuet** — Frontend, UX & Module Planning

---
