import Home from '../../views/Home/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Rahul Kumar',
  description: 'Welcome to my personal portfolio. I am a Web Developer specializing in React.',
};

export default function HomePage() {
  return <Home />;
}
