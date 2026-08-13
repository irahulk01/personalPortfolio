import About from '../../views/About/About';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Rahul Kumar',
  description: 'Learn more about Rahul Kumar, a React Developer from Kolkata.',
};

export default function AboutPage() {
  return <About />;
}
