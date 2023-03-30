document.addEventListener("DOMContentLoaded", async () => {
	const templates = await fetch("../void.html")
		.then((response) => response.text())
		.then((html) => {
			return new DOMParser().parseFromString(html, "text/html");
		})
		.catch((error) => console.error(error));
	await loadCoreContent(templates);
});

async function loadCoreContent(templates) {
	templates.getElementsByTagName("content")[0].childNodes.forEach((tag) => {
		if (tag.nodeType === Node.ELEMENT_NODE) {
			document.body.appendChild(tag);
		}
	});

	window.addEventListener("load", () => {
		document.querySelector("#preloader").remove();
	});

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

	Array.from(templates.getElementsByTagName("head")[0].childNodes)
		.slice()
		.reverse()
		.forEach((tag) =>
			document.head.insertBefore(tag, document.head.firstChild)
		);

	templates.getElementsByTagName("scripts")[0].childNodes.forEach((tag) => {
		if (tag.nodeType === Node.ELEMENT_NODE) {
			document.body.appendChild(tag);
		}
	});

	Array.from(document.getElementsByClassName("short-lived")).forEach((tag) =>
		tag.remove()
	);
}
