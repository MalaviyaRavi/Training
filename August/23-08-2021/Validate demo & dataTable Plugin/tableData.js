$(document).ready(function () {
  $("#table_id").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "csv", "excel", "pdf", "print"],
  });
});
