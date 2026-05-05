<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h1>Login Page</h1>
    @if ($errors->any())
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    @endif
    <form method="POST" action="/login">
      @csrf
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Mot de passe" />
      <button type="submit">Connexion</button>
  </form>
</body>
</html>