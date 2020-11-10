const socket = io();

const params = jQuery.deparam(window.location.search);
document.getElementById("roomName").innerHTML =
  (params.room ? params.room : "random") + "'s room";
// console.log(params);

function scrollToBottom() {
  // Selectors
  const messages = jQuery("#messages");
  const newMessage = messages.children("li:last-child");
  // Heights
  const clientHeight = messages.prop("clientHeight");
  const scrollTop = messages.prop("scrollTop");
  const scrollHeight = messages.prop("scrollHeight");
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function () {
  socket.emit("join", params, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No err");
    }
  });
});

socket.on("disconnect", function () {
  console.log("Disconnected from thr server");
});

socket.on("updateUserList", function (users) {
  const ol = jQuery("<ol></ol>");

  users.forEach(function (user) {
    ol.append(jQuery("<li></li>").text(user));
  });

  jQuery("#users").html(ol);
});

// socket.on("newEmail", function (data) {
//   console.log("New email");
//   console.log(data);
// });

socket.on("newMessage", function (data) {
  //   console.log("New message: ", data);
  const { from, text, createdAt } = data;
  const formattedTime = moment(createdAt).format("h:mm a");

  const template = jQuery("#message-template").html();
  const html = Mustache.render(template, {
    text,
    from,
    createdAt: formattedTime,
    class:
      params.name.trim() === from.trim() ? "message yourMessage" : "message",
  });

  jQuery("#messages").append(html);
  scrollToBottom();

  //   const li = jQuery("<li></li>");
  //   li.text(`${from} ${formattedTime}: ${text}`);
  //   jQuery("#messages").append(li);
});

// socket.emit(
//   "createMessage",
//   {
//     from: "sender",
//     text: "hi",
//   },
//   function (data) {
//     console.log("Got it");
//     console.log(data);
//   }
// );

jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();
  e.stopPropagation();

  // const url = new URL(window.location);
  // const userName = url.searchParams.get("name");

  socket.emit(
    "createMessage",
    {
      from: params.name ? params.name : "user",
      text: jQuery("[name=message]").val(),
    },
    function (data) {
      document.getElementById("messageId").value = "";
      //   alert(data);
    }
  );
});

const locationBtn = jQuery("#send-location");

locationBtn.on("click", function () {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }

  locationBtn.attr("disabled", "disabled").text("Sending Location...");

  navigator.geolocation.getCurrentPosition(
    function (position) {
      locationBtn.removeAttr("disabled").text("Send Location");
      socket.emit("createLocationMessage", {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    },
    function (err) {
      locationBtn.removeAttr("disabled").text("Send Location");
      alert("Unable to fetch location.");
    }
  );
});

socket.on("newLocationMessage", function (data) {
  const { from, url, createdAt } = data;
  const formattedTime = moment(createdAt).format("h:mm a");

  const template = jQuery("#location-message-template").html();
  const html = Mustache.render(template, {
    from,
    url,
    createdAt: formattedTime,
    class:
      params.name.trim() === from.trim() ? "message yourMessage" : "message",
  });
  jQuery("#messages").append(html);
  scrollToBottom();

  //   const li = jQuery("<li></li>");
  //   const a = jQuery(`<a href="${url}" target="_blank">My Current Location</a>`);
  //   li.text(`${from} ${formattedTime}:  `);
  //   li.append(a);
  //   jQuery("#messages").append(li);
});
