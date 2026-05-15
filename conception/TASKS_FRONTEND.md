# Tâches Frontend — Membre B
**Stack:** React 19 + Vite | **Deadline:** 24 mai 2026

---

## Semaine 1 — Setup ✅ TERMINÉ

- [x] Nettoyer projet React existant
- [x] Installer dépendances : `axios`, `react-router-dom`, `react-toastify`, `jspdf`
- [x] Créer structure dossiers (`pages/`, `components/`, `context/`, `services/`)
- [x] Créer `api.js` : base URL `http://localhost:8000/api`, intercepteur Bearer token, handler 401 global

---

## Semaine 2 — Auth ✅ TERMINÉ

- [x] `AuthContext.jsx` : `{token, user: {id, nom, role}}` dans localStorage
- [x] Page `Login` : split-screen, formulaire email + mot de passe, boutons démo (Patient/Secrétaire/Dentiste)
- [x] Page `Register` : formulaire complet
- [x] `ProtectedRoute.jsx` : redirection `/login` si pas de token ou rôle non autorisé
- [x] Redirection post-login selon rôle (PATIENT / SECRETAIRE / DENTISTE)
- [x] `Layout.jsx` : sidebar dynamique par rôle, topbar, bouton déconnexion

---

## Semaine 3 — Pages

### Pages Patient

- [x] **`PatientDashboard`** (`/patient/dashboard`)
  - Prochain RDV confirmé, stats rapides, grille actions, liste RDV récents
  - Appels API : `GET /api/rendez-vous`

- [x] **`BookAppointment`** (`/patient/reserver`)
  - [x] Calendrier → `GET /api/rendez-vous/available-slots?date=`
  - [x] Afficher créneaux libres, sélectionner créneau
  - [x] Champ raison (optionnel)
  - [x] `POST /api/rendez-vous` → toast "En attente de confirmation"

- [x] **`MyAppointments`** (`/patient/rendez-vous`)
  - [x] Liste tous RDV avec badge statut
  - [x] Bouton Annuler si EN_ATTENTE → `DELETE /api/rendez-vous/{id}`

- [x] **`MyVisits`** (`/patient/visites`)
  - [x] Liste visites triées par date décroissante, filtre recherche
  - [ ] Page détail `/patient/visites/{id}` — non implémentée (hors scope deadline)

- [x] **`MyPrescriptions`** (`/patient/ordonnances`)
  - [x] Liste ordonnances API réelle
  - [x] Bouton "Télécharger PDF" → jsPDF

- [x] **`MyInvoices`** (`/patient/factures`)
  - [x] Liste avec statut EN_ATTENTE / PAYÉE
  - [x] Bouton "Télécharger PDF" → jsPDF
  - [x] Drawer détail facture

- [x] **`MyProfile`** (`/patient/profil`)
  - [x] Afficher/modifier : nom, prenom, telephone, adresse, date_naissance, sexe
  - [x] Champs médicaux : notes_generales, contact_urgence
  - [x] Formulaire changement mot de passe (ancien + nouveau)

---

### Pages Secrétaire

- [x] **`SecretaireDashboard`** (`/secretaire/dashboard`)
  - Stats 4 cartes, shortcuts, tableau RDV en attente avec Confirmer/Rejeter

- [x] **`ManageAppointments`** (`/secretaire/rendez-vous`)
  - [x] Tableau tous RDV avec filtre statut
  - [x] Bouton Confirmer → `PUT /api/rendez-vous/{id}/confirm`
  - [x] Bouton Rejeter → modal raison → `PUT /api/rendez-vous/{id}/reject`
  - [ ] Email backend — dépend backend (NotificationService)

- [x] **`ManagePayments`** (`/secretaire/paiements`)
  - [x] Tableau factures EN_ATTENTE : nom patient, montant, date visite
  - [x] Bouton Marquer PAYÉE → `POST /api/factures/{id}/payment`

- [x] **`ManageMedications`** (`/secretaire/medicaments`)
  - [x] Liste médicaments
  - [x] Modal Ajouter/Modifier : nom, description, forme, dosage, prix_unitaire
  - [x] Bouton Supprimer avec confirmation

