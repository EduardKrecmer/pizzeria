# Pizzeria Web Application

## Overview

This is a full-stack pizza ordering application built for a Slovakian pizzeria. The application features a React-based frontend with TypeScript, a Node.js/Express backend, and is designed to be deployed on platforms like Vercel or Replit. The system allows customers to browse pizzas, customize orders, and place orders online.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for Replit compatibility
- **Styling**: Tailwind CSS with custom theme (olive/green color scheme)
- **UI Components**: Radix UI components for professional interface elements
- **State Management**: Zustand for global state with persistence
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth interactions
- **Routing**: React Router for SPA navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Structure**: RESTful endpoints for pizzas, extras, and orders
- **Email Service**: Nodemailer integration for order confirmations
- **CORS Configuration**: Comprehensive CORS setup for cross-origin requests
- **Development Mode**: Proxy server setup for development environment

### Build System
- **Development**: Vite dev server with hot reload
- **Production**: Static build with Vite
- **Deployment**: Multiple deployment strategies (Vercel, Replit)
- **TypeScript**: Full type safety across the application

## Key Components

### Data Models
- **Pizza**: ID, name, description, price, image, tags, ingredients, weight, allergens (32 pizze v ponuke)
- **Extra**: ID, name, price for additional toppings (kategoricky rozdelené: Syry, Mäso, Zelenina, Iné)
- **Order**: Customer information, items, delivery details, payment information

### Core Features
- **Product Catalog**: Dynamic pizza listing with categories and filtering
- **Shopping Cart**: Persistent cart with item management
- **Order Form**: Multi-step checkout process with validation
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Email Notifications**: Automated order confirmations

### UI Components
- Custom pizza cards with hover effects
- Shopping cart drawer with item management
- Multi-step checkout form with validation
- Loading states and error handling
- Toast notifications for user feedback

## Data Flow

1. **Product Loading**: JSON data files (pizzas.json, extras.json) loaded via API endpoints
2. **State Management**: Zustand stores manage cart state and pizza data with local storage persistence
3. **Order Processing**: Form data validated and sent to backend API
4. **Email Workflow**: Order confirmation emails sent to both customer and restaurant
5. **Error Handling**: Comprehensive error boundaries and user feedback

## External Dependencies

### Core Libraries
- React ecosystem (React, React DOM, React Router)
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI for component primitives
- Framer Motion for animations
- Zustand for state management

### Development Tools
- TypeScript for type safety
- ESLint and Prettier for code quality
- Nodemailer for email functionality
- CORS middleware for cross-origin requests

### Deployment Dependencies
- Vercel-specific configurations and serverless functions
- Replit-specific proxy servers and port management
- Environment variable management

## Deployment Strategy

### Vercel Deployment
- Static frontend build served from CDN
- Serverless functions for API endpoints (/api directory)
- Environment variables for email configuration
- JSON data files served statically

### Replit Deployment
- Development proxy server on port 5000
- Vite dev server on port 5173
- API server on port 3000
- CORS proxy for cross-origin requests

### Configuration Files
- `vercel.json` for Vercel-specific settings
- Multiple Vite configurations for different environments
- Package.json variants for different deployment targets

## Changelog

