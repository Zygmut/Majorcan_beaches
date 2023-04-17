document.addEventListener("DOMContentLoaded", () => {
	addMobileNavSupport();
	addPreloader();
	removeShortLivedElements();
	addScrollToTop();
});

function addMobileNavSupport() {
	const mobileNavShow = document.querySelector(".mobile-nav-show");
	const mobileNavHide = document.querySelector(".mobile-nav-hide");

	document.querySelectorAll(".mobile-nav-toggle").forEach((el) => {
		el.addEventListener("click", function (event) {
			event.preventDefault();
			mobileNavToogle();
		});
	});

	function mobileNavToogle() {
		document.querySelector("body").classList.toggle("mobile-nav-active");
		mobileNavShow.classList.toggle("d-none");
		mobileNavHide.classList.toggle("d-none");
	}

	document.querySelectorAll("#navbar a").forEach((navbarlink) => {
		if (!navbarlink.hash) return;

		if (!document.querySelector(navbarlink.hash)) return;

		navbarlink.addEventListener("click", () => {
			if (document.querySelector(".mobile-nav-active")) {
				mobileNavToogle();
			}
		});
	});
}
function addPreloader() {
	window.addEventListener("load", () => {
		document.querySelector("#preloader").remove();
	});
}

function addScrollToTop() {
	const scrollTop = document.querySelector(".scroll-top");
	const togglescrollTop = function () {
		window.scrollY > 0
			? scrollTop.classList.add("active")
			: scrollTop.classList.remove("active");
	};

	window.addEventListener("load", togglescrollTop);
	document.addEventListener("scroll", togglescrollTop);
	scrollTop.addEventListener(
		"click",
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		})
	);
}

function removeShortLivedElements() {
	Array.from(document.getElementsByClassName("short-lived")).forEach((tag) =>
		tag.remove()
	);
}
