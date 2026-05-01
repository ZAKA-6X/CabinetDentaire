# Tâches Backend — Membre A
**Stack:** Laravel 11 | **Deadline:** 24 mai 2026

---

## Semaine 1 — Setup (21–27 avril)

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

---

## Semaine 2 — Modèles, Auth & API (28 avril – 4 mai)

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

**Auth API (Sanctum)**
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
- [ ] `POST /api/visites` → créer visite depuis RDV confirmé (diagnostic, traitement, notes, opérations → snapshot coût, auto-créer Facture, passer RDV → COMPLÉTÉ)
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
- [ ] `POST /api/factures/{id}/payment` → créer Paiement + passer facture → PAYÉE + envoyer email reçu (secrétaire)
- [ ] `GET /api/admin/factures/report` → total revenus, payées vs en attente (secrétaire)

- [ ] Tester **tous** les endpoints Postman, exporter collection → `docs/api-collection.json`

---

## Semaine 3 — Emails, Audit & PDF (5–11 mai)

- [ ] Emails Mailtrap (Laravel Notifications) :
  - **Confirmation RDV** : envoyé au patient quand secrétaire confirme (nom, date, heure)
  - **Rejet RDV** : envoyé au patient quand secrétaire rejette (raison incluse)
  - **Reçu paiement** : envoyé au patient quand secrétaire marque PAYÉE (numéro facture, montant, date)
- [ ] Logger dans table `audit` : chaque CREATE/UPDATE/DELETE sur rendez_vous, visites, ordonnances, factures
- [ ] `GET /api/factures/{id}/pdf` → retourner données formatées pour génération PDF
- [ ] `GET /api/ordonnances/{id}/pdf` → retourner données formatées pour génération PDF

---

## Semaine 4 — Tests & Sécurité (12–18 mai)

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

---

## Semaine 5 — Documentation & Soumission (19–24 mai)

- [ ] Finaliser `database/schema.sql` avec données exemple (seeders inclus)
- [ ] Écrire section backend `README.md` :
  - Prérequis (PHP 8.2, Composer, MySQL)
  - Installation : `composer install`, `.env`, `migrate`, `db:seed`
  - Lancer : `php artisan serve`
- [ ] Mettre à jour collection Postman → `docs/api-collection.json`
- [ ] Nettoyage code : supprimer `dd()`, `var_dump()`, logs de debug
- [ ] Push propre sur `main`
