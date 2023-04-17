document.addEventListener("DOMContentLoaded", () => {
	document
		.getElementById("search-bar")
		.addEventListener("submit", function (event) {
			event.preventDefault();
			const content = document.getElementById("contentInput").value;
			const destinationURL =
				"./search.html?content=" + encodeURIComponent(content);
			window.location.href = destinationURL;
		});
});
