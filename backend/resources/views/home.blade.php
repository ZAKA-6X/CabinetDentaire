<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Welcome <?php echo "hello" ?></h1>
    @foreach($medicaments as $medicament)
        <p>{{ $medicament->nom }}</p>
    @endforeach
    <a href="/logout">logout</a>
</body>
</html>