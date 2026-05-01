# Répartition des Tâches — Clinique Dentaire
**Deadline:** 24 mai 2026 | **Équipe:** 2 membres | **Stack:** Laravel 11 + React

---

## Membres

| | Rôle |
|---|---|
| **Membre A** | Backend — Laravel, BDD, API REST |
| **Membre B** | Frontend — React, UI, intégration API |

---

## Semaine 1 — Setup (21–27 avril)

### Membre A — Backend
- [ ] Initialiser projet Laravel 11 dans `/backend`
- [ ] Configurer `.env` : MySQL, Sanctum, Mailtrap, APP_URL
- [ ] Écrire **toutes** les migrations dans l'ordre :
  - `users` (id, email, password, role ENUM: PATIENT/SECRETAIRE/DENTISTE, statut, created_at, last_login)
  - `patients` (id FK→users, nom_complet, telephone, adresse, date_naissance, sexe, antecedents_medicaux, allergies, contact_urgence)
  - `secretaires` (id FK→users, nom_complet, numero_employe, date_embauche)
  - `dentistes` (id FK→users, nom_complet, numero_licence, specialite, heures_travail)
  - `medicaments` (id, nom, description, forme, dosage, prix_unitaire)
  - `operations_dentaires_catalogue` (id, nom, description, cout) ← tarifs modifiables par secrétaire
  - `rendez_vous` (id, patient_id, dentiste_id, date_heure, duree, raison, statut ENUM: EN_ATTENTE/CONFIRMÉ/ANNULÉ/COMPLÉTÉ, notes, secretaire_id, confirme_le)
  - `visites` (id, rendez_vous_id, patient_id, dentiste_id, date_visite, diagnostic, traitement_fourni, notes, statut ENUM: EN_COURS/COMPLÉTÉ)
  - `visites_operations` (id, visite_id, operation_id, cout_applique) ← snapshot du coût au moment de la visite
  - `ordonnances` (id, visite_id, patient_id, dentiste_id, date_delivrance, instructions_generales, statut ENUM: ACTIF/COMPLÉTÉ/ANNULÉ)
  - `ordonnance_medicaments` (id, ordonnance_id, medicament_id, frequence, duree_jours, instructions_speciales)
  - `factures` (id, numero_facture unique, visite_id, patient_id, frais_base, frais_operations, montant_total, statut ENUM: EN_ATTENTE/PAYÉE/ANNULÉE, date_paiement)
  - `paiements` (id, facture_id, montant_recu, date_paiement, methode ENUM: ESPECES, numero_recu, secretaire_id)
  - `audit` (id, utilisateur_id, action ENUM: CREATE/UPDATE/DELETE, table_affectee, enregistrement_id, ancienne_valeur JSON, nouvelle_valeur JSON, timestamp, ip)
- [ ] Configurer CORS middleware (autoriser `http://localhost:3000`)
- [ ] Push branche `backend/setup`

### Membre B — Frontend
- [ ] Nettoyer projet React existant (supprimer fichiers CRA inutiles dans `/src`)
- [ ] Installer dépendances :
  ```
  npm install axios react-router-dom react-datepicker jspdf react-toastify
  ```
- [ ] Créer structure dossiers :
  ```
  src/
  ├── pages/
  │   ├── auth/
  │   ├── patient/
  │   ├── secretaire/
  │   └── dentiste/
  ├── components/      (layout, shared UI)
  ├── services/        (authService.js, appointmentService.js, …)
  ├── context/         (AuthContext.js)
  └── api.js           (axios instance + intercepteurs)
  ```
- [ ] Créer `api.js` : base URL `http://localhost:8000/api`, intercepteur Authorization header Bearer token
- [ ] Push branche `frontend/setup`

### Partagé
- [ ] Créer repo GitHub, branches : `main`, `backend`, `frontend`
- [ ] Confirmer format token Sanctum entre les deux membres

---

## Semaine 2 — Backend + Auth Frontend (28 avril – 4 mai)

### Membre A — Backend

**Modèles & Relations**
- [ ] Modèles Eloquent avec relations :
  - `User` hasOne Patient/Secretaire/Dentiste selon rôle
  - `Patient` hasMany Rendez_vous, Visites, Ordonnances, Factures
  - `Visite` hasMany Visites_Operations, hasOne Ordonnance, hasOne Facture
  - `Ordonnance` hasMany Ordonnance_Medicaments

