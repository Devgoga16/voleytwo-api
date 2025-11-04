# VolleyFund API - Vercel Deployment Guide

This guide will help you deploy the VolleyFund API to Vercel as a serverless function.

## 🚀 Quick Deployment

### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- MongoDB Atlas database
- Git repository (optional but recommended)

### Step 1: Environment Setup

1. **Clone or prepare your project**:
   ```bash
   git clone <your-repo-url>
   cd voleytwo-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Test locally** (optional but recommended):
   ```bash
   # Set your MongoDB URI
   export MONGODB_URI="your-mongodb-atlas-connection-string"

   # Run tests
   npm run test

   # Or test with local server
   npm run local
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set environment variables** in Vercel dashboard or via CLI:
   ```bash
   vercel env add MONGODB_URI
   # Enter your MongoDB Atlas connection string
   ```

#### Option B: GitHub Integration

1. **Connect your GitHub repository** to Vercel
2. **Vercel will automatically detect** the configuration files
3. **Set environment variables** in the Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string

### Step 3: Verify Deployment

After deployment, your API will be available at:
- **Production URL**: `https://your-project-name.vercel.app`
- **API Documentation**: `https://your-project-name.vercel.app/api-docs`

Test the deployment:
```bash
# Test with your production URL
BASE_URL=https://your-project-name.vercel.app npm run test
```

## � Project Structure

```
voleytwo-api/
├── api/
│   └── index.js          # Serverless function entry point
├── models/
│   └── Transaction.js    # MongoDB model
├── routes/
│   └── transactions.js   # API routes
├── middleware/
│   └── upload.js         # File upload middleware
├── config/
│   └── database.js       # Database configuration
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── .vercelignore         # Files to exclude from deployment
├── test-api.js           # Pre-deployment testing script
└── VERCEL-README.md      # This file
```

## ⚙️ Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

### Environment Variables
- `MONGODB_URI`: MongoDB Atlas connection string
- `NODE_ENV`: Set to `production` automatically by Vercel

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Image Upload
- `POST /api/transactions/:id/upload-image` - Upload image to transaction
- `DELETE /api/transactions/:id/remove-image` - Remove image from transaction

### Documentation
- `GET /api-docs` - Swagger API documentation

## 🗄️ Database Configuration

The API uses MongoDB Atlas for serverless compatibility. The connection is configured in `config/database.js` with:

- Connection pooling for serverless functions
- Automatic reconnection handling
- Timeout configurations optimized for serverless

## 🖼️ File Upload

Images are uploaded using Multer with memory storage (required for serverless). Images are stored as base64 strings in the database.

## 🧪 Testing

Run comprehensive tests before deployment:

```bash
# Local testing
npm run test

# Test production deployment
BASE_URL=https://your-app.vercel.app npm run test
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Timeout**
   - Ensure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
   - Check your connection string format

2. **Cold Start Delays**
   - Serverless functions have cold start delays (normal)
   - First request may take 2-5 seconds

3. **Function Timeout**
   - Vercel serverless functions timeout after 30 seconds
   - Optimize database queries and image processing

4. **Environment Variables**
   - Ensure `MONGODB_URI` is set in Vercel dashboard
   - Variables are case-sensitive

### Logs and Debugging

Check Vercel function logs in the dashboard or via CLI:
```bash
vercel logs
```

## 📈 Performance Optimization

- Database connections are reused across function invocations
- Images are stored in memory during upload
- CORS is configured for cross-origin requests
- Swagger documentation is served statically

## 🔒 Security

- Environment variables protect sensitive data
- CORS configured for web application access
- Input validation on all endpoints
- File upload restrictions (images only)

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test locally with `npm run test`
4. Review MongoDB Atlas configuration

## 🎯 Next Steps

After successful deployment:
1. Update your frontend application URLs
2. Configure monitoring and alerts
3. Set up CI/CD for automatic deployments
4. Consider adding authentication/authorization

---

**Happy deploying! 🚀**