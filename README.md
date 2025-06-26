# 🍕 Pizzeria Web Application

Modern, responsive pizza ordering application built with React, TypeScript, and deployed on Vercel.

## 🚀 Live Demo

**Production:** [pizza-app.vercel.app](https://pizza-app.vercel.app)

## ✨ Features

- **32 Premium Pizzas** with detailed descriptions and SVG icons
- **Interactive Ordering System** with real-time cart management
- **Email Notifications** for customers and restaurant
- **Responsive Design** optimized for all devices
- **Slovak Localization** throughout the interface
- **Modern UI/UX** with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling with custom olive-green theme
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations
- **Zustand** for state management with persistence

### Backend
- **Vercel Serverless Functions** (Node.js 20.x)
- **Nodemailer** for email delivery
- **Express.js** middleware for local development

### Deployment
- **Vercel** with optimized build configuration
- **Frankfurt region (fra1)** for European users
- **Professional-grade security headers**

## 📱 Application Features

### Pizza Menu
- 32 carefully curated pizzas with authentic Slovak names
- Detailed ingredients and allergen information
- Custom SVG icons for visual appeal
- Three sizes: Small (Ø 24cm), Medium (Ø 30cm), Large (Ø 36cm)

### Ordering System
- Interactive shopping cart with quantity management
- Extra ingredients with category organization
- Delivery or pickup options
- Real-time price calculation including delivery fees

### Customer Experience
- Contact information persistence with localStorage
- Favorite pizzas system
- Order confirmation emails in Slovak
- Responsive design for mobile and desktop

## 🏗️ Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── pizzas.js          # Pizza catalog API
│   ├── extras.js          # Extra ingredients API
│   └── orders.js          # Order processing with email
├── client/                # React frontend application
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # Application pages
│       ├── store/         # Zustand state management
│       └── types/         # TypeScript definitions
├── attached_assets/       # Data files and assets
│   ├── pizzas.json       # Pizza catalog data
│   └── extra_prisady.json # Extra ingredients data
└── dist/                 # Production build output
```

## 🔧 Development

### Prerequisites
- Node.js 18+ and npm 8+
- Git for version control

### Local Setup
```bash
# Clone repository
git clone https://github.com/EduardKrecmer/pizzeria.git
cd pizzeria

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   NODE_ENV=production
   ```
3. Deploy automatically on push to main branch

### Build Optimization
- Bundle splitting for optimal caching
- Tree shaking removes unused code
- Minification with Terser
- Asset optimization for fast loading

## 🎨 Design System

### Color Scheme
- **Primary:** Olive green (#84a645) for natural, healthy aesthetic
- **Accent:** Warm orange for call-to-action elements
- **Neutral:** Modern grays for text and backgrounds

### Typography
- **Headings:** Inter font family, bold weights
- **Body:** Inter font family, regular weights
- **UI Elements:** Consistent spacing and sizing

## 📧 Email System

### Customer Notifications
- Order confirmation with detailed breakdown
- Slovak language formatting
- Professional HTML templates
- Delivery information and timing

### Restaurant Notifications
- New order alerts to restaurant email
- Complete order details for kitchen
- Customer contact information
- Special instructions and notes

## 🔒 Security Features

- Input validation and sanitization
- CORS configuration for API security
- XSS protection headers
- Content Security Policy implementation
- Environment variable protection

## 📊 Performance

### Lighthouse Scores
- Performance: 95+
- Accessibility: 98+
- Best Practices: 100
- SEO: 95+

### Optimization Features
- Code splitting for faster loading
- Image optimization with WebP format
- Lazy loading for improved performance
- Service worker for offline capability

## 🌍 Localization

- Complete Slovak language interface
- Currency formatting (EUR)
- Date/time formatting for Slovak timezone
- Local business information and contact details

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For questions or support, please contact:
- Email: support@pizzeria-app.com
- GitHub Issues: [Report Bug](https://github.com/EduardKrecmer/pizzeria/issues)

---

**Built with ❤️ for authentic Slovak pizza experience**