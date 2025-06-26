import React from 'react';

interface PizzaIconProps {
  pizzaName: string;
  className?: string;
  size?: number;
}

const PizzaIcon: React.FC<PizzaIconProps> = ({ pizzaName, className = "", size = 120 }) => {
  // Normalizujeme názov pizze pre určenie typu ikony
  const normalizedName = pizzaName.toLowerCase()
    .replace(/á/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/č/g, 'c')
    .replace(/ď/g, 'd')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ĺ/g, 'l')
    .replace(/ľ/g, 'l')
    .replace(/ň/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ô/g, 'o')
    .replace(/ŕ/g, 'r')
    .replace(/š/g, 's')
    .replace(/ť/g, 't')
    .replace(/ú/g, 'u')
    .replace(/ý/g, 'y')
    .replace(/ž/g, 'z')
    .replace(/\s+/g, '');

  // Musíme definovať gradienty globálne pre všetky ikony
  const commonDefs = (
    <defs>
      <radialGradient id="doughGradient" cx="0.5" cy="0.4" r="0.7">
        <stop offset="0%" stopColor="#FFEAA7"/>
        <stop offset="100%" stopColor="#FDCB6E"/>
      </radialGradient>
      <radialGradient id="sauceGradient" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0%" stopColor="#E74C3C"/>
        <stop offset="100%" stopColor="#C0392B"/>
      </radialGradient>
      <radialGradient id="cheeseGradient" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0%" stopColor="#FFFBF0"/>
        <stop offset="100%" stopColor="#F5F5DC"/>
      </radialGradient>
      <radialGradient id="hamGradient" cx="0.3" cy="0.3" r="0.7">
        <stop offset="0%" stopColor="#F1C0C7"/>
        <stop offset="60%" stopColor="#E91E63"/>
        <stop offset="100%" stopColor="#C2185B"/>
      </radialGradient>
    </defs>
  );

  // Funkcia na získanie správnej ikony na základe názvu pizze
  const getPizzaIcon = (name: string) => {
    if (name.includes('syrova') || name.includes('margherita')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          {commonDefs}
          
          {/* Pizza základ s gradientom */}
          <circle cx="60" cy="60" r="50" fill="url(#doughGradient)" stroke="#D4A520" strokeWidth="2"/>
          
          {/* Paradajková omáčka */}
          <circle cx="60" cy="60" r="44" fill="url(#sauceGradient)" opacity="0.9"/>
          
          {/* Syr s textúrou */}
          <circle cx="60" cy="60" r="38" fill="url(#cheeseGradient)" opacity="0.95"/>
          <circle cx="50" cy="50" r="3" fill="#FFFBF0" opacity="0.8"/>
          <circle cx="70" cy="55" r="2.5" fill="#FFFBF0" opacity="0.8"/>
          <circle cx="55" cy="70" r="2" fill="#FFFBF0" opacity="0.8"/>
          <circle cx="75" cy="70" r="3" fill="#FFFBF0" opacity="0.8"/>
          
          {/* Bazalka s detailmi */}
          <g fill="#228B22">
            <ellipse cx="45" cy="45" rx="10" ry="5" fill="#2ECC71" transform="rotate(45 45 45)"/>
            <ellipse cx="45" cy="45" rx="8" ry="3" fill="#27AE60" transform="rotate(45 45 45)"/>
            <ellipse cx="75" cy="55" rx="9" ry="4" fill="#2ECC71" transform="rotate(-30 75 55)"/>
            <ellipse cx="75" cy="55" rx="7" ry="2.5" fill="#27AE60" transform="rotate(-30 75 55)"/>
            <ellipse cx="55" cy="75" rx="8" ry="4" fill="#2ECC71" transform="rotate(60 55 75)"/>
            <ellipse cx="55" cy="75" rx="6" ry="2.5" fill="#27AE60" transform="rotate(60 55 75)"/>
          </g>
          
          {/* Tieň a lesk */}
          <circle cx="60" cy="60" r="50" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6"/>
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.15"/>
        </svg>
      );
    }
    
    if (name.includes('sunkova') || name.includes('sunka') || name.includes('prosciutto')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          {commonDefs}
          
          {/* Pizza základ */}
          <circle cx="60" cy="60" r="50" fill="url(#doughGradient)" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="44" fill="url(#sauceGradient)" opacity="0.9"/>
          <circle cx="60" cy="60" r="38" fill="url(#cheeseGradient)" opacity="0.95"/>
          
          {/* Šunka s textúrou a tieňom */}
          <g>
            <ellipse cx="45" cy="50" rx="12" ry="8" fill="url(#hamGradient)" opacity="0.9"/>
            <ellipse cx="45" cy="50" rx="10" ry="6" fill="#F06292" opacity="0.7"/>
            <ellipse cx="45" cy="50" rx="6" ry="4" fill="#EC407A" opacity="0.5"/>
            
            <ellipse cx="70" cy="45" rx="10" ry="7" fill="url(#hamGradient)" opacity="0.9"/>
            <ellipse cx="70" cy="45" rx="8" ry="5" fill="#F06292" opacity="0.7"/>
            
            <ellipse cx="55" cy="70" rx="11" ry="8" fill="url(#hamGradient)" opacity="0.9"/>
            <ellipse cx="55" cy="70" rx="9" ry="6" fill="#F06292" opacity="0.7"/>
            <ellipse cx="55" cy="70" rx="5" ry="3" fill="#EC407A" opacity="0.5"/>
            
            <ellipse cx="75" cy="70" rx="9" ry="6" fill="url(#hamGradient)" opacity="0.9"/>
            <ellipse cx="75" cy="70" rx="7" ry="4" fill="#F06292" opacity="0.7"/>
          </g>
          
          {/* Syr detail */}
          <circle cx="40" cy="65" r="2" fill="#FFFBF0" opacity="0.8"/>
          <circle cx="80" cy="60" r="1.5" fill="#FFFBF0" opacity="0.8"/>
          <circle cx="62" cy="40" r="2.5" fill="#FFFBF0" opacity="0.8"/>
          
          {/* Lesk */}
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.15"/>
        </svg>
      );
    }
    
    if (name.includes('salama') || name.includes('diavola') || name.includes('pepperoni')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="salamiGradient" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#E74C3C"/>
              <stop offset="70%" stopColor="#8B0000"/>
              <stop offset="100%" stopColor="#5D0000"/>
            </radialGradient>
            <radialGradient id="salamiInner" cx="0.4" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#FF6B6B"/>
              <stop offset="100%" stopColor="#DC143C"/>
            </radialGradient>
          </defs>
          
          {/* Pizza základ */}
          <circle cx="60" cy="60" r="50" fill="url(#doughGradient)" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="44" fill="url(#sauceGradient)" opacity="0.9"/>
          <circle cx="60" cy="60" r="38" fill="url(#cheeseGradient)" opacity="0.95"/>
          
          {/* Saláma kolieska s detailmi */}
          <g>
            {/* Veľké koliesko */}
            <circle cx="45" cy="45" r="8" fill="url(#salamiGradient)"/>
            <circle cx="45" cy="45" r="6" fill="url(#salamiInner)"/>
            <circle cx="45" cy="45" r="4" fill="#FF4757" opacity="0.8"/>
            <circle cx="43" cy="43" r="1" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="47" cy="46" r="0.5" fill="#FFFFFF" opacity="0.4"/>
            
            {/* Stredné koliesko */}
            <circle cx="75" cy="50" r="7" fill="url(#salamiGradient)"/>
            <circle cx="75" cy="50" r="5" fill="url(#salamiInner)"/>
            <circle cx="75" cy="50" r="3" fill="#FF4757" opacity="0.8"/>
            <circle cx="73.5" cy="48.5" r="0.8" fill="#FFFFFF" opacity="0.6"/>
            
            {/* Ďalšie kolieska */}
            <circle cx="50" cy="75" r="8" fill="url(#salamiGradient)"/>
            <circle cx="50" cy="75" r="6" fill="url(#salamiInner)"/>
            <circle cx="50" cy="75" r="4" fill="#FF4757" opacity="0.8"/>
            <circle cx="48" cy="73" r="1" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="52" cy="76" r="0.5" fill="#FFFFFF" opacity="0.4"/>
            
            <circle cx="75" cy="75" r="6" fill="url(#salamiGradient)"/>
            <circle cx="75" cy="75" r="4" fill="url(#salamiInner)"/>
            <circle cx="75" cy="75" r="2.5" fill="#FF4757" opacity="0.8"/>
            <circle cx="74" cy="74" r="0.5" fill="#FFFFFF" opacity="0.6"/>
            
            {/* Malé kolieska */}
            <circle cx="38" cy="65" r="5" fill="url(#salamiGradient)"/>
            <circle cx="38" cy="65" r="3.5" fill="url(#salamiInner)"/>
            <circle cx="65" cy="35" r="4.5" fill="url(#salamiGradient)"/>
            <circle cx="65" cy="35" r="3" fill="url(#salamiInner)"/>
          </g>
          
          {/* Lesk */}
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.1"/>
        </svg>
      );
    }
    
    if (name.includes('sampinon') || name.includes('fungi') || name.includes('mushroom')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="mushroomGradient" cx="0.3" cy="0.2" r="0.8">
              <stop offset="0%" stopColor="#F5F5DC"/>
              <stop offset="50%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#8B7355"/>
            </radialGradient>
            <radialGradient id="mushroomShadow" cx="0.5" cy="0.8" r="0.6">
              <stop offset="0%" stopColor="#A0522D"/>
              <stop offset="100%" stopColor="#654321"/>
            </radialGradient>
          </defs>
          
          {/* Pizza základ */}
          <circle cx="60" cy="60" r="50" fill="url(#doughGradient)" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="44" fill="url(#sauceGradient)" opacity="0.9"/>
          <circle cx="60" cy="60" r="38" fill="url(#cheeseGradient)" opacity="0.95"/>
          
          {/* Šampiňóny s detailnou textúrou */}
          <g>
            {/* Veľký šampiňón */}
            <ellipse cx="45" cy="50" rx="10" ry="6" fill="url(#mushroomGradient)"/>
            <ellipse cx="45" cy="52" rx="8" ry="3" fill="url(#mushroomShadow)" opacity="0.6"/>
            <ellipse cx="45" cy="48" rx="6" ry="2" fill="#FFFFFF" opacity="0.4"/>
            <ellipse cx="42" cy="49" rx="2" ry="1" fill="#8B4513" opacity="0.5"/>
            <ellipse cx="48" cy="51" rx="1.5" ry="0.8" fill="#8B4513" opacity="0.5"/>
            
            {/* Stredný šampiňón */}
            <ellipse cx="70" cy="45" rx="8" ry="5" fill="url(#mushroomGradient)"/>
            <ellipse cx="70" cy="46.5" rx="6" ry="2.5" fill="url(#mushroomShadow)" opacity="0.6"/>
            <ellipse cx="70" cy="43.5" rx="4" ry="1.5" fill="#FFFFFF" opacity="0.4"/>
            <ellipse cx="68" cy="45" rx="1.5" ry="0.8" fill="#8B4513" opacity="0.5"/>
            
            {/* Dolný šampiňón */}
            <ellipse cx="55" cy="70" rx="9" ry="6" fill="url(#mushroomGradient)"/>
            <ellipse cx="55" cy="72" rx="7" ry="3" fill="url(#mushroomShadow)" opacity="0.6"/>
            <ellipse cx="55" cy="68" rx="5" ry="2" fill="#FFFFFF" opacity="0.4"/>
            <ellipse cx="52" cy="70" rx="2" ry="1" fill="#8B4513" opacity="0.5"/>
            <ellipse cx="58" cy="71" rx="1.5" ry="0.8" fill="#8B4513" opacity="0.5"/>
            
            {/* Pravý šampiňón */}
            <ellipse cx="75" cy="75" rx="7" ry="4" fill="url(#mushroomGradient)"/>
            <ellipse cx="75" cy="76" rx="5" ry="2" fill="url(#mushroomShadow)" opacity="0.6"/>
            <ellipse cx="75" cy="74" rx="3" ry="1" fill="#FFFFFF" opacity="0.4"/>
            
            {/* Malé šampiňóny */}
            <ellipse cx="35" cy="60" rx="5" ry="3" fill="url(#mushroomGradient)"/>
            <ellipse cx="35" cy="61" rx="3" ry="1.5" fill="url(#mushroomShadow)" opacity="0.6"/>
            
            <ellipse cx="85" cy="55" rx="4" ry="2.5" fill="url(#mushroomGradient)"/>
            <ellipse cx="85" cy="56" rx="2.5" ry="1" fill="url(#mushroomShadow)" opacity="0.6"/>
          </g>
          
          {/* Lesk */}
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.1"/>
        </svg>
      );
    }
    
    if (name.includes('hawai') || name.includes('ananas') || name.includes('hawaiian')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="pineappleGradient" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#FFE135"/>
              <stop offset="60%" stopColor="#FFC107"/>
              <stop offset="100%" stopColor="#FF8F00"/>
            </radialGradient>
          </defs>
          
          {/* Pizza základ */}
          <circle cx="60" cy="60" r="50" fill="url(#doughGradient)" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="44" fill="url(#sauceGradient)" opacity="0.9"/>
          <circle cx="60" cy="60" r="38" fill="url(#cheeseGradient)" opacity="0.95"/>
          
          {/* Ananás kúsky s detailnou textúrou */}
          <g>
            {/* Veľký kúsok ananásu */}
            <polygon points="45,38 52,52 38,52" fill="url(#pineappleGradient)"/>
            <polygon points="45,40 50,50 40,50" fill="#FFD54F" opacity="0.8"/>
            <polygon points="45,42 48,48 42,48" fill="#FFEB3B" opacity="0.6"/>
            <line x1="42" y1="45" x2="48" y2="45" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="44" y1="42" x2="44" y2="48" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="46" y1="42" x2="46" y2="48" stroke="#FF8F00" strokeWidth="0.5"/>
            
            {/* Pravý horný ananás */}
            <polygon points="70,43 77,57 63,57" fill="url(#pineappleGradient)"/>
            <polygon points="70,45 75,55 65,55" fill="#FFD54F" opacity="0.8"/>
            <polygon points="70,47 73,53 67,53" fill="#FFEB3B" opacity="0.6"/>
            <line x1="67" y1="50" x2="73" y2="50" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="69" y1="47" x2="69" y2="53" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="71" y1="47" x2="71" y2="53" stroke="#FF8F00" strokeWidth="0.5"/>
            
            {/* Dolný ľavý ananás */}
            <polygon points="50,68 57,82 43,82" fill="url(#pineappleGradient)"/>
            <polygon points="50,70 55,80 45,80" fill="#FFD54F" opacity="0.8"/>
            <polygon points="50,72 53,78 47,78" fill="#FFEB3B" opacity="0.6"/>
            <line x1="47" y1="75" x2="53" y2="75" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="49" y1="72" x2="49" y2="78" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="51" y1="72" x2="51" y2="78" stroke="#FF8F00" strokeWidth="0.5"/>
            
            {/* Dolný pravý ananás */}
            <polygon points="75,68 82,82 68,82" fill="url(#pineappleGradient)"/>
            <polygon points="75,70 80,80 70,80" fill="#FFD54F" opacity="0.8"/>
            <polygon points="75,72 78,78 72,78" fill="#FFEB3B" opacity="0.6"/>
            <line x1="72" y1="75" x2="78" y2="75" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="74" y1="72" x2="74" y2="78" stroke="#FF8F00" strokeWidth="0.5"/>
            <line x1="76" y1="72" x2="76" y2="78" stroke="#FF8F00" strokeWidth="0.5"/>
          </g>
          
          {/* Šunka s detailmi */}
          <ellipse cx="60" cy="50" rx="8" ry="5" fill="url(#hamGradient)"/>
          <ellipse cx="60" cy="50" rx="6" ry="3" fill="#F06292" opacity="0.7"/>
          <ellipse cx="50" cy="65" rx="7" ry="4" fill="url(#hamGradient)"/>
          <ellipse cx="50" cy="65" rx="5" ry="2.5" fill="#F06292" opacity="0.7"/>
          
          {/* Lesk */}
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.1"/>
        </svg>
      );
    }
    
    if (name.includes('vegetarian') || name.includes('zelenina') || name.includes('veggie')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
          <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
          <circle cx="45" cy="45" r="5" fill="#FF6347"/>
          <circle cx="75" cy="50" r="4" fill="#32CD32"/>
          <circle cx="50" cy="70" r="5" fill="#FFD700"/>
          <ellipse cx="70" cy="70" rx="6" ry="3" fill="#8B4513"/>
          <ellipse cx="60" cy="45" rx="4" ry="8" fill="#228B22"/>
          <circle cx="40" cy="65" r="3" fill="#FF4500"/>
        </svg>
      );
    }
    
    if (name.includes('quattro') || name.includes('styri') || name.includes('formaggi') || name.includes('syr')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="mozzarellaGrad" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="100%" stopColor="#F8F8FF"/>
            </radialGradient>
            <radialGradient id="gorgonzolaGrad" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#F0F8FF"/>
              <stop offset="100%" stopColor="#E6E6FA"/>
            </radialGradient>
            <radialGradient id="parmezanGrad" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#FFFAF0"/>
              <stop offset="100%" stopColor="#FFF8DC"/>
            </radialGradient>
            <radialGradient id="ricottaGrad" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#FFFFE0"/>
              <stop offset="100%" stopColor="#F5F5DC"/>
            </radialGradient>
          </defs>
          
          {/* Pizza základ */}
          <circle cx="60" cy="60" r="50" fill="url(#doughGradient)" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="44" fill="#FFFFFF" opacity="0.9"/>
          <circle cx="60" cy="60" r="38" fill="#FFFBF0" opacity="0.95"/>
          
          {/* Štyri syry v štyroch rohoch */}
          {/* Mozzarella - ľavý horný */}
          <circle cx="45" cy="45" r="8" fill="url(#mozzarellaGrad)"/>
          <circle cx="45" cy="45" r="6" fill="#FFFFFF" opacity="0.8"/>
          <circle cx="45" cy="45" r="4" fill="#F8F8FF" opacity="0.6"/>
          <circle cx="43" cy="43" r="1" fill="#FFFFFF"/>
          
          {/* Gorgonzola - pravý horný */}
          <circle cx="75" cy="45" r="8" fill="url(#gorgonzolaGrad)"/>
          <circle cx="75" cy="45" r="6" fill="#E6E6FA" opacity="0.8"/>
          <circle cx="75" cy="45" r="4" fill="#DDA0DD" opacity="0.6"/>
          <circle cx="73" cy="43" r="0.8" fill="#9370DB" opacity="0.7"/>
          <circle cx="77" cy="46" r="0.6" fill="#9370DB" opacity="0.5"/>
          
          {/* Parmezán - ľavý dolný */}
          <circle cx="45" cy="75" r="8" fill="url(#parmezanGrad)"/>
          <circle cx="45" cy="75" r="6" fill="#FFF8DC" opacity="0.8"/>
          <circle cx="45" cy="75" r="4" fill="#F0E68C" opacity="0.6"/>
          <circle cx="43" cy="73" r="1" fill="#FFD700" opacity="0.8"/>
          
          {/* Ricotta - pravý dolný */}
          <circle cx="75" cy="75" r="8" fill="url(#ricottaGrad)"/>
          <circle cx="75" cy="75" r="6" fill="#F5F5DC" opacity="0.8"/>
          <circle cx="75" cy="75" r="4" fill="#DDBF94" opacity="0.6"/>
          <circle cx="77" cy="77" r="0.8" fill="#DEB887" opacity="0.7"/>
          
          {/* Centrálny syr */}
          <circle cx="60" cy="60" r="6" fill="#FFD700" opacity="0.9"/>
          <circle cx="60" cy="60" r="4" fill="#FFA500" opacity="0.7"/>
          <circle cx="60" cy="60" r="2" fill="#FF8C00" opacity="0.5"/>
          
          {/* Extra syrové bodky */}
          <circle cx="55" cy="50" r="2" fill="#FFFFFF" opacity="0.7"/>
          <circle cx="65" cy="50" r="1.5" fill="#F0F8FF" opacity="0.7"/>
          <circle cx="50" cy="65" r="1.8" fill="#FFF8DC" opacity="0.7"/>
          <circle cx="70" cy="65" r="1.5" fill="#F5F5DC" opacity="0.7"/>
          
          {/* Lesk */}
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.15"/>
        </svg>
      );
    }
    
    if (name.includes('vajickova') || name.includes('vajicko') || name.includes('egg')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="eggWhiteGrad" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="70%" stopColor="#F8F8FF"/>
              <stop offset="100%" stopColor="#F0F0F0"/>
            </radialGradient>
            <radialGradient id="eggYolkGrad" cx="0.3" cy="0.3" r="0.7">
              <stop offset="0%" stopColor="#FFF700"/>
              <stop offset="60%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#FFA500"/>
            </radialGradient>
          </defs>
          
          {/* Pizza základ */}
          <circle cx="60" cy="60" r="50" fill="url(#doughGradient)" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="44" fill="url(#sauceGradient)" opacity="0.9"/>
          <circle cx="60" cy="60" r="38" fill="url(#cheeseGradient)" opacity="0.95"/>
          
          {/* Veľké vajíčko */}
          <ellipse cx="50" cy="50" rx="8" ry="6" fill="url(#eggWhiteGrad)"/>
          <ellipse cx="50" cy="50" rx="6.5" ry="4.5" fill="#FFFFFF" opacity="0.9"/>
          <circle cx="50" cy="50" r="4" fill="url(#eggYolkGrad)"/>
          <circle cx="50" cy="50" r="3" fill="#FFD700" opacity="0.8"/>
          <circle cx="48.5" cy="48.5" r="1" fill="#FFF700" opacity="0.6"/>
          
          {/* Stredné vajíčko */}
          <ellipse cx="70" cy="70" rx="7" ry="5" fill="url(#eggWhiteGrad)"/>
          <ellipse cx="70" cy="70" rx="5.5" ry="3.5" fill="#FFFFFF" opacity="0.9"/>
          <circle cx="70" cy="70" r="3" fill="url(#eggYolkGrad)"/>
          <circle cx="70" cy="70" r="2.2" fill="#FFD700" opacity="0.8"/>
          <circle cx="68.8" cy="68.8" r="0.8" fill="#FFF700" opacity="0.6"/>
          
          {/* Malé vajíčko */}
          <ellipse cx="75" cy="45" rx="5" ry="4" fill="url(#eggWhiteGrad)"/>
          <ellipse cx="75" cy="45" rx="4" ry="3" fill="#FFFFFF" opacity="0.9"/>
          <circle cx="75" cy="45" r="2" fill="url(#eggYolkGrad)"/>
          <circle cx="75" cy="45" r="1.5" fill="#FFD700" opacity="0.8"/>
          
          {/* Šunka detail */}
          <ellipse cx="45" cy="75" rx="6" ry="4" fill="url(#hamGradient)"/>
          <ellipse cx="45" cy="75" rx="4" ry="2.5" fill="#F06292" opacity="0.7"/>
          
          {/* Extra vajíčkové bielka rozliate */}
          <ellipse cx="38" cy="62" rx="4" ry="2" fill="#FFFFFF" opacity="0.8"/>
          <ellipse cx="82" cy="58" rx="3" ry="1.5" fill="#FFFFFF" opacity="0.7"/>
          <ellipse cx="62" cy="35" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.6"/>
          
          {/* Lesk */}
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.1"/>
        </svg>
      );
    }
    
    if (name.includes('bryndza') || name.includes('bryndzova')) {
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F4C430" stroke="#D4A520" strokeWidth="2"/>
          <circle cx="60" cy="60" r="45" fill="#DC143C" opacity="0.8"/>
          <circle cx="60" cy="60" r="40" fill="#FFF8DC" opacity="0.9"/>
          <circle cx="50" cy="45" r="8" fill="#F0F8FF"/>
          <circle cx="70" cy="55" r="7" fill="#F0F8FF"/>
          <circle cx="45" cy="70" r="6" fill="#F0F8FF"/>
          <circle cx="75" cy="75" r="7" fill="#F0F8FF"/>
          <ellipse cx="60" cy="60" rx="4" ry="8" fill="#228B22"/>
        </svg>
      );
    }
    
    // Default pizza ikona
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="defaultDough" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#FFEAA7"/>
            <stop offset="100%" stopColor="#FDCB6E"/>
          </radialGradient>
          <radialGradient id="defaultSauce" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="#E74C3C"/>
            <stop offset="100%" stopColor="#C0392B"/>
          </radialGradient>
          <radialGradient id="defaultCheese" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="#FFFBF0"/>
            <stop offset="100%" stopColor="#F5F5DC"/>
          </radialGradient>
        </defs>
        
        {/* Pizza základ */}
        <circle cx="60" cy="60" r="50" fill="url(#defaultDough)" stroke="#D4A520" strokeWidth="2"/>
        <circle cx="60" cy="60" r="44" fill="url(#defaultSauce)" opacity="0.9"/>
        <circle cx="60" cy="60" r="38" fill="url(#defaultCheese)" opacity="0.95"/>
        
        {/* Mix ingrediencií */}
        <circle cx="50" cy="50" r="6" fill="#FF6347" opacity="0.9"/>
        <circle cx="50" cy="50" r="4" fill="#FF4757" opacity="0.7"/>
        
        <circle cx="70" cy="55" r="5" fill="#32CD32" opacity="0.9"/>
        <circle cx="70" cy="55" r="3" fill="#2ECC71" opacity="0.7"/>
        
        <ellipse cx="55" cy="70" rx="6" ry="4" fill="#8B4513" opacity="0.9"/>
        <ellipse cx="55" cy="70" rx="4" ry="2.5" fill="#A0522D" opacity="0.7"/>
        
        <ellipse cx="65" cy="75" rx="5" ry="3" fill="#FFB6C1" opacity="0.9"/>
        <ellipse cx="65" cy="75" rx="3" ry="2" fill="#F06292" opacity="0.7"/>
        
        {/* Extra detaily */}
        <circle cx="40" cy="65" r="3" fill="#FFD700" opacity="0.8"/>
        <circle cx="75" cy="70" r="2.5" fill="#228B22" opacity="0.8"/>
        <circle cx="62" cy="45" r="2" fill="#FF4500" opacity="0.8"/>
        
        {/* Lesk */}
        <ellipse cx="50" cy="45" rx="20" ry="15" fill="#FFFFFF" opacity="0.1"/>
      </svg>
    );
  };

  return (
    <div className={`pizza-icon ${className}`}>
      {getPizzaIcon(normalizedName)}
    </div>
  );
};

export default PizzaIcon;