- [x] **`ManageOperations`** (`/secretaire/operations`)
  - [x] Liste catalogue : nom, description, coût actuel
  - [x] Bouton Modifier tarif → inline edit → `PUT /api/operations/{id}`

- [x] **`PatientsList`** (`/secretaire/patients`)
  - [x] Liste patients : nom, téléphone, date_naissance
  - [x] Cliquer → historique rendez-vous du patient

---

### Pages Dentiste

- [x] **`DentisteDashboard`** (`/dentiste/dashboard`)
  - Agenda jour, stats 3 cartes, RDV confirmés avec bouton "Enregistrer visite"

- [x] **`RecordVisit`** (`/dentiste/visite/:rdv_id`)
  - [x] Champs diagnostic, traitement_fourni, notes
  - [x] Section opérations : liste depuis `GET /api/operations`, multi-ajout, coût unitaire affiché
  - [x] Total en temps réel : 200 MAD (base) + sum(opérations)
  - [x] `POST /api/visites` → navigue vers ordonnance avec visite_id après succès
  - ⚠️ Backend VisiteController.store utilise `session('role')` au lieu de `$request->user()` — bug backend à corriger

- [x] **`IssuePrescription`** (`/dentiste/ordonnance/:visite_id`)
  - [x] Multi-select médicaments depuis `GET /api/medicaments`
  - [x] Par médicament : fréquence, durée_jours
  - [x] Instructions générales
  - [x] `POST /api/ordonnances` statut=ACTIF

- [x] **`PatientHistory`** (`/dentiste/patient/:id/historique`)
  - [x] Profil patient : nom, antécédents, allergies
  - [x] Liste visites passées : diagnostic + traitements
  - [x] Liste ordonnances précédentes

---

## Semaine 4 — Intégration & Tests (12–18 mai)

- [x] Remplacer tous les mocks/données statiques par vrais appels API dans toutes les pages
- [x] Intercepteur axios → toast erreur global si 401 / 403 / 422 / 500
- [ ] Tester flux complet end-to-end :
  1. Inscription patient → connexion
  2. Réserver RDV → secrétaire confirme → email patient
  3. Dentiste enregistre visite + opérations → facture auto-créée
  4. Dentiste émet ordonnance
  5. Patient télécharge facture PDF + ordonnance PDF
  6. Secrétaire marque PAYÉE → email reçu
- [ ] Responsive : tester 375px mobile + 768px tablette
- [ ] Multi-navigateurs : Chrome, Firefox, Edge

---

## Semaine 5 — Documentation & Soumission (19–24 mai)

- [ ] Section frontend `README.md` : prérequis, `npm install`, `npm run dev`, `VITE_API_URL`
- [ ] Vidéo démo ≤5 min :
  - Inscription + connexion patient
  - Réservation RDV → confirmation secrétaire
  - Enregistrement visite dentiste + opérations
  - Émission ordonnance
  - Facture + paiement secrétaire
  - Téléchargement PDF ordonnance + facture
  - 3 dashboards distincts (rôles)
- [ ] Nettoyage : supprimer `console.log`, commentaires inutiles
- [ ] Push propre sur `main`

---

## État actuel (13 mai 2026)

| Zone | Statut |
|------|--------|
| Setup (Vite, deps, structure) | ✅ |
| Auth (context, login, register, protected routes) | ✅ |
| Layout (sidebar dynamique, topbar, logout) | ✅ |
| PatientDashboard | ✅ |
| SecretaireDashboard | ✅ |
| DentisteDashboard | ✅ |
| ManageAppointments (confirm/reject) | ✅ |
| BookAppointment (créneaux réels API) | ✅ |
| MyAppointments | ✅ |
| MyVisits | ✅ |
| MyPrescriptions (+ PDF) | ✅ |
| MyInvoices (+ PDF + drawer) | ✅ |
| MyProfile | ✅ |
| ManagePayments | ✅ |
| ManageMedications | ✅ |
| ManageOperations | ✅ |
| PatientsList | ✅ |
| RecordVisit | ✅ ⚠️ Bug backend session() à corriger |
| IssuePrescription | ✅ |
| PatientHistory | ✅ |
| Intercepteur axios global (403/422/500 toast) | ✅ |
