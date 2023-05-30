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
	console.log(beach_data);

	loadName(beach_data);
	loadLocation(beach_data);
	loadDescription(beach_data, "en");
	loadPhotos(beach_data);
	loadVideo(beach_data);
	generateMap(beach_data);
	loadTags(beach_data);
	textToSpeech(beach_data, "en");
	weatherApi(beach_data)
	// Tags
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

function generateTag(name) {
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

function generateMap(beach) {
	var map = L.map('map').setView([ beach.geo.latitude, beach.geo.longitude], 13);

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	setTimeout(function () {
		window.dispatchEvent(new Event("resize"));
	}, 500);
}

function textToSpeech(beach, lang) {
	textToSpeechButton.addEventListener(
		"click",
		function () {
			var u = new SpeechSynthesisUtterance();
			u.text = String(beach.description[langHash[lang]]);
			u.lang = 'en-US';
			u.rate = 1;
			speechSynthesis.speak(u);
		}
	);
}

function weatherApi(beach) {

	const lat = beach.geo.latitude;
	const lon = beach.geo.longitude;
	const apiKey = 'ca8606d4240b45a7bb3ac32d97789e1b';

	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
	fetch(url)
		.then((resp) => resp.json())
		//If city name is valid
		.then((data) => {
			console.log(data);
			console.log(data.weather[0].icon);
			console.log(data.weather[0].main);
			console.log(data.weather[0].description);
			console.log(data.name);
			console.log(data.main.temp_min);
			console.log(data.main.temp_max);
			result.innerHTML = `
        <h4 class="weather">${data.weather[0].main}</h4>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <h1>${precise(data.main.temp-273)} &#176;</h1>
        <div class="temp-container">
            <div>
                <h4 class="title">min</h4>
                <h4 class="temp">${precise(data.main.temp_min-273)}&#176;</h4>
            </div>
            <div>
                <h4 class="title">max</h4>
                <h4 class="temp">${precise(data.main.temp_max-273)}&#176;</h4>
            </div>
        </div>
        `;
		})
		//If city name is NOT valid
		.catch(() => {
			result.innerHTML = `<h3 class="msg">City not found</h3>`;
		});
}

function precise(x) {
	return x.toPrecision(3);
  }

