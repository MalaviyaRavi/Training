const userEventHandler = function () {
  //user edit mode flag
  this.inEditMode = false;

  //for search query
  this.hasSearch;
  this.searchedGender;

  // for sorting
  this.sortBy;
  this.sortingOrder;

  $(window)[0].addEventListener("beforeunload", (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = "sure want to exit??";
  });

  this.init = function () {
    _this.validateFormAndSave();
    _this.editUser();
    _this.cancelEditOperation();
    _this.deleteUser();
    _this.getUsersByQuery();
    _this.showUsers({});
    _this.getUserDetail();
    _this.filterInputSearchEvents();
    _this.exportsCsvEvents();
    _this.cronController();
  };

  this.validateFormAndSave = function () {
    $.validator.addMethod("checkfiletype", function (value) {
      if (value.length) {
        let extensions = ["jpg", "jpeg", "png", "JPEG", "JPG", "PNG"];
        let fileExtension = value.split(".")[1];
        return extensions.includes(fileExtension);
      } else {
        return true;
      }
    });

    //validation
    $("#signup_form").validate({
      rules: {
        firstname: {
          required: true,
          minlength: 3,
        },
        lastname: {
          required: true,
          minlength: 3,
        },
        gender: {
          required: true,
        },
        address: {
          required: true,
        },
        interest: {
          required: true,
        },
        hobby: {
          required: true,
        },
        image: {
          checkfiletype: true,
        },
      },
      messages: {
        firstname: {
          required: "firstname is required.",
          minlength: "firstname should be 3 characters long.",
        },
        lastname: {
          required: "lastname is required.",
          minlength: "lastname should be 3 characters long.",
        },
        gender: {
          required: "gender is required",
        },
        address: {
          required: "address is required",
        },
        interest: {
          required: "interest is required",
        },
        hobby: {
          required: "select at least one hobby",
        },
        image: {
          checkfiletype: "profile image must be jpg, jpeg and png type",
        },
      },
      errorClass: "error fail-alert",
      errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
          error.insertAfter(element.parent().parent());
        } else {
          error.insertAfter(element);
        }
      },
      //user save & update
      submitHandler: function (form, event) {
        event.preventDefault();

        let formData = new FormData(form);

        $.ajax({
          url: "/api/users",
          type: "post",
          data: formData,
          contentType: false,
          processData: false,
          success: function (response) {
            let activePagenumber = Number($(".pageBtn.btn-primary").text());

            if (response.isUpdated) {
              $.alert(response.message);
              $("#btnUpdate").html("Add User").attr("id", "btnSave");
              $("#btnCancel").remove();
              $("#editImage").remove();
              $(".edit-btn").attr("disabled", false);
              $(".delete-btn").attr("disabled", false);
              $(".pageBtn").attr("disabled", false);
              $("#userId").remove();
              $("#signup_form")[0].reset();
              $("input:radio").attr("checked", false);
              _this.showUsers({ page: activePagenumber });
            }
            if (response.isAdded) {
              $.alert(response.message);
              $("#signup_form")[0].reset();
              _this.showUsers({});
            }
            if (response.hasError) {
              $.alert(response.message);
            }
          },
        });
      },
    });
  };

  this.editUser = function () {
    //edit user
    $(document)
      .off("click", ".edit-btn")
      .on("click", ".edit-btn", function () {
        _this.inEditMode = true;

        if ($("label.error.fail-alert").length) {
          $("label.error.fail-alert").remove();
        }

        let userId = $(this).data("id");
        $.ajax({
          url: "/api/users/" + userId,
          type: "get",
          success: function ({ success, message, data }) {
            let activePagenumber = Number($(".pageBtn.btn-primary").text());
            if (success) {
              $("#firstname").val(data.firstname);
              $("#lastname").val(data.lastname);
              $("#address").val(data.address);
              $("#" + data.gender).attr("checked", true);
              $("#interest").val(data.interest);
              $("#hobby")
                .find("[value=" + data.hobbies.join("], [value=") + "]")
                .prop("checked", true);

              $("#image").before(
                "<img src=/img/" +
                  data.image +
                  " height=50, width=50 id='editImage'/>"
              );

              $("#firstname").after(
                ' <input type="hidden" id="userId" name="userId" value=' +
                  data._id +
                  ">"
              );

              $("#btnSave").html("Update User").attr("id", "btnUpdate");
              $("#actionBtns").prepend(
                "<button class='btn btn-danger' id='btnCancel'>Cancel</button>"
              );
              // _this.showUsers("undefined", "undefined", activePagenumber);
              $(".edit-btn").attr("disabled", true);
              $(".delete-btn").attr("disabled", true);
            }
            if (!success) {
              $.alert(message);
            }
          },
        });
      });
  };

  this.cancelEditOperation = function () {
    //cancel update operation
    _this.inEditMode = false;
    $(document)
      .off("click", "#btnCancel")
      .on("click", "#btnCancel", function () {
        $("#btnUpdate").html("Add User").attr("id", "btnSave");
        $("#signup_form")[0].reset();
        $("input:radio").attr("checked", false);
        $("#editImage").remove();
        $("#userId").remove();
        $(".edit-btn").attr("disabled", false);
        $(".delete-btn").attr("disabled", false);
        $(".pageBtn").attr("disabled", false);
        $("label.error.fail-alert").remove();
        $(this).remove();
      });
  };

  this.deleteUser = function () {
    $(document)
      .off("click", ".delete-btn")
      .on("click", ".delete-btn", function () {
        let current = this;
        $.confirm({
          title: "Delete User",
          content: "Are You Sure Want To Delete??",
          buttons: {
            confirm: function () {
              let userId = $(current).data("id");
              $.ajax({
                url: "/api/users/" + userId + "",
                type: "delete",
                success: function ({ success, message, data }) {
                  let activePagenumber = Number(
                    $(".pageBtn.btn-primary").text()
                  );

                  //if one user in last page
                  let lastPageNumber = Number(
                    $(".pagination").find(".pageBtn:last").html()
                  );
                  if (
                    activePagenumber == lastPageNumber &&
                    $("tr").length == 1
                  ) {
                    activePagenumber--;
                  }

                  if (success) {
                    $("." + userId).remove();
                    $.alert(message);
                    _this.showUsers({ page: activePagenumber });
                  }
                  if (!success) {
                    $.alert(message);
                  }
                },
              });
            },
            cancel: function () {},
          },
        });
      });
  };

  //display users
  // sortBy, sortingOrder, search, gender, page = 1
  this.showUsers = function (args) {
    console.log("keys", args);

    let page;
    if (!args.page) {
      page = 1;
    } else {
      page = args.page;
      delete args.page;
    }

    let url = "/api/users/?page=" + page;

    for (const key in args) {
      if (args[key]) {
        url = url + "&" + key + "=" + args[key];
      }
    }

    $.ajax({
      url: url,
      type: "get",
      success: function (response) {
        if (response.type == "success") {
          if (response.isDownload) {
            let a = $("<a />");
            a.attr("download", response.csvFileName);
            a.attr("href", `/csvs/${response.csvFileName}`);
            $("body").append(a);
            a[0].click();
            $("body").remove(a);
            $.alert("Users CSV File exported");
            return;
          }

          if (response.isQueryStored) {
            $.alert("CSV Link Will Be Sent Specified Email");
            return;
          }
        }
        $("#users").html("");
        $("#users").html(response);
      },
    });
  };

  //get users by query
  this.getUsersByQuery = function () {
    //sorting
    $(document).on("click", "th", function () {
      //if user in editing mode
      if (_this.inEditMode) {
        $("#btnUpdate").html("Add User").attr("id", "btnSave");
        $("#signup_form")[0].reset();
        $("input:radio").attr("checked", false);
        $("#editImage").remove();
        $("#userId").remove();
        $(".edit-btn").attr("disabled", false);
        $(".delete-btn").attr("disabled", false);
        $(".pageBtn").attr("disabled", false);
        $("label.error.fail-alert").remove();
        $("#btnCancel").remove();
      }

      console.log("clicked");

      let sortBy = $(this).data("column");
      let sortingOrder = $(this).data("order");
      _this.sortBy = sortBy;
      _this.sortingOrder = sortingOrder;

      _this.showUsers({
        sortBy: sortBy,
        sortingOrder: sortingOrder,
        search: _this.hasSearch,
        gender: _this.searchedGender,
      });
    });

    //pagination
    $(document).on("click", ".pageBtn", function () {
      //if user in editing mode
      if (_this.inEditMode) {
        $("#btnUpdate").html("Add User").attr("id", "btnSave");
        $("#signup_form")[0].reset();
        $("input:radio").attr("checked", false);
        $("#editImage").remove();
        $("#userId").remove();
        $(".edit-btn").attr("disabled", false);
        $(".delete-btn").attr("disabled", false);
        $("label.error.fail-alert").remove();
        $("#btnCancel").remove();
      }

      let currentBtnText = $(this).text();
      let curretnActivePage = Number($(".pageBtn.btn-primary").text());

      let destinationPage;
      if (currentBtnText == "Previous") {
        destinationPage = curretnActivePage - 1;
      } else if (currentBtnText == "Next") {
        destinationPage = curretnActivePage + 1;
      } else {
        destinationPage = Number(currentBtnText);
      }
      if (_this.hasSearch != "undefined") {
        search = _this.hasSearch;
      }
      _this.showUsers({
        sortBy: _this.sortBy,
        sortingOrder: _this.sortingOrder,
        search: _this.hasSearch,
        gender: _this.searchedGender,
        page: destinationPage,
      });
    });

    //searching
    $("#searchBtn").click(function () {
      let genderSelection = $("#searchGender").val();

      if (genderSelection != "all") {
        _this.searchedGender = genderSelection;
      }

      let query = $("#search").val();
      if (query.length) {
        _this.hasSearch = query;
      }
      _this.showUsers({ search: query, gender: _this.searchedGender });
    });

    $("#clearBtn").click(function () {
      $("#search").val("");
      _this.hasSearch = "undefined";
      _this.searchedGender = "undefined";
      $("#searchGender option[value='all']").prop("selected", true);
      $(this).attr("disabled", true);
      _this.showUsers({});
    });

    $("#resetSort").click(function () {
      _this.sortingOrder = undefined;
      _this.sortBy = undefined;
      _this.showUsers({});
    });
  };

  //view users all details
  this.getUserDetail = function () {
    $(document).on("click", ".btnView", function () {
      let userId = $(this).data("id");
      console.log(userId);
      $.ajax({
        url: "/api/users/user/" + userId,
        type: "get",
        dataType: "html",
        success: function (res) {
          $(".modal-title").html(res.firstname);
          $("#userDetails .modal-body").html(res);
          $("#userDetails").modal("show");
        },
      });
    });
  };

  this.filterInputSearchEvents = function () {
    $("#search").change(function () {
      let searchText = $(this).val();
      if (searchText.length) {
        $("#clearBtn").attr("disabled", false);
      } else {
        $("#clearBtn").attr("disabled", true);
      }
    });
  };

  this.validateEmail = function (email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  this.exportsCsvEvents = function () {
    $("#exportsToCsv").click(function () {
      let activePagenumber = Number($(".pageBtn.btn-primary").text());
      _this.showUsers({
        page: activePagenumber,
        search: _this.hasSearch,
        gender: _this.searchedGender,
        sortBy: _this.sortBy,
        sortingOrder: _this.sortingOrder,
        export: true,
      });
    });

    $("#exportsToEmail").click(function () {
      let activePagenumber = Number($(".pageBtn.btn-primary").text());
      let email = prompt("enter email here");

      if (email) {
        let isValidEmail = _this.validateEmail(email);

        if (!isValidEmail) {
          $.alert("enter valid email try again");
          return;
        }

        _this.showUsers({
          page: activePagenumber,
          search: _this.hasSearch,
          gender: _this.searchedGender,
          sortBy: _this.sortBy,
          sortingOrder: _this.sortingOrder,
          export: true,
          email: email,
        });
      }
    });
  };

  this.cronController = function () {
    $("#cronControl").click(function () {
      let $cronControlBtn = $(this);

      let cronStatus = $(this).data("cron");
      $(this).data("cron", !cronStatus);
      cronStatus = $(this).data("cron");
      $.ajax({
        url: "/api/users/changeCronControl",
        type: "post",
        data: { cronStatus: cronStatus },
        success: function (response) {
          let cronStatusAlert = !cronStatus
            ? "Cron service has been Stoped"
            : "Cron Service has been Started";
          $cronControlBtn.text(!cronStatus ? "Start Cron" : "Stop Cron");
        },
      });
    });
  };

  let _this = this;

  this.init();
};
