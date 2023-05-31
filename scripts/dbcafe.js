export const fetchDBcafe = async () => {
	return fetch(
		"https://raw.githubusercontent.com/Zygmut/Majorcan_beaches/main/assets/json/cafeterias.json"
	)
		.then((response) => response.json())
		.then((json) => json["itemListElement"]);
};