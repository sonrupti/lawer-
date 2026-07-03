import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/register
 * Body: { username, email, phone?, password }
 *
 * Creates a new Supabase Auth user. The profile row is auto-created
 * by the database trigger (handle_new_user). Supabase sends a
 * confirmation / OTP email automatically.
 */
export async function POST(request) {
  try {
    const { username, email, phone, password } = await request.json();

    // --- Input validation ---
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required.' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 30 characters.' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username may only contain letters, numbers, and underscores.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // --- Check for duplicate username ---
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'This username is already taken. Please choose another.' },
        { status: 409 }
      );
    }

    // --- Create the Supabase Auth user ---
    // Supabase sends an OTP / magic link to the email automatically.
    // The trigger on auth.users will insert the profiles row.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone: phone || null,
        },
        // emailRedirectTo is not needed since we use OTP verification flow
      },
    });

    if (error) {
      // Supabase returns a specific error for duplicate emails
      if (error.message.toLowerCase().includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Registration initiated. Please check your email for a verification OTP.',
      userId: data.user?.id,
      email,
    });
  } catch (err) {
    console.error('[/api/auth/register] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
