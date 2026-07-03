import { supabase } from "@/lib/supabase";
import LawyersClientPage from "./LawyersClientPage";

// Setting revalidate to 0 tells Next.js not to cache this page.
// Whenever a user visits, Next.js will fetch the latest advocates and cases from Supabase.
export const revalidate = 0;

export default async function Page({ searchParams }) {
  // In Next.js 15+, searchParams is a Promise. We must await it before reading properties.
  const resolvedSearchParams = await searchParams;

  // Query Supabase for all lawyers, and automatically fetch their associated cases.
  // The 'cases(*)' syntax tells Supabase to join the tables and attach an array of case objects.
  const { data: lawyers, error } = await supabase
    .from("lawyers")
    .select("*, cases(*)")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching lawyers from Supabase:", error);
  }

  return (
    // We pass the lawyers data and the searchParams down to the Client page component
    <LawyersClientPage 
      initialLawyers={lawyers || []} 
      searchParams={resolvedSearchParams} 
    />
  );
}
