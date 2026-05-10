// /login is just an alias for /signup which has both modes.
import { redirect } from "next/navigation";

export default function LoginRedirect() {
  redirect("/signup");
}
