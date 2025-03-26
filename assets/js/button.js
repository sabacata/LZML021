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
	document.getElementById("helptext").innerHTML = "HELPPPP";
	
}

function sabian3Filter() {
                let tableau = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                resultat = tableau.filter(element => element % 2 == 0);
    
                document.getElementById("sabian3filterCodeHolder").innerHTML = `let tableau = ${'[' + tableau.join(', ') + ']'}
resultat = tableau.filter(element => element % 2 == 0);`;

                document.getElementById("sabian3filterHolder").innerHTML = `resultat vaut ${'[' + resultat.join(', ') + ']'}`;
            }