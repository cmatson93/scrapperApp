// First thing: ask the back end for json with all articles
// $.getJSON("/all", function(data) {
//   // Call our function to generate a table body
//   displayResults(data);
// });

// function displayResults(data) {
//   // Then, for each entry of that json...
//   console.log(data);
//   for (var i=0; i< data.length; i++) {
//     // Append each article to the doc
//     $("#results").prepend("<div class='articleDiv'><h2>" + data[i].title + "</h2>" +
//      "<a href='"+data[i].link+"'>Read Article</a><button>Save</button><button class='comment' id='"+data[i]._id+"' >Comment</button></div>");
//   };
// }


// Whenever someone clicks a comment button
$(document).on("click", ".comment", function(){
  console.log("comment button clicked");
  console.log(this.id);

  var thisID = this.id;

  $.ajax({
    method: "GET",
    url: "/articles/" + thisID
  }).done(function(data){
    console.log("done");
    console.log(data);
    console.log("========");
  })

});