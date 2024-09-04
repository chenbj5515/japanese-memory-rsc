"use client"
import { useCookies } from "react-cookie";

export default function App() {
  const [cookies] = useCookies(["user_id"]);
  if (!cookies.user_id) {
    window.location.href = "/welcome"
  }
  else {
    window.location.href = "/home"
  }
  return null;
}