- June 25, 2025: Initial setup
- June 25, 2025: Aktualizované pizza menu podľa novej ponuky pizzerie (32 pizze)
- June 25, 2025: Implementované bezpečnostné vylepšenia (helmet, rate limiting, input validation)
- June 25, 2025: Opravené reálne pizza obrázky namiesto placeholderov
- June 25, 2025: Vyčistená štruktúra projektu, odstránené prebytočné súbory
- June 25, 2025: Zjednodušená cartStore logika pre lepšiu funkčnosť objednávok
- June 25, 2025: Pridané Error Boundary komponenty pre robustné error handling
- June 25, 2025: Opravený problém s načítavaním pizz z JSON súboru (proxy-server.mjs)
- June 25, 2025: Pridané jednoduché SVG ikony pre každú pizzu (rýchle načítavanie, pekný dizajn)
- June 25, 2025: Integrácia SVG ikon do PizzaCard a PizzaDetail komponentov namiesto obrázkov
- June 25, 2025: Pridané detailné SVG ikony s gradientmi, textúrami a vizuálnymi efektmi
- June 25, 2025: Opravené zobrazovanie ikon v detailnom náhľade pizze a odporúčaných pizzách
- June 25, 2025: Pridané smooth scrolling na vrch stránky pri kliknutí na logo a tlačidlo Domov
- June 25, 2025: Vytvorené rozklikavacie hodiny na úvodnej stránke s detailnými otváracími časmi
- June 25, 2025: Opravené tlačidlo "Pokračovať v objednávke" v košíku - správne naviguje na domovskú stránku s menu
- June 25, 2025: Vylepšené extra prísady s lepším osvetlením, kontrastom a kompaktnejším dizajnom
- June 26, 2025: Opravená Vite konfigurácia - pridané allowedHosts pre Replit hostovanie
- June 26, 2025: Vytvorené nové komponenty OrderForm.tsx a FavoritePizza.tsx
- June 26, 2025: Pridané ukladanie údajov do localStorage (kontaktné údaje, obľúbené pizze)
- June 26, 2025: Integrované obľúbené pizze do detailu pizze a domovskej stránky
- June 26, 2025: Vylepšený checkout proces s novým formulárom pre kontaktné údaje
- June 26, 2025: Zjednotené formuláre - odstránený samostatný OrderForm, funkcionalita integrovaná do CheckoutForm
- June 26, 2025: Pridané ukladanie kontaktných údajov priamo do checkout formulára s checkboxom "Zapamätať údaje"
- June 26, 2025: Opravená logika dopravy - 1.50€ pre 1 pizzu, zadarmo pre 2+ pizze
- June 26, 2025: Pridaná možnosť úpravy pizze priamo z košíka s EditCartItem komponentom
- June 26, 2025: Opravená JSON parsing chyba pri odosielaní objednávok
- June 26, 2025: Nastavené odosielanie objednávok na email pizza.objednavka@gmail.com
- June 26, 2025: Opravená Vercel deployment chyba - presun Vite z devDependencies do dependencies
- June 26, 2025: Vyriešené konflikty súborov v API priečinku pre Vercel serverless functions
- June 26, 2025: Dokončený Vercel deployment - všetky build chyby vyriešené, projekt pripravený pre produkciu
- June 26, 2025: Kompletne vyriešené všetky Vercel deployment problémy - štandardná konfigurácia, správne dependencies
- June 26, 2025: Definitívne opravené Vite dependency issue - Vite presunuytý z devDependencies do dependencies
- June 26, 2025: Vyriešené PostCSS/Autoprefixer dependency issue - všetky CSS build dependencies presunuté do dependencies
- June 26, 2025: Implementované Vercel best practices - Node.js 20.x runtime, optimalizované API functions, professional-grade konfigurácia
- June 26, 2025: Kompletná GitHub repository optimalizácia - README, LICENSE, GitHub Actions, issue templates, contributing guidelines
- June 26, 2025: Finálne vyriešené všetky Vercel deployment chyby - odstránené neplatné runtime specifications, projekt pripravený pre produkčné nasadenie
- June 26, 2025: Opravený Vercel SPA routing - pridané rewrites pre správne zobrazenie React aplikácie namiesto statického HTML
- June 26, 2025: Vyriešený Vercel build error "Could not resolve entry module" - opravené build command na "cd client && npm run build"
- June 26, 2025: Profesionálne optimalizovaný Vercel deployment - vytvorený client/package.json, kompletná Vite konfigurácia, verified build process
- June 26, 2025: Hlbká analýza a riešenie všetkých Vercel prekážok - opravené CSS build errors, kompletné dependencies, TypeScript konfigurácia, optimalizovaná .vercelignore

## User Preferences

Preferred communication style: Simple, everyday language.