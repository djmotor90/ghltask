# GoHighLevel Marketplace Integration Guide

## Current Status

✅ **OAuth Working** - Your app successfully authenticates with GoHighLevel  
✅ **Dashboard Created** - Users see a functional task manager interface  
⚠️ **Marketplace Visibility** - App needs to be configured in GHL Marketplace

---

## Making Your App Visible in GoHighLevel

Your app won't appear as a tab in the GHL portal automatically. Here's what you need to do:

### Option 1: Add to GoHighLevel Marketplace (Recommended)

1. **Go to GHL Developer Portal**
   - Visit: https://marketplace.gohighlevel.com/
   - Login with your GHL account

2. **Submit Your App**
   - Go to "My Apps" section
   - Click "Create New App" or edit your existing app
   - Fill in these details:
     - **App Name**: Your Task Manager
     - **App URL**: `https://seashell-app-jr3fc.ondigitalocean.app`
     - **OAuth Redirect URL**: `https://seashell-app-jr3fc.ondigitalocean.app/auth/callback`
     - **Scopes**: Select all the scopes you're using (locations.readonly, users.readonly, etc.)
     - **Category**: Productivity / Project Management
   
3. **Configure App Distribution**
   - Choose "Private" (for testing) or "Public" (to list in marketplace)
   - Set pricing (free or paid)
   - Add app description, screenshots, and logo

4. **Enable as Location App**
   - In app settings, enable "Location Access App"
   - This allows the app to be installed per location
   - Users will see it in their GHL sidebar

5. **Submit for Review**
   - Once configured, submit for GHL review
   - Private apps can be used immediately
   - Public apps need approval (3-7 days)

---

### Option 2: Direct Link Integration

If you don't want marketplace listing, users can access your app via direct link:

1. **Share Your App URL**
   - Give users: `https://seashell-app-jr3fc.ondigitalocean.app`
   - They click "Login with GoHighLevel"
   - After OAuth, they're redirected to dashboard

2. **Add Custom Menu Item in GHL** (Manual per user)
   - In GHL, go to Settings → Custom Menu Links
   - Add new link:
     - **Label**: Task Manager
     - **URL**: `https://seashell-app-jr3fc.ondigitalocean.app`
     - **Icon**: Choose an icon
   - This adds your app to their sidebar

---

### Option 3: Embedded Widget (Advanced)

To show your app inside GHL (iframe embedded):

1. **Enable iframe Support**
   - Add these headers to your app responses:
   ```typescript
   // In next.config.js
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'ALLOW-FROM https://app.gohighlevel.com',
           },
           {
             key: 'Content-Security-Policy',
             value: "frame-ancestors 'self' https://app.gohighlevel.com https://*.gohighlevel.com",
           },
         ],
       },
     ];
   },
   ```

2. **Register as Custom Widget**
   - In GHL Marketplace settings, enable "Custom Widget"
   - Set widget URL to your app
   - Users can then add it to their GHL dashboard

---

## Next Steps for You

### Immediate Actions:

1. **Update Marketplace App Settings**
   - Login to https://marketplace.gohighlevel.com/
   - Update your app with the correct redirect URL
   - Ensure all OAuth scopes match what you're requesting

2. **Test the App**
   - Try installing your app in a test GHL location
   - Verify OAuth flow works end-to-end
   - Check that dashboard loads after authentication

3. **Add More UI Features** (Current dashboard is a foundation)
   - Create task lists
   - Add task creation forms
   - Build task detail views
   - Implement comments and attachments

### Configuration Checklist:

- [ ] GHL Marketplace app created/updated
- [ ] Redirect URL matches: `https://seashell-app-jr3fc.ondigitalocean.app/auth/callback`
- [ ] OAuth scopes configured correctly
- [ ] App URL set to: `https://seashell-app-jr3fc.ondigitalocean.app`
- [ ] Tested OAuth flow end-to-end
- [ ] Dashboard loads after authentication
- [ ] JWT_SECRET set in Digital Ocean environment

---

## Why Users Don't See a Tab Automatically

GoHighLevel doesn't automatically add tabs for OAuth apps. You need to:
- **Submit to marketplace** and get approved, OR
- **Ask users to manually add** via Custom Menu Links, OR
- **Build iframe widget** that they can embed

The OAuth flow you've built is the authentication mechanism. The marketplace submission determines visibility.

---

## Support Links

- **GHL Developer Docs**: https://highlevel.stoplight.io/
- **Marketplace Portal**: https://marketplace.gohighlevel.com/
- **Developer Community**: https://community.gohighlevel.com/

---

## Current App URLs

- **Production**: https://seashell-app-jr3fc.ondigitalocean.app
- **OAuth Redirect**: https://seashell-app-jr3fc.ondigitalocean.app/auth/callback
- **Dashboard**: https://seashell-app-jr3fc.ondigitalocean.app/dashboard
- **API Health**: https://seashell-app-jr3fc.ondigitalocean.app/api/health

Test all these URLs to ensure they're working correctly!
