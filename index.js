function loadHeader() {
    fetch("HeaderFooter/header.html")
        .then(function(headertext){
            return headertext.text();
        })
        .then(function(data) {
            document.querySelector("#header").innerHTML = data;
        });
}

loadHeader();

function loadFooter() {
    fetch("HeaderFooter/footer.html")
        .then(function(footertext) {
            return footertext.text();
        })
        .then(function(data) {
            document.querySelector("#footer").innerHTML = data;
        });
}

loadFooter();

$("#contactform").submit(function(event) {

    event.preventDefault();

    $("#submitConfirm").text("All right, Your message has been submitted! Please wait for a confirmation sent to your email.");

    this.reset();

});