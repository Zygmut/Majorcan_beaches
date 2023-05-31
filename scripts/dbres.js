export const fetchDBres = async () => {
	return fetch(
		"https://www.mllcarestaurantes.com/assets/restaurante.json"
	)
		.then((response) => response.json())
		.then((json) => json["itemListElement"]);
};