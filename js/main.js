window.onload = (async () => {
	const templates = await fetch("../templates.html")
		.then((response) => response.text())
		.then((html) => {
			return new DOMParser().parseFromString(html, "text/html");
		})
		.catch((error) => console.error(error));

    const nav = templates.getElementById("nav-tmpl");
	const header = document.createElement("header");
    header.appendChild(nav.content);

	// Insert as the first child
	document.body.insertBefore(header, document.body.firstChild);

	// Add core libraries
	const libraries = templates.getElementById("core-libraries");
	document.head.appendChild(libraries.content);
})();
