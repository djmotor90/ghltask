import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const host = request.headers.get('host') || 'task.gurver.org';

  // Handle errors from GHL
  if (error) {
    return NextResponse.redirect(
      new URL(`https://${host}/?error=${error}`)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`https://${host}/?error=no_code`)
    );
  }

  try {
    // Exchange code with backend API
    const apiUrl = `https://api.gurver.org/auth/callback?code=${code}`;
    console.log(`[OAuth Callback] Exchanging code at: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to exchange code for token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const { accessToken, user } = data;

    console.log(`[OAuth Callback] Success! User: ${user.email}`);

    // Redirect to dashboard with token in query (will be stored client-side)
    const dashboardUrl = new URL(`https://${host}/dashboard`);
    dashboardUrl.searchParams.set('token', accessToken);
    
    return NextResponse.redirect(dashboardUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.redirect(
      new URL(`https://${host}/?error=callback_failed&details=${encodeURIComponent(errorMsg)}`)
    );
  }
}
