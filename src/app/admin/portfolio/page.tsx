import PortfolioDashboard from '../../../component/admin/portfolio/PortfolioDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Dashboard | App Manager',
  description: 'Manage and monitor portfolio analytics and inquiries.',
};

export default function PortfolioAdminPage() {
  return <PortfolioDashboard />;
}
