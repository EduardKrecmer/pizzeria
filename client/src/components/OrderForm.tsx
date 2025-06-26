import React, { useState, useEffect, useMemo } from 'react';
import { User, Phone, Mail, MapPin, Save, Trash2, Truck, Store, Building, Hash } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import FormField from './NewFormField';

import { CustomerInfo, DeliveryType } from '../types';
import { obce, potrebujeUlicu, getPSCByObec } from '../data/obce';

type OrderFormData = CustomerInfo;

interface OrderFormProps {
  onSubmit?: (data: CustomerInfo) => void;
  initialData?: Partial<CustomerInfo>;
  className?: string;
  showDeliveryOptions?: boolean;
  showSubmitButton?: boolean;
}

const STORAGE_KEY = 'pizzeria_customer_data';

const OrderForm: React.FC<OrderFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  className = '',
  showDeliveryOptions = true,
  showSubmitButton = true
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    cityPart: '',
    postalCode: '',
    notes: '',
    deliveryType: 'DELIVERY',
    ...initialData
  });
  
  const [rememberData, setRememberData] = useState<boolean>(false);
  const [hasStoredData, setHasStoredData] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo | 'minimumOrder', string>>>({});
  const [streetLabel, setStreetLabel] = useState('Číslo domu');
  const [cityParts, setCityParts] = useState<string[]>([]);
  
  const { getTotal } = useCartStore();

  // Minimálna hodnota objednávky pre rôzne lokality
  const getMinimumOrderValue = useMemo(() => {
    if ((formData.city === 'Púchov' && formData.cityPart === 'Čertov') ||
        (formData.city === 'Lazy pod Makytou' && formData.cityPart === 'Čertov') ||
        formData.cityPart === 'Hoštiná') {
      return 20;
    }
    else if (formData.city === 'Púchov') {
      return 15;
    }
    return 0;
  }, [formData.city, formData.cityPart]);

  // Načítanie uložených údajov pri spustení komponenty
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsedData }));
        setRememberData(true);
        setHasStoredData(true);
      } catch (error) {
        console.error('Chyba pri načítavaní uložených údajov:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Aktualizácia častí obce pri zmene mesta
  useEffect(() => {
    const selectedObec = obce.find(obec => obec.obec === formData.city);
    if (selectedObec && selectedObec.casti && selectedObec.casti.length > 1) {
      setCityParts(selectedObec.casti);
      setStreetLabel(potrebujeUlicu(formData.city) ? 'Ulica a číslo domu' : 'Číslo domu');
    } else {
      setCityParts([]);
      setStreetLabel('Číslo domu');
    }
  }, [formData.city]);

  // Automatické nastavenie PSČ pri zmene mesta
  useEffect(() => {
    if (formData.city) {
      const psc = getPSCByObec(formData.city);
      if (psc && psc !== formData.postalCode) {
        setFormData(prev => ({ ...prev, postalCode: psc }));
      }
    }
  }, [formData.city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Vymazanie chyby pre dané pole
    if (errors[name as keyof CustomerInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRememberData(isChecked);
    
    if (isChecked) {
      // Uložiť aktuálne údaje
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setHasStoredData(true);
    } else {
      // Vymazať uložené údaje
      localStorage.removeItem(STORAGE_KEY);
      setHasStoredData(false);
    }
  };

  const handleForgetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRememberData(false);
    setHasStoredData(false);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      street: '',
      city: '',
      cityPart: '',
      postalCode: '',
      notes: '',
      deliveryType: 'DELIVERY'
    });
  };

  // Validácia formulára
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo | 'minimumOrder', string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Meno je povinné';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefón je povinný';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu';
    }

    if (formData.deliveryType === 'DELIVERY') {
      if (!formData.city.trim()) {
        newErrors.city = 'Mesto je povinné';
      }
      
      if (!formData.street.trim()) {
        newErrors.street = streetLabel + ' je povinné';
      }

      // Kontrola minimálnej hodnoty objednávky
      if (showDeliveryOptions && getMinimumOrderValue > 0) {
        const currentTotal = getTotal();
        if (currentTotal < getMinimumOrderValue) {
          newErrors.minimumOrder = `Minimálna hodnota objednávky pre ${formData.city}${formData.cityPart ? ` (${formData.cityPart})` : ''} je ${getMinimumOrderValue}€. Aktuálna hodnota: ${currentTotal.toFixed(2)}€`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Uložiť údaje ak je checkbox zaškrtnutý
    if (rememberData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setHasStoredData(true);
    }
    
    onSubmit?.(formData);
  };

  const isFormValid = formData.firstName.trim() && 
                      formData.phone.trim() && 
                      formData.email.trim() && 
                      (formData.deliveryType === 'PICKUP' || (formData.city.trim() && formData.street.trim()));

  // Handler pre výber mesta
  const handleCitySelect = (selectedCity: string) => {
    setFormData(prev => ({ ...prev, city: selectedCity, cityPart: '' }));
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }
  };

  // Handler pre výber časti mesta
  const handleCityPartSelect = (selectedPart: string) => {
    setFormData(prev => ({ ...prev, cityPart: selectedPart }));
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border border-neutral-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-[#4a5d23]">
          Kontaktné údaje
        </h3>
        
        {hasStoredData && (
          <button
            type="button"
            onClick={handleForgetData}
            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Zabudnúť uložené údaje"
          >
            <Trash2 className="w-4 h-4" />
            Zabudnúť údaje
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Meno */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#4a5d23] mb-2">
            Meno a priezvisko *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-[#4a5d23] transition-colors"
              placeholder="Vaše meno a priezvisko"
            />
          </div>
        </div>

        {/* Telefón */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#4a5d23] mb-2">
            Telefónne číslo *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-[#4a5d23] transition-colors"
              placeholder="0901 234 567"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4a5d23] mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-[#4a5d23] transition-colors"
              placeholder="vas@email.sk"
            />
          </div>
        </div>

        {/* Adresa */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-[#4a5d23] mb-2">
            Adresa doručenia *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-[#4a5d23] transition-colors"
              placeholder="Ulica 123, 020 01 Púchov"
            />
          </div>
        </div>

        {/* Zapamätať údaje checkbox */}
        <div className="flex items-center gap-3 p-3 bg-[#f5f9ee] rounded-lg border border-[#e0e8c9]">
          <input
            type="checkbox"
            id="remember"
            checked={rememberData}
            onChange={handleRememberChange}
            className="w-4 h-4 text-[#4a5d23] border-neutral-300 rounded focus:ring-[#4a5d23] focus:ring-2"
          />
          <label htmlFor="remember" className="flex items-center gap-2 text-sm text-[#4a5d23] cursor-pointer">
            <Save className="w-4 h-4" />
            Zapamätať údaje pre budúce objednávky
          </label>
        </div>

        {/* Submit tlačidlo */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            isFormValid
              ? 'bg-[#4a5d23] text-white hover:bg-[#3a4a1a] shadow-md hover:shadow-lg'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {onSubmit ? 'Pokračovať' : 'Uložiť údaje'}
        </button>
      </form>

      {hasStoredData && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Údaje sú uložené pre budúce objednávky
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderForm;