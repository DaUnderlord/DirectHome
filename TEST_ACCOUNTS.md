# Test Accounts for Mobile Testing

## ⚠️ Important Note

Your app uses **Supabase Authentication**, which means test accounts need to exist in your Supabase database, not just in the frontend mock data.

---

## Option 1: Check Existing Supabase Accounts

### Steps to Check:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `fwjbyxvxnuldoowoxowf`
3. Navigate to **Authentication** → **Users**
4. Check if any test accounts exist

### If Accounts Exist:
You can use those credentials to test. Common test patterns:
- Email: `test@example.com` or `demo@example.com`
- Password: Usually something like `Test123!` or `Demo123!`

---

## Option 2: Create New Test Accounts

### Method A: Via Your App (Recommended for Mobile Testing)
This tests the actual registration flow!

1. **Open your deployed app** on mobile
2. **Navigate to** `/auth/register`
3. **Create a test account:**
   ```
   First Name: Test
   Last Name: User
   Email: test+mobile@yourdomain.com
   Phone: 08012345678
   Password: Test123!@#
   Role: Home Seeker (or Home Owner)
   ```
4. **Check email** for verification link (if enabled)
5. **Use these credentials** to test login

### Method B: Via Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click **"Add user"**
3. Fill in:
   ```
   Email: test@example.com
   Password: Test123!@#
   Auto Confirm User: ✓ (check this)
   ```
4. Click **"Create user"**
5. Go to **Table Editor** → `profiles` table
6. Add profile data:
   ```sql
   INSERT INTO profiles (id, email, phone, first_name, last_name, role)
   VALUES (
     'user-id-from-auth',
     'test@example.com',
     '+2348012345678',
     'Test',
     'User',
     'homeseeker'
   );
   ```

---

## Recommended Test Accounts to Create

### 1. Home Seeker Account
```
Email: homeseeker.test@example.com
Password: Seeker123!@#
Phone: +2348012345678
Role: homeseeker
```

### 2. Home Owner Account
```
Email: homeowner.test@example.com
Password: Owner123!@#
Phone: +2348023456789
Role: homeowner
```

### 3. Admin Account
```
Email: admin.test@example.com
Password: Admin123!@#
Phone: +2348034567890
Role: admin
```

---

## Quick Test Script (Using Supabase SQL Editor)

Run this in your Supabase SQL Editor to create test accounts:

```sql
-- Note: You'll need to create auth users first via Supabase Dashboard
-- Then run this to add profile data

-- Home Seeker Profile
INSERT INTO profiles (id, email, phone, first_name, last_name, role, created_at, updated_at)
VALUES (
  'YOUR_AUTH_USER_ID_1',
  'homeseeker.test@example.com',
  '+2348012345678',
  'Test',
  'Seeker',
  'homeseeker',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Home Owner Profile
INSERT INTO profiles (id, email, phone, first_name, last_name, role, created_at, updated_at)
VALUES (
  'YOUR_AUTH_USER_ID_2',
  'homeowner.test@example.com',
  '+2348023456789',
  'Test',
  'Owner',
  'homeowner',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();
```

---

## Testing Checklist

### Test with Home Seeker Account:
- [ ] Login on mobile
- [ ] Browse properties
- [ ] Save favorites
- [ ] Send messages
- [ ] Book appointments
- [ ] View dashboard

### Test with Home Owner Account:
- [ ] Login on mobile
- [ ] List a property
- [ ] View inquiries
- [ ] Manage appointments
- [ ] View analytics
- [ ] Update profile

### Test with Admin Account:
- [ ] Login on mobile
- [ ] Access admin panel
- [ ] View user management
- [ ] Check analytics
- [ ] Moderate content

---

## Password Requirements

All test passwords must meet these requirements:
- ✓ At least 8 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)
- ✓ At least one special character (@$!%*?&#)

**Example valid passwords:**
- `Test123!@#`
- `Demo2024!`
- `Mobile@Test1`
- `Seeker#2024`

---

## Troubleshooting

### "User not found" Error
**Cause:** Account doesn't exist in Supabase
**Solution:** Create account via Supabase Dashboard or registration flow

### "Invalid credentials" Error
**Cause:** Wrong password or email
**Solution:** Reset password via "Forgot Password" or check Supabase

### "Email not verified" Error
**Cause:** Email verification required
**Solution:** 
1. Check email for verification link
2. Or in Supabase Dashboard → Users → Click user → "Confirm email"

### "Profile not found" Error
**Cause:** Auth user exists but no profile in database
**Solution:** Add profile data to `profiles` table

---

## Security Notes

⚠️ **Important:**
- These are TEST accounts only
- Use `+` email trick for multiple accounts: `test+1@example.com`, `test+2@example.com`
- Don't use real personal information
- Delete test accounts after testing
- Don't commit real credentials to Git

---

## Quick Access (After Creating Accounts)

### Home Seeker Test
```
URL: https://your-app.vercel.app/auth/login
Email: homeseeker.test@example.com
Password: [Your chosen password]
```

### Home Owner Test
```
URL: https://your-app.vercel.app/auth/login
Email: homeowner.test@example.com
Password: [Your chosen password]
```

### Admin Test
```
URL: https://your-app.vercel.app/auth/login
Email: admin.test@example.com
Password: [Your chosen password]
```

---

## Next Steps

1. **Create at least one test account** using Method A or B above
2. **Save credentials** securely (password manager recommended)
3. **Test mobile login** with the account
4. **Test registration** by creating a new account on mobile
5. **Document any issues** you encounter

---

**Last Updated:** $(date)
**Status:** Ready for account creation
