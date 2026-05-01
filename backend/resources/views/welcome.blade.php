<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>hello user</h1>
    @if ($errors->any())
      <ul>
          @foreach ($errors->all() as $error)
              <li style="color:red">{{ $error }}</li>
          @endforeach
      </ul>
    @endif
    <form method="POST" action="/login">
      @csrf
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="mot_de_passe" placeholder="Mot de passe" />
      <button type="submit">Connexion</button>
  </form>
</body>
</html>