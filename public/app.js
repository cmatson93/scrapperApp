// First thing: ask the back end for json with all articles
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  // displayResults(data);
});

function displayResults(articles) {
  // First, empty the table
  $("#results").empty();

  // Then, for each entry of that json...
  articles.forEach(function(article) {
    console.log(article);
    // Append each of the animal's properties to the table
    $("#results").append("<div class='articleDiv'><h2>" + article.title + "</h2>" +
     "<a href='"+article.link+"'>Read Article</a></div>");
  });
}

// When user clicks the weight sort button, display table sorted by weight
$("#button").on("click", function() {
  // Set new column as currently-sorted (active)
  // setActive("#animal-weight");
  console.log("clicked");

  // Do an api call to the back end for json with all animals sorted by weight
  $.getJSON("/all", function(data) {
    // Call our function to generate a table body
    console.log(data);
    displayResults(data);
  });
});