import Recruiters from '../../../views/Recruiters/Recruiters';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Recruiters | Rahul Kumar',
  description: 'Information for recruiters and hiring managers.',
};

export default function RecruitersPage() {
  return <Recruiters />;
}
