import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart, X } from 'lucide-react';

interface AddToCartNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const AddToCartNotification: React.FC<AddToCartNotificationProps> = ({ 
  message, 
  isVisible, 
  onClose 
}) => {
  const [showNotification, setShowNotification] = useState(isVisible);

  useEffect(() => {
    setShowNotification(isVisible);
    
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-green-50 border border-green-100 shadow-lg rounded-lg px-4 py-3 flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
              <Check className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 mr-2">
              <p className="text-sm font-medium text-green-800">{message}</p>
            </div>
            <button
              onClick={() => {
                setShowNotification(false);
                onClose();
              }}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-green-100 transition-colors"
              aria-label="Zavrieť notifikáciu"
            >
              <X className="h-4 w-4 text-green-600" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartNotification;