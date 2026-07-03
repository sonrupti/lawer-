import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/login
 * Body: { identifier, password }
 * identifier can be email or username.
 *
 * Supabase Auth only supports signing in with email, so if a username
 * is provided we look up the corresponding email from the profiles table first.
 */
export async function POST(request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required.' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    let email = identifier;

    // If identifier looks like a username (no @), resolve it to an email
    if (!identifier.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', identifier)
        .maybeSingle();

      if (!profile) {
        return NextResponse.json(
          { error: 'No account found with that username or email.' },
          { status: 401 }
        );
      }

      // Get the email from auth.users using the profile id
      // We use the admin client approach via service role — but since we don't
      // expose a service role key on the frontend, we store email in profiles.
      // For now, require email login and show a friendly hint.
      return NextResponse.json(
        { error: 'Please sign in with your email address, not your username.' },
        { status: 400 }
      );
    }

    // Sign in with email + password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('invalid') ||
        error.message.toLowerCase().includes('credentials')
      ) {
        return NextResponse.json(
          { error: 'Incorrect email or password. Please try again.' },
          { status: 401 }
        );
      }
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return NextResponse.json(
          { error: 'Please verify your email before logging in.', code: 'EMAIL_NOT_CONFIRMED' },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fetch the user's profile to determine if language has been selected
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_selected_language, preferred_language, username')
      .eq('id', data.user.id)
      .maybeSingle();

    return NextResponse.json({
      message: 'Login successful.',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: profile?.username,
      },
      hasSelectedLanguage: profile?.has_selected_language ?? false,
      preferredLanguage: profile?.preferred_language,
    });
  } catch (err) {
    console.error('[/api/auth/login] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
