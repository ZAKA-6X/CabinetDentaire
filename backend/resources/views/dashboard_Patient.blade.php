<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
</head>
<body>
    <h1>Welcome Patient</h1>
    <form method="POST" action="/logout">                                                                                                                                                                                           
        @csrf                                                                                                                                                                                                                       
        <button type="submit">Déconnexion</button>                                                                                                                                                                                  
    </form> 
</body>
</html>