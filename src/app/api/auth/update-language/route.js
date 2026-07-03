import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/update-language
 * Body: { language }
 *
 * Saves the user's preferred language to their profile.
 * Also marks has_selected_language = true so the language page is skipped on future logins.
 */
export async function POST(request) {
  try {
    const { language } = await request.json();

    if (!language) {
      return NextResponse.json({ error: 'Language is required.' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Ensure the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        preferred_language: language,
        has_selected_language: true,
      })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Language preference saved.',
      preferredLanguage: language,
    });
  } catch (err) {
    console.error('[/api/auth/update-language] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
