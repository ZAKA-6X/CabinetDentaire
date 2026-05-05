<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Secretaire;
use App\Models\Dentiste;
use App\Models\CatalogueOperation;
use App\Models\Medicament;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $patient = Utilisateur::create([
            'email'    => 'patient@clinic.ma',
            'password' => Hash::make('password'),
            'role'     => 'patient',
            'statut'   => 'actif',
        ]);
        Patient::create([
            'utilisateur_id' => $patient->id,
            'nom'            => 'Ben Ali',
            'prenom'         => 'Karim',
            'telephone'      => '0600000001',
            'sexe'           => 'masculin',
        ]);

        $secretaire = Utilisateur::create([
            'email'    => 'secretaire@clinic.ma',
            'password' => Hash::make('password'),
            'role'     => 'secretaire',
            'statut'   => 'actif',
        ]);
        Secretaire::create([
            'utilisateur_id' => $secretaire->id,
            'nom'            => 'Moussaoui',
            'prenom'         => 'Sara',
            'numero_employe' => 'SEC-001',
            'date_embauche'  => '2024-01-01',
        ]);

        $dentiste = Utilisateur::create([
            'email'    => 'dentiste@clinic.ma',
            'password' => Hash::make('password'),
            'role'     => 'dentiste',
            'statut'   => 'actif',
        ]);
        Dentiste::create([
            'utilisateur_id' => $dentiste->id,
            'nom'            => 'Alaoui',
            'prenom'         => 'Youssef',
            'specialite'     => 'Orthodontie',
        ]);

        $operations = [
            [
                'nom'         => 'Examen et diagnostic',
                'description' => 'Examen de la bouche, des dents et des gencives. Recherche de caries, infections, problèmes gingivaux. Utilisation de radiographies si nécessaire.',
                'cout'        => 150,
            ],
            [
                'nom'         => 'Détartrage (nettoyage)',
                'description' => 'Élimination du tartre et de la plaque dentaire. Prévention des maladies des gencives.',
                'cout'        => 200,
            ],
            [
                'nom'         => 'Soins des caries (dentisterie conservatrice)',
                'description' => 'Élimination de la carie et restauration de la dent avec un matériau comme le composite.',
                'cout'        => 300,
            ],
            [
                'nom'         => 'Traitement de canal (endodontie)',
                'description' => 'Traitement de la pulpe (nerf) infectée. Nettoyage et obturation des canaux.',
                'cout'        => 800,
            ],
            [
                'nom'         => 'Extraction dentaire',
                'description' => 'Extraction d\'une dent trop abîmée ou des dents de sagesse.',
                'cout'        => 250,
            ],
            [
                'nom'         => 'Orthodontie',
                'description' => 'Correction de la position des dents. Utilisation d\'appareils dentaires.',
                'cout'        => 5000,
            ],
            [
                'nom'         => 'Prothèses dentaires',
                'description' => 'Remplacement des dents manquantes : couronnes, bridges, prothèses amovibles.',
                'cout'        => 3000,
            ],
            [
                'nom'         => 'Implantologie',
                'description' => 'Pose d\'implants dentaires (racines artificielles). Remplacement durable des dents.',
                'cout'        => 8000,
            ],
        ];

        foreach ($operations as $op) {
            CatalogueOperation::create($op);
        }

        $medicaments = [
            ['nom' => 'Paracétamol',  'description' => 'Antalgique. Soulagement de la douleur et de la fièvre.',       'forme' => 'Comprimé', 'dosage' => '500mg - 1g'],
            ['nom' => 'Ibuprofène',   'description' => 'Anti-inflammatoire non stéroïdien (AINS).',                     'forme' => 'Comprimé', 'dosage' => '200mg - 400mg'],
            ['nom' => 'Diclofénac',   'description' => 'Anti-inflammatoire non stéroïdien (AINS).',                     'forme' => 'Comprimé', 'dosage' => '50mg - 75mg'],
            ['nom' => 'Surgam',       'description' => 'Anti-inflammatoire non stéroïdien (AINS).',                     'forme' => 'Comprimé', 'dosage' => '300mg'],
            ['nom' => 'Amoxicilline', 'description' => 'Antibiotique. Traitement des infections bactériennes.',         'forme' => 'Gélule',   'dosage' => '500mg - 1g'],
        ];

        foreach ($medicaments as $med) {
            Medicament::create($med);
        }
    }
}
