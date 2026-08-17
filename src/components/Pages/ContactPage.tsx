import React, { useState } from 'react';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
import ContentPage from '../UI/ContentPage';

const ContactPage: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <ContentPage
      meta={{
        title: 'Contact DirectHome',
        description: 'Get in touch with DirectHome — questions about our calculators, listings launch, or partnerships.',
        path: '/contact',
      }}
      eyebrow="Contact"
      title={
        <>
          Talk to us. We actually{' '}
          <span className="italic text-courtyard-700">read this</span>
        </>
      }
      subtitle="Questions about the tools, the marketplace launch, or working together — send a note."
    >
      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-stone-100 mb-1">Send a message</h2>
          <p className="text-stone-400 text-sm mb-4">
            We typically reply within one business day.
          </p>

          {sent ? (
            <div className="rounded-sm border border-courtyard-100 bg-courtyard-50 px-4 py-3 text-sm text-courtyard-800">
              Thanks — we have your message and will get back to you soon.
            </div>
          ) : (
            <>
              <label className="block text-sm text-stone-300">
                Name
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                />
              </label>
              <label className="block text-sm text-stone-300">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                />
              </label>
              <label className="block text-sm text-stone-300">
                Subject
                <input
                  type="text"
                  name="subject"
                  required
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                />
              </label>
              <label className="block text-sm text-stone-300">
                Message
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 resize-none"
                />
              </label>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400"
              >
                Send message
              </button>
            </>
          )}
        </form>

        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-stone-100">Direct lines</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <IconMail className="text-gold-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-stone-500">Email</p>
                <a href="mailto:norwickprojects@gmail.com" className="text-gold-400 hover:text-gold-300">
                  norwickprojects@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconPhone className="text-gold-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-stone-500">Phone</p>
                <a href="tel:+2348105797401" className="text-stone-100 hover:text-gold-300">
                  0810 579 7401
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconMapPin className="text-gold-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-stone-500">Address</p>
                <p className="text-stone-300">39, Off-Igbe road, Ikorodu, Lagos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentPage>
  );
};

export default ContactPage;
