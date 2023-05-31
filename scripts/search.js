import { fetchDB } from "./db.js";

let db;

const emojiHash = {
	first_aid: "🆘",
	parking: "🅿️",
	showers: "🚿",
	blue_flag: "🏖️",
	nudist: "🔞",
	hike: "🚶‍♂️",
};

const engToEspHash = {
	first_aid: "servicio_de_socorro",
	parking: "aparcamiento",
	showers: "duchas",
	blue_flag: "bandera_azul",
	nudist: "nudista",
	hike: "caminata",
	sandy: "arena",
	rocky: "roca",
};

const espToEngHash = {
	servicio_de_socorro: "first_aid",
	aparcamiento: "parking",
	duchas: "showers",
	bandera_azul: "blue_flag",
	nudista: "nudist",
	caminata: "hike",
	arena: "sandy",
	roca: "rocky",
};
//Max number of beaches per batch
const maxSizeBatch = 9;
var beachBatches = [];

//Max number of pages per pagination (dependeds on results)
const maxPagesPerPagination = 5;
var paginations = [];
var numberOfPaginations;
//Tracking variables
var actual_pagination;
var actual_batch;

//Main event and function triggerer
document.addEventListener("DOMContentLoaded", async () => {
	db = await fetchDB();
	await setCurrentLocations();
	document.getElementById("submit").onclick = async () => queryForm();
	overrideEnterKeyStroke();
	loadURLContent();

});
//Misc
function overrideEnterKeyStroke() {
	document.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("submit").click();
		}
	});
}
//Load content from URL
function loadURLContent() {
	const URLparams = new URLSearchParams(window.location.search);
	const content = URLparams.get("content");
	const pagination = URLparams.get("pagination");
	const page = URLparams.get("page");

	if (pagination != null && page != null){

		actual_pagination = pagination;
		actual_batch = page;

	}else{
		actual_batch = 0;
		actual_pagination = 0;
	}

	document.getElementById("name").value = content;
	document.getElementById("submit").click();

}

//Set curren locations available in the db to the Form
async function setCurrentLocations() {
	const option = (element) => "<option>" + element + "</option>";

	let cities = new Set();
	cities.add("All Cities");
	db.forEach((x) => cities.add(x.geo.address.addressLocality));

	const options = Array.from(cities).map((x) => option(x));

	document.getElementById("city").innerHTML = options;
}

function getFormData(documentDOM) {
	return {
		name: documentDOM.getElementById("name").value,
		type: documentDOM.getElementById("type").value,
		city: documentDOM.getElementById("city").value,
		first_aid: documentDOM.getElementById("first_aid").checked,
		parking: documentDOM.getElementById("parking").checked,
		showers: documentDOM.getElementById("showers").checked,
		blue_flag: documentDOM.getElementById("blue_flag").checked,
		nudist: documentDOM.getElementById("nudist").checked,
		hike: documentDOM.getElementById("hike").checked,
	};
}

function generateKeywordFilter(data, keyword_map) {
	const keyword_filter = [];
	Object.keys(data).forEach((key) => {
		if (data[key]) {
			const keyword = keyword_map[key];
			if (keyword) {
				keyword_filter.push(keyword);
			}
		}
	});

	if (data.type !== "All types") {
		keyword_filter.push(keyword_map[data.type.toLowerCase()]);
	}
	return keyword_filter;
}

