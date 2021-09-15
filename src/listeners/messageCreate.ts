import { Message } from "discord.js";

export const name = 'messageCreate'

export const once = false;

export const execute = async(_: Message) : Promise<void> => {
    // console.log(message.content)
}