// Generator pre SVG ikony pizz
// Tento skript vytvorí jednoduché, pekné SVG ikony pre každú pizzu

const pizzaIcons = {
  // Základná pizza ikona template
  base: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Pizza základ -->
    <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" stroke-width="2"/>
    <!-- Paradajková omáčka -->
    <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
    <!-- Syr -->
    <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
  </svg>`,

  // Špecifické ikony pre rôzne typy pizz
  syrova: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" stroke-width="2"/>
    <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
    <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
    <!-- Bazalka listy -->
    <ellipse cx="45" cy="45" rx="8" ry="4" fill="#228B22" transform="rotate(45 45 45)"/>
    <ellipse cx="75" cy="55" rx="8" ry="4" fill="#228B22" transform="rotate(-30 75 55)"/>
    <ellipse cx="55" cy="75" rx="8" ry="4" fill="#228B22" transform="rotate(60 55 75)"/>
  </svg>`,

  sunkova: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" stroke-width="2"/>
    <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
    <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
    <!-- Šunka kúsky -->
    <ellipse cx="45" cy="50" rx="12" ry="8" fill="#FFB6C1"/>
    <ellipse cx="70" cy="45" rx="10" ry="7" fill="#FFB6C1"/>
    <ellipse cx="55" cy="70" rx="11" ry="8" fill="#FFB6C1"/>
    <ellipse cx="75" cy="70" rx="9" ry="6" fill="#FFB6C1"/>
  </svg>`,

  salamova: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" stroke-width="2"/>
    <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
    <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
    <!-- Saláma kolieska -->
    <circle cx="45" cy="45" r="8" fill="#8B0000"/>
    <circle cx="45" cy="45" r="6" fill="#DC143C"/>
    <circle cx="75" cy="50" r="7" fill="#8B0000"/>
    <circle cx="75" cy="50" r="5" fill="#DC143C"/>
    <circle cx="50" cy="75" r="8" fill="#8B0000"/>
    <circle cx="50" cy="75" r="6" fill="#DC143C"/>
    <circle cx="75" cy="75" r="6" fill="#8B0000"/>
    <circle cx="75" cy="75" r="4" fill="#DC143C"/>
  </svg>`,

  sampinova: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" stroke-width="2"/>
    <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
    <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
    <!-- Šampiňóny -->
    <ellipse cx="45" cy="50" rx="10" ry="6" fill="#F5F5DC"/>
    <ellipse cx="45" cy="50" rx="8" ry="4" fill="#DDD"/>
    <ellipse cx="70" cy="45" rx="8" ry="5" fill="#F5F5DC"/>
    <ellipse cx="70" cy="45" rx="6" ry="3" fill="#DDD"/>
    <ellipse cx="55" cy="70" rx="9" ry="6" fill="#F5F5DC"/>
    <ellipse cx="55" cy="70" rx="7" ry="4" fill="#DDD"/>
  </svg>`,

  hawai: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" stroke-width="2"/>
    <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
    <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
    <!-- Ananás kúsky -->
    <polygon points="45,40 50,50 40,50" fill="#FFD700"/>
    <polygon points="70,45 75,55 65,55" fill="#FFD700"/>
    <polygon points="50,70 55,80 45,80" fill="#FFD700"/>
    <polygon points="75,70 80,80 70,80" fill="#FFD700"/>
    <!-- Šunka -->
    <ellipse cx="60" cy="50" rx="8" ry="5" fill="#FFB6C1"/>
    <ellipse cx="50" cy="65" rx="7" ry="4" fill="#FFB6C1"/>
  </svg>`,

  vegetarianska: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" stroke-width="2"/>
    <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
    <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
    <!-- Zelenina mix -->
    <circle cx="45" cy="45" r="5" fill="#FF6347"/> <!-- paradajka -->
    <circle cx="75" cy="50" r="4" fill="#32CD32"/> <!-- hrášok -->
    <circle cx="50" cy="70" r="5" fill="#FFD700"/> <!-- kukurica -->
    <ellipse cx="70" cy="70" rx="6" ry="3" fill="#8B4513"/> <!-- šampiňón -->
    <ellipse cx="60" cy="45" rx="4" ry="8" fill="#228B22"/> <!-- bazalka -->
  </svg>`
};

console.log('Pizza SVG ikony sú pripravené pre použitie!');