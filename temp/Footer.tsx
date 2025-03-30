
export default function Footer() {
  return (
    <footer className="bg-[#f6fdf8] border-t border-gray-200 text-sm text-gray-700 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-[#6BA368] mb-2">Otváracie hodiny</h4>
          <ul className="space-y-1">
            <li><strong>Nedeľa:</strong> Zatvorené</li>
            <li><strong>Pondelok:</strong> Zatvorené</li>
            <li><strong>Utorok – Sobota:</strong> 15:00 – 22:00</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#6BA368] mb-2">Kontakt</h4>
          <p>objednavky@pizzeria.sk</p>
          <p>+421 900 000 000</p>
        </div>
        <div>
          <h4 className="font-semibold text-[#6BA368] mb-2">Pizzeria Janíček</h4>
          <p>Všetky práva vyhradené &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
