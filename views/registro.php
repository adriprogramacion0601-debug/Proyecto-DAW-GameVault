<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset='utf-8'/>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'/>
    <title>Registro </title>
    <meta name='viewport' content='width=device-width, initial-scale=1'/>
</head>
<body>
    <form method="post">
        <fieldset>
            <legend>Registro</legend>
            <label for="nom">Nombre: </label>
            <input type="text" id="nom" name="Nombre"/>
            <br/>
            <label for="con">Contraseña: </label>
            <input type="password" id="con" name="Contraseña"/>

            <label for="em">Email:</label>
            <input type="email" id="em" name="Email"/>
            <br/>
            <input type="reset" value="Borrar datos"/>
        </fieldset>
    </form>
</body>
</html>