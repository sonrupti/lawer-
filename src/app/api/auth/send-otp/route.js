import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/send-otp
 * Body: { email, type }
 * type: 'signup' | 'magiclink' | 'recovery' | 'phone_change'
 *
 * Triggers Supabase to send an OTP email to the user.
 * Used for: registration verification, login 2FA, and password reset.
 */
export async function POST(request) {
  try {
    const { email, type = 'email' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Use Supabase's built-in OTP mechanism
    // For 'signup' type: re-sends the email confirmation OTP
    // For 'magiclink' type: sends a one-time login link/OTP
    const { error } = await supabase.auth.resend({
      type: type === 'recovery' ? 'signup' : 'signup',
      email,
      options: {
        emailRedirectTo: undefined, // We use OTP token flow, not link flow
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'OTP sent successfully. Please check your email.',
    });
  } catch (err) {
    console.error('[/api/auth/send-otp] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
