document.addEventListener("DOMContentLoaded", async () => {

    loadContactContent();

});

function loadContactContent() {

    prepButton();

};


function prepButton() {


    document.getElementById('contact-form').addEventListener('submit', function(event) {
      event.preventDefault();
			emailjs.init('2ovVyhBf8xZZ66Dyp')
      // generate a five digit number for the contact_number variable
      this.contact_number.value = Math.random() * 100000 | 0;
      // these IDs from the previous steps
      emailjs.sendForm('service_w7eyps8', 'template_k7mbir6', this)
            .then(function() {
              console.log('SUCCESS!');
            }, function(error) {
              console.log('FAILED...', error);
            });
        })


};