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
