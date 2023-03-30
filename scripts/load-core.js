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
	//const nav = templates.getElementById("nav-tmpl");
	//const header = document.createElement("header");
	//header.appendChild(nav.content);
	//
	//// Insert as the first child
	//document.body.insertBefore(header, document.body.firstChild);

	// Add head items
	templates
		.getElementsByTagName("head")[0]
		.childNodes.forEach((tag) =>
			document.head.insertBefore(tag, document.head.firstChild)
		);

	// Add body items
	templates.getElementsByTagName("body")[0].childNodes.forEach((tag) => {
		if (tag.nodeType === Node.ELEMENT_NODE) {
			document.body.appendChild(tag);
		}
	});

	// Remove voided items
	Array.from(document.getElementsByClassName("short-lived")).forEach((tag) =>
		tag.remove()
	);
}
