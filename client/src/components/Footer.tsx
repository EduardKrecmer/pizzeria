import { Pizza as PizzaIcon, Facebook, Instagram, Phone, Mail, MapPin, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-background border-t border-border py-8 text-muted-foreground" 
      role="contentinfo" 
      aria-label="Päta stránky"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo a kontakt */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center mr-2">
                <PizzaIcon className="w-6 h-6 text-primary" aria-hidden="true" />
                <Leaf className="absolute w-2.5 h-2.5 text-accent-dark -right-0.5 -top-0.5" aria-hidden="true" />
              </div>
              <h3 className="font-accent text-xl text-primary">Pizzeria <span className="text-secondary-dark">Janíček</span></h3>
            </div>
            
            <p className="text-sm max-w-md">
              Kvalitné bio pizze pripravené s láskou, z lokálnych surovín, 
              bez konzervantov a umelých prísad. Prajeme dobrú chuť!
            </p>
            
            <div className="flex items-center text-sm space-x-6 pt-2">
              <a 
                href="tel:+421944386486" 
                className="flex items-center text-foreground/70 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
                aria-label="Zavolajte nám: +421 944 386 486"
              >
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>+421 944 386 486</span>
              </a>
              
              <a 
                href="mailto:tancujucapizza@gmail.com"
                className="flex items-center text-foreground/70 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
                aria-label="Napíšte nám email: tancujucapizza@gmail.com"
              >
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Email</span>
              </a>
            </div>
          </div>
          
          {/* Sociálne siete a odkazy */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-medium text-foreground">Kontakt a informácie</h4>
            
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href="https://maps.app.goo.gl/..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-foreground/70 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
              >
                <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Nájdete nás na mape</span>
              </a>
              
              <div className="flex items-center mt-4 space-x-4" aria-label="Sociálne siete">
                <a 
                  href="https://www.facebook.com/tancujucapizza" 
                  className="flex items-center text-foreground/70 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary" 
                  aria-label="Facebook profil Pizzeria Janíček"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://instagram.com" 
                  className="flex items-center text-foreground/70 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary" 
                  aria-label="Instagram profil Pizzeria Janíček"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-4 text-xs" aria-label="Dôležité odkazy">
              <Link 
                to="/" 
                className="text-foreground/60 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
              >
                Podmienky použitia
              </Link>
              <Link 
                to="/" 
                className="text-foreground/60 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
              >
                Ochrana súkromia
              </Link>
            </div>
          </div>
        </div>
        
        <div className="eco-divider w-full mt-8 mb-4 opacity-40"></div>
        
        <div className="text-foreground/60 text-xs text-center">
          <p>© {currentYear} Pizzeria Janíček. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
