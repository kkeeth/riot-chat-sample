import "@riotjs/hot-reload";
import { component } from "riot";

import "./style.css";
import App from "./app.riot";

const mountApp = component(App);
mountApp(document.getElementById("root") || document.body, {
  title: "Hello RiotJS",
});
