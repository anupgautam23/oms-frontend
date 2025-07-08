import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useOrders } from "../contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PlaceOrder = () => {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: 1,
    price: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const { user } = useAuth();
  const { placeOrder, isLoading } = useOrders();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    } else if (formData.productName.trim().length < 1) {
      newErrors.productName = "Product name must be at least 1 character";
    } else if (formData.productName.trim().length > 100) {
      newErrors.productName = "Product name must be less than 100 characters";
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    } else if (formData.quantity > 100) {
      newErrors.quantity = "Quantity cannot exceed 100";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    } else if (formData.price > 999999.99) {
      newErrors.price = "Price cannot exceed 999,999.99";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm() || !user) return;

    try {
      const success = await placeOrder({
        productName: formData.productName.trim(),
        quantity: formData.quantity,
        price: formData.price,
      });

      if (success) {
        // Reset form and navigate back to dashboard
        setFormData({ productName: "", quantity: 1, price: 0 });
        navigate("/");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setServerError("Failed to place order. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    if (name === "quantity") {
      processedValue = parseInt(value) || 1;
    } else if (name === "price") {
      processedValue = parseFloat(value) || 0;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    // Clear the specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Clear server error when user makes changes
    if (serverError) {
      setServerError("");
    }
  };

  // Calculate total amount
  const totalAmount = formData.quantity * formData.price;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
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
            Enter the product information and pricing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                className={`mt-1 ${errors.productName ? "border-red-500" : ""}`}
                placeholder="Enter product name (e.g., Laptop, Mouse, Keyboard)"
                disabled={isLoading}
                maxLength={100}
              />
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productName}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Maximum 100 characters
              </p>
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
                className={`mt-1 ${errors.quantity ? "border-red-500" : ""}`}
                placeholder="Enter quantity"
                disabled={isLoading}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Maximum quantity: 100 items
              </p>
            </div>

            <div>
              <Label htmlFor="price">Price per Unit ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                max="999999.99"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`mt-1 ${errors.price ? "border-red-500" : ""}`}
                placeholder="Enter price per unit"
                disabled={isLoading}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter the price per unit (e.g., 299.99)
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  <strong>Product:</strong>{" "}
                  {formData.productName || "Not specified"}
                </p>
                <p>
                  <strong>Quantity:</strong> {formData.quantity}
                </p>
                <p>
                  <strong>Price per Unit:</strong> ${formData.price.toFixed(2)}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> Will be set to "PENDING" after
                  submission
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !user}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2 mt-0.5">
              1
            </span>
            Your order will be submitted with a "PENDING" status
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2 mt-0.5">
              2
            </span>
            Our team will review and process your order (status will change to
            "CONFIRMED")
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2 mt-0.5">
              3
            </span>
            Order will be processed and shipped (status: "PROCESSING" →
            "SHIPPED")
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2 mt-0.5">
              4
            </span>
            You'll receive updates on your dashboard when the order is delivered
          </li>
        </ul>
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
        <ul className="space-y-1 text-sm text-yellow-800">
          <li>• Make sure to enter accurate product information</li>
          <li>• Price should be the cost per individual unit</li>
          <li>• Total amount will be calculated automatically</li>
          <li>• You can track your order status on the dashboard</li>
        </ul>
      </div>
    </div>
  );
};

export default PlaceOrder;
