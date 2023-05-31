export const fetchDBcafe = async () => {
	return fetch(
		"https://www.cafeconcultura.com/assets/JSON/cafeterias.json"
	)
		.then((response) => response.json())
		.then((json) => json["itemListElement"]);
};