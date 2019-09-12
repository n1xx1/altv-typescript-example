
import * as React from "react";
import * as ReactDOM from "react-dom";
import { typedRender } from "altv-typescript";
import { ViewLoginDefinitions } from "./login";

const alt = typedRender<ViewLoginDefinitions>();

require("../global.scss");

function App({}: {}) {
    return <></>;
}

ReactDOM.render(<App />, document.getElementById("wrapper"));
