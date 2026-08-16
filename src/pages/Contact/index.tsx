import React from 'react'
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import { SEO } from '../../components/SEO'

const Contact: React.FC = () => {
  return (
    <div className="bg-light-gray min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Contact Us | Gentle Electronics"
        description="Get in touch with Gentle Electronics for support, inquiries, or feedback."
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-charcoal mb-4">Contact Us</h1>
          <p className="text-lg text-secondary-charcoal">
            We're here to help! Reach out to us for any inquiries about our products or your orders.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border-gray overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Info */}
            <div className="bg-charcoal text-white p-10">
              <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-secondary-charcoal text-orange">
                    <FiPhone className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">WhatsApp & Phone</h3>
                    <p className="mt-1 text-border-gray">07061158745</p>
                    <a href="https://wa.me/2347061158745" target="_blank" rel="noopener noreferrer" className="mt-2 text-orange hover:underline text-sm inline-block">
                      Message us on WhatsApp &rarr;
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-secondary-charcoal text-orange">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Email</h3>
                    <p className="mt-1 text-border-gray">info@gentleelectronics.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-secondary-charcoal text-orange">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Location</h3>
                    <p className="mt-1 text-border-gray">
                      Lagos, Nigeria<br />
                      (Delivery Available Nationwide)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-secondary-charcoal text-orange">
                    <FiClock className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Business Hours</h3>
                    <p className="mt-1 text-border-gray">
                      Monday - Saturday<br />
                      9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form or Message */}
            <div className="p-10 flex flex-col justify-center text-center">
              <div className="mx-auto w-24 h-24 bg-light-gray rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-orange" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-4">Fastest way to reach us</h2>
              <p className="text-secondary-charcoal mb-8">
                For the quickest response, please message us directly on WhatsApp. We typically reply within a few minutes during business hours.
              </p>
              <a 
                href="https://wa.me/2347061158745" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-md font-bold text-lg flex items-center justify-center transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
