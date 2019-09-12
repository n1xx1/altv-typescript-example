import * as alt from "alt";
import chat from "chat";

alt.on("playerConnect", (player: alt.Player): boolean => {
    alt.emitClient(player, 'onFirstConnect');
    
    alt.log(`==> ${player.name} has connected.`);
    chat.broadcast(`==> ${player.name} has joined.`);
    
    return true;
});

alt.onClient("spawnPlayer", (player: alt.Player) => {
    alt.emitClient(player, 'screen:FadeOutFadeIn', 500, 1000);

    player.model = "ig_floyd";
    player.spawn(813, -279, 66, 500);

    setTimeout(() => {
        player.giveWeapon(453432689, 100, true);
        alt.emitClient(player, "playerSpawned");
    }, 1500);
});

