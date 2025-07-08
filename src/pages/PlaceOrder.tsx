
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package } from 'lucide-react';

const PlaceOrder = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 1
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { user } = useAuth();
  const { placeOrder, isLoading } = useOrders();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    
    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    } else if (formData.quantity > 100) {
      newErrors.quantity = 'Quantity cannot exceed 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    placeOrder(formData.productName, formData.quantity, user.id);
    
    // Reset form and navigate back to dashboard
    setFormData({ productName: '', quantity: 1 });
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">Place New Order</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to place your order.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Order Details
          </CardTitle>
          <CardDescription>
            Enter the product name and quantity you'd like to order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                className={`mt-1 ${errors.productName ? 'border-red-500' : ''}`}
                placeholder="Enter product name (e.g., Laptop, Mouse, Keyboard)"
              />
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max="100"
                value={formData.quantity}
                onChange={handleChange}
                className={`mt-1 ${errors.quantity ? 'border-red-500' : ''}`}
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Maximum quantity: 100 items
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Product:</strong> {formData.productName || 'Not specified'}</p>
                <p><strong>Quantity:</strong> {formData.quantity}</p>
                <p><strong>Status:</strong> Will be set to "Pending" after submission</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
            Your order will be submitted with a "Pending" status
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
            Our team will review and process your order
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
            You'll receive updates on your dashboard as the status changes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlaceOrder;
