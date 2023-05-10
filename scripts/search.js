import { fetchDB } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
	await setCurrentLocations();
	document.getElementById("submit").onclick = async () => queryForm();
	overrideEnterKeyStroke();
	loadURLContent();
});

function overrideEnterKeyStroke(){
	document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
		document.getElementById("submit").click();
  }
});
}

function loadURLContent() {
	const URLparams = new URLSearchParams(window.location.search);
	const content = URLparams.get("content");

	document.getElementById("name").value = content;
	document.getElementById("submit").click();
}

async function setCurrentLocations(){
	const option = element => "<option>" + element + "</option>";
	const db = await fetchDB();
	let cities = new Set();
	cities.add("All Cities");
	db.forEach(x => cities.add(x.geo.address.addressLocality))
	const options = Array.from(cities).map(x => option(x));
	document.getElementById("city").innerHTML = options;
}

function getFormData(documentDOM) {
	return {
		name: documentDOM.getElementById("name").value,
		type: documentDOM.getElementById("type").value,
		city: documentDOM.getElementById("city").value,
		first_aid: documentDOM.getElementById("first_aid").checked,
		parking: documentDOM.getElementById("parking").checked,
		showers: documentDOM.getElementById("showers").checked,
		blue_flag: documentDOM.getElementById("blue_flag").checked,
		nudist: documentDOM.getElementById("nudist").checked,
		hike: documentDOM.getElementById("hike").checked,
	};
}

function generateKeywordFilter(data, keyword_map) {
	const keyword_filter = [];
	Object.keys(data).forEach((key) => {
		if (data[key]) {
			const keyword = keyword_map[key];
			if (keyword) {
				keyword_filter.push(keyword);
			}
		}
	});

	if (data.type !== "All types") {
		keyword_filter.push(keyword_map[data.type.toLowerCase()]);
	}
	return keyword_filter;
}

async function queryForm() {
		const form_data = getFormData(document);

		const keyword_filter = generateKeywordFilter(form_data, {
			first_aid: "servicio_de_socorro",
			parking: "aparcamiento",
			showers: "duchas",
			blue_flag: "bandera_azul",
			nudist: "nudista",
			hike: "caminata",
			sandy: "arena",
			rocky: "roca",
		});

		const filter_name = (item, name) =>
			item.name.toLowerCase().indexOf(name.toLowerCase()) >= 0;

		const filter_keywords = (item, keywords) =>
			keyword_filter.length == 0 ||
			keywords.every((keyword) => item["keywords"].includes(keyword));

		const filter_city = (item, city) =>
			city === "All Cities" || item.geo.address.addressLocality === city;

		const db = await fetchDB();

		const search = db.filter((item) =>
				filter_city(item, form_data.city) && filter_name(item, form_data.name) && filter_keywords(item, keyword_filter)
		);

		console.log(search);
}
