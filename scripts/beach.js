import { fetchDB } from "./db.js";

let db;

const langHash = {
	es: 0,
	ct: 1,
	en: 2,
};

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
	enableContentSwipper();
	loadBeachContent();
});

function loadURLContent() {
	const URLparams = new URLSearchParams(window.location.search);
	return URLparams.get("id");
}

function loadBeachContent() {
	const beach_id = loadURLContent();
	const beach_data = db.find((x) => x["@identifier"] == beach_id);

	loadName(beach_data);
	loadLocation(beach_data);
	loadDescription(beach_data, "en");
	loadPhotos(beach_data);
	loadVideo(beach_data);
	loadTags(beach_data);
}

function loadName(beach) {
	document.getElementById("name").innerHTML = beach["name"];
}

function loadLocation(beach) {
	document.getElementById("location").innerHTML =
		beach.geo.address.addressLocality;
}

function loadDescription(beach, lang) {
	document.getElementById("description").innerHTML =
		beach.description[langHash[lang]];
}

function loadPhotos(beach) {
	const carousel_items = document.getElementById("carousel-items");
	beach.photo.forEach(
		(photo_url) => (carousel_items.innerHTML += generateCarouselItem(photo_url))
	);
	carousel_items.children[0].classList.add("active");
}

function generateCarouselItem(img_url) {
	return `
						<div class="carousel-item">
							<img class="d-block w-100" src="${img_url}">
						</div>
						`;
}

function loadVideo(beach) {
	document.getElementById("video").src =
		"https://www.youtube.com/embed/" + beach.subjectOf.video.split("=")[1];
}

function loadTags(beach) {
	const tags = document.getElementById("tags");
	beach.keywords
		.filter((x) => x != "arena" && x != "roca")
		.forEach((x) => (tags.innerHTML += generateTag(x)));
}

function generateTag(name){
	return `<label title="${espToEngHash[name]}">${emojiHash[espToEngHash[name]]}</label>`
}

function enableContentSwipper() {
	return new Swiper(".swiper", {
		speed: 1000,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: true,
		},
		slidesPerView: "auto",
		pagination: {
			el: ".swiper-pagination",
			type: "bullets",
			clickable: true,
		},
	});
}
