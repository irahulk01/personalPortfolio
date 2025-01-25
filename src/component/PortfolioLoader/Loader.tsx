import { HiBriefcase } from 'react-icons/hi';
import './PortfolioLoader.css'; 

export default function Loader() {
  return (
    <div className="loader">
      <div className="logo-container">
        <HiBriefcase className="rocket-icon" />
      </div>
      <div className="loading-text">
        <div className="dot-flashing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
