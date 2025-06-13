import { redirect } from "next/navigation"

export default function Index() {
  // This file serves as an entry point for GitHub deployments
  // It simply redirects to the home page
  redirect("/")

  // This return statement is never reached due to the redirect,
  // but is included to satisfy TypeScript's requirement for a return value
  return null
}
