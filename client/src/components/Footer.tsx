import { Pizza, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Pizza className="w-7 h-7 mr-2 text-primary" />
              <h3 className="font-accent text-xl font-bold">Pizzeria Janíček</h3>
            </div>
            <p className="text-neutral-400">Poctivá pizza z kvalitných surovín rovno k vám domov.</p>
            <div className="flex mt-4 space-x-3">
              <a href="https://facebook.com" className="text-neutral-400 hover:text-white transition duration-200" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="text-neutral-400 hover:text-white transition duration-200" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Informácie</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-neutral-400 hover:text-white transition duration-200">O nás</Link></li>
              <li><Link to="/" className="text-neutral-400 hover:text-white transition duration-200">Často kladené otázky</Link></li>
              <li><Link to="/" className="text-neutral-400 hover:text-white transition duration-200">Podmienky používania</Link></li>
              <li><Link to="/" className="text-neutral-400 hover:text-white transition duration-200">Ochrana súkromia</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Kontakt</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-400">
                <Phone className="w-4 h-4 mr-2" />
                +421 901 123 456
              </li>
              <li className="flex items-center text-neutral-400">
                <Mail className="w-4 h-4 mr-2" />
                info@pizzeriajanicek.sk
              </li>
              <li className="flex items-center text-neutral-400">
                <MapPin className="w-4 h-4 mr-2" />
                Hlavná 123, Bratislava
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Otváracie hodiny</h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex justify-between">
                <span>Nedeľa</span>
                <span>Zatvorené</span>
              </li>
              <li className="flex justify-between">
                <span>Pondelok</span>
                <span>Zatvorené</span>
              </li>
              <li className="flex justify-between">
                <span>Utorok - Sobota</span>
                <span>15:00 - 22:00</span>
              </li>
            </ul>
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
