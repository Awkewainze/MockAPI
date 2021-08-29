import '@fortawesome/fontawesome-free/css/all.css';
import "bootstrap/dist/js/bootstrap";
import "bootswatch/dist/darkly/bootstrap.min.css";
import * as React from "react";
import { render } from "react-dom";
// import "regenerator-runtime/runtime";
import { Main } from "./components";
import "./styles.scss";

document.addEventListener("DOMContentLoaded", () => {
    render(<Main />, document.body)
});