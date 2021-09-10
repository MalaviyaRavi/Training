$(document).ready(function () {
  $(".m1 button").click(function () {
    $("img").attr("width", "500");
  });

  $("header button").click(function () {
    var $x = $("header div");
    $x.prop("color", "#e0eeee");
    $x.append("The value of the color property: " + $x.prop("color"));
    $x.removeProp("color");
    $x.append("<br>Now the value of the color property: " + $x.prop("color"));
  });

  $(".m2 button").click(function () {
    $(".m2 p").toggleClass("main");
  });

  $(".m3 div").click(function () {
    var color = $(this).css("background-color");
    var width = $(this).innerWidth();
    var outerWidth = $(this).outerWidth();
    $(".m3 #result").html(
      "Inner Width is <span>" +
        width +
        "</span>." +
        "Inner Width is <span>" +
        outerWidth +
        "</span>."
    );
    $(".m3 #result").css({ color: color, "background-color": "white" });

    $(document).scroll(function () {
      alert("Scrooling");
    });

    $("#b1").click(function () {
      $(".m4 div").data("name", "Welcome to the javaTpoint.com");
      alert("Data attached");
    });
    $("#b2").click(function () {
      alert($(".m4 div").data("name"));
      $(".m4 div").text($(".m4 div").data("name"));
    });
  });
});
