# Mobile Testing Guide - Quick Reference

## Quick Test on Your Phone

### 1. Test Login (2 minutes)
1. Open the deployed Vercel URL on your phone
2. Navigate to `/auth/login`
3. **Check these:**
   - [ ] Can you tap the email field easily?
   - [ ] Does the email keyboard appear (with @ and .com)?
   - [ ] Does your password manager suggest saved passwords?
   - [ ] Can you tap the "Sign In" button easily?
   - [ ] Does the page zoom when you tap inputs? (Should NOT zoom)

### 2. Test Registration (3 minutes)
1. Navigate to `/auth/register`
2. **Check these:**
   - [ ] First/Last name fields are easy to tap
   - [ ] Email field shows email keyboard
   - [ ] Phone field shows numeric keypad
   - [ ] Password fields offer to save password
   - [ ] All buttons are easy to tap
   - [ ] Can complete all 3 steps without issues

### 3. Test on Slow Connection (2 minutes)
1. Enable "Slow 3G" in Chrome DevTools (or use actual slow connection)
2. Try to login
3. **Check:**
   - [ ] Does it eventually succeed? (Should retry 3 times)
   - [ ] Does it timeout gracefully after 5 seconds?
   - [ ] Do you see appropriate error messages?

---

## Common Issues & Solutions

### Issue: "Page zooms when I tap an input"
**Cause:** Font size < 16px
**Status:** ✅ FIXED - All inputs now use 16px font

### Issue: "Can't tap the button accurately"
**Cause:** Button too small (< 44px)
**Status:** ✅ FIXED - All buttons now minimum 44px

### Issue: "Password manager doesn't work"
**Cause:** Missing autocomplete attributes
**Status:** ✅ FIXED - Added proper autocomplete

### Issue: "Wrong keyboard appears"
**Cause:** Missing inputMode attribute
**Status:** ✅ FIXED - Email shows email keyboard, phone shows numeric

### Issue: "Stuck on loading screen"
**Cause:** Network timeout too short
**Status:** ✅ FIXED - Increased to 5s with retry logic

---

## Browser DevTools Mobile Testing

### Chrome DevTools
```
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Set throttling to "Slow 3G"
5. Test login/registration
```

### Firefox Responsive Design Mode
```
1. Open DevTools (F12)
2. Click responsive design mode (Ctrl+Shift+M)
3. Select "iPhone 12/13"
4. Test login/registration
```

---

## Real Device Testing (Recommended)

### iOS Safari
- Most important to test (strictest browser)
- Test on iPhone 8 or newer
- Check both portrait and landscape

### Android Chrome
- Test on Android 8.0 or newer
- Check autofill behavior
- Verify keyboard types

---

## What to Look For

### ✅ Good Signs
- Inputs are easy to tap (no precision required)
- Correct keyboard appears for each field
- Password manager offers to save/fill
- No zoom when tapping inputs
- Forms submit successfully
- Loading states are clear

### ❌ Bad Signs
- Page zooms when tapping inputs
- Hard to tap buttons/inputs
- Wrong keyboard type
- Password manager doesn't work
- Stuck on loading screen
- Silent failures (no error messages)

---

## Quick Fixes If Issues Persist

### If inputs still zoom:
```css
/* Add to index.css */
input, textarea, select {
  font-size: 16px !important;
}
```

### If buttons are hard to tap:
```css
/* Add to index.css */
button, a {
  min-height: 44px !important;
  min-width: 44px !important;
}
```

### If network issues persist:
Check Vercel environment variables:
```
VITE_SUPABASE_URL=<your-url>
VITE_SUPABASE_ANON_KEY=<your-key>
```

---

## Reporting Issues

If you find issues after deployment, collect:
1. Device model (e.g., "iPhone 13")
2. OS version (e.g., "iOS 16.5")
3. Browser (e.g., "Safari")
4. Screenshot of the issue
5. Browser console errors (if possible)
6. Network tab showing failed requests

---

## Emergency Rollback

If critical issues found after deployment:
```bash
# Revert to previous deployment in Vercel dashboard
# Or redeploy previous commit:
git revert HEAD
git push origin main
```
