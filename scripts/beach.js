document.addEventListener("DOMContentLoaded", () => {
	enableContentSwipper();
	enableWeatherWidget();
});

function enableContentSwipper() {
	return new Swiper(".swiper", {
		speed: 1000,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: true,
		},
		slidesPerView: "auto",
		pagination: {
			el: ".swiper-pagination",
			type: "bullets",
			clickable: true,
		},
	});
}

function enableWeatherWidget() {
!function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
      js=d.createElement(s);
      js.id=id;
      js.src='https://weatherwidget.io/js/widget.min.js';
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(document,'script','weatherwidget-io-js');

  // Configure the widget options
  var options = {
    location: "Palma de Mallorca",
    size: "wide",
    unit: "C"
  };

  // Initialize the widget
  var widget = new WeatherWidgetIO("#weather-widget", options);
}
