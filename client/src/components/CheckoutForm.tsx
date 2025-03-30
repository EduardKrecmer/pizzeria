import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
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
  
  const { setCustomerInfo, placeOrder, orderCompleted } = useCartStore();
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof CustomerInfo]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Meno je povinné';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefón je povinný';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Neplatný formát telefónu';
    }
    
    if (!formData.street.trim()) newErrors.street = 'Ulica a číslo sú povinné';
    if (!formData.city.trim()) newErrors.city = 'Mesto je povinné';
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'PSČ je povinné';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
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
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold mb-6">Kontaktné údaje a doručenie</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">Meno</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.firstName ? 'border-red-500' : 'border-neutral-300'
                } rounded-lg focus:ring-2 focus:ring-primary focus:outline-none`} 
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">Telefón</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.phone ? 'border-red-500' : 'border-neutral-300'
                } rounded-lg focus:ring-2 focus:ring-primary focus:outline-none`} 
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">Ulica a číslo</label>
              <input 
                type="text" 
                id="street" 
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.street ? 'border-red-500' : 'border-neutral-300'
                } rounded-lg focus:ring-2 focus:ring-primary focus:outline-none`} 
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">Mesto</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.city ? 'border-red-500' : 'border-neutral-300'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:outline-none`} 
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">PSČ</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.postalCode ? 'border-red-500' : 'border-neutral-300'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:outline-none`} 
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>
            </div>
          
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">Poznámka k objednávke</label>
              <textarea 
                id="notes" 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3} 
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              ></textarea>
            </div>
          
            <div className="border border-neutral-200 p-4 rounded-lg bg-neutral-50 mt-4">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">Platba pri prevzatí</p>
              </div>
              <p className="text-sm text-neutral-600">Platba v hotovosti kuriérovi pri doručení objednávky.</p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Link 
              to="/"
              className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition duration-200 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Späť k výberu
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
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
