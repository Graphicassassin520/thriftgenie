# ThriftGenie - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

Your ThriftGenie application is fully ready for Vercel deployment with all API routes, database integration, and OpenAI Vision AI functionality.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com)
3. **PostgreSQL Database** - Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [PlanetScale](https://planetscale.com)

## 🔧 Deployment Steps

### Option 1: Deploy via Git (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add these variables:
     ```
     OPENAI_API_KEY=sk-your-actual-openai-key
     DATABASE_URL=postgresql://username:password@host:port/database
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add DATABASE_URL
   ```

## 🗄️ Database Setup

### Using Neon (Recommended)

1. **Create Database**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Run Migrations**
   ```bash
   npx prisma db push
   ```

### Using Supabase

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Go to Settings → Database
   - Copy connection string

2. **Configure Connection**
   - Use the connection string in `DATABASE_URL`
   - Run: `npx prisma db push`

## 🔐 Environment Variables

Required environment variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-actual-openai-key

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Optional: App URL for cache busting
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📦 Build Configuration

The project includes optimized build configuration:

- **vercel.json** - Deployment settings
- **API Routes** - 30-second timeout for AI processing
- **Database** - Prisma with PostgreSQL
- **Build Command** - `prisma generate && next build`

## 🎯 Features Included

✅ **Full AI Functionality**
- OpenAI Vision API integration
- Smart pricing engine
- Multi-platform content generation

✅ **Database Integration**
- PostgreSQL with Prisma
- Automatic migrations
- Optimized queries

✅ **Performance Optimized**
- Next.js 14 App Router
- API route optimization
- Built-in caching

✅ **Production Ready**
- Error handling
- Rate limiting
- Environment validation

## 🔍 Verification

After deployment, verify:

1. **Homepage** - UI loads correctly
2. **API Health** - Visit `/api/health`
3. **AI Analysis** - Test image upload and analysis
4. **Database** - Check `/api/debug` for connection status

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `DATABASE_URL` is correct
   - Run `npx prisma db push` to sync schema

2. **OpenAI API Error**
   - Check `OPENAI_API_KEY` is valid
   - Verify API key has credits

3. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check TypeScript errors

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test locally
vercel dev
```

## 🌟 Pro Tips

1. **Use Vercel's Built-in Analytics**
   - Enable in dashboard for performance monitoring

2. **Set up Custom Domain**
   - Add your domain in Vercel dashboard

3. **Enable Branch Previews**
   - Automatic deployments for pull requests

4. **Monitor Usage**
   - Track OpenAI API usage
   - Monitor database connections

## 📞 Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **OpenAI API**: [help.openai.com](https://help.openai.com)
- **Database**: Check your provider's documentation

---

🎉 **Your ThriftGenie app is now ready for production on Vercel!** 