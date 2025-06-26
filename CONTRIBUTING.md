# Contributing to Pizzeria Web Application

Thank you for your interest in contributing to our pizza ordering application! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/pizzeria.git`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open http://localhost:5173 in your browser

## 📁 Project Structure

### Key Directories
- `/api/` - Vercel serverless functions for backend logic
- `/client/src/` - React frontend application
- `/client/src/components/` - Reusable UI components
- `/client/src/pages/` - Application pages and routing
- `/client/src/store/` - Zustand state management
- `/attached_assets/` - Static data files (pizzas, extras)

### Important Files
- `vercel.json` - Vercel deployment configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `package.json` - Dependencies and scripts

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing component structure and naming conventions
- Use Tailwind CSS classes instead of custom CSS
- Implement responsive design for all components
- Maintain Slovak language consistency in UI text

### Component Development
- Create reusable components in `/client/src/components/`
- Use Radix UI primitives for accessibility
- Implement proper TypeScript interfaces
- Add loading states and error handling
- Follow existing design patterns

### State Management
- Use Zustand for global state (cart, user preferences)
- Implement localStorage persistence for user data
- Keep state updates immutable
- Add proper TypeScript types for state

## 🔧 API Development

### Serverless Functions
- Place new API endpoints in `/api/` directory
- Use Node.js 20.x runtime configuration
- Implement proper error handling and validation
- Add CORS headers for frontend compatibility
- Follow existing patterns for data processing

### Email Integration
- Use existing Nodemailer configuration
- Maintain Slovak language in email templates
- Include proper error handling for email failures
- Test email functionality in development

## 🧪 Testing

### Manual Testing
- Test all functionality on desktop and mobile
- Verify email delivery in development
- Check cart persistence across browser sessions
- Validate form submissions and error handling

### Performance Testing
- Run `npm run build` to verify production build
- Check bundle size and optimization
- Test loading performance on slower connections
- Verify responsive design on various screen sizes

## 📝 Pull Request Process

### Before Submitting
1. Ensure code follows project conventions
2. Test functionality thoroughly
3. Update documentation if needed
4. Verify build process works: `npm run build`
5. Check TypeScript compilation: `npm run type-check`

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Email functionality verified
- [ ] Build process successful

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Environment**
- Browser: [e.g. Chrome 120]
- Device: [e.g. iPhone 14, Windows PC]
- Screen size: [e.g. 1920x1080, mobile]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of proposed feature

**Use Case**
Why is this feature needed?

**Implementation Ideas**
Suggestions for implementation

**Additional Context**
Any other relevant information
```

## 🌍 Localization

### Slovak Language Guidelines
- Maintain consistent terminology throughout
- Use proper Slovak diacritics (á, č, ď, é, etc.)
- Follow Slovak currency formatting (EUR)
- Use appropriate formal/informal tone
- Verify translations with native speakers

### Adding New Text
- Add new strings to appropriate component files
- Use semantic naming for text variables
- Maintain consistency with existing translations
- Consider context and user experience

## 🔒 Security Guidelines

### Data Handling
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Implement proper error handling without exposing internals

### Email Security
- Use app-specific passwords for Gmail integration
- Validate email addresses before sending
- Handle email failures gracefully
- Protect against injection attacks

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Design Resources
- [Radix UI Components](https://www.radix-ui.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Community

### Communication
- Be respectful and constructive in discussions
- Help other contributors when possible
- Share knowledge and best practices
- Report issues clearly and thoroughly

### Code Reviews
- Provide helpful feedback on pull requests
- Focus on code quality and user experience
- Suggest improvements and alternatives
- Acknowledge good work and contributions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making this pizza ordering application better! 🍕