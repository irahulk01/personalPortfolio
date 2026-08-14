import Resume from '../../../views/Resume/Resume';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume | Rahul Kumar',
  description: 'View my resume and experience.',
};

export default function ResumePage() {
  return <Resume />;
}
