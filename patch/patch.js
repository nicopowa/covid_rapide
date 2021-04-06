window.addEventListener("load", () => main());

const genInput = (name, prompt, cmp) => {
				
	let input = document.createElement("input");

	input.setAttribute("type", "text");
	input.setAttribute("id", cmp);
	input.setAttribute("name", name);
	input.setAttribute("required", "required");
	input.setAttribute("placeholder", prompt);

	if(cmp) 
		input.setAttribute("autocomplete", cmp);

	return input;

};

const genSelect = (name, prompt) => {

	let select = document.createElement("select");

	select.setAttribute("name", name);
	select.setAttribute("required", "required");

	let placeholder = document.createElement("option");

	placeholder.setAttribute("disabled", "disabled");
	placeholder.setAttribute("selected", "selected");
	placeholder.setAttribute("hidden", "hidden");

	placeholder.value = "";
	placeholder.text = prompt;

	select.appendChild(placeholder);

	let options = name === "motif" ?
	[
		"travail", 
		"animaux", 
		"sante", 
		"famille", 
		"convocation_demarches", 
		"demenagement", 
		"achats_culte_culturel", 
		"sport"
	] 
	: 
	[
		1, 2, 5, 10, 15, 20, 30, 45, 60
	];
	
	options.forEach(motif => {

		let option = document.createElement("option");

		option.value = 
		option.text = 
		motif;

		select.appendChild(option);

	});

	return select;

};

const onSubmit = event => {

	event.preventDefault();

	let identifier = Math.random().toString(36).substr(2), 
		store = new SecureLS({encodingType: "aes"}), 
		data = Object.fromEntries(
			new FormData(event.target)
			.entries()
		);
		
	store.set(identifier, data);

	console.log("stored", store.get(identifier));

	window.location = "../?id=" + identifier + "&no=1";

};

const main = () => {

	let form = document.createElement("form");
	document.body.appendChild(form);

	form.addEventListener("submit", onSubmit);

	[
		{name: "firstname", prompt: "Prénom", cmp: "given-name"}, 
		{name: "lastname", prompt: "Nom", cmp: "family-name"}, 
		{name: "birthday", prompt: "Date de naissance", cmp: "birthday"}, 
		{name: "placeofbirth", prompt: "Ville de naissance", cmp: "bcity"}, 
		{name: "address", prompt: "Adresse", cmp: "address-level1"}, 
		{name: "zipcode", prompt: "Code postal", cmp: "postal-code"}, 
		{name: "city", prompt: "Ville", cmp: "address-level2"}, 
		{name: "motif", prompt: "Motif", cmp: "covid-motif"}, 
		{name: "minutes", prompt: "Antidatage (minutes)", cmp: "covid-time"}
	]
	.forEach(
		field => 
		form.appendChild(
			(field.name === "motif" || field.name === "minutes" ? 
			genSelect : genInput)
			(field.name, field.prompt, field.cmp)
		)
	);

	let submit = document.createElement("input");
	submit.setAttribute("type", "submit");
	submit.value = "OK";
	form.appendChild(submit);

};

