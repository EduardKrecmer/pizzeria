import { useState } from 'react';
import { ArrowLeft, Loader2, Phone, MapPin, Home, FileText, Truck, DollarSign } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { CustomerInfo } from '../types';

const CheckoutForm = () => {
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: '',
    lastName: '', // Ponecháme v objekte, ale nebudeme používať
    email: '', // Ponecháme v objekte, ale nebudeme používať
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { setCustomerInfo, placeOrder } = useCartStore();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof CustomerInfo]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only numbers
    const numericValue = value.replace(/\D/g, '');
    // Format phone number
    let formattedValue = numericValue;
    if (numericValue.length > 3 && numericValue.length <= 6) {
      formattedValue = `${numericValue.slice(0, 3)} ${numericValue.slice(3)}`;
    } else if (numericValue.length > 6) {
      formattedValue = `${numericValue.slice(0, 3)} ${numericValue.slice(3, 6)} ${numericValue.slice(6, 10)}`;
    }
    
    setFormData({ ...formData, phone: formattedValue });
    
    // Clear error when user types
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };
  
  // Format postal code as user types
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only numbers
    const numericValue = value.replace(/\D/g, '').slice(0, 5);
    // Format postal code (PSČ)
    let formattedValue = numericValue;
    if (numericValue.length > 3) {
      formattedValue = `${numericValue.slice(0, 3)} ${numericValue.slice(3)}`;
    }
    
    setFormData({ ...formData, postalCode: formattedValue });
    
    // Clear error when user types
    if (errors.postalCode) {
      setErrors({ ...errors, postalCode: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Meno je povinné';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefón je povinný';
    } else if (!/^[0-9\s]{9,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Neplatný formát telefónu';
    }
    
    if (!formData.street.trim()) newErrors.street = 'Ulica a číslo sú povinné';
    if (!formData.city.trim()) newErrors.city = 'Mesto je povinné';
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'PSČ je povinné';
    } else if (!/^[0-9\s]{5,6}$/.test(formData.postalCode.replace(/\s/g, ''))) {
      newErrors.postalCode = 'PSČ musí obsahovať 5 číslic';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Nastavíme prázdne hodnoty pre nepoužívané polia
      const customerInfo = {
        ...formData,
        lastName: '',
        email: ''
      };
      setCustomerInfo(customerInfo);
      await placeOrder();
      setIsSubmitting(false);
    }
  };
  
  // Helper component for form input
  const FormField = ({ 
    label, 
    id, 
    name, 
    value, 
    type = 'text', 
    onChange, 
    icon, 
    error, 
    placeholder = '' 
  }: { 
    label: string;
    id: string;
    name: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    error?: string;
    placeholder?: string;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
          {icon}
        </div>
        <input 
          type={type} 
          id={id} 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 px-4 py-3 border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300'
          } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200`} 
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100">
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
          Kontaktné údaje a doručenie
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info section */}
          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <h4 className="text-md font-medium text-neutral-800 mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-primary" aria-hidden="true" />
              Kontaktné údaje
            </h4>
            <div className="space-y-4">
              <FormField 
                label="Meno"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                icon={<span className="text-sm font-medium">Aa</span>}
                error={errors.firstName}
                placeholder="Vaše meno"
              />
              
              <FormField 
                label="Telefón"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                icon={<Phone className="w-4 h-4" />}
                error={errors.phone}
                placeholder="0XX XXX XXXX"
              />
            </div>
          </div>
          
          {/* Delivery address section */}
          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <h4 className="text-md font-medium text-neutral-800 mb-4 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-primary" aria-hidden="true" />
              Adresa doručenia
            </h4>
            <div className="space-y-4">
              <FormField 
                label="Ulica a číslo"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                icon={<Home className="w-4 h-4" />}
                error={errors.street}
                placeholder="Názov ulice a číslo domu"
              />
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Mesto"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  icon={<MapPin className="w-4 h-4" />}
                  error={errors.city}
                  placeholder="Mesto"
                />
                <FormField 
                  label="PSČ"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handlePostalCodeChange}
                  icon={<span className="text-sm font-medium">#</span>}
                  error={errors.postalCode}
                  placeholder="XXX XX"
                />
              </div>
            </div>
          </div>
          
          {/* Notes section */}
          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <h4 className="text-md font-medium text-neutral-800 mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-primary" aria-hidden="true" />
              Poznámka k objednávke
            </h4>
            <div>
              <div className="relative">
                <textarea 
                  id="notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Špeciálne požiadavky k objednávke..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200"
                ></textarea>
              </div>
            </div>
          </div>
        
          {/* Payment section */}
          <div className="border border-neutral-200 p-4 rounded-lg bg-neutral-50 mb-6">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" aria-hidden="true" />
              <p className="font-medium">Platba pri prevzatí</p>
            </div>
            <p className="text-sm text-neutral-600 ml-7">Platba v hotovosti kuriérovi pri doručení objednávky.</p>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between mt-8">
            <Link 
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all duration-200 flex items-center justify-center shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Späť k výberu
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  Spracovanie...
                </>
              ) : (
                <>Dokončiť objednávku</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;