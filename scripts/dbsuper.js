export const fetchDBsuper = async () => {
	return fetch(
		"https://www.mallorcamiradores.com/assets/json/miradores.json"
	)
		.then((response) => response.json())
		.then((json) => json["itemListElement"]);
};