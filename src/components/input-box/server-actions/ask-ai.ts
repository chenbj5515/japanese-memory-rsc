"use server"
import { fetchChatApi } from "@/utils";

export async function askAI(originalText: string, propmt: string) {
    const response = await fetchChatApi(originalText, propmt);
    const data = await response.json();
    return data?.choices?.[0]?.message?.content;
}
