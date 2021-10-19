const socket = io({ autoConnect: false });

$(document).ready(function () {});

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    // user: name,
    message: message.trim(),
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  //   console.log(className);
  mainDiv.classList.add(className, "message");

  let markup = `
        
        <p>${msg}</p>
    `;

  // <h4>${msg}</h4>
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
