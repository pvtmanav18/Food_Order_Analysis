import React from 'react';
import { 
  BarChart3, 
  Sparkles, 
  BrainCircuit, 
  Layers, 
  Compass, 
  FileText, 
  TrendingUp, 
  Download,
  UtensilsCrossed,
  Flame
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, backendStatus, onDownloadPdf }) => {
  const navItems = [
    { id: 'overview', label: 'Culinary Overview', icon: <TrendingUp size={16} /> },
    { id: 'eda', label: 'EDA Kitchen Gallery', icon: <BarChart3 size={16} /> },
    { id: 'predictor', label: 'AI Rating Chef', icon: <Sparkles size={16} /> },
    { id: 'evaluation', label: 'Model Evaluation', icon: <BrainCircuit size={16} /> },
    { id: 'architecture', label: 'Architecture & Flow', icon: <Layers size={16} /> },
    { id: 'explorer', label: 'Order Menu Explorer', icon: <Compass size={16} /> },
    { id: 'documentation', label: 'Project Recipe & Docs', icon: <FileText size={16} /> },
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-icon">
            <span style={{ fontSize: '1.4rem' }}>🍔</span>
          </div>
          <div>
            <div className="brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>FoodHub Intelligence</span>
              <Flame size={16} color="#f97316" fill="#f97316" />
            </div>
            <div className="brand-subtitle">Python for Data Science | BE05000231 &bull; CE-C</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="navbar-tabs" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-tab-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Status & Actions */}
        <div className="nav-actions">
          <div className="status-pill" title={backendStatus ? "FastAPI Connected" : "Connecting to Backend..."}>
            <span className="status-dot" style={backendStatus ? {} : { backgroundColor: '#f59e0b', boxShadow: 'none' }} />
            <span>{backendStatus ? 'Kitchen API Ready' : 'Connecting...'}</span>
          </div>

          <button 
            className="btn-secondary" 
            onClick={onDownloadPdf}
            title="Download Full Project Documentation PDF"
          >
            <Download size={15} color="#f97316" />
            <span>Report PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
