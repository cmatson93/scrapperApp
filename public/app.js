// Whenever someone clicks a addNote button
$(document).on("click", "#noteButton", function(){
  console.log("addNote button clicked");
  console.log(this.value);

  var thisID = this.value;
  // $('.modal').on('shown.bs.modal', function () {
  //   $('#myInput').trigger('focus')
  // })

  $.ajax({
    method: "GET",
    url: "/note/" + thisID
  }).done(function(data){
    $("#modButtons").prepend("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    console.log("done");
    console.log(data);
    console.log("========");

    $(".modal").fadeIn(300).css("display", "flex");
    // If there's a note in the article
    if (data.note) {
      // Place the title of the note in the title input
      $("#titleinput").val(data.note.title);
      // Place the body of the note in the body textarea
      $("#bodyinput").val(data.note.body);
    }
    
    $("#articleTitle").text(data.title);
// $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

    $(document).on("click", "#savenote", function(){
      console.log(this);
      var newId = $(this).attr("data-id");

      $.ajax({
        method: "POST",
        url: "/note/"+ newId,
        data: {
          title: $("note-title").val(),
          body: $("#note-body").val()
        }
      })
      .done(function(data){
        console.log(data);

      })
    })

  })

});


// When you click the savenote button
// $(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  // console.log(this);
  // var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  // $.ajax({
  //   method: "POST",
  //   url: "/articles/" + thisId,
  //   data: {
  //     // Value taken from title input
  //     title: $("#titleinput").val(),
  //     // Value taken from note textarea
  //     body: $("#bodyinput").val()
  //   }
  // })
  //   // With that done
  //   .done(function(data) {
  //     // Log the response
  //     console.log(data);
  //     // Empty the notes section
  //     $("#notes").empty();
  //   });

  // // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
// });