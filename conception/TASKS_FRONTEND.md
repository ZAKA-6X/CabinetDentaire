# Tâches Frontend — Membre B
**Stack:** React | **Deadline:** 24 mai 2026

---

## Semaine 1 — Setup (21–27 avril)

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

---

## Semaine 2 — Auth (28 avril – 4 mai)

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

## Semaine 3 — Pages (5–11 mai)

### Pages Patient

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

### Pages Secrétaire

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

### Pages Dentiste

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

## Semaine 4 — Intégration & Tests (12–18 mai)

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

---

## Semaine 5 — Documentation & Soumission (19–24 mai)

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
