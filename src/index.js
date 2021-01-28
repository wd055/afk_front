import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import $ from "jquery";

import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
} from "@vkontakte/vkui";

const origin = "http://localhost:8000/";

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = $.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
var csrftoken = getCookie("csrftoken");
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
    // xhr.setRequestHeader("Origin", origin);
    xhr.setRequestHeader("vk-params", window.location.search);
  },
});

// Init VK  Mini App
bridge.send("VKWebAppInit");

bridge.subscribe(({ detail: { type, data } }) => {
  if (type === "VKWebAppUpdateConfig") {
    const schemeAttribute = document.createAttribute("scheme");
    schemeAttribute.value = data.scheme ? data.scheme : "client_light";
    document.body.attributes.setNamedItem(schemeAttribute);
  }
});

ReactDOM.render(
  <ConfigProvider isWebView={true}>
    <AdaptivityProvider>
      <AppRoot>
        <App />
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>,
  document.getElementById("root")
);
if (process.env.NODE_ENV === "development") {
  // import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
