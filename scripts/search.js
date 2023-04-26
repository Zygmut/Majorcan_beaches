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

function focusSubmitButton() {
	document.getElementById("submit").focus;
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

function setSubmitListener() {
	document.getElementById("submit").onclick = async () => {
		const form_data = getFormData(document);

		// filter values depending on input
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

		const filter_name = (item, data) =>
			item.name.toLowerCase().indexOf(data.name.toLowerCase()) >= 0;

		const filter_keywords = (item, keywords) =>
			keyword_filter.length == 0 ||
			keywords.every((keyword) => item["keywords"].includes(keyword));

		const filter_city = (item, city) =>
			item.geo.address.addressLocality === city;

		const db = await fetchDB();

		const search = (
			form_data.city === "All Cities"
				? db
				: db.filter((item) => filter_city(item, form_data.city))
		).filter(
			(item) =>
				filter_name(item, form_data) && filter_keywords(item, keyword_filter)
		);

		console.log(search);
	};
}
