document.addEventListener("DOMContentLoaded", () => {
	const URLparams = new URLSearchParams(window.location.search);
	const content = URLparams.get("content");

	document.getElementById("keyword").value = content;
});
