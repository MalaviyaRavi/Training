$(document).ready(function () {
  $("#wrap").click(function () {
    $("#wrapcontent").wrap("<em> </em>");
  });

  $(".m1 > button").click(function () {
    $(".m1 > p").wrapInner("<b></b>");
  });

  $("#prepend").click(function () {
    $(".m2").prepend(" <b>Newly added preppended text</b>.");
  });

  $("#append").click(function () {
    $(" <b>Newly added appended text</b>.").appendTo(".m2");
  });

  $("#after").click(function () {
    $("#title").after("<b>Newly added text after p</b>");
  });

  $("#before").click(function () {
    $("<b>Newly added text before p</b>").insertBefore("#title");
  });

  $("#empty").click(function () {
    $(".m3 > div").empty();
  });

  var x;
  $("#btn1").click(function () {
    x = $(".m4 > p").detach();
  });
  $("#btn2").click(function () {
    $(".m4").prepend(x);
  });

  $(".replaceAll").click(function () {
    $("<span><b>Hello world!</b></span>").replaceAll(".m5 > p");
  });
});
