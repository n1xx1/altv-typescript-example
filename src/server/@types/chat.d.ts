declare module "chat" {
    import { Player } from "alt";

    export function send(player: Player, msg: string): void;

    export function broadcast(msg: string): void;
    
    export function registerCmd(cmd: string, callback: (player: Player, args: string[]) => void): void;
    
    const defaultExport: { 
        send: typeof send, 
        broadcast: typeof broadcast, 
        registerCmd: typeof registerCmd,
    };
    export default defaultExport;

}