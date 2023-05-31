export const fetchDBsuper = async () => {
	return fetch(
		""
	)
		.then((response) => response.json())
		.then((json) => json["itemListElement"]);
};