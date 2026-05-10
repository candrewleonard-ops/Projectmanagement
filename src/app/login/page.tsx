// /login is just an alias for /signup which has both modes.
export const runtime = 'edge';

import { redirect } from "next/navigation";

export default function LoginRedirect() {
  redirect("/signup");
}
