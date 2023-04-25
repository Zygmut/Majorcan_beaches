import { fetchDB } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
	loadURLContent();
	setSubmitListener();
	focusSubmitButton();
});

function loadURLContent() {
	const URLparams = new URLSearchParams(window.location.search);
	const content = URLparams.get("content");

	document.getElementById("name").value = content;
}

function check_beach_subtype_selection(data) {
	return (
		data["first_aid"] ||
		data["parking"] ||
		data["showers"] ||
		data["blue_flag"] ||
		data["nudist"] ||
		data["hike"]
	);
}

function focusSubmitButton() {
	document.getElementById("submit").focus;
}

function setSubmitListener() {
	document.getElementById("submit").onclick = async () => {
		const data = {
			name: document.getElementById("name").value,
			type: document.getElementById("type").value,
			city: document.getElementById("city").value,
			first_aid: document.getElementById("first_aid").checked,
			parking: document.getElementById("parking").checked,
			showers: document.getElementById("showers").checked,
			blue_flag: document.getElementById("blue_flag").checked,
			nudist: document.getElementById("nudist").checked,
			hike: document.getElementById("hike").checked,
		};

		console.log(data);

		const db = await fetchDB();
		console.log(db);
		let search = db;
		if (check_beach_subtype_selection(data)) {
			if (data["first_aid"]) {
				search = search.filter(
					(element) =>
						element["keywords"].includes("servicio_de_socorro")
				);
			}
			if (search.length != 0 && data["parking"]) {
				search = search.filter(
					(element) =>
						element["keywords"].includes("aparcamiento")
				);
			}
			if (search.length != 0 && data["showers"]) {
				search = search.filter(
					(element) =>
						element["keywords"].includes("duchas")
				);
			}
			if (search.length != 0 && data["blue_flag"]) {
				search = search.filter(
					(element) =>
						element["keywords"].includes("bandera_azul")
				);
			}
			if (search.length != 0 && data["nudist"]) {
				search = search.filter(
					(element) =>
						element["keywords"].includes("nudista")
				);
			}
			if (search.length != 0 && data["hike"]) {
				search = search.filter(
					(element) =>
						element["keywords"].includes("caminata")
				);
			}
		}

		if (search.length != 0 && data["name"] != "") {
			search = search.filter(
				(element) =>
					element["name"].toLowerCase().indexOf(data["name"].toLowerCase()) >= 0
			);
		}
		console.log(search);
	};
}