**Seeders**
- [ ] 1 dentiste (email: `dentiste@clinic.ma`, pass: `password`)
- [ ] 1 secrétaire (email: `secretaire@clinic.ma`, pass: `password`)
- [ ] 10 médicaments (Amoxicilline, Ibuprofène, Paracétamol…)
- [ ] Catalogue opérations : Détartrage 150 MAD, Remplissage 300 MAD, Dévitalisation 400 MAD, Extraction 250 MAD, Blanchiment 500 MAD

**Auth API** (Sanctum)
- [ ] `POST /api/auth/register` → créer User (rôle=PATIENT) + Patient, retourner token
- [ ] `POST /api/auth/login` → retourner token + user (id, nom, role)
- [ ] `POST /api/auth/logout` → révoquer token
- [ ] `GET /api/auth/profile` → retourner user + données profil selon rôle
- [ ] Middleware `CheckRole` : `role:patient`, `role:secretaire`, `role:dentiste`

**API Patients**
- [ ] `GET /api/patients/{id}` → profil complet (avec antecedents, allergies, contact_urgence)
- [ ] `PUT /api/patients/{id}` → modifier profil (patient modifie son propre profil uniquement)
- [ ] `GET /api/patients/{id}/history` → toutes visites + ordonnances + factures du patient
- [ ] `GET /api/patients` → liste tous patients (secrétaire + dentiste uniquement)

**API Rendez-vous**
- [ ] `POST /api/rendez-vous` → créer, statut=EN_ATTENTE (patient)
- [ ] `GET /api/rendez-vous` → liste selon rôle (patient = les siens, secrétaire = tous, dentiste = confirmés)
- [ ] `GET /api/rendez-vous/{id}` → détails
- [ ] `DELETE /api/rendez-vous/{id}` → annuler si EN_ATTENTE (patient seulement)
- [ ] `PUT /api/rendez-vous/{id}/confirm` → statut=CONFIRMÉ + envoyer email (secrétaire)
- [ ] `PUT /api/rendez-vous/{id}/reject` → statut=ANNULÉ + raison + envoyer email (secrétaire)
- [ ] `GET /api/rendez-vous/available-slots?date=YYYY-MM-DD` → créneaux libres
- [ ] `GET /api/dentiste/schedule` → RDV confirmés du jour (dentiste)

**API Visites**
- [ ] `POST /api/visites` → créer visite depuis RDV confirmé :
  - Enregistrer diagnostic, traitement, notes
  - Enregistrer opérations choisies dans `visites_operations` (snapshot du coût)
  - Auto-créer `Facture` : frais_base=200 MAD + sum(operations.cout_applique), statut=EN_ATTENTE
  - Passer statut RDV → COMPLÉTÉ
- [ ] `GET /api/visites/{id}` → détails (avec opérations, ordonnance, facture)
- [ ] `GET /api/patient/{id}/visites` → historique patient
- [ ] `GET /api/dentiste/visites/today` → visites du jour

**API Opérations (catalogue)**
- [ ] `GET /api/operations` → liste catalogue (accessible à tous connectés)
- [ ] `PUT /api/operations/{id}` → modifier tarif (secrétaire uniquement)

**API Médicaments**
- [ ] `GET /api/medicaments` → liste (dentiste + secrétaire)
- [ ] `POST /api/medicaments` → ajouter (secrétaire)
- [ ] `PUT /api/medicaments/{id}` → modifier (secrétaire)
- [ ] `DELETE /api/medicaments/{id}` → supprimer (secrétaire)

**API Ordonnances**
- [ ] `POST /api/ordonnances` → créer liée à visite_id, avec tableau médicaments [{id, frequence, duree_jours, instructions}]
- [ ] `GET /api/ordonnances/{id}` → détails avec médicaments
- [ ] `GET /api/patient/{id}/ordonnances` → liste + filtre statut (ACTIF/COMPLÉTÉ/ANNULÉ)

**API Factures**
- [ ] `GET /api/factures/{id}` → détails
- [ ] `GET /api/patient/{id}/factures` → liste patient
- [ ] `GET /api/factures` → liste toutes (secrétaire)
- [ ] `POST /api/factures/{id}/payment` → créer enregistrement `Paiement` + passer facture → PAYÉE + envoyer email reçu (secrétaire)
- [ ] `GET /api/admin/factures/report` → total revenus, payées vs en attente (secrétaire)

