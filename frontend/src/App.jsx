import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import OverviewTab from './components/OverviewTab';
import EdaTab from './components/EdaTab';
import PredictorTab from './components/PredictorTab';
import EvaluationTab from './components/EvaluationTab';
import ArchitectureTab from './components/ArchitectureTab';
import ExplorerTab from './components/ExplorerTab';
import DocumentationTab from './components/DocumentationTab';

const API_BASE_URL = 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [cuisines, setCuisines] = useState(null);
  const [edaPlots, setEdaPlots] = useState([]);
  const [evalSummary, setEvalSummary] = useState(null);
  const [backendStatus, setBackendStatus] = useState(false);

  useEffect(() => {
    // Health check
    axios.get(`${API_URL}/health`)
      .then(res => {
        if (res.data.status === 'ok') {
          setBackendStatus(true);
        }
      })
      .catch(() => setBackendStatus(false));

    // Stats
    axios.get(`${API_URL}/stats`)
      .then(res => setStats(res.data))
      .catch(err => {
        console.warn("Could not fetch stats from backend; using default project stats.", err);
        setStats({
          total_orders: 1898,
          avg_cost: 16.50,
          min_cost: 4.47,
          max_cost: 35.41,
          total_restaurants: 178,
          avg_rating: 4.34,
          unrated_orders: 736,
          unrated_pct: 38.8,
          weekend_orders: 1351,
          weekday_orders: 547,
          weekend_pct: 71.2
        });
      });

    // Cuisines
    axios.get(`${API_URL}/cuisines`)
      .then(res => setCuisines(res.data))
      .catch(err => {
        console.warn("Could not fetch cuisines from backend; using default dataset counts.", err);
        setCuisines({
          labels: [
            "American", "Japanese", "Italian", "Chinese", "Mexican", 
            "Indian", "Middle Eastern", "Mediterranean", "French", 
            "Southern", "Korean", "Spanish", "Thai", "Vietnamese"
          ],
          data: [584, 470, 298, 215, 77, 73, 49, 46, 18, 17, 13, 12, 19, 7]
        });
      });

    // EDA Plots
    axios.get(`${API_URL}/eda/plots`)
      .then(res => setEdaPlots(res.data.plots))
      .catch(err => console.warn("EDA plots API failed:", err));

    // Eval summary
    axios.get(`${API_URL}/eval/summary`)
      .then(res => setEvalSummary(res.data))
      .catch(err => console.warn("Eval summary API failed:", err));
  }, []);

  const handleDownloadPdf = () => {
    // Opens or triggers download of the official project documentation PDF
    const downloadUrl = `${API_BASE_URL}/static/docs/Food_Order_Analysis_Documentation.pdf`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="app-wrapper">
      {/* Top Sticky Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendStatus} 
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <OverviewTab 
            stats={stats} 
            cuisines={cuisines} 
            onSelectTab={setActiveTab} 
          />
        )}

        {activeTab === 'eda' && (
          <EdaTab 
            edaPlots={edaPlots} 
            baseUrl={API_BASE_URL} 
          />
        )}

        {activeTab === 'predictor' && (
          <PredictorTab 
            apiUrl={API_URL} 
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationTab 
            evalSummary={evalSummary} 
            baseUrl={API_BASE_URL} 
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureTab 
            baseUrl={API_BASE_URL} 
          />
        )}

        {activeTab === 'explorer' && (
          <ExplorerTab 
            apiUrl={API_URL} 
          />
        )}

        {activeTab === 'documentation' && (
          <DocumentationTab 
            onDownloadPdf={handleDownloadPdf} 
            baseUrl={API_BASE_URL} 
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-card)', 
        padding: '1.5rem', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--text-sub)',
        background: 'rgba(9, 13, 22, 0.9)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>Food Order Analysis Using Data Science</strong> | Ahmedabad Institute of Technology
          </div>
          <div>
            Subject: Python for Data Science (BE05000231) &bull; 5th Semester CE-C
          </div>
          <div>
            Dataset: FoodHub (1,898 Orders) &bull; Models: Random Forest & Logistic Regression
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
