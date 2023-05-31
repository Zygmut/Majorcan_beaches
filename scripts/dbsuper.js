export const fetchDBsuper = async () => {
	return fetch(
		"https://raw.githubusercontent.com/Zygmut/Majorcan_beaches/main/assets/json/supermercat.json"
	)
		.then((response) => response.json())
		.then((json) => json["itemListElement"]);
};