'use client';

import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Receipt,
  MapPin,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  Tag,
  Zap,
  Check
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import confetti from 'canvas-confetti';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    createOrder,
    currentUser,
    selectedAddress,
    setSelectedAddress,
    selectedPaymentMethod,
    setSelectedPaymentMethod
  } = useAppStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(selectedAddress);

  if (!isCartOpen) return null;

  const isB2B = currentUser.role === 'BUYER_BULK';

  // Calculate pricing & B2B auto-discount (3% on items >= ₹2500)
  let subtotal = 0;
  let totalB2BDiscount = 0;
  let retailBenchmarkTotal = 0;

  const calculatedItems = cart.map(({ produce, quantityKg }) => {
    const itemGross = quantityKg * produce.basePricePerKg;
    const isItemB2BDiscount = isB2B && itemGross >= 2500;
    const itemDiscount = isItemB2BDiscount ? Math.round(itemGross * 0.03 * 10) / 10 : 0;
    const itemNet = itemGross - itemDiscount;

    subtotal += itemGross;
    totalB2BDiscount += itemDiscount;
    retailBenchmarkTotal += quantityKg * produce.bigBasketPricePerKg;

    return {
      produceId: produce.id,
      cropName: produce.cropName,
      quantityKg,
      unitPrice: produce.basePricePerKg,
      imageUrl: produce.imageUrl,
      farmerName: produce.farmerName,
      itemSubtotal: itemNet,
      b2bDiscountAmount: itemDiscount,
    };
  });

  const finalPayableTotal = Math.round((subtotal - totalB2BDiscount) * 10) / 10;
  const totalRetailSavings = Math.max(0, Math.round(retailBenchmarkTotal - finalPayableTotal));

  const handleCheckout = () => {
    setIsCheckingOut(true);

    setTimeout(() => {
      const order = createOrder({
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerType: isB2B ? 'BUYER_BULK' : 'BUYER_RETAIL',
        items: calculatedItems,
        subtotalAmount: subtotal,
        totalB2BDiscountAmount: totalB2BDiscount,
        deliveryFee: 0, // Free Pune direct delivery
        totalAmount: finalPayableTotal,
        status: 'PLACED',
        paymentMethod: selectedPaymentMethod,
        paymentStatus: selectedPaymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING_ON_DELIVERY' : selectedPaymentMethod === 'B2B_CREDIT' ? 'INVOICE_15_DAYS' : 'PAID',
        deliveryAddress: addressForm,
      });

      setIsCheckingOut(false);
      setOrderCompleted(order);
      clearCart();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 1000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedAddress(addressForm);
    setIsEditingAddress(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-300" />
              <div>
                <h2 className="text-base font-bold font-display">KhetConnect Checkout</h2>
                <p className="text-[11px] text-emerald-200">Fresh Produce Direct from Pune Growers</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setOrderCompleted(null);
              }}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen */}
          {orderCompleted ? (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  ORDER PLACED SUCCESSFULLY
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 font-display">Thank You, {orderCompleted.buyerName.split(' ')[0]}!</h3>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  Order ID: <strong className="text-slate-900">{orderCompleted.id}</strong>
                </p>
              </div>

              {/* Order Receipt Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left w-full space-y-2.5 text-xs">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700 font-mono">₹{orderCompleted.totalAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <strong className="text-slate-800 uppercase">{orderCompleted.paymentMethod.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="text-emerald-700 font-bold">{orderCompleted.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Address:</span>
                    <span className="text-right truncate max-w-[180px] text-slate-800 font-medium">
                      {orderCompleted.deliveryAddress.flatOrHouseNo}, {orderCompleted.deliveryAddress.city}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                📦 Your order has been assigned to our Pune regional dispatch queue for same-day delivery.
              </p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderCompleted(null);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                Done & Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Scrollable Cart Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* 1. Items List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Shopping Cart ({cart.length} items)</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">5% Cheaper Guarantee</span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 space-y-2 text-slate-400">
                      <Receipt className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs font-bold">Your cart is empty</p>
                      <p className="text-[11px]">Add fresh farm produce from the catalog</p>
                    </div>
                  ) : (
                    cart.map(({ produce, quantityKg }) => {
                      const itemGross = quantityKg * produce.basePricePerKg;
                      const hasB2BDiscount = isB2B && itemGross >= 2500;
                      const b2bDiscount = hasB2BDiscount ? Math.round(itemGross * 0.03 * 10) / 10 : 0;
                      const itemNet = itemGross - b2bDiscount;

                      return (
                        <div
                          key={produce.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 relative hover:border-emerald-200 transition-colors"
                        >
                          <img
                            src={produce.imageUrl}
                            alt={produce.cropName}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-xs text-slate-900 truncate">{produce.cropName}</h4>
                              <button
                                onClick={() => removeFromCart(produce.id)}
                                className="text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <p className="text-[10px] text-slate-500 truncate">
                              📍 {produce.locationName} • ₹{produce.basePricePerKg}/kg
                            </p>

                            {hasB2BDiscount && (
                              <span className="inline-flex items-center gap-1 text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded mt-0.5">
                                <Tag className="w-2.5 h-2.5" /> 3% B2B Volume Discount (-₹{b2bDiscount})
                              </span>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                                <button
                                  onClick={() => updateCartQuantity(produce.id, quantityKg - (isB2B ? 10 : 1))}
                                  className="text-slate-500 hover:text-slate-900 font-bold px-1"
                                >
                                  -
                                </button>
                                <span className="text-xs font-mono font-bold text-slate-900">{quantityKg} kg</span>
                                <button
                                  onClick={() => updateCartQuantity(produce.id, quantityKg + (isB2B ? 10 : 1))}
                                  className="text-slate-500 hover:text-slate-900 font-bold px-1"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs font-bold text-slate-900 font-mono">
                                ₹{itemNet.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {cart.length > 0 && (
                  <>
                    {/* 2. Delivery Address Section */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery Address
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(!isEditingAddress)}
                          className="text-[11px] text-emerald-700 font-bold hover:underline"
                        >
                          {isEditingAddress ? 'Cancel' : 'Change'}
                        </button>
                      </div>

                      {isEditingAddress ? (
                        <form onSubmit={handleSaveAddress} className="space-y-2 text-xs pt-1">
                          <input
                            type="text"
                            placeholder="Flat / House No, Building"
                            value={addressForm.flatOrHouseNo}
                            onChange={(e) => setAddressForm({ ...addressForm, flatOrHouseNo: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Street / Area Name"
                            value={addressForm.streetName}
                            onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            required
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Pincode"
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-xs"
                          >
                            Save Address
                          </button>
                        </form>
                      ) : (
                        <div className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-slate-200">
                          <p className="font-bold text-slate-900">{addressForm.fullName} • {addressForm.phone}</p>
                          <p className="text-slate-600 text-[11px]">{addressForm.flatOrHouseNo}, {addressForm.streetName}</p>
                          <p className="text-slate-500 text-[10px]">{addressForm.city}, {addressForm.state} - {addressForm.pincode}</p>
                        </div>
                      )}
                    </div>

                    {/* 3. Payment Options Section */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Select Payment Method
                      </span>

                      <div className="space-y-1.5 text-xs">
                        
                        {/* UPI */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('UPI')}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                            selectedPaymentMethod === 'UPI'
                              ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-emerald-600" />
                            <span>UPI (GPay / PhonePe / Paytm / BHIM)</span>
                          </div>
                          {selectedPaymentMethod === 'UPI' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        </button>

                        {/* Credit / Debit Card */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('CARD')}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                            selectedPaymentMethod === 'CARD'
                              ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span>Credit / Debit Card (Visa, RuPay, Master)</span>
                          </div>
                          {selectedPaymentMethod === 'CARD' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        </button>

                        {/* Cash on Delivery */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('CASH_ON_DELIVERY')}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                            selectedPaymentMethod === 'CASH_ON_DELIVERY'
                              ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-amber-600" />
                            <span>Pay on Inspection / Delivery</span>
                          </div>
                          {selectedPaymentMethod === 'CASH_ON_DELIVERY' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        </button>

                        {/* B2B Credit Line (for bulk buyers) */}
                        {isB2B && (
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentMethod('B2B_CREDIT')}
                            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              selectedPaymentMethod === 'B2B_CREDIT'
                                ? 'bg-purple-50 border-purple-400 font-bold text-purple-950 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-purple-600" />
                              <span>B2B Institutional Credit (15-Day Net)</span>
                            </div>
                            {selectedPaymentMethod === 'B2B_CREDIT' && <Check className="w-4 h-4 text-purple-600 stroke-[3]" />}
                          </button>
                        )}

                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Price Receipt & Place Order Button (Confidential cuts completely removed) */}
              {cart.length > 0 && (
                <div className="border-t border-slate-200 bg-slate-50/95 p-4 space-y-3">
                  
                  {/* Clean Receipt Breakdown */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Item Subtotal:</span>
                      <span className="font-mono font-semibold">₹{subtotal.toLocaleString()}</span>
                    </div>

                    {totalB2BDiscount > 0 && (
                      <div className="flex justify-between text-amber-800 font-bold">
                        <span>B2B Volume Discount (3% on ₹2500+ Items):</span>
                        <span className="font-mono">-₹{totalB2BDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    {totalRetailSavings > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                        <span>Savings vs Local Market Retail:</span>
                        <span className="font-mono">Save ₹{totalRetailSavings.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>Direct Pune Delivery:</span>
                      <span className="text-emerald-700 font-bold uppercase">FREE</span>
                    </div>

                    <div className="border-t border-slate-100 pt-1.5 flex justify-between items-center text-sm font-extrabold text-slate-900">
                      <span>Total Payable:</span>
                      <span className="font-mono text-emerald-800 text-base">₹{finalPayableTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <span>Processing Order...</span>
                    ) : (
                      <>
                        <span>Place Order • ₹{finalPayableTotal.toLocaleString()}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
