# Deployment Guide

This guide covers how to deploy the Pizzeria Web Application to various hosting platforms.

## Vercel (Recommended)

Vercel provides seamless deployment with serverless functions support.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/pizzeria-app)

### Manual Deployment

1. **Install Vercel CLI**:
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

### Environment Variables

Configure these variables in your Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_SECURE` | Use SSL/TLS | `false` |
| `EMAIL_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email password | `your-app-password` |
| `EMAIL_FROM` | From address | `your-email@gmail.com` |
| `NODE_ENV` | Environment | `production` |

### Gmail Setup

For email functionality:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password at [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the App Password (not your regular password) for `EMAIL_PASS`

## Netlify

1. **Connect Repository**: Link your GitHub repository in Netlify dashboard
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add the same variables as listed above
4. **Deploy**: Automatic deployment on git push

## Railway

1. **Connect Repository**: Import from GitHub in Railway dashboard
2. **Configure**:
   - Root directory: `/`
   - Build command: `npm run build`
   - Start command: `npm start`
3. **Environment Variables**: Add via Railway dashboard
4. **Deploy**: Automatic deployment

## DigitalOcean App Platform

1. **Create App**: Import from GitHub repository
2. **Configure Build**:
   - Build command: `npm run build`
   - Output directory: `dist`
3. **Environment Variables**: Configure in app settings
4. **Deploy**: Automatic deployment

## Custom Server

### Prerequisites
- Node.js 18+
- Domain with SSL certificate
- Reverse proxy (nginx recommended)

### Steps

1. **Clone and build**:
   ```bash
   git clone https://github.com/your-username/pizzeria-app.git
   cd pizzeria-app
   npm install
   npm run build
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start application**:
   ```bash
   npm start
   ```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        try_files $uri $uri/ /index.html;
        root /path/to/pizzeria-app/dist;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
docker build -t pizzeria-app .
docker run -p 3000:3000 --env-file .env pizzeria-app
```

## Performance Optimization

### CDN Setup
- Configure CDN for static assets
- Enable compression (gzip/brotli)
- Set appropriate cache headers

### Database
- Consider migrating from JSON to PostgreSQL for better performance
- Use connection pooling
- Implement caching layer (Redis)

## Monitoring

### Recommended Tools
- **Vercel Analytics** (for Vercel deployments)
- **Google Analytics** for user tracking
- **Sentry** for error monitoring
- **LogRocket** for session replay

### Health Checks
- Monitor API endpoint response times
- Set up alerts for email delivery failures
- Track build and deployment status

## Scaling

### Traffic Growth
- **< 1,000 visits/day**: Free tier sufficient
- **1,000-10,000 visits/day**: Upgrade to paid plans
- **> 10,000 visits/day**: Consider dedicated infrastructure

### Database Migration
When ready to scale beyond JSON files:
1. Set up PostgreSQL database
2. Create migration scripts for existing data
3. Update API endpoints to use database
4. Implement proper indexing and optimization

## Troubleshooting

### Common Issues

**Build Failures**:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

**Email Not Working**:
- Verify Gmail App Password is correct
- Check spam folders
- Test SMTP settings with email client

**API Errors**:
- Ensure serverless functions are properly deployed
- Check environment variables are set
- Review function logs

### Support

For deployment issues:
- Check the GitHub Issues tab
- Review platform-specific documentation
- Contact support through appropriate channels

---

Happy deploying! 🚀