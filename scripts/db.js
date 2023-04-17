export const fetchDB = async () => {
	return fetch(
		"https://raw.githubusercontent.com/Zygmut/beach_data/main/beach_data.json"
	).then((response) => {
		return response.json();
	});
};
