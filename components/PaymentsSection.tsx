'use client';

import { motion } from 'framer-motion';
import { DollarSign, Shirt, CreditCard, Users, Baby, Clock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentsSection = () => {
  const duesStructure = [
    {
      category: 'Adult (18-79)',
      price: 125,
      description: 'Full weekend access & meals',
      icon: Users,
      color: 'from-blue-500 to-blue-700',
    },
    {
      category: 'Child (10-17)',
      price: 50,
      description: 'Kids activities & meals',
      icon: Baby,
      color: 'from-green-500 to-green-700',
    },
    {
      category: 'Day Visitor',
      price: 75,
      description: 'Single day attendance',
      icon: Clock,
      color: 'from-orange-500 to-orange-700',
    },
    {
      category: 'Senior (80+)',
      price: 0,
      description: 'Free with our gratitude',
      icon: Crown,
      color: 'from-purple-500 to-purple-700',
    },
    {
      category: 'Grandfather Rate',
      price: 50,
      description: 'Special legacy pricing',
      icon: Crown,
      color: 'from-indigo-500 to-indigo-700',
    },
  ];

  return (
    <section id="payments" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Payments & Merchandise
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Secure your spot at our family gathering and grab some commemorative merchandise. 
            Your contribution helps fund all the weekend activities and memories.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Dues Structure */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">2025 Reunion Dues</h3>
                <p className="text-slate-600">Pricing for our family weekend</p>
              </div>

              <div className="space-y-4">
                {duesStructure.map((dues, index) => {
                  const IconComponent = dues.icon;
                  
                  return (
                    <div
                      key={dues.category}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${dues.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{dues.category}</h4>
                          <p className="text-sm text-slate-600">{dues.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-slate-800">
                          {dues.price === 0 ? 'FREE' : `$${dues.price}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Button */}
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                  onClick={() => window.open('https://venmo.com/churchwellreunion', '_blank')}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  Pay Dues via Venmo
                </Button>
                <p className="text-sm text-slate-500 mt-3">
                  Secure payment through Venmo @churchwellreunion
                </p>
              </div>
            </div>
          </div>

          {/* Merchandise */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Commemorative Merchandise</h3>
                <p className="text-slate-600">Keepsakes to remember the gathering</p>
              </div>

              {/* T-Shirt Preview */}
              <div className="space-y-6">
                <div className="relative group">
                  <div className="bg-gradient-to-br from-slate-100 to-blue-100 p-6 rounded-lg">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-slate-700 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                        <div className="text-center text-white">
                          <div className="text-2xl mb-1">🏡</div>
                          <div className="text-xs font-bold">CFR 2025</div>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">
                        Family Reunion T-Shirt
                      </h4>
                      <p className="text-slate-600 text-sm mb-4">
                        Premium quality with commemorative design
                      </p>
                      
                      {/* Size Options */}
                      <div className="space-y-2 text-sm text-slate-600">
                        <p>Available sizes: S, M, L, XL, XXL</p>
                        <p>100% cotton, comfortable fit guaranteed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">T-Shirt Price:</span>
                    <span className="text-2xl font-bold text-slate-800">$25</span>
                  </div>
                </div>

                {/* Order Button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    disabled
                  >
                    <Shirt className="w-5 h-5 mr-3" />
                    Coming Soon!
                  </Button>
                  <p className="text-sm text-slate-500 mt-3">
                    Pre-orders will open closer to the reunion date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {/*
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">💳 Payment Information</h3>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-200">Payment Methods</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Venmo: @churchwellreunion (preferred)</li>
                  <li>• Cash payments accepted at check-in</li>
                  <li>• Checks payable to "Churchwell Family Reunion"</li>
                  <li>• Payment plans available for large families</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-200">Important Notes</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Early bird discount: Pay by August 1st</li>
                  <li>• Family discounts for 5+ attendees</li>
                  <li>• Refunds available until August 1st</li>
                  <li>• All payments help fund activities & prizes</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-blue-100">
                Questions about payments? Contact our treasurer Toni Vasquez
              </p>
            </div>
          </div>
        </div>
        */}
      </div>
    </section>
  );
};

export default PaymentsSection;