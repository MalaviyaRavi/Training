const usersEventHandler = function () {
  this.init = function () {
    _this.fieldMap = {};
    _this.socket = io("http://localhost:3000", {
      transports: ['websocket']
    });
    _this.socketEvents();
    _this.selectedFields = {};
    _this.fileId = null;
    _this.addUser();
    _this.displayUsers({});
    _this.exportToCsv();
    _this.uploadCSV();
    _this.displayUploadStatusReport();
    _this.logout();
  };

  this.displayUsers = function (options) {
    let url = "/api/users";
    if (options.export) {
      url = url + "?export=" + options.export;
    }
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        Authorization: $(document)[0].cookie.split("=")[1]
      },
      success: function (response) {
        if (response.type == "exportToCsv" && response.statusCode == 200) {
          let a = $("<a />");
          a.attr("download", response.csvFileName);
          a.attr("href", `/csvs/${response.csvFileName}`);
          $("body").append(a);
          a[0].click();
          $("body").remove(a);
          $.alert("Users CSV File exported");
          return;
        }

        if ((response.type = "invalidToken" && response.statusCode == 401)) {
          return $(location).attr("href", "/");
        }

        if (response.statusCode != 200) {
          $("usersList").append(`<h3>${response.message}</h3>`);
          return;
        }

        let tableHeader = `<tr>
      
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Mobile</th>
      </tr>`;
        $("#usersList").append(tableHeader);

        for (const user of response.users) {
          let userDataRow = `<tr>
            
              <td scope="col">${user.name}</td>
              <td scope="col">${user.email}</td>
              <td scope="col">${user.mobile}</td>
            </tr>`;
          $("#usersList").append(userDataRow);
        }
      },
    });
  };

  this.addUser = function () {
    $("#addUserForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 3,
        },
        mobile: {
          required: true,
          minlength: 3,
          remote: "/api/users/check",
        },
        email: {
          required: true,
          remote: "/api/users/check",
        },
        password: {
          required: true,
          minlength: 3,
        },
      },
      messages: {
        name: {
          required: "name is required",
        },
        mobile: {
          required: "mobile is required.",
          remote: "mobile number already registered",
        },
        email: {
          required: "email is required",
          remote: "email already registred",
        },
        password: {
          required: "address is required",
          minlength: "mobile should be minimum 6 characters long",
        },
      },
      errorClass: "text-danger",

      //user add
      submitHandler: function (form, event) {
        event.preventDefault();

        let name = $("#name").val();
        let mobile = $("#mobile").val();
        let email = $("#email").val();
        let password = $("#password").val();

        $.ajax({
          url: "/api/users",
          type: "POST",
          data: {
            name,
            mobile,
            email,
            password
          },
          headers: {
            Authorization: $(document)[0].cookie.split("=")[1]
          },
          success: function (response) {
            if (response.statusCode != 201) {
              alert(response.message);
              return;
            }

            let userDataRow = `<tr>
            <td scope="col">${response.user.name}</td>
            <td scope="col">${response.user.email}</td>
            <td scope="col">${response.user.mobile}</td>
          </tr>`;
            $("#usersList").append(userDataRow);
            $("#addUserForm")[0].reset();
          },
        });
      },
    });
  };

  this.logout = function () {
    $("#btnLogout").on("click", function () {
      $.ajax({
        url: "/api/logout",
        method: "GET",
        success: function (response) {
          if (response.type == "success") {
            $(location).attr("href", "/");
          }
        },
      });
    });
  };

  this.exportToCsv = function () {
    $("#btnExport").on("click", function () {
      _this.displayUsers({
        export: true
      });
    });
  };

  this.uploadCSV = function () {
    $("#btnUpload").on("click", function () {
      if ($("#csvFile")[0].files.length === 0) {
        $("#error").html("please select file");
        return;
      }
      if ($("#csvFile")[0].files[0].type != "text/csv") {
        $("#error").html("please upload csv file");
        return;
      }
      let formData = new FormData($("#uplosdCsv")[0]);
      $.ajax({
        url: "/api/upload/csv",
        type: "post",
        data: formData,
        contentType: false,
        processData: false,
        headers: {
          Authorization: $(document)[0].cookie.split("=")[1]
        },
        xhr: function () {
          //upload Progress
          let xhr = $.ajaxSettings.xhr();
          if (xhr.upload) {
            $("#progress-wrp").css("display", "block");
            xhr.upload.addEventListener('progress', function (event) {
              let percent = 0;
              let position = event.loaded || event.position;
              let total = event.total;
              if (event.lengthComputable) {
                percent = Math.ceil(position / total * 100);
              }
              //update progressbar
              $(".progress-bar").css("width", +percent + "%");
              $(".status").text(percent + "%");
            }, true);
          }
          return xhr;
        },
        success: function (response) {
          if (response.type == "error") {
            alert(response.message);
            return;
          }
          _this.selectedFields = {};
          let optionString = '';
          let dbFields = response.dbFields;
          for (const field of dbFields) {
            optionString = optionString + `<option value="${field}">${field}</option>`;
          }
          _this.fileId = response.fileId;

          for (let fieldIndex = 0; fieldIndex < response.firstRow.length; fieldIndex++) {

            let $row = `<tr id="${response.csvHeaderField[fieldIndex]}" class="fieldRow">

            <td>${response.firstRow[fieldIndex]}</td>
            <td>${response.secondRow[fieldIndex]}</td>
            <td>
                <select name="default" id="${response.csvHeaderField[fieldIndex]}-dropdown" class="dbOption form-select">
                    <option value="default" selected>select db field</option>
                    ${optionString}
                    <option value="add" id = "addNewField">Add New Field</option>
                </select>
            </td>
        </tr>`
            $("#mappingDetails").append($row);
          }
          console.log("beofre");
          $('#fieldMapping').modal({
            backdrop: 'static',
            keyboard: false
          })
          console.log("after");
          $('#fieldMapping').modal('show');
        },
      });
    });

    $("#btnModalUpload").on("click", function (e) {
      $("#modelError").text("");
      let skipRow = $("#skipRow").prop("checked");
      let selectedRows = [];
      $('.fieldRow').each(function (i) {
        let field = $(this).attr("id");

        let dbField = $(`#${field}-dropdown option:selected`).val();
        if (dbField != "default") {
          selectedRows.push(dbField);
          _this.fieldMap[dbField] = field
        }

      });
      console.log(selectedRows, "sfdgjsdjlg");

      if (!selectedRows.includes("email") || !selectedRows.includes("mobile") || !selectedRows.includes("name")) {
        $.toast({
          heading: 'Warning',
          text: `please selectet required fields(name, email & mobile)`,
          showHideTransition: 'plain',
          icon: 'warning',
          hideAfter: 2000,
          allowToastClose: true,
          stack: 3,
          position: 'top-center',
        })

        return;
      }


      $.ajax({
        url: "/api/fieldMap?fileId=" + _this.fileId + "&skipRow=" + skipRow,
        headers: {
          Authorization: $(document)[0].cookie.split("=")[1]
        },
        type: "POST",
        data: _this.fieldMap,
        success: function (response) {
          console.log(response);
          if (response.type == "success") {
            $("#mappingDetails").html("");
            $('#fieldMapping').modal('hide');
            $("#progress-wrp").css("display", "none");
            $.alert(response.message);
          } else {
            $.alert(response.message);
          }
        }
      })
    })

    $(document).on("change", ".dbOption", function (e) {
      $this = $(this);

      if ($(this).val() === "add") {
        let newField = prompt("enter new field");
        if (!newField) {
          return;
        }
        $.ajax({
          url: "/api/field/add",
          data: {
            newField: newField
          },
          method: "POST",
          success: function (response) {
            if (response.type == "error") {
              return $.alert(response.message)
            }
            $(`<option value="${newField}">${newField}</option>`).insertBefore(".dbOption #addNewField")
            $this.val(newField).attr("selected", true);
            $this.attr('name', newField);
            _this.selectedFields[newField] = 1;
          }
        })
        return;
      }


      let prevValue = $this.attr("name");
      let current = $this.val();

      if (_this.selectedFields.hasOwnProperty(current)) {
        $.toast({
          heading: 'Warning',
          text: `${current} already selected try new one`,
          showHideTransition: 'plain',
          icon: 'warning',
          hideAfter: 2000,
          allowToastClose: true,
          stack: 3,
          position: 'top-center',
        })
        $this.val(prevValue).attr("selected", true);
      } else {
        $this.attr("name", current)
        if (current !== "default") {
          delete _this.selectedFields[prevValue];
          _this.selectedFields[current] = 1;
        } else {
          delete _this.selectedFields[prevValue];
        }
      }


      /*$(this).attr('name', $(this).val());
      let newSelectedValue = $(this).val();

      if (previousSelectedValue === newSelectedValue) {
        return;
      }

      if (previousSelectedValue === "default" && newSelectedValue !== "default") {
        selectedField[newSelectedValue] = 1;
        for (const field of Object.keys(selectedField)) {
          $(`.dbOption option[value=${field}]`).prop("disabled", true);
        }
        return;
      }

      if (previousSelectedValue !== "default" && newSelectedValue === "default") {
        $(`.dbOption option[value=${previousSelectedValue}]`).prop("disabled", false);
        delete selectedField[previousSelectedValue];
        for (const field of Object.keys(selectedField)) {
          $(`.dbOption option[value=${field}]`).prop("disabled", true);
        }
        return;
      }

      if (previousSelectedValue !== "default" && newSelectedValue !== "default") {
        $(`.dbOption option[value=${previousSelectedValue}]`).prop("disabled", false);
        delete selectedField[previousSelectedValue];
        selectedField[newSelectedValue] = 1;
        for (const field of Object.keys(selectedField)) {
          $(`.dbOption option[value=${field}]`).prop("disabled", true);
        }
      }*/

    })
    //file select change event
    $("#csvFile").change(function () {
      $("#error").text("");
    });

    $("#btnModelClose").on("click", function () {
      $.ajax({
        url: "/api/files/" + _this.fileId,
        method: "DELETE",
        success: function (response) {
          $("#mappingDetails").html("");
        }
      })
    })

  };

  this.displayUploadStatusReport = function () {
    $.ajax({
      url: "/api/files",
      method: "GET",
      success: function (response) {
        if (response.type == "error") {
          return $.alert(response.message)
        }

        $("#fileStatus").html("");

        $("#fileStatus").append(`<tr>
        <th>FileName</th>
        <th>totalRecords</th>
        <th>Parsed Rows</th>
        <th>Duplicate Rows(DB)</th>
        <th>Duplicate Rows(CSV)</th>
        <th>Discarded Rows</th>
        <th>Total Uploaded Rows</th>
        <th>Status</th>
        <th>Percent Upload</th>
    </tr>`)

        for (const file of response.files) {

          let $span = null;
          let $status = null;
          if (file.status == "pending") {
            console.log(file);
            $status = `<span class="text text-danger">${file.status}</span>`
            $span = `<span class="text text-danger">${file.percentUpload}%</span>`
          }
          if (file.status == "inProgress") {
            $status = ` <span class="text text-primary">${file.status}</span>`
            $span = ` <span class="text text-primary">${file.percentUpload}%</span>`
          }
          if (file.status == "uploaded") {
            $status = ` <span class="text text-success">${file.status}</span>`
            $span = ` <span class="text text-success">${file.percentUpload}%</span>`
          }


          let fileRow = `<tr>
          <td>${file.Name}</td>
          <td>${file.totalRecords}</td>
          <td>${file.parsedRows}</td>
          <td>${file.duplicateRecords}</td>
          <td>${file.duplicateRecordsInCsv}</td>
          <td>${file.discardredRecords}</td>
          <td>${file.totalUploadedRecords}</td>
          <td>${$status}</td>
          <td>
             ${$span}
          </td>
      </tr>`

          $("#fileStatus").append(fileRow)
        }
      }
    })
  }

  this.socketEvents = function () {

    // $("#btnStartCron").on("click", function () {
    //   console.log("start");
    //   $(this).addClass("d-none");
    //   $("#btnStopCron").removeClass("d-none");
    //   _this.socket.emit("cronStart");
    // })

    // $("#btnStopCron").on("click", function () {
    //   console.log("stop");
    //   $(this).addClass("d-none");
    //   $("#btnStartCron").removeClass("d-none");
    //   _this.socket.emit("cronStop");
    // })



    _this.socket.on("statusChange", function () {
      _this.displayUploadStatusReport();
    })

    _this.socket.on("cronStart", function () {
      console.log("jo start");
      $.toast({
        text: `cron job start`,
        icon: 'info',
        showHideTransition: 'slide',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 3,
        position: 'top-right',
        textAlign: 'left',
        loaderBg: '#174646',
      });
    })

    _this.socket.on("fileProcessStart", function (payLoad) {
      $.toast({
        text: `${payLoad.fileName} uploading start`,
        icon: 'info',
        showHideTransition: 'slide',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 3,
        position: 'top-right',
        textAlign: 'left',
        loaderBg: '#174646',
      });
    })

    _this.socket.on("fileProcessEnd", function (payLoad) {
      $.toast({
        text: `${payLoad.fileName} uploading done`,
        icon: 'info',
        showHideTransition: 'slide',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 3,
        position: 'top-right',
        textAlign: 'left',
        loaderBg: '#174646',
      });
    })
  }

  let _this = this;
  this.init();
};