import { SussyBot } from "../bot";

export const name = 'ready'

export const once = false;

export const execute = async (client: SussyBot) => {
    console.log(`Logged in as ${client.user!.tag}`)
}