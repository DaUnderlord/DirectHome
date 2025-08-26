import React from 'react';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a server
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions or feedback? We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <IconMail className="text-blue-600 mt-1 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a href="mailto:norwickprojects@gmail.com" className="text-blue-600 hover:underline">
                      norwickprojects@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <IconPhone className="text-blue-600 mt-1 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <a href="tel:+2348105797401" className="text-blue-600 hover:underline">
                      08105797401
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <IconMapPin className="text-blue-600 mt-1 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Address</p>
                    <p className="text-gray-600">
                      39, Off-Igbe road, Ikorodu, Lagos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;