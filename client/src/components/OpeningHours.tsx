import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type DaySchedule = {
  day: string;
  hours: string;
};

type OpeningStatus = 'open' | 'closed';

// Aktualizované otváracie hodiny
const OPENING_HOURS: DaySchedule[] = [
  { day: 'Pondelok', hours: 'zatvorené' },
  { day: 'Utorok', hours: '15:00 - 22:00' },
  { day: 'Streda', hours: '15:00 - 22:00' },
  { day: 'Štvrtok', hours: '15:00 - 22:00' },
  { day: 'Piatok', hours: '15:00 - 22:00' },
  { day: 'Sobota', hours: '15:00 - 22:00' },
  { day: 'Nedeľa', hours: 'zatvorené' },
];

const OpeningHours = () => {
  const [status, setStatus] = useState<OpeningStatus>('closed');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    // Nastavenie počiatočného stavu
    checkOpeningStatus();
    
    // Aktualizácia času každú minútu
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkOpeningStatus();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Konvertovanie času na počet minút od polnoci
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  // Kontrola, či je aktuálne otvorené
  const checkOpeningStatus = () => {
    // Získanie aktuálneho času v Bratislave (CEST/CET)
    const now = new Date();
    
    // Nastavenie aktuálneho dátumu a času
    setCurrentTime(now);
    
    // Normálna implementácia
    const bratislavaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Bratislava' }));
    
    const dayOfWeek = bratislavaTime.getDay(); // 0 = Nedeľa, 1 = Pondelok, ...
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Prekonvertovanie na náš index (0 = Pondelok)
    
    const daySchedule = OPENING_HOURS[dayIndex];
    
    // Ak sú otváracie hodiny "zatvorené", nastavíme stav na zatvorené
    if (daySchedule.hours === 'zatvorené') {
      setStatus('closed');
      return;
    }
    
    const [openTime, closeTime] = daySchedule.hours.split(' - ');
    
    const currentMinutes = bratislavaTime.getHours() * 60 + bratislavaTime.getMinutes();
    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);
    
    // Ak je aktuálny čas medzi otváracím a zatváracím časom, pizzeria je otvorená
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      setStatus('open');
    } else {
      setStatus('closed');
    }
  };
  
  return (
    <div className="relative">
      {/* Hlavný button pre hodiny - jemne viditeľný */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center text-sm text-neutral-300 hover:text-white transition-all duration-300 opacity-70 hover:opacity-100 focus:outline-none focus:opacity-100"
        aria-expanded={isExpanded}
        aria-label="Zobraziť otváracie hodiny"
      >
        <div 
          className={`mr-2 w-2 h-2 rounded-full transition-colors ${
            status === 'open' ? 'bg-green-500' : 'bg-red-500'
          }`} 
          aria-hidden="true"
        ></div>
        <span 
          aria-live="polite"
          className="mr-1"
        >
          {status === 'open' ? 'Otvorené' : 'Zatvorené'}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 transition-transform" />
        )}
      </button>

      {/* Rozbaľovací panel s otváracími hodinami */}
      {isExpanded && (
        <div className="fixed inset-x-4 top-20 md:absolute md:top-full md:left-1/2 md:transform md:-translate-x-1/2 md:inset-x-auto mt-3 bg-white rounded-lg shadow-xl border border-gray-200 p-5 w-auto md:w-80 z-[60] max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h3 className="font-semibold text-[#4a5d23] mb-3 text-base text-center">Otváracie hodiny</h3>
          <div className="space-y-2">
            {OPENING_HOURS.map((day, index) => {
              const today = new Date();
              const bratislavaTime = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Bratislava' }));
              const dayOfWeek = bratislavaTime.getDay();
              const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
              const isToday = index === todayIndex;
              
              return (
                <div 
                  key={day.day} 
                  className={`flex justify-between items-center text-sm py-1 px-2 rounded transition-colors ${
                    isToday 
                      ? 'font-semibold text-[#4a5d23] bg-[#f2f5e9] border border-[#4a5d23]/20' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{day.day}</span>
                  <span className={`font-medium ${day.hours === 'zatvorené' ? 'text-red-600' : 'text-gray-800'}`}>
                    {day.hours}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Aktuálny čas */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center bg-gray-50 py-2 px-3 rounded">
              <span className="font-medium">Aktuálny čas:</span> {currentTime.toLocaleTimeString('sk-SK', {
                timeZone: 'Europe/Bratislava',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          {/* Zatváracie tlačidlo pre mobilné zariadenia */}
          <div className="md:hidden mt-4 text-center">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Zavrieť
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay pre mobilné zariadenia */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-[55] md:hidden"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default OpeningHours;