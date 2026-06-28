# reCAPTCHA Setup Guide for SMAE Contact Form

## What is reCAPTCHA?
Google reCAPTCHA v3 is a spam protection tool that prevents bots from submitting your contact form. It works silently in the background without requiring users to click "I'm not a robot."

## Step 1: Get Your reCAPTCHA Keys

1. Go to: https://www.google.com/recaptcha/admin
2. **Sign in** with your Google account (create one if needed)
3. Click **"Create"** or **"+"** button to create a new reCAPTCHA

## Step 2: Configure reCAPTCHA v3

Fill in the form:

| Field | Value |
|-------|-------|
| **Label** | SMAE Contact Form |
| **reCAPTCHA type** | reCAPTCHA v3 |
| **Domains** | localhost (for testing)<br>yourdomain.com (for production) |

Then click **Create** or **Submit**.

## Step 3: Copy Your Keys

You'll see two keys:
- **Site Key** (Public) - Goes in your frontend code
- **Secret Key** (Private) - Goes in your backend .env file

## Step 4: Add Keys to Your Project

### Update `.env` file:

Open `c:\Users\avsss\Desktop\smae\.env` and replace:

```env
RECAPTCHA_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY_HERE
RECAPTCHA_SITE_KEY=YOUR_ACTUAL_SITE_KEY_HERE
```

**Example:**
```env
RECAPTCHA_SECRET_KEY=6LcV3p0qAAAAAJ9fj3Ks9fH3Ks9fH3Ks9fH3
RECAPTCHA_SITE_KEY=6LcV3p0qAAAAALcV3p0qAAAAALcV3p0qAAAAA
```

### Update `script.js` file:

Find this line (around line 425):
```javascript
const recaptchaToken = await grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action: 'submit' });
```

Replace `YOUR_RECAPTCHA_SITE_KEY` with your actual Site Key:
```javascript
const recaptchaToken = await grecaptcha.execute('6LcV3p0qAAAAALcV3p0qAAAAALcV3p0qAAAAA', { action: 'submit' });
```

## Step 5: Test It

1. **Restart your backend**:
   ```bash
   npm start
   ```

2. **Open your website** and go to the contact form

3. **Fill out and submit** the form

4. You should see "Verifying..." then success/error message

## How It Works

✅ **User fills form** → **reCAPTCHA token generated** → **Sent to backend** → **Google verifies token** → **Form submitted (if valid)**

reCAPTCHA v3 assigns a score (0.0 to 1.0):
- **0.0** = Likely a bot
- **1.0** = Likely a human
- **0.5** = Threshold used (can be adjusted in `server.js`)

## Troubleshooting

### "grecaptcha is not defined"
- Make sure the reCAPTCHA script tag is in your HTML `<head>`
- Check: `<script src="https://www.google.com/recaptcha/api.js"></script>`

### "reCAPTCHA verification failed"
- Check your Site Key and Secret Key are correct
- Make sure your domain is added in reCAPTCHA admin console
- For localhost: use `localhost` not `127.0.0.1`

### "Failed to verify reCAPTCHA"
- Ensure backend has `axios` installed: `npm install axios`
- Check that `.env` has correct SECRET_KEY
- Restart the server after updating `.env`

### Form still submitting with no verification
- Check browser console (F12) for JavaScript errors
- Verify reCAPTCHA script loaded: check Network tab in DevTools

## Production Deployment

When deploying live:

1. **Update reCAPTCHA admin** to add your actual domain(s)
2. **Update `.env`** on your production server with real keys
3. **Update `script.js`** if using different site key
4. **Test thoroughly** before going live

## Security Notes

🔒 **Never share your Secret Key** - keep it in `.env` only
🔒 **Site Key can be public** - it's used in frontend code
🔒 **Adjust score threshold** in `server.js` if too strict/lenient

## Dashboard

Monitor submissions and reCAPTCHA performance:
- https://www.google.com/recaptcha/admin
- View analytics, blocked attempts, scores
