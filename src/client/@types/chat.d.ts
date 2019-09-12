import { Player } from "alt";

declare module "chat" {

    export function pushMessage(name: string, text: string): void;

    export function pushLine(text: string): void;
    
    const defaultExport: { 
        pushMessage: typeof pushMessage, 
        pushLine: typeof pushLine,
    };
    export default defaultExport;

}