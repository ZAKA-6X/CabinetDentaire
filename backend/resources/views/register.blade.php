<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription Patient</title>
</head>
<body>
    <h1>Inscription Patient</h1>

    @if ($errors->any())
        @foreach ($errors->all() as $error)
            <p style="color:red">{{ $error }}</p>
        @endforeach
    @endif

    <form method="POST" action="/register">
        @csrf
        <input type="text" name="nom_complet" placeholder="Nom complet" required /><br>
        <input type="email" name="email" placeholder="Email" required /><br>
        <input type="password" name="mot_de_passe" placeholder="Mot de passe" required /><br>
        <input type="text" name="telephone" placeholder="Téléphone" /><br>
        <input type="text" name="adresse" placeholder="Adresse" /><br>
        <input type="date" name="date_naissance" placeholder="Date de naissance" /><br>
        <select name="sexe">
            <option value="">-- Sexe --</option>
            <option value="masculin">Masculin</option>
            <option value="feminin">Féminin</option>
            <option value="autre">Autre</option>
        </select><br>
        <textarea name="antecedents_medicaux" placeholder="Antécédents médicaux"></textarea><br>
        <textarea name="allergies" placeholder="Allergies"></textarea><br>
        <input type="text" name="contact_urgence" placeholder="Contact d'urgence" /><br>
        <textarea name="notes_generales" placeholder="Notes générales"></textarea><br>
        <button type="submit">S'inscrire</button>
    </form>

    <a href="/">Déjà un compte ? Connexion</a>
</body>
</html>