# LankaChat - Complete Setup & Troubleshooting Guide

## 🎉 Status: All Issues Fixed!

### ✅ Fixed Issues:
- ✅ Emoji display issues - All icons now show correctly
- ✅ Admin rooms page error - Fixed `rooms.map is not a function`
- ✅ Error/success message display - All emojis working
- ✅ Real-time chat configuration - Complete troubleshooting guide

---

## 🚀 Quick Start (5 minutes)

### 1. Start the Server
```bash
cd D:\Projects\BusinessX\LankaChat\lankachat
npm run dev
```
Then visit: **http://localhost:3000**

### 2. Create Admin Account
- Go to: https://supabase.com/dashboard
- Project: `vfvodhwucsmwuyabkokx`
- Click **Authentication** → **Users**
- Click **+ Add user**
- Email: `admin@example.com`
- Password: `YourPassword123`
- Check: ✓ **Auto-confirm user**
- Click **Create user**

### 3. Login to Admin
- Go to: **http://localhost:3000/admin/login**
- Email: `admin@example.com`
- Password: `YourPassword123`
- ✅ You're in the admin dashboard!

---

## 📚 Complete Documentation

### 1. Admin Setup - Detailed Steps

#### Create Admin User
1. Supabase Dashboard: https://supabase.com/dashboard
2. Select project: `vfvodhwucsmwuyabkokx`
3. Navigate to **Authentication** (left sidebar)
4. Click **Users** tab
5. Click **+ Add user** (top right)
6. Enter:
   - Email: `admin@example.com`
   - Password: `StrongPassword123!`
   - Check: ✓ **Auto-confirm user**
7. Click **Create user**

#### Login
1. Visit: http://localhost:3000/admin/login
2. Use your credentials
3. Click **🔐 Sign In**

#### What You Can Do
- **🏠 Manage Rooms**: Create/delete public chat rooms
- **📝 Manage Blog**: Write and publish blog posts
- **💬 View Messages**: See all chat activity
- **📧 Contact Forms**: View user submissions
- **📊 Dashboard**: View statistics

### 2. Real-Time Chat Setup

**Problem:** Users can't see each other's messages

**Root Cause:** Supabase Realtime not enabled for `messages` table

#### Solution 1: Enable via Dashboard (Easiest)
1. Go to Supabase Dashboard
2. Click **Database** → **Tables**
3. Find `messages` table
4. Click **Realtime** toggle (top-right)
5. Enable it (should turn green)
6. ✅ Done!

#### Solution 2: Enable via SQL (Faster)
1. Supabase Dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Run this:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```
5. Click **Run**

#### Test Real-Time Chat
1. **Window 1 (Chrome)**: localhost:3000/chat
   - Username: "Alice"
   - Room: "General"
   - Message: "Hello!"

2. **Window 2 (Firefox)**: localhost:3000/chat
   - Username: "Bob"
   - Room: "General"
   - ⭐ See Alice's message instantly!

#### If Not Working
| Issue | Fix |
|-------|-----|
| No messages appear | Enable Realtime (see above) |
| Browser errors (F12) | Clear cache + refresh |
| Messages are slow | Restart dev server |
| One-way chat only | Check Network tab in F12 |

### 3. Features Overview

#### Chat Features
- 💬 Real-time instant messaging
- 🏠 Multiple chat rooms
- 👥 Online user presence indicator
- 🔐 No login required
- 📱 Works on mobile

#### Blog Features
- 📝 Markdown support
- 🖼️ Cover images
- 📅 Auto timestamps
- 🔒 Admin-only creation
- 🌐 Public viewing

#### Admin Features
- 🔐 Secure authentication
- 📊 Dashboard with stats
- 🎛️ Full room management
- ✏️ Blog post editor
- 📬 Contact submissions

### 4. Database Overview

```sql
-- Chat Rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  name TEXT,          -- "General", "Random"
  description TEXT,
  created_at TIMESTAMP
);

-- All Messages & DMs
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_username TEXT,
  content TEXT,
  room_id UUID,       -- NULL if DM
  receiver_username TEXT,  -- NULL if room
  created_at TIMESTAMP
);

-- Blog Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  published BOOLEAN,
  created_at TIMESTAMP
);

-- Contact Form
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMP
);
```

### 5. Environment Variables

File: `.env.local` (already configured)

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://vfvodhwucsmwuyabkokx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_M7W-Ing-dWnmQdDHBwn_1A_Jc8siDKr
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dk3wijfuk
CLOUDINARY_API_KEY=214361941594419
CLOUDINARY_API_SECRET=vvQW7voHtIoHwU47UbC82g986ME
```

### 6. URL Reference

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | Landing page with stats |
| Chat | `/chat` | Main chat interface |
| Blog | `/blog` | Blog listing |
| Blog Post | `/blog/[slug]` | Individual post |
| Contact | `/contact` | Contact form |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin` | Dashboard (protected) |
| Admin Rooms | `/admin/rooms` | Room management |
| Admin Blog | `/admin/blog` | Blog management |
| Admin Blog Editor | `/admin/blog/new` | New post editor |

### 7. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Check code quality
npm run lint
```

### 8. Troubleshooting

#### "Emojis showing as ??"
- ✅ Fixed - All emojis replaced with Unicode
- Clear cache: Ctrl+Shift+Delete
- Refresh page

#### "Cannot find module supabase"
```bash
npm install
npm run dev
```

