document.addEventListener("DOMContentLoaded", () => {
	document
		.getElementById("search-bar")
		.addEventListener("submit", function (event) {
			event.preventDefault();
			const content = document.getElementById("contentInput").value;
			const destinationURL =
				"./search.html?content=" + encodeURIComponent(content)+"&pagination=0&page=0";

			window.location.href = destinationURL;
		});
});
