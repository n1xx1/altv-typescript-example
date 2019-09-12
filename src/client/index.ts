import * as alt from "alt";
import * as game from "natives";
import { mat4, vec3, vec2, vec4 } from "gl-matrix";
import { ViewDebugDefinitions } from "../render/views/debug.d";
import { typedView } from "altv-typescript";

const debugView = typedView<ViewDebugDefinitions>("http://resource/build/render/view_debug.html");

alt.onServer("onFirstConnect", () => {
    alt.log("connected!");
    alt.emitServer("spawnPlayer");
});

alt.onServer("screen:FadeOutFadeIn", (timeOut: number, timeIn: number) => {
    game.doScreenFadeOut(timeOut);
    alt.setTimeout(() => {
        game.doScreenFadeIn(timeIn);
    }, timeOut);
});

alt.onServer("playerSpawned", () => {
	game.setPedDefaultComponentVariation(game.playerPedId());
	
	debugView.emit("data", "test");
});

