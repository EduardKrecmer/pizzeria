import { Facebook, Mail, MapPin, Phone, Pizza } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-12" role="contentinfo" aria-label="Päta stránky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center">
              <Pizza className="w-7 h-7 mr-2 text-primary" aria-hidden="true" />
              <h3 className="font-accent text-xl font-bold">Tancujúca Pizza</h3>
            </div>
            <p className="text-neutral-400">Poctivá pizza z kvalitných surovín rovno k vám domov.</p>
            <div className="flex space-x-4" aria-label="Sociálne siete">
              <a 
                href="https://www.facebook.com/tancujucapizza" 
                className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1" 
                aria-label="Facebook profil Tancujúca Pizza"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-6 h-6" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold" id="opening-hours">Otváracie hodiny</h4>
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

          <div className="space-y-4">
            <h4 className="text-lg font-semibold" id="footer-contact">Kontakt</h4>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3" aria-hidden="true" />
                <a 
                  href="tel:+421944386486" 
                  className="hover:text-white transition duration-200"
                >
                  +421 944 386 486
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3" aria-hidden="true" />
                <a 
                  href="mailto:tancujucapizza@gmail.com"
                  className="hover:text-white transition duration-200"
                >
                  tancujucapizza@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" aria-hidden="true" />
                <span>Hlavná 123, Bratislava</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Užitočné odkazy</h4>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-neutral-400 hover:text-white transition duration-200">
                    Domov
                  </Link>
                </li>
                <li>
                  <Link to="/menu" className="text-neutral-400 hover:text-white transition duration-200">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/checkout" className="text-neutral-400 hover:text-white transition duration-200">
                    Objednávka
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-10 pt-8 text-neutral-400 text-sm text-center">
          <p>© {new Date().getFullYear()} Tancujúca Pizza. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer