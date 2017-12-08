// Whenever someone clicks a addNote button
$(document).on("click", "#noteButton", function(){
  event.preventDefault();
  console.log("addNote button clicked");
  console.log(this.value);

  var thisID = this.value;

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
    if (data.note.title) {
      // Place the title of the note in the title input
      $("#note-title").val(data.note.title);
      
    }
    if (data.note.body) {
      // Place the body of the note in the body textarea
      $("#note-body").val(data.note.body);
    }

    $("#articleTitle").text(data.title);

    $(document).on("click", "#savenote", function(){
      console.log(this);
      var newId = $(this).attr("data-id");

      $.ajax({
        method: "POST",
        url: "/note/"+ newId,
        data: {
          title: $("#note-title").val(),
          body: $("#note-body").val()
        }
      })
      .done(function(data){
        console.log(data);

      })
    })

  })

  $(".closeMod").on("click", function(){
    $(".modal").remove();
  })

});

