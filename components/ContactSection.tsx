'use client';

import { motion } from 'framer-motion';
import { Mail, Instagram, MapPin } from 'lucide-react';

const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'General questions & information',
      contact: 'info@churchwellreunion.com',
      action: 'mailto:info@churchwellreunion.com',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Instagram,
      title: 'Follow Us',
      description: 'Latest updates & behind the scenes',
      contact: '@Churchwell_family_reunion',
      action: 'https://www.instagram.com/Churchwell_family_reunion',
      color: 'from-pink-500 to-purple-700',
      bgColor: 'bg-pink-50',
    },
    {
      icon: MapPin,
      title: 'Event Location',
      description: 'Casa de Fruta',
      contact: '10031 Pacheco Pass Hwy, Gilroy, CA 95020',
      action: 'https://maps.google.com/?q=10031+Pacheco+Pass+Hwy,+Gilroy,+CA+95020',
      color: 'from-green-500 to-teal-700',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Contact Information
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions about our family gathering? We're here to help 
            with all your questions and needs.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              
              return (
                <motion.div
                  key={method.title}
                  className={`${method.bgColor} p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-white/50`}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => window.open(method.action, '_blank')}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {method.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-3">
                        {method.description}
                      </p>
                      <p
                        className={
                          `text-slate-700 font-medium text-center text-sm sm:text-base md:text-sm ` +
                          (method.title === 'Event Location'
                            ? 'break-words whitespace-normal'
                            : 'whitespace-nowrap overflow-x-auto')
                        }
                      >
                        {method.contact}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">🏡 Frequently Asked Questions</h3>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-200 mb-2">How do I reserve my campsite?</h4>
                  <p className="text-blue-100 text-sm">
                    Call Casa de Fruta directly at 1-800-548-3813 ext 2 then ext 7, 
                    or visit casadefruta.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-blue-100">
                More questions? Don't hesitate to reach out! 🏡
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;