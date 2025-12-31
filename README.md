# OS.js
Un simulateur d'OS (système d'exploitation), modulable facilement et entièrement écrit en JS.
Utile pour tout projet visant à recréer une application quelconque de Windows.

# Prérequis
- Navigateur quelconque avec JavaScript activé
- Rien d'autre x)
  
# Importation
```html
<script src="https://github.com/Main-April/OS.js/blob/main/Main/${file_name}"></script>
```
> [!CAUTION]
> N'oubliez pas de désactiver le cors pour éviter toute erreur liée à l'importation des fichiers.

# Utilisation
## Gestionnaire de fichier
> [!NOTE]
> Il vous faudra importer le fichier os.js du dossier Main pour pouvoir utiliser le code suivant.

```javascript
// L'OS est accessible depuis l'objet OS :
let main_OS = OS;
// Vous pouvez créer vos propres répertoires par défaut :
main_OS.Files = {C:{Dossier_1{},Dossier_2:{}}};
// Insérez vos propres fichiers en utilisant la syntaxe suivantes :
let name = "texte.txt";
let content = "Ceci est un texte quelconque."
let path = "C/Dossier_1";
let file = new File(name,content,path)
// OS.Files.C.Dossier_1 = File { name : "texte.txt", content : "eci est un texte quelconque", }
```
