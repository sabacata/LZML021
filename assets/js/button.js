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