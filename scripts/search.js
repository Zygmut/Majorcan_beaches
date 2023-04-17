document.addEventListener("DOMContentLoaded", () => {
	loadURLContent();
	setSubmitListener();
});

function loadURLContent() {
	const URLparams = new URLSearchParams(window.location.search);
	const content = URLparams.get("content");

	document.getElementById("name").value = content;
}

function setSubmitListener() {
	document.getElementById("submit").onclick = () => {
		const data = {
			name: document.getElementById("name").value,
			type: document.getElementById("type").value,
			city: document.getElementById("city").value,
			first_aid: document.getElementById("first_aid").checked,
			parking: document.getElementById("parking").checked,
			showers: document.getElementById("showers").checked,
			blue_flag: document.getElementById("blue_flag").checked,
			nudist: document.getElementById("nudist").checked,
			hike: document.getElementById("hike").checked,
		};

		console.log(data);
	};
}
