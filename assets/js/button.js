function namebutton() {
	let name = document.getElementById("nameInput").value;
	if (name) {
		alert("Welcome, " + name + "!"); 
	} 
	else {
		alert("Vous n'avez rien saisi.")
	}
}

function helpbutton() {
	document.getElementById("helpText").innerHTML = "Etapes à suivre: - Chargez un texte  au format .txt grâce au bouton Parcourir - Le bouton Dictionnaire: permet d'obtenir un tableau qui classe les tokens de façon décroissnte en fonction du nombre d'occurences. - Le bouton Grep: vous devez entrer un pôle(regex ou mot) et obtenir le tableau des lignes d'occurences";	
}

function sabian3Filter() {
	let tableau = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	resultat = tableau.filter(element => element % 2 == 0);
	document.getElementById("sabian3filterCodeHolder").innerHTML = "let tableau = [" + tableau.join(", ") + "];\nresultat = tableau.filter(element => element % 2 == 0)";
	document.getElementById("sabian3filterHolder").innerHTML = "resultat vaut [" + resultat.join(", ") + "]";
	}

//Ce sont des variables qui servent à stocker le contenu originel du texte (fileContent) ainsi que le text segmenté (segmentedText). Le stockage de ces deux variables a lieu dès que le fichier txt est chargé.
let fileContent = ""
let segmentedText = ""

