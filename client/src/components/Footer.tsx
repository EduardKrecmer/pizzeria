import { Pizza, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-10" role="contentinfo" aria-label="Päta stránky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Pizza className="w-7 h-7 mr-2 text-primary" aria-hidden="true" />
              <h3 className="font-accent text-xl font-bold">Pizzeria Janíček</h3>
            </div>
            <p className="text-neutral-400">Poctivá pizza z kvalitných surovín rovno k vám domov.</p>
            <div className="flex mt-4 space-x-3" aria-label="Sociálne siete">
              <a 
                href="https://facebook.com" 
                className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1" 
                aria-label="Facebook profil Pizzeria Janíček"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="https://instagram.com" 
                className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1" 
                aria-label="Instagram profil Pizzeria Janíček"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          
          <nav aria-labelledby="footer-info">
            <h4 className="text-lg font-medium mb-4" id="footer-info">Informácie</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  O nás
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  Často kladené otázky
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  Podmienky používania
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  Ochrana súkromia
                </Link>
              </li>
            </ul>
          </nav>
          
          <div aria-labelledby="footer-contact">
            <h4 className="text-lg font-medium mb-4" id="footer-contact">Kontakt</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-400">
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                <a 
                  href="tel:+421901123456" 
                  className="hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  +421 901 123 456
                </a>
              </li>
              <li className="flex items-center text-neutral-400">
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                <a 
                  href="mailto:info@pizzeriajanicek.sk"
                  className="hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  info@pizzeriajanicek.sk
                </a>
              </li>
              <li className="flex items-center text-neutral-400">
                <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Hlavná 123, Bratislava</span>
              </li>
            </ul>
          </div>
          
          <div aria-labelledby="opening-hours">
            <h4 className="text-lg font-medium mb-4" id="opening-hours">Otváracie hodiny</h4>
            <dl className="space-y-2 text-neutral-400">
              <div className="flex justify-between">
                <dt>Nedeľa</dt>
                <dd>Zatvorené</dd>
              </div>
              <div className="flex justify-between">
                <dt>Pondelok</dt>
                <dd>Zatvorené</dd>
              </div>
              <div className="flex justify-between">
                <dt>Utorok - Sobota</dt>
                <dd>15:00 - 22:00</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} Pizzeria Janíček. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
