import { fetchDB } from "./db.js";

let db;

document.addEventListener("DOMContentLoaded", async () => {
	db = await fetchDB();
	console.log(db);
	enableContentSwipper();
});

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