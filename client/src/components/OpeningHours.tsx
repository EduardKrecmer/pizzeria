import { useEffect, useState } from 'react';

type DaySchedule = {
  day: string;
  hours: string;
};

type OpeningStatus = 'open' | 'closed';

const OPENING_HOURS: DaySchedule[] = [
  { day: 'Pondelok', hours: '10:00 - 22:00' },
  { day: 'Utorok', hours: '10:00 - 22:00' },
  { day: 'Streda', hours: '10:00 - 22:00' },
  { day: 'Štvrtok', hours: '10:00 - 22:00' },
  { day: 'Piatok', hours: '10:00 - 23:00' },
  { day: 'Sobota', hours: '11:00 - 23:00' },
  { day: 'Nedeľa', hours: '11:00 - 22:00' },
];

const OpeningHours = () => {
  const [status, setStatus] = useState<OpeningStatus>('closed');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
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
    
    // Pre účely testovania môžeme pridať offset, aby sme videli zmeny stavu
    // Toto by bolo v produkčnom kóde odstránené
    // const testTime = new Date();
    // testTime.setHours(testTime.getHours() + 5); // Napr. posun o 5 hodín pre testovanie
    // const bratislavaTime = testTime;
    
    // Normálna implementácia
    const bratislavaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Bratislava' }));
    
    const dayOfWeek = bratislavaTime.getDay(); // 0 = Nedeľa, 1 = Pondelok, ...
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Prekonvertovanie na náš index (0 = Pondelok)
    
    const daySchedule = OPENING_HOURS[dayIndex];
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
  
  // Formátovanie času pre zobrazenie
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('sk-SK', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Bratislava'
    });
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800">Otváracie hodiny</h3>
        <div className="flex items-center">
          <span className="text-sm mr-2">Aktuálne:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status === 'open' ? 'Otvorené' : 'Zatvorené'}
          </span>
        </div>
      </div>
      
      <div className="text-sm text-neutral-600 mb-2">
        Aktuálny čas v Bratislave: <span className="font-medium">{formatTime(currentTime)}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {OPENING_HOURS.map((schedule, index) => (
          <div 
            key={index} 
            className={`flex justify-between py-1 ${
              (index === new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Bratislava' })).getDay() - 1) || 
              (new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Bratislava' })).getDay() === 0 && index === 6)
                ? 'font-semibold bg-neutral-100 px-2 rounded' 
                : ''
            }`}
          >
            <span>{schedule.day}</span>
            <span>{schedule.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpeningHours;