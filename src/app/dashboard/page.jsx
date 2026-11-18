
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";

// Dashboard Main Page
// এটি Server Component। তাই এখানে useSession লাগবে না।

export default async function DashboardPage() {

  // STEP 1:
  // BetterAuth থেকে বর্তমান Login করা User-এর Session আনব।

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  // STEP 2:
  // User Login না করলে Sign In Page-এ পাঠাব।

  if (!session) {
    redirect("/sign-in");
  }


  // STEP 3:
  // Database থেকে User-এর Role সংগ্রহ করব।

  const role = session.user.role;


  // STEP 4:
  // Admin হলে Admin Dashboard-এ পাঠাব।

  if (role === "admin") {
    redirect("/dashboard/admin");
  }


  // STEP 5:
  // Technician হলে Technician Dashboard-এ পাঠাব।

  if (role === "technician") {
    redirect("/dashboard/technician");
  }


  // STEP 6:
  // Customer হলে Customer Dashboard-এ পাঠাব।

  if (role === "customer") {
    redirect("/dashboard/customer");
  }


  // STEP 7:
  // Role পাওয়া না গেলে Sign In Page-এ পাঠাব।

  redirect("/sign-in");
}