- [ ] Tester **tous** les endpoints Postman, exporter collection → `docs/api-collection.json`

### Membre B — Frontend

**Auth**
- [ ] `AuthContext.js` : stocker `{token, user: {id, nom, role}}` dans localStorage
- [ ] `authService.js` : fonctions register, login, logout appelant `api.js`
- [ ] Page `Login` : formulaire email + mot de passe, gestion erreur "identifiants incorrects"
- [ ] Page `Register` : formulaire complet (nom_complet, email, password, telephone, adresse, date_naissance, sexe)
- [ ] `ProtectedRoute` : rediriger vers `/login` si pas de token
- [ ] Redirection post-login selon rôle :
  - PATIENT → `/patient/dashboard`
  - SECRETAIRE → `/secretaire/dashboard`
  - DENTISTE → `/dentiste/dashboard`
- [ ] Composant `Navbar` avec bouton Déconnexion

---

## Semaine 3 — Frontend Pages (5–11 mai)

### Membre B — Pages Patient

- [ ] **`PatientDashboard`** (`/patient/dashboard`)
  - Prochain RDV confirmé (date, heure, dentiste)
  - Actions en attente : factures EN_ATTENTE, ordonnances ACTIF non consultées
  - Raccourcis : Réserver / Mon Profil / Mes Visites / Mes Ordonnances / Mes Factures

- [ ] **`BookAppointment`** (`/patient/reserver`)
  - Calendrier react-datepicker → `GET /api/rendez-vous/available-slots?date=`
  - Afficher créneaux libres, sélectionner un créneau
  - Champ notes (optionnel)
  - Soumettre → `POST /api/rendez-vous` → toast "En attente de confirmation"

- [ ] **`MyAppointments`** (`/patient/rendez-vous`)
  - Liste tous RDV avec badge statut (EN_ATTENTE / CONFIRMÉ / ANNULÉ / COMPLÉTÉ)
  - Bouton Annuler uniquement si statut=EN_ATTENTE → `DELETE /api/rendez-vous/{id}`

- [ ] **`MyVisits`** (`/patient/visites`)
  - Liste visites triées par date décroissante
  - Filtre par plage de dates
  - Cliquer → ouvrir `VisitDetail`

- [ ] **`VisitDetail`** (`/patient/visites/{id}`)
  - Diagnostic, traitement fourni, notes
  - Opérations effectuées avec coûts
  - Ordonnance liée (si existante) → lien vers téléchargement PDF
  - Facture liée → montant, statut paiement

- [ ] **`MyPrescriptions`** (`/patient/ordonnances`)
  - Liste ordonnances avec filtre statut : ACTIF / COMPLÉTÉ / ANNULÉ
  - Bouton "Télécharger PDF" → générer avec jsPDF :
    - Nom patient, date, dentiste
    - Tableau médicaments : nom, description, fréquence, durée
    - Instructions générales

- [ ] **`MyInvoices`** (`/patient/factures`)
  - Liste factures avec statut EN_ATTENTE / PAYÉE
  - Bouton "Télécharger PDF" → générer avec jsPDF :
    - Numéro facture, date, dentiste, patient
    - Frais de base + opérations détaillées + total
    - Statut paiement

- [ ] **`MyProfile`** (`/patient/profil`)
  - Afficher et modifier : nom_complet, telephone, adresse, date_naissance, sexe
  - Champs médicaux : antecedents_medicaux, allergies, contact_urgence
  - Formulaire changement de mot de passe (ancien + nouveau)

---

### Membre B — Pages Secrétaire

- [ ] **`SecretaireDashboard`** (`/secretaire/dashboard`)
  - Compteur RDV en attente
  - Compteur factures en attente
  - Liens rapides vers les sections

- [ ] **`ManageAppointments`** (`/secretaire/rendez-vous`)
  - Tableau tous RDV avec filtre statut
  - Pour chaque RDV EN_ATTENTE :
    - Bouton **Confirmer** → `PUT /api/rendez-vous/{id}/confirm` → email envoyé au patient
    - Bouton **Rejeter** → modal "Raison du rejet" → `PUT /api/rendez-vous/{id}/reject` → email envoyé

- [ ] **`ManagePayments`** (`/secretaire/paiements`)
  - Tableau factures EN_ATTENTE avec nom patient, montant total, date visite
  - Bouton **Marquer PAYÉE** → `POST /api/factures/{id}/payment` → toast + email reçu

