const userEventHandler = function () {
  this.init = function () {
    _this.openFileManager();
  };

  this.loadFiles = function () {
    $.ajax({
      url: "/files",
      type: "get",
      success: function (res) {
        console.log("response");
        console.log(res);
        $("#files").modal("show");
      },
    });
  };

  this.openFileManager = function () {
    $(".btnShow").on("click", function () {
      _this.loadFiles();
    });
  };
  let _this = this;
  this.init();
};
