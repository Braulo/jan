# Kommentar Service

Folgende Enviroment Variabeln können vor dem Start gesetzt werden:
* PORT - Default: 80
* MYSQL_URI - Default: NULL

Zum Starten kann man diesen Befehl beispielsweise verwenden:
```
PORT=8000 MYSQL_URI=mysql://root:root@localhost/comment npm start
```
In diesem fall habe ich MySQL per Docker mit folgendem Befehl gestartet:
```
docker run -p 3306:3306 --name jan-comment -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=comment -d mysql:latest
```

Es gibt folgende Routen:

### GET /
Argument | Required | Beschreibung
-        | -      | -
owner    | [ ]    | Integer : Besitzer ID des Kommentars

### GET /:path
Argument | Required | Beschreibung
-        | -      | -
---      | ---    | ---

### POST /
Argument | Required | Beschreibung
-        | -      | -
owner    | [ ]    | Integer : Besitzer ID des Kommentars
content  | [x]    | String  : Inhalt des Kommentares