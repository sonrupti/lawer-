import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/verify-otp
 * Body: { email, token, type }
 * type: 'signup' | 'recovery' | 'magiclink'
 *
 * Verifies the 6-digit OTP entered by the user.
 * On success, Supabase creates a session (stored in cookies).
 * Returns hasSelectedLanguage to determine post-login redirect.
 */
export async function POST(request) {
  try {
    const { email, token, type = 'signup' } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and OTP token are required.' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { error: 'OTP must be a 6-digit number.' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('expired') ||
        error.message.toLowerCase().includes('invalid')
      ) {
        return NextResponse.json(
          { error: 'The OTP is invalid or has expired. Please request a new one.' },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fetch profile to determine post-login redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_selected_language, preferred_language, username')
      .eq('id', data.user.id)
      .maybeSingle();

    return NextResponse.json({
      message: 'OTP verified successfully.',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: profile?.username,
      },
      hasSelectedLanguage: profile?.has_selected_language ?? false,
      preferredLanguage: profile?.preferred_language,
    });
  } catch (err) {
    console.error('[/api/auth/verify-otp] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