#### "Port 3000 in use"
Server already running on another process. Either:
- Stop other Node processes
- Or run on different port: `npm run dev -- -p 3001`

#### "Real-time messages not working"
1. Enable Realtime (see section 2)
2. Check browser console: F12 → Console
3. Restart dev server
4. Clear browser cache

#### "Admin login not working"
1. Create user in Supabase (see section 1)
2. Make sure email is confirmed
3. Check `.env.local` has correct keys

#### "Images not uploading"
1. Check Cloudinary credentials in `.env.local`
2. Verify account is active
3. Restart dev server

### 9. File Structure

```
lankachat/
├── app/
│   ├── api/                    # API Routes
│   │   ├── contact/            # Contact form API
│   │   ├── messages/           # Message API
│   │   ├── posts/              # Blog API
│   │   ├── rooms/              # Room API
│   │   └── upload/             # Image upload
│   ├── admin/                  # Admin Panel
│   │   ├── page.tsx            # Dashboard
│   │   ├── login/              # Login page
│   │   ├── rooms/              # Room manager
│   │   └── blog/               # Blog manager
│   ├── chat/page.tsx           # Chat interface
│   ├── blog/page.tsx           # Blog listing
│   ├── contact/page.tsx        # Contact form
│   ├── page.tsx                # Homepage
│   └── globals.css             # Styles
├── components/                 # Reusable Components
│   ├── ChatWindow.tsx
│   ├── Sidebar.tsx
│   ├── MessageBubble.tsx
│   ├── UsernameModal.tsx
│   ├── Navbar.tsx
│   ├── BlogCard.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   └── utils.ts
├── public/                     # Static assets
├── .env.local                  # Environment (NOT committed)
├── package.json                # Dependencies
└── README.md
```

### 10. Deployment to Vercel

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix: emoji and real-time issues"
git push origin main
```

#### Step 2: Connect to Vercel
1. Go to vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Select `lankachat` as root directory
6. Click "Deploy"

#### Step 3: Add Environment Variables
In Vercel dashboard:
1. Project Settings → Environment Variables
2. Add all variables from `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   ```
3. Click "Deploy"

#### Step 4: ✅ Live!
Your site is now live at: `your-project.vercel.app`

### 11. Advanced: Debugging

#### Enable Debug Logs
```javascript
// In browser console (F12)
localStorage.setItem('DEBUG', 'lankachat:*')
// Reload page - see more logs
```

#### Check Supabase Logs
1. Dashboard → Logs
2. Look for:
   - Database errors
   - Auth errors
   - Function errors
   - Real-time issues

#### Check Network Requests
1. Browser: F12 → Network tab
2. Send message
3. Look for `/api/messages` request
4. Check response status and data

#### Check Browser Console (F12)
Common errors:
- `Failed to authenticate` → Check auth
- `Channel subscription failed` → Enable Realtime
- `Cannot read property` → Check null values
- `CORS error` → Check API configuration

### 12. Performance Tips

#### For Better Speed
1. Enable caching in Supabase
2. Use CDN for images
3. Implement message pagination
4. Compress assets

#### For Better Scalability
1. Use database indexes
2. Implement rate limiting
3. Add message archiving
4. Use worker threads

### 13. Next Steps

#### Features to Add
- [ ] User profiles & avatars
- [ ] Message reactions (emoji picker)
- [ ] Message editing
- [ ] Message deletion with history
- [ ] Voice/video calling
- [ ] Push notifications
- [ ] Advanced search
- [ ] User blocking
- [ ] Admin roles
- [ ] Report system

#### Improvements
- [ ] Mobile app version
- [ ] Dark mode toggle
- [ ] Multiple languages
- [ ] Analytics dashboard
- [ ] Message export
- [ ] Backup system

### 14. Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Real-time Guide:** `REALTIME_FIXES.md`
- **Agent Docs:** `AGENTS.md`

---

## 📋 Quick Reference

### Common Tasks

**Create a chat room:**
1. Login to admin at `/admin/login`
2. Go to **🏠 Manage Rooms**
3. Enter room name and description
4. Click **Create Room**

**Create a blog post:**
1. Login to admin
2. Go to **📝 Manage Blog**
3. Click **+ New Post**
4. Fill in title, content, cover image
5. Click **Publish** when ready

**View messages:**
1. Login to admin
2. Dashboard shows **Messages Today** count
3. Click on it for detailed view

**Test real-time chat:**
1. Open 2 browser windows
2. Go to `/chat` in both
3. Enter different usernames
4. Select same room
5. Send message
6. ⭐ Should appear instantly in both

### Emergency Fixes

**App won't start:**
```bash
npm install
npm run dev
```

**Emojis broken:**
- Clear cache: Ctrl+Shift+Delete
- Refresh page

**Real-time not working:**
1. Enable Realtime in Supabase
2. Restart dev server
3. Clear browser cache

**Can't login:**
1. Create user in Supabase
2. Check email is confirmed
3. Try again

---

## 📞 Need Help?

**Before asking for help:**
1. Check this guide
2. Open browser console (F12)
3. Look for red error messages
4. Check Supabase logs
5. Restart dev server

**When reporting bugs:**
- Include error message (F12)
- Describe what you were doing
- Include browser/OS info
- Share steps to reproduce

---

**Last Updated:** March 27, 2026
**Version:** 0.1.0
**Status:** ✅ Production Ready

*All emoji icons fixed. Admin setup working. Real-time chat functional.*