- [ ] **`ManageMedications`** (`/secretaire/medicaments`)
  - Liste médicaments + boutons Ajouter / Modifier / Supprimer
  - Modal formulaire : nom, description, forme, dosage, prix_unitaire

- [ ] **`ManageOperations`** (`/secretaire/operations`)
  - Liste catalogue opérations : nom, description, coût actuel
  - Bouton **Modifier tarif** → inline edit → `PUT /api/operations/{id}`

- [ ] **`PatientsList`** (`/secretaire/patients`)
  - Liste tous patients (lecture seule) : nom, téléphone, date_naissance
  - Cliquer → voir historique rendez-vous du patient

---

### Membre B — Pages Dentiste

- [ ] **`DentisteDashboard`** (`/dentiste/dashboard`)
  - Agenda du jour : liste RDV CONFIRMÉS uniquement (`GET /api/dentiste/schedule`)
  - Afficher : heure, nom patient, téléphone, notes de réservation
  - Bouton **Enregistrer visite** par RDV

- [ ] **`RecordVisit`** (`/dentiste/visite/enregistrer/{rdv_id}`)
  - Champs : diagnostic (textarea), traitement_fourni (textarea), notes (textarea)
  - Section **Opérations effectuées** :
    - Liste déroulante depuis `GET /api/operations`
    - Ajouter plusieurs opérations, afficher coût unitaire
    - Afficher total calculé en temps réel : 200 MAD (base) + sum(opérations)
  - Bouton **Marquer comme COMPLÉTÉ** → `POST /api/visites`
    - Crée visite + visites_operations + facture auto
  - Après succès → proposer **Émettre une ordonnance** (optionnel)

- [ ] **`IssuePrescription`** (`/dentiste/ordonnance/nouvelle/{visite_id}`)
  - Multi-select médicaments depuis `GET /api/medicaments`
  - Pour chaque médicament sélectionné : fréquence (ex: "2 fois par jour"), durée_jours
  - Instructions générales (textarea)
  - Bouton **Enregistrer ordonnance** → `POST /api/ordonnances`, statut=ACTIF

- [ ] **`PatientHistory`** (`/dentiste/patient/{id}/historique`)
  - Profil patient : nom, antécédents, allergies
  - Liste toutes visites passées avec diagnostic + traitements
  - Liste ordonnances précédentes

---

### Membre A — Backend (semaine 3)

- [ ] Emails Mailtrap (Laravel Notifications) :
  - **Confirmation RDV** : envoyé au patient quand secrétaire confirme (nom, date, heure)
  - **Rejet RDV** : envoyé au patient quand secrétaire rejette (raison incluse)
  - **Reçu paiement** : envoyé au patient quand secrétaire marque PAYÉE (numéro facture, montant, date)
- [ ] Logger dans table `audit` : chaque CREATE/UPDATE/DELETE sur rendez_vous, visites, ordonnances, factures
- [ ] `GET /api/factures/{id}/pdf` → retourner données formatées pour génération PDF
- [ ] `GET /api/ordonnances/{id}/pdf` → retourner données formatées pour génération PDF

---

## Semaine 4 — Intégration & Tests (12–18 mai)

### Membre A — Backend
- [ ] Corriger tous les bugs remontés par Membre B
- [ ] Tests de sécurité rôles :
  - Patient ne peut pas accéder aux routes secrétaire/dentiste
  - Patient ne voit que ses propres données (rendez-vous, visites, factures)
  - Dentiste ne peut pas confirmer paiement
  - Secrétaire ne peut pas créer ordonnance
- [ ] Vérifier rejet token invalide/expiré (401)
- [ ] Optimiser requêtes N+1 avec `with()` (eager loading)
- [ ] Exporter schéma final → `database/schema.sql`
- [ ] Vérifier calcul auto facture : frais_base + sum(visites_operations.cout_applique) = montant_total

### Membre B — Frontend
- [ ] Remplacer tous les mocks/données statiques par vrais appels API
- [ ] Gestion erreurs globale : intercepteur axios → toast erreur si 401/403/422/500
- [ ] Tester flux complet end-to-end :
  1. Inscription patient → connexion
  2. Réserver RDV → secrétaire confirme → email reçu
  3. Dentiste enregistre visite + opérations → facture auto-créée
  4. Dentiste émet ordonnance
  5. Patient télécharge facture PDF + ordonnance PDF
  6. Secrétaire marque PAYÉE → email reçu
