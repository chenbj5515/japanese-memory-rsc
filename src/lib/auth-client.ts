import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // the base url of your auth server
})

export const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
    console.log(data)
}
export const signOut = async () => {
    const data = await authClient.signOut()
    console.log(data)
}
export const { signUp, useSession } = createAuthClient()