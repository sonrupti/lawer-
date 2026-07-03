import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * GET /api/auth/profile
 *
 * Returns the current user's profile data.
 * Used by the Navbar and other components to display user info.
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('username, preferred_language, has_selected_language')
      .eq('id', user.id)
      .maybeSingle();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: profile?.username,
        preferredLanguage: profile?.preferred_language,
        hasSelectedLanguage: profile?.has_selected_language ?? false,
      },
    });
  } catch (err) {
    console.error('[/api/auth/profile] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
