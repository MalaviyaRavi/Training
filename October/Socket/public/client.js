const socket = io();

$.noConflict();

jQuery(document).ready(function () {
  jQuery.get(
    "http://localhost:3000/users",
    function ({ onlineusers, offlineusers }) {
      let useritem;
      jQuery("#users").html("");
      console.log(users, "hello");
      if (onlineusers.length != 0) {
        onlineusers.forEach((user) => {
          console.log(user);
          useritem = `   <div class="list-item user-${user._id} socketid-${user.user_socket_id}" data-id="7" style="background-color:#3CB371">
        <div><a href="#" data-abc="true"><span class="w-48 avatar gd-primary"><img
                        src="https://img.icons8.com/color/48/000000/administrator-male.png"
                        alt="."></span></a></div>
        <div class="flex"> <a href="#" class="item-author text-color" data-abc="true">${user.username}</a>
            <div class="item-except text-muted text-sm h-1x">For what reason would it be advisable
                for me to think about business content?</div>
        </div>
        <div class="no-wrap">
            <div class="item-date text-muted text-sm d-none d-md-block">21 July</div>
        </div>
    </div>
    `;
          jQuery("#users").append(useritem);
        });
      }

      if (offlineusers.length != 0) {
        offlineusers.forEach((user) => {
          console.log(user);
          useritem = `   <div  class="list-item  user-${user._id}" data-id="7">
          <div><a href="#" data-abc="true"><span class="w-48 avatar gd-primary"><img
                          src="https://img.icons8.com/color/48/000000/administrator-male.png"
                          alt="."></span></a></div>
          <div class="flex"> <a href="#" class="item-author text-color" data-abc="true">${user.username}</a>
              <div class="item-except text-muted text-sm h-1x">For what reason would it be advisable
                  for me to think about business content?</div>
          </div>
          <div class="no-wrap">
              <div class="item-date text-muted text-sm d-none d-md-block">21 July</div>
          </div>
      </div>
      `;
          jQuery("#users").append(useritem);
        });
      }
    }
  );

  jQuery(".list-item").each(function (item) {
    console.log("Each Loop");
    item.on("click", function () {
      let classlist = item.attr("class");
      let userid = classlist[1].split("-")[1];
      let sockerid = classlist[2].split("-")[1];
      console.log(userid);
      console.log("socketid---------", sockerid);
    });
  });
});

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

socket.on("new_user_online", (data) => {
  console.log("userid user enter--------- ", data.sessionValue);
  jQuery(".user-" + data.sessionValue).css("background-color", "#3CB371");
  jQuery(".user-" + data.sessionValue).addClass(
    "socketid-" + data.connection_id
  );
});

socket.on("oneuserleft", (userid) => {
  console.log("userid userleft--------------------", userid);
  jQuery(".user-" + userid).css("background-color", "#FFFFFF");
});

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  //   console.log(className);
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Recieve messages
socket.on("message", (msg) => {
  // msg, "incoming";
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