window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    // On "écoute" si le fichier donné a été modifié.
    // Si on a donné un nouveau fichier, on essaie de le lire.
    fileInput.addEventListener('change', function(e) {
        // Dans le HTML (ligne 22), fileInput est un élément de tag "input" avec un attribut type="file".
        // On peut récupérer les fichiers données avec le champs ".files" au niveau du javascript.
        // On peut potentiellement donner plusieurs fichiers,
        // mais ici on n'en lit qu'un seul, le premier, donc indice 0.
        let file = fileInput.files[0];
        // on utilise cette expression régulière pour vérifier qu'on a bien un fichier texte.
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { // on vérifie qu'on a bien un fichier texte
            // lecture du fichier. D'abord, on crée un objet qui sait lire un fichier.
            var reader = new FileReader();

            // on dit au lecteur de fichier de placer le résultat de la lecture
            // dans la zone d'affichage du texte.
            reader.onload = function(e) {
                fileContent = reader.result; //stockage du contenu du fichier dans la variable fileContent
				fileDisplayArea.innerText = reader.result; //affichage du contenu du texte
				segmentedText = segmentation(); //affichage du texte segmenté + stockage du texte segmenté dans la variable segmentedText
            }

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);    

            document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
};


function segmentation() {
    if (!fileContent) {
        alert("Pas de texte, chargez en un!");
        return;
    }
	const re =  /\W+/gi;
	let pageAnalysis = document.getElementById("pageAnalysis");
	let resultSeg = fileContent.split(re); //segmentation du texte en fonction du regex stocké dans re
	let resultSegQuotes = resultSeg.map(word => "\"" + word + "\"") //mettre chaque token entre quillemets
	pageAnalysis.innerText = resultSegQuotes.join(", "); //affichage des tokens (déjà entre guillemets) séparés par une virgule
	return resultSeg; //return du segmentation (sans guillemets et virgules) pour le stockage dans la variable
};

function nothing() {
	pageAnalysis.innerText = fileContent
};

function dictionnaire() {
	if (!fileContent) {
        alert("Pas de texte, chargez en un!");
        return;
    }
	let pageAnalysis = document.getElementById("pageAnalysis");
	let dictionary = {} //création d'un dictionnaire vide
	segmentedText.forEach(word => {
		word = word.toLowerCase(); //mettre chaque mot du texte en minuscules
		//si le mot est dans le dictionnaire, on ajoute 1 à sa valeur (corréspondant au nombre d'occurrences) ; si le mot n'est pas dans le dictionnaire, il est ajouté avec une valeur 1
		if (word in dictionary) {
			dictionary[word] += 1;
		}
		else {
			dictionary[word] = 1
		}
	});
	let dictionaryResult = "mot : nombre d'occurrences\r" //créer une variable pour afficher les résultats
	//ajouter à la variable dictionnaryResults chaque clé du dictionnarie entre quillements et sa valeur séparé par un deux-points (donc chauqe mot du text segmenté et le nombre d'occurrences)
	for (word in dictionary) {
		dictionaryResult += "\"" + word + "\"" + " : " + dictionary[word] + "\r"
	}
	pageAnalysis.innerText = dictionaryResult
};

function concordancier() {
	if (!fileContent) {
        alert("Pas de texte, chargez en un!");
        return;
    }
	
	const poleText = document.getElementById("poleID").value
	
	if (poleText === "") {
        alert("Le pôle n'est pas renseigné !");
        return;
    }
	
		const contextTable = `
			<table border="1px">
				<thead>
					<tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr>
				</thead>
				<tbody id="contextBody">
				</tbody>
			</table>
		`;
		
	
	pageAnalysis.innerHTML = contextTable
	
	segmentedText.forEach((word, index) => {
		word = word.toLowerCase(); //normaliser tous les tokens
		if (word === poleText.toLowerCase()) {
			
			//si le mot dans le texte n'est pas le premier mot, la variable gauche devient le mot d'avant
			//si le mot est le premier dans le texte, gauche reste vide
			let gauche = ""
			if (index > 0) {
				gauche = segmentedText[index - 1]
			};
			
			//si le mot dans le texte n'est pas le dernier mot, la variable droite devient le mot d'après
			//si le mot est le dernier dans le texte, droite reste vide
			let droite = ""
			if (index < segmentedText.length - 1) {
				droite = segmentedText[index + 1]
			};
			
			//création d'un element <tr></tr> (ligne dans le tableau) avec des cellules pour le contexte gauche, droit et le mot pôle 
			let row = document.createElement("tr");
			row.innerHTML = `
				<td>${gauche}</td>
				<td>${segmentedText[index]}</td>
				<td>${droite}</td>
			`;
			
			//ajouter cette ligne au tableau
			document.getElementById("contextBody").appendChild(row);
		}
	});		
};
function grep(pattern, lines) { //en gros cette fonction va servir à rechercher des motifs (mots ou regex) dans chaque ligne // 
    const regex = new RegExp(pattern, 'gi');
    const result = []; // ça va crée un tableau qui va s'appeler "result" qui va stocker les lignes 

    // pour chaque ligne ça va regarder si le motif est défini dans regex, si c'est vrai ça continue sinon on retourne à résultat
    lines.forEach(line => { 
        if (regex.test(line)) {
            const highlighted = line.replace(regex, match => `<span style="color:red;">${match}</span>`); // cette ligne et la suivante vont mettre en rouge dans le tableau le motif qui a été reconnu précedemment
            result.push(highlighted);
        }
    });

    return result; // ça va donner le tableau "result" qui va contenir toutes les lignes qui vont correspondre au motif avec ces motifs mis en rouge
}

function grepbutton() { // cette fonction renvoi à la fonction définie juste au dessus, et elle va se lancer quand on clique sur le bouton "grep"
    let motif = document.getElementById("poleID").value; // cette ligne va résupérer la valeur qui va etre saisie dans la case "pole" (et qui va correspondre au motif qu'on veut chercher)
    let pageAnalysis = document.getElementById("pageAnalysis");

    if (!fileContent) { // ça va nous avertir si on a oublié de charger le texte qui va être utilisé
        alert("Pas de texte, chargez-en un !");
        return;
    }

    if (!motif) { // ça va nous avertir si on a oublié de charger le mot/regex qui va être utilisé pour chercher
        alert("Veuillez entrer un motif !");
        return;
    }

    let lines = fileContent.split(/\r?\n/); // ça va découper le texte en un tableau composée de lignes avec \n
    let resultLines = grep(motif, lines); // cette ligne renvoie à la fonction grep() pour chercher le mot/regex dans les lignes du tableau 

    if (resultLines.length === 0) { // Si il n'y a pas de résultats trouvé pour le mot/regex recherché alors ça envoi le message de la ligne suivante disant qu'il n'y a pas de correspondance
        pageAnalysis.innerHTML = "<p>Aucune correspondance trouvée.</p>";
    } else { //si il y a des résultats trouvés 
        let htmlTable = "<table border='1'><tr><th>Ligne(s)</th></tr>";
        resultLines.forEach(line => {
            htmlTable += `<tr><td>${line}</td></tr>`;
        });
        htmlTable += "</table>";
        pageAnalysis.innerHTML = htmlTable;
    }
}

function pieChart() {
    let motif = document.getElementById("stopwordID").value;
    let pageAnalysis = document.getElementById("pageAnalysis"); // ça va récupérer l'élément de Hhtml de la zone d'analyse
    const textContent = document.getElementById('pageAnalysis').textContent; // là ça récupére juste le texte

    if (!fileContent) {
        alert("Pas de texte, chargez-en un !"); // comme dans la fonction précédente on fait en sorte que le bouton renvoi un message d'erreur si il n'y a pas de texte
        return;
    }
    if (document.getElementById('fileDisplayArea').innerHTML === "") { // ça va avérifier que le texte est est affiché dans "display area"
        document.getElementById('logger3').innerHTML = "XX!";
    } else {
        // On va récupérer les stopwords depuis l'input "mots grammaticaux"
        var stopwordInput = document.getElementById('stopwordID').value; // ça va découper la chaine de stopwords 
        var stopwords = stopwordInput ? stopwordInput.split(",") : []; // Si l'input est vide, on met un tableau vide

        const tokens = textContent.split(/\s+/).filter(word => word.length > 0); // ça va séparer le texte en mots
        global_var_tokens = tokens;
        // Filtrer les stopwords de global_var_tokens
        var filteredTokens = global_var_tokens.filter(function(token) {
            return stopwords.indexOf(token) === -1;
        });
       

        var cleanedTokens = global_var_tokens.map(token =>
            token.toLowerCase().replace(/[.,!?;:(){}\[\]'"«»\-]/g, "") // ça va mettre en minuscules les mots et enlever la ponctuation
           );
   
        var cleanedStopwords = stopwords.map(sw => sw.toLowerCase().trim()); // ça va mettre les stopwords en minuscule et retirer les espaces avant et après les stopwords
   
        // Puis filtrer :
        var filteredTokens = cleanedTokens.filter(token =>
            cleanedStopwords.indexOf(token) === -1
       );

        // Compter le nombre d'occurences de chaque token dans "filteredTokens"
        var count = {};
        filteredTokens.forEach(function(token) {
            count[token] = (count[token] || 0) + 1;
        });

        var chartData = [];
        var sortedTokens = Object.keys(count).sort(function(a, b) {
            return count[b] - count[a];
        }).slice(0, 30);

        sortedTokens.forEach(function(token) {
            chartData.push({
                label: token,
                y: count[token]
            });
        });

        // Creation du graphique CanvasJS
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            backgroundColor: "transparent",
            title: {
                text: "Mots les plus fréquents"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                legendText: "{label}",
                indexLabelFontSize: 14,
                indexLabel: "{label} - {y}",
                dataPoints: chartData
            }]
        });
		
		chart.render();		
    }
}