//Query in db based on form
async function queryForm() {
	const beach_listing = document.getElementById("beaches");
	beach_listing.innerHTML = "";
	const form_data = getFormData(document);

	const keyword_filter = generateKeywordFilter(form_data, engToEspHash);

	const filter_name = (item, name) =>
		item.name.toLowerCase().indexOf(name.toLowerCase()) >= 0;

	const filter_keywords = (item, keywords) =>
		keyword_filter.length == 0 ||
		keywords.every((keyword) => item["keywords"].includes(keyword));

	const filter_city = (item, city) =>
		city === "All Cities" || item.geo.address.addressLocality === city;

	const search = db.filter(
		(item) =>
			filter_city(item, form_data.city) &&
			filter_name(item, form_data.name) &&
			filter_keywords(item, keyword_filter)
	);
	//If any form data is checked...
	if (form_data.city != "All Cities" || form_data.blue_flag != false|| form_data.type != "All types"|| form_data.hike != false
		|| form_data.nudist != false ||form_data.parking != false|| form_data.first_aid != false || form_data.showers != false){
		actual_batch=0;
		actual_pagination=0;
	}

	//Load every beach matching form data in here
	const beaches = Array.from(
		search.map((x) =>
			generateBeach(x["@identifier"], x.name, x.keywords, x.photo[0])
		)
	);
	//Remove previous batch from possible previous search
	const pages = document.getElementById('pages');
	removeChildrens(pages);

	//Reset buttons styling
	const rightButton = document.getElementById('right-button');
	const leftButton = document.getElementById('left-button');
	rightButton.style.display='none';
	leftButton.style.display='none';


	var indexBatch = 0;
	var batch= [];
	var count=0;
	//Reset batches
	beachBatches = [];
	for (let beach of beaches){
		count++;
		batch.push(beach);
		if(count==maxSizeBatch){
			beachBatches.splice(indexBatch,0,batch);
			batch = [];
			count=0;
			indexBatch++;
		}

	}
	//Lower batch size
	if (batch.length<maxSizeBatch && batch.length > 0){
		beachBatches.splice(indexBatch,0,batch);
	}

	numberOfPaginations = Math.ceil(beachBatches.length/maxPagesPerPagination);
	//Reset paginations
	paginations = [];
	var paginationIndex = 0;
	var countPages = 0;
	var pagination = [];
	//Pagination adding
	for(let batch of beachBatches){
		countPages++;
		pagination.push(batch);
		if(countPages==maxPagesPerPagination){
			paginations.splice(paginationIndex,0,pagination);
			countPages=0;
			paginationIndex++;
			pagination=[];
		}

	}

	if (pagination.length<maxPagesPerPagination && pagination.length > 0){
		paginations.splice(paginationIndex,0,pagination);
	}

	/* console.log(paginations);
	console.log(beachBatches.length);
	console.log(numberOfPaginations); */


	const name = document.getElementById('name');
	const URLparams = new URLSearchParams(window.location.search);
	const content_name = URLparams.get('content');
	//If name submited is not the same as the content, reset batch and pagination
	if (name.value != content_name){
		actual_batch = 0;
		actual_pagination = 0;
	}

	//First batch visualization
	if(beachBatches.length>0){
		for(let i=0; i<beachBatches[actual_batch].length;i++){
			beach_listing.innerHTML += beachBatches[actual_batch][i];
		}
	}else{
		alert("No se han encontrado playas...");
	}

	addPages(actual_pagination);

	//If +5 pages exist in the query
	if(actual_pagination + 1 < numberOfPaginations){
		const rightButton = document.getElementById('right-button');
		rightButton.style.display='block';
	}
	initNavigationButtons();
	//In case query changes pagination and page from default.
	if (actual_pagination!=0 || actual_batch!=0){
		updatePagination(actual_pagination);
		updateBatch(actual_batch);
	}
	//Update URL content
	const destinationURL = "./search.html?content="+encodeURIComponent(name.value)+"&pagination="+encodeURI(actual_pagination)+"&page="+encodeURI(actual_batch);
	history.replaceState(null,null,destinationURL);
}
//Right and left buttons
function initNavigationButtons() {
	//Navs buttons
	const rightButton = document.getElementById('right-button');
	const leftButton = document.getElementById('left-button');
	//RB
	rightButton.addEventListener('click', function(){
		if(actual_pagination < numberOfPaginations-1){
			actual_pagination++;
			console.log(actual_pagination );
			console.log(numberOfPaginations);
			updatePagination(actual_pagination);
			updateBatch(0);
		}
	});
	//LB
	leftButton.addEventListener('click', function(){
		if(actual_pagination > 0){
			actual_pagination--;
			updatePagination(actual_pagination);
			updateBatch(0);
		}
	});
}
//Remove all the children of an element
function removeChildrens(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
//Add Pages depending of Pagination
function addPages(numberOfPagination) {
  const pages = document.getElementById('pages');
	//Number visualized in the page btn
  var number = numberOfPagination * 5 + 1;
	//Index of the button in the actual pagination
  var index = 0;
  for (let _ in paginations[actual_pagination]) {
    const page = document.createElement('li');
    const pButton = document.createElement('button');

    pButton.classList.add('btn', 'btn-primary', 'rounded-circle');
    pButton.innerHTML = number;

    //Work around to append different index
    const createButtonClickListener = function (currentIndex) {
      return function () {
        updateBatch(currentIndex);

      };
    };

    pButton.addEventListener('click', createButtonClickListener(index));

    page.appendChild(pButton);
    pages.appendChild(page);
    number++;
    index++;
  }
}


window.addEventListener('popstate', function(event) {
	const URLparams = new URLSearchParams(window.location.search);
	//Pagination and page adquired from new state
	const pagination = URLparams.get("pagination");
	const page = URLparams.get("page");
	//Internal state update
	actual_pagination = pagination;

	updatePagination(pagination);
	updateBatch(page, false);
});
//Update pagination
function updatePagination(pagination){
	const pages = document.getElementById('pages');
	const rightButton = document.getElementById('right-button');
	const leftButton = document.getElementById('left-button');


	if(actual_pagination == numberOfPaginations-1){
		rightButton.style.display='none';
	}else{
		rightButton.style.display='block';
	}
	if(actual_pagination == 0){
		leftButton.style.display='none';
	}else{
		leftButton.style.display='block';
	}
	removeChildrens(pages);
	addPages(pagination);

}
//Update Batch
function updateBatch(batch, push){
	const beach_listing = document.getElementById('beaches');
	const currentUrl = updateURL(batch);

	removeChildrens(beach_listing);

	for(let i = 0; i < paginations[actual_pagination][batch].length; i++) {
		beach_listing.innerHTML += paginations[actual_pagination][batch][i];
	}
	if (push==true){
		history.pushState(null,null,currentUrl);
	}else{
		history.replaceState(null,null,currentUrl);
	}
}
//Updated URL
function updateURL(batch){
	const name = document.getElementById('name');
	const updatedURL = "./search.html?content="+encodeURIComponent(name.value)+"&pagination="+encodeURI(actual_pagination)+"&page="+encodeURI(batch);
	return updatedURL;
}
//MISC TO CREATE
function generateTag(name) {
	return `
												<li>
													<label class="icon-info" data-bs-toggle="tooltip" data-bs-placement="top"
														title="${espToEngHash[name]}">${emojiHash[espToEngHash[name]]}</label>
												</li>`;
}

function generateBeach(id, name, tags, img_url) {
	let str = `<div class="col-12 col-md-6 col-lg-4 gap-3 py-3">
						<div class="card card-box m-0">
							<a href="beach.html?id=${id}">

								<div class="card-overlay">
									<div class="card-overlay-content">
										<div class="card-header">
											<h6 id="title" class="card-title">
												${name}
											</h6>
										</div>
										<div id="tags" class="card-footer-a rounded-1">
											<ul class="card-info d-flex justify-content-evenly">`;
	tags
		.filter((x) => x != "arena" && x != "roca")
		.forEach((x) => (str += generateTag(x)));
	str += `
											</ul>
										</div>
									</div>
								</div>
								<div class="img-overlay">
									<img id="img" src="${img_url}" class="img-fluid">
								</div>
							</a>
						</div>
					</div>`;

	return str;
}
