export const fetchDBres = async () => {
	return fetch(
		"https://raw.githubusercontent.com/Zygmut/Majorcan_beaches/main/assets/json/restaurante.json"
	)
		.then((response) => response.json())
		.then((json) => json["itemListElement"]);
};