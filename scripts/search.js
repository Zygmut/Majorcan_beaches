import { fetchDB } from "./db.js";

let db;

const emojiHash = {
	first_aid: "🆘",
	parking: "🅿️",
	showers: "🚿",
	blue_flag: "🏖️",
	nudist: "🔞",
	hike: "🚶‍♂️",
};

const engToEspHash = {
	first_aid: "servicio_de_socorro",
	parking: "aparcamiento",
	showers: "duchas",
	blue_flag: "bandera_azul",
	nudist: "nudista",
	hike: "caminata",
	sandy: "arena",
	rocky: "roca",
};

const espToEngHash = {
	servicio_de_socorro: "first_aid",
	aparcamiento: "parking",
	duchas: "showers",
	bandera_azul: "blue_flag",
	nudista: "nudist",
	caminata: "hike",
	arena: "sandy",
	roca: "rocky",
};

document.addEventListener("DOMContentLoaded", async () => {
	db = await fetchDB();
	await setCurrentLocations();
	document.getElementById("submit").onclick = async () => queryForm();
	overrideEnterKeyStroke();
	loadURLContent();
});

function overrideEnterKeyStroke() {
	document.addEventListener("keypress", function (event) {
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

async function setCurrentLocations() {
	const option = (element) => "<option>" + element + "</option>";

	let cities = new Set();
	cities.add("All Cities");
	db.forEach((x) => cities.add(x.geo.address.addressLocality));

	const options = Array.from(cities).map((x) => option(x));

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
	const beach_listing = document.getElementById("beaches");
	beach_listing.innerHTML = "";
	const form_data = getFormData(document);

	const keyword_filter = generateKeywordFilter(form_data, engToEspHash);

	const filter_name = (item, name) =>
		item.name.toLowerCase().indexOf(name.toLowerCase()) >= 0;

	const filter_keywords = (item, keywords) =>
		keyword_filter.length == 0 ||
		keywords.every((keyword) => item["keywords"].includes(keyword));

	const filter_city = (item, city) =>
		city === "All Cities" || item.geo.address.addressLocality === city;

	const search = db.filter(
		(item) =>
			filter_city(item, form_data.city) &&
			filter_name(item, form_data.name) &&
			filter_keywords(item, keyword_filter)
	);

	const beaches = Array.from(
		search.map((x) =>
			generateBeach(x["@identifier"], x.name, x.keywords, x.photo[0])
		)
	);

	beaches.forEach((element) => (beach_listing.innerHTML += element));
}

function generateTag(name) {
	return `
												<li>
													<label class="icon-info" data-bs-toggle="tooltip" data-bs-placement="top"
														title="${espToEngHash[name]}">${emojiHash[espToEngHash[name]]}</label>
												</li>`;
}

function generateBeach(id, name, tags, img_url) {
	let str = `<div class="col-12 col-md-6 col-lg-4 gap-3 py-3">
						<div class="card card-box m-0">
							<a href="beach.html?id=${id}">

								<div class="card-overlay">
									<div class="card-overlay-content">
										<div class="card-header">
											<h6 id="title" class="card-title">
												${name}
											</h6>
										</div>
										<div id="tags" class="card-footer-a rounded-1">
											<ul class="card-info d-flex justify-content-between">`;
	tags
		.filter((x) => x != "arena" && x != "roca")
		.forEach((x) => (str += generateTag(x)));
	str += `
											</ul>
										</div>
									</div>
								</div>
								<div class="img-overlay">
									<img id="img" src="${img_url}" alt="" class="img-fluid">
								</div>
							</a>
						</div>
					</div>`;

	return str;
}
