import { supabase } from "@/lib/supabase";
import LawyerProfileClientPage from "./LawyerProfileClientPage";
import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";

// Disable page caching so edits on the admin screen reflect immediately on profile reloads
export const revalidate = 0;

export default async function Page({ params }) {
  // In Next.js 15+, params is a Promise. We must await it to get the parameter ID.
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Query Supabase for the single lawyer matching this ID and include all their nested cases.
  const { data: lawyer, error } = await supabase
    .from("lawyers")
    .select("*, cases(*)")
    .eq("id", id)
    .single();

  if (error || !lawyer) {
    console.error("Error fetching lawyer profile:", error);
    
    // If lawyer is not found in database, render a clean error state
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="glass-card p-8 border border-border bg-surface/10">
          <UserX className="mx-auto h-12 w-12 text-danger mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">Advocate Not Found</h2>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            The profile you are trying to view does not exist in our database records. It may have been removed or the ID is incorrect.
          </p>
          <Link 
            href="/lawyers" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO DIRECTORY
          </Link>
        </div>
      </div>
    );
  }

  return <LawyerProfileClientPage lawyer={lawyer} />;
}
