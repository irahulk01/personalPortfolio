import Work from '../../../views/Works/Work';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work | Rahul Kumar',
  description: 'View my projects and work experience.',
};

export default function WorkPage() {
  return <Work />;
}
