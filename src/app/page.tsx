"use client"
// import { useCookies } from "react-cookie";

// export default function App() {
//   const [cookies] = useCookies(["user_id"]);
//     if (!cookies.user_id) {
//       window.location.href = "/welcome"
//     }
//     else {
//       window.location.href = "/home"
//     }
//   return null;
// }

// export const dynamic = "force-dynamic";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
    </div>
  );
}
