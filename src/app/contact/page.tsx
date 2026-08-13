import Contact from '../../views/ContactForm/Contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Rahul Kumar',
  description: 'Get in touch with me.',
};

export default function ContactPage() {
  return <Contact />;
}
