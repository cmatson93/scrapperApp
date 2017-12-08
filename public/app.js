// Whenever someone clicks a noteButton button
$(document).on("click", "#noteButton", function(){
  event.preventDefault();

  var thisID = this.value;

  $.ajax({
    method: "GET",
    url: "/note/" + thisID
  }).done(function(data){
    console.log(data);
    $("#modButtons").prepend("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

    $(".modal").fadeIn(300).css("display", "flex");
    // If there's a note in the article
    console.log(data.note.title);
    if (data.note.title) {
    //   // Place the title of the note in the title input
      $("#note-title").val(data.note.title);
      
    }
    if (data.note.body) {
    //   // Place the body of the note in the body textarea
      $("#note-body").val(data.note.body);
    }

    $("#articleTitle").text(data.title);

    $(document).on("click", "#savenote", function(){

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
        $(".modal").fadeOut(300).css("display", "none");
      })
    })

  })

  $(".closeMod").on("click", function(){
    $(".modal").fadeOut(300).css("display", "none");
  })

});

