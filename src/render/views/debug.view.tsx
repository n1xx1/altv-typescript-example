
import * as React from "react";
import * as ReactDOM from "react-dom";
import { typedRender } from "altv-typescript";
import { ViewDebugDefinitions } from "./debug";

const alt = typedRender<ViewDebugDefinitions>();

import "../global.scss";

function App({}: {}) {
    const [data, setData] = React.useState("");

    React.useEffect(() => {
        alt.on("data", handleData);
        return () => alt.off("data", handleData);
    });

    return <>
        <pre style={{ color: "#f00" }}>{ "\n\n\n" + data }</pre>
    </>;

    function handleData(data: string) {
        setData(data);
    }
}

ReactDOM.render(<App />, document.getElementById("wrapper"));