- [ ] Responsive : tester sur mobile 375px + tablette 768px
- [ ] Multi-navigateurs : Chrome, Firefox, Edge

### Partagé
- [ ] Session test croisé : A teste toutes les pages, B teste tous les endpoints Postman
- [ ] Vérifier comptes démo fonctionnels :
  - `patient@test.ma` / `password` (avec historique de données)
  - `secretaire@clinic.ma` / `password`
  - `dentiste@clinic.ma` / `password`

---

## Semaine 5 — Documentation & Soumission (19–24 mai)

### Membre A — Backend
- [ ] Finaliser `database/schema.sql` avec données exemple (seeders inclus)
- [ ] Écrire section backend `README.md` :
  - Prérequis (PHP 8.2, Composer, MySQL)
  - Installation : `composer install`, `.env`, `migrate`, `db:seed`
  - Lancer : `php artisan serve`
- [ ] Mettre à jour collection Postman → `docs/api-collection.json`
- [ ] Nettoyage code : supprimer `dd()`, `var_dump()`, logs de debug
- [ ] Push propre sur `main`

### Membre B — Frontend
- [ ] Écrire section frontend `README.md` :
  - Prérequis (Node.js 18+, npm)
  - Installation : `npm install`
  - Lancer : `npm start`
  - Variables d'env : `REACT_APP_API_URL`
- [ ] Enregistrer vidéo démo (≤5 min) couvrant :
  - Inscription patient + connexion immédiate
  - Réservation RDV → confirmation secrétaire
  - Enregistrement visite dentiste + opérations
  - Émission ordonnance
  - Génération facture + paiement secrétaire
  - Téléchargement PDF ordonnance + facture
  - Accès basé sur les rôles (3 dashboards différents)
- [ ] Nettoyage code : supprimer `console.log`, commentaires inutiles
- [ ] Push propre sur `main`

### Partagé
- [ ] Merger `backend` + `frontend` → `main`
- [ ] Relecture `README.md` final (noms membres, features, install)
- [ ] **Soumettre avant le 24 mai 2026**

---

## Matrice de couverture — DENTAL_CLINIC.md vs TASKS.md

| Fonctionnalité spec | Backend A | Frontend B |
|---|---|---|
| Auth register/login/logout (Sanctum) | ✅ S2 | ✅ S2 |
| Profil patient (allergies, antécédents, contact urgence) | ✅ S2 | ✅ S3 |
| Réservation RDV + créneaux disponibles | ✅ S2 | ✅ S3 |
| Confirmation/rejet RDV secrétaire + emails | ✅ S2+S3 | ✅ S3 |
| Annulation RDV (EN_ATTENTE uniquement) | ✅ S2 | ✅ S3 |
| Agenda dentiste (confirmés uniquement) | ✅ S2 | ✅ S3 |
| Enregistrement visite : diagnostic + traitement | ✅ S2 | ✅ S3 |
| Opérations dentaires dans visite (Détartrage, etc.) | ✅ S2 | ✅ S3 |
| Auto-calcul facture (base + opérations) | ✅ S2 | ✅ S3 |
| Émission ordonnance + médicaments + fréquence | ✅ S2 | ✅ S3 |
| Filtre ordonnances par statut (ACTIF/COMPLÉTÉ/ANNULÉ) | ✅ S2 | ✅ S3 |
| PDF ordonnance (jsPDF) | ✅ S3 | ✅ S3 |
| PDF facture (jsPDF) | ✅ S3 | ✅ S3 |
| Confirmation paiement secrétaire + TABLE PAIEMENTS | ✅ S2 | ✅ S3 |
| Email reçu paiement | ✅ S3 | — |
| Gestion médicaments (secrétaire CRUD) | ✅ S2 | ✅ S3 |
| Modification tarifs opérations (secrétaire) | ✅ S2 | ✅ S3 |
| Liste patients (secrétaire, lecture seule) | ✅ S2 | ✅ S3 |
| Historique patient complet (dentiste) | ✅ S2 | ✅ S3 |
| Rapport financier secrétaire | ✅ S2 | — |
| Audit trail | ✅ S3 | — |
| Contrôle accès rôles (middleware) | ✅ S2 | ✅ S2 |
| Responsive mobile | — | ✅ S4 |

---

*Basé sur : `DENTAL_CLINIC.md` v2.0 + `activityDiagram.mermaid`*
*Mise à jour : 19 avril 2026*
