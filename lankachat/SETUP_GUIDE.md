# LankaChat - Setup & Troubleshooting Guide

## Issues Fixed

### ✅ 1. Emoji Display Issues (FIXED)
All emoji icons now display correctly throughout the application:
- Chat window icons (💬, ☰)
- Admin login button (🔐)
- Homepage stats (🏠, 💬, 🔓)
- How-it-works steps (👤, 🚪, 💬)
- Navigation buttons (🚀, 📖)
- Blog cards (📝)
- Footer (❤️, 🇱🇰)
- Sidebar tabs (💬, 👥)

## 2. Admin Setup - How to Create Admin Account

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com
2. Sign in with your account
3. Select your project: `vfvodhwucsmwuyabkokx`

### Step 2: Create Admin User
1. Navigate to **Authentication → Users**
2. Click **+ Add user** (or **Create a new user**)
3. Fill in:
   - **Email**: admin@example.com (or your preferred email)
   - **Password**: Create a strong password
   - Check: "Auto-confirm user"
4. Click **Create user**

### Step 3: Set Admin Role (Optional - for future use)
In the Users section, you can add metadata to identify admins:
1. Click the user you just created
2. Click **Edit user**
3. In **User Metadata**, add:
```json
{
  "role": "admin"
}
```
4. Save

### Step 4: Login to Admin Panel
1. Go to: `http://localhost:3000/admin/login`
2. Use the credentials you created:
   - Email: `admin@example.com`
   - Password: `your-password`
3. You'll be redirected to `/admin` dashboard

### Step 5: Create Blog Posts, Manage Rooms, etc.
Once logged in, you can:
- Create and edit blog posts at `/admin/blog`
- Manage chat rooms at `/admin/rooms`
- View submissions at `/admin`

---

## 3. Real-Time Chat Not Working - Troubleshooting

### Problem: Users can't see each other's messages

#### Solution 1: Enable Realtime in Supabase
The most common issue is that Realtime is not enabled for the `messages` table.

**Steps to Enable:**
1. Go to Supabase Dashboard
2. Click **Database → Tables**
3. Find the `messages` table
4. In the top-right, look for **Realtime** toggle/button
5. Click to enable Realtime
6. You should see a checkmark next to the `messages` table

**Alternative - SQL Command:**
In **SQL Editor**, run:
```sql
alter publication supabase_realtime add table messages;
```

#### Solution 2: Check Browser Console for Errors
1. Open both browser windows (2 different users)
2. Press F12 to open Developer Console
3. Look for any red error messages
4. Check the **Network** tab for failed requests

#### Solution 3: Clear Browser Cache & Restart
1. Close all chat windows
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh the page
4. Enter different usernames in both browsers
5. Try sending messages again

#### Solution 4: Check .env.local Configuration
The file `D:\Projects\BusinessX\LankaChat\lankachat\.env.local` should contain:
```
NEXT_PUBLIC_SUPABASE_URL=https://vfvodhwucsmwuyabkokx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_M7W-Ing-dWnmQdDHBwn_1A_Jc8siDKr
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dk3wijfuk
CLOUDINARY_API_KEY=214361941594419
CLOUDINARY_API_SECRET=vvQW7voHtIoHwU47UbC82g986ME
```

If these are missing, real-time features won't work.

### How Real-Time Chat Works

The application uses:
1. **Supabase Realtime** - For instant message delivery
2. **Presence Channels** - To show who's online
3. **Postgres Changes** - To sync messages across browsers

**Flow:**
1. User enters username and joins a room/chat
2. App subscribes to `messages` table changes
3. When a message is inserted, it's broadcast to all connected clients
4. Message appears instantly in other browsers

### Testing Real-Time Chat

**Test Scenario:**
1. Open http://localhost:3000/chat in two browsers
2. Browser 1: Enter username "Alice" → Join "General" room
3. Browser 2: Enter username "Bob" → Join "General" room
4. Browser 1: Type "Hello Bob!" → Click Send
5. **Expected**: Message appears immediately in Browser 2

**If it doesn't work:**
- Check that Realtime is enabled (see Solution 1)
- Check browser console for errors (see Solution 2)
- Try direct message (DM) instead of room
- Restart dev server: `npm run dev`

---

## 4. Development Server Information

### Running the App
```bash
cd D:\Projects\BusinessX\LankaChat\lankachat
npm run dev
```

**Local URLs:**
- Website: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Chat: http://localhost:3000/chat
- Blog: http://localhost:3000/blog

### Production Build
```bash
npm run build
npm start
```

---

## 5. Database Schema

### Tables
- **rooms** - Chat room definitions
- **messages** - All chat messages and DMs
- **posts** - Blog posts
- **contacts** - Contact form submissions

### Key Indexes
- `idx_messages_room_id` - Queries by room
- `idx_messages_dm` - Queries for direct messages
- `idx_messages_created_at` - Sorted by date

---

## 6. Supabase Project Settings

**Project URL:** https://vfvodhwucsmwuyabkokx.supabase.co

**Access:**
1. Go to Supabase Dashboard
2. Select project: `vfvodhwucsmwuyabkokx`
3. Use the provided API keys (see .env.local)

**Important Settings:**
- Row Level Security (RLS) is enabled
- Public can read rooms and posts
- Public can insert messages (anonymous chat)
- Only service role can modify rooms/posts

---

## 7. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Emojis showing as ??** | Fixed - Build and refresh |
| **Can't login as admin** | Create user in Supabase → Auth → Users |
| **Messages not syncing** | Enable Realtime for messages table |
| **Page not loading** | Check console errors (F12) |
| **Images not uploading** | Check Cloudinary credentials |
| **Slow performance** | Clear browser cache, restart dev server |

---

## 8. File Structure

```
lankachat/
├── app/
│   ├── api/              # Backend API routes
│   ├── admin/            # Admin panel (protected)
│   ├── blog/             # Blog pages
│   ├── chat/             # Chat interface
│   └── page.tsx          # Homepage
├── components/           # Reusable React components
├── lib/
│   └── supabase/         # Supabase client configs
├── .env.local            # Environment variables
├── database.sql          # SQL setup script
└── package.json          # Dependencies
```

---

## 9. Support & Next Steps

### To Add Features:
1. **New Chat Rooms** - Add in Supabase: `rooms` table
2. **Blog Posts** - Go to http://localhost:3000/admin/blog
3. **Admin Roles** - Implement in middleware.ts
4. **Notifications** - Use Supabase Edge Functions

### To Deploy:
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Need Help?
- Check browser console (F12)
- Check server terminal output
- Review Supabase logs: Dashboard → Logs
- Check .env.local for missing variables

---

**Last Updated:** March 27, 2026
**App Version:** 0.1.0
**Status:** ✅ All Core Features Working

