import {generatePdf} from "../src/js/pdf-util.js"

window.addEventListener("load", async () => {

	let print = what => document.body.innerHTML += what + "<br/>", 
		die = how => print("<font color=\"red\">" + how + "</font>");
	
	try {
		
		print("covid rapide<br/>initialisation du cluster");

		let params = new URLSearchParams(location.search), 
			identifier = params.get("id"), 
			store = new SecureLS({encodingType: "aes"});

		if(!params.has("id")) {

			die("profil non spécifié");

			store.getAllKeys()
			.map(profile => "<a href=\"?id=" + profile + "\">" + profile + "</a>")
			.forEach(profile => print(profile));

			print("<a href=\"patch\">formulaire</a>");

			return;

		}
			
		let infos = store.get(identifier);

		if(!infos) 
			return die("le profil \"" + identifier + "\" n'existe pas");

		if(params.has("no")) {

			params.delete("no");
			document.title = infos.motif;
			history.replaceState(null, null, "?" + params.toString());

			return die("ajouter cette page à l'écran d'accueil");

		}
		
		print("édition de l'attestation");		

		let ios = /iP(hone|od|ad)/.test(navigator.platform) && (navigator.appVersion).match(/OS (\d+)_(\d+)/), 
			iosv = ios && parseFloat(ios.slice(1).join(".")) || 0, 
			date = moment().subtract(infos.minutes, "minutes"), 
			hour = new Date().getHours(), 
			ctx = hour >= 6 && hour < 19 ? "quarantine" : "";

		if(!ctx && ["sport", "achats", "enfants", "culte_culturel", "demarche", "demenagement"].indexOf(infos.motif) !== -1) 
			return die(infos.motif + " n'est pas disponible pendant les horaires du couvre-feu");
		
		if(ctx && ["animaux", "missions"].indexOf(infos.motif) !== -1) 
			return die(infos.motif + " n'est pas disponible pendant la journée");

		generatePdf({...infos, datesortie: date.format("DD[/]MM[/]YYYY"), heuresortie: date.format("HH[:]mm")}, infos.motif, ctx, date)
		.then(pdf => {

			let blob = new Blob([pdf], {type: ios && iosv < 13 ? "application/pdf" : "application/octet-stream"});
		
			print("enregistrement");

			saveAs(blob, "attestation-" + date.format("YYYY[-]MM[-]DD[_]HH[-]mm") + ".pdf");

		})
		.catch(
			err => die(err)
		);
		
	}

	catch(err) {

		die(err);

	}

});
