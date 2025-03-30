import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerInfo } from '../types';

const CheckoutForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
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
  
  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Meno je povinné';
    if (!formData.lastName.trim()) newErrors.lastName = 'Priezvisko je povinné';
    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefón je povinný';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Neplatný formát telefónu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    
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
  
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 3) {
      setIsSubmitting(true);
      setCustomerInfo(formData);
      await placeOrder();
      setIsSubmitting(false);
      
      if (orderCompleted) {
        navigate('/order-success');
      }
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                currentStep >= 1 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
              }`}>1</div>
              <span className={`text-sm mt-1 ${
                currentStep >= 1 ? 'text-primary font-medium' : 'text-neutral-500'
              }`}>Osobné údaje</span>
            </div>
            <div className="flex-1 h-1 bg-neutral-200 mx-2">
              <div className="h-full bg-primary" style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                currentStep >= 2 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
              }`}>2</div>
              <span className={`text-sm mt-1 ${
                currentStep >= 2 ? 'text-primary font-medium' : 'text-neutral-500'
              }`}>Doručenie</span>
            </div>
            <div className="flex-1 h-1 bg-neutral-200 mx-2">
              <div className="h-full bg-primary" style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                currentStep >= 3 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
              }`}>3</div>
              <span className={`text-sm mt-1 ${
                currentStep >= 3 ? 'text-primary font-medium' : 'text-neutral-500'
              }`}>Platba</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal information */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-heading font-bold mb-4">Kontaktné údaje</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">Priezvisko</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${
                      errors.lastName ? 'border-red-500' : 'border-neutral-300'
                    } rounded-lg focus:ring-2 focus:ring-primary focus:outline-none`} 
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-neutral-300'
                    } rounded-lg focus:ring-2 focus:ring-primary focus:outline-none`} 
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
              </div>
            </div>
          )}

          {/* Step 2: Delivery address */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-heading font-bold mb-4">Adresa doručenia</h3>
              <div className="grid grid-cols-1 gap-4">
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
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-heading font-bold mb-4">Spôsob platby</h3>
              <div className="space-y-4">
                <div className="border border-primary rounded-lg p-4 flex items-center">
                  <input 
                    type="radio" 
                    id="payment-cash" 
                    name="payment" 
                    checked 
                    className="w-4 h-4 accent-primary" 
                  />
                  <label htmlFor="payment-cash" className="ml-3 flex flex-1 cursor-pointer">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="12" x="2" y="6" rx="2"></rect>
                        <circle cx="12" cy="12" r="2"></circle>
                        <path d="M6 12h.01M18 12h.01"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium block">Hotovosť pri doručení</span>
                      <span className="text-sm text-neutral-500">Platba kuriérovi pri prevzatí</span>
                    </div>
                  </label>
                </div>
                <div className="border border-neutral-200 rounded-lg p-4 flex items-center opacity-50">
                  <input 
                    type="radio" 
                    id="payment-card" 
                    name="payment" 
                    disabled 
                    className="w-4 h-4 accent-primary" 
                  />
                  <label htmlFor="payment-card" className="ml-3 flex flex-1 cursor-not-allowed">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <line x1="2" x2="22" y1="10" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium block">Platobná karta</span>
                      <span className="text-sm text-neutral-500">Momentálne nedostupné</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button 
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition duration-200 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Späť
              </button>
            ) : (
              <Link 
                to="/"
                className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition duration-200"
              >
                Späť
              </Link>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition duration-200 flex items-center"
              >
                Pokračovať
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
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
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
