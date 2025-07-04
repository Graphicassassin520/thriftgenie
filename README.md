# 🔥 ThriftGenie - AI-Powered Product Listing Optimizer

Transform your product photos into professional listings across multiple platforms with AI-powered analysis.

## ✨ Features

- **🤖 AI Image Analysis**: Uses OpenAI GPT-4o-mini Vision to identify products, condition, and specifications
- **💰 Smart Pricing**: AI-generated pricing suggestions based on product analysis
- **📝 Multi-Platform Content**: Optimized listings for 9 platforms:
  - Facebook, Instagram, TikTok, Poshmark, Mercari
  - Craigslist, Etsy, Website, X (Twitter)
- **🎯 Platform-Specific Optimization**: Tailored titles, descriptions, and hashtags
- **📊 Performance Analytics**: Track usage and analysis success rates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- PostgreSQL database (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thriftgenie.git
   cd thriftgenie
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=your_database_url_here
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **AI Integration**: OpenAI GPT-4o-mini Vision API
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI, Lucide Icons
- **Image Processing**: Sharp, Background Removal
- **Deployment**: Vercel, Netlify compatible

## 📁 Project Structure

```
thriftgenie/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── analyze/       # AI analysis endpoint
│   │   ├── enhance/       # Image enhancement
│   │   └── listings/      # Database operations
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── upload-interface.tsx
│   ├── analysis-results.tsx
│   └── platform-selector.tsx
├── lib/                   # Utility functions
│   ├── openai-ai.ts      # OpenAI integration
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🔧 API Endpoints

- `POST /api/analyze` - Analyze product images with AI
- `POST /api/enhance` - Enhance product images
- `GET /api/listings` - Retrieve saved listings
- `GET /api/health` - System health check

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload .next/ folder to Netlify
```

> **Note**: For full AI functionality, use Vercel or other platforms that support Next.js API routes.

## 🛠️ Development

### Run tests
```bash
npm run test
```

### Build for production
```bash
npm run build
```

### Lint code
```bash
npm run lint
```

## 📊 Usage Analytics

The application includes built-in analytics for:
- API usage tracking
- Analysis success rates
- Performance metrics
- Error monitoring

## 🔐 Security

- API keys are stored securely in environment variables
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS protection

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@thriftgenie.com or create an issue in the GitHub repository.

---

**Built with ❤️ using Next.js and OpenAI** # Triggering redeploy after adding environment variables
# Force deployment with latest fixes

🚀 Vercel deployment Fri Jul  4 08:27:25 EDT 2025
