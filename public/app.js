// First thing: ask the back end for json with all articles
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

function displayResults(articles) {
  // Then, for each entry of that json...
  console.log(articles);
  articles.forEach(function(article) {
    console.log(article);
    // Append each article to the doc
    $("#results").append("<div class='articleDiv'><h2>" + article.title + "</h2>" +
     "<a href='"+article.link+"'>Read Article</a><button>Save</button><button>Comment</button></div>");
  });
}

// When user clicks the scrape button, scrape for any new articles and prepend those to the page
$("#scrape-articles").on("click", function() {
  // Set new column as currently-sorted (active)
  // setActive("#animal-weight");
  console.log("clicked");
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data){
    console.log(data);
    console.log("____SUCESS____");
    displayResults(data);
    // $.getJSON("/all", function(data) {
    //   // Call our function to generate a table body
    //   console.log("____SUCESS____");
    //   console.log(data);
    //   displayResults(data);
    // });
  })
  // Do an api call to the back end for json with all animals sorted by weight

});