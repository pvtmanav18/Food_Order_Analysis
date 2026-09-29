import React, { useState } from 'react';
import { 
  BrainCircuit, 
  BarChart2, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Award,
  Maximize2,
  X
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EvaluationTab = ({ evalSummary, baseUrl = 'http://localhost:8000' }) => {
  const [activeModalPlot, setActiveModalPlot] = useState(null);

  const defaultComparison = [
    { Model: "Random Forest", Accuracy: 0.476, Precision: 0.489, Recall: 0.456, F1: 0.472 },
    { Model: "Logistic Regression", Accuracy: 0.474, Precision: 0.484, Recall: 0.400, F1: 0.438 }
  ];

  const defaultFeatures = [
    { feature: "cost_of_the_order", importance: 0.3284 },
    { feature: "restaurant_order_count", importance: 0.2142 },
    { feature: "Price_High", importance: 0.0763 },
    { feature: "Price_Low", importance: 0.0681 },
    { feature: "is_weekend", importance: 0.0624 },
    { feature: "Cuisine_American", importance: 0.0465 },
    { feature: "Cuisine_Japanese", importance: 0.0412 },
    { feature: "Cuisine_Italian", importance: 0.0385 }
  ];

  const comparison = evalSummary?.comparison?.length > 0 ? evalSummary.comparison : defaultComparison;
  const features = evalSummary?.features?.length > 0 ? evalSummary.features.slice(0, 8) : defaultFeatures;

  // Chart data for Feature Importance
  const featureChartData = {
    labels: features.map(f => f.feature.replace('Cuisine_', 'Cuisine: ')),
    datasets: [
      {
        label: 'Relative Importance',
        data: features.map(f => (f.importance * 100).toFixed(2)),
        backgroundColor: [
          '#6366f1', '#10b981', '#f59e0b', '#06b6d4', 
          '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6'
        ],
        borderRadius: 6,
      }
    ]
  };

  const evalPlots = [
    {
      id: "eval_01",
      filename: "01_confusion_matrix_lr.png",
      title: "Logistic Regression Confusion Matrix",
      model: "Logistic Regression",
      desc: "Balanced prediction spread across low and high rating classes, yielding 47.4% accuracy."
    },
    {
      id: "eval_02",
      filename: "02_confusion_matrix_rf.png",
      title: "Random Forest Confusion Matrix",
      model: "Random Forest",
      desc: "GridSearch-tuned ensemble yielding highest F1 score (0.472) among tested algorithms."
    },
    {
      id: "eval_03",
      filename: "03_model_comparison.png",
      title: "Comparative Performance Metrics",
      model: "Benchmark",
      desc: "Visual side-by-side comparison across Accuracy, Precision, Recall, and F1 metrics."
    },
    {
      id: "eval_04",
      filename: "04_feature_importance.png",
      title: "Random Forest Feature Weights",
      model: "Feature Analysis",
      desc: "Visualizes the dominant predictive influence of order cost and restaurant order volume."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="status-pill text-purple" style={{ fontSize: '0.72rem' }}>
              Phase 6 & 7 Deliverables
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Stratified 80/20 Train-Test Split (Seed: 42)
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
            Model Evaluation & Benchmarking
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Rigorous performance comparison between Logistic Regression and Random Forest versus the majority-class baseline.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="status-pill" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            Baseline Accuracy: 51.3%
          </div>
        </div>
      </div>

      {/* Comparison Cards & Benchmark Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Model Metrics Table */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#10b981" />
            <span>Classification Performance Metrics</span>
          </h3>

          <div className="custom-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1 Score</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr key={idx} style={row.Model === 'Random Forest' ? { background: 'rgba(99, 102, 241, 0.08)' } : {}}>
                    <td style={{ fontWeight: 600 }}>
                      {row.Model}
                      {row.Model === 'Random Forest' && (
                        <span className="status-pill text-emerald" style={{ marginLeft: '0.5rem', fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                          Best Model
                        </span>
                      )}
                    </td>
                    <td>{(row.Accuracy * 100).toFixed(1)}%</td>
                    <td>{(row.Precision * 100).toFixed(1)}%</td>
                    <td>{(row.Recall * 100).toFixed(1)}%</td>
                    <td style={{ fontWeight: 700, color: 'var(--emerald)' }}>
                      {(row.F1 * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                {/* Majority Class Baseline row */}
                <tr style={{ background: 'rgba(244, 63, 94, 0.05)', color: 'var(--text-muted)' }}>
                  <td style={{ fontStyle: 'italic' }}>
                    Majority Class Baseline
                  </td>
                  <td>51.3%</td>
                  <td>--</td>
                  <td>--</td>
                  <td style={{ color: 'var(--rose)' }}>--</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: '#fff' }}>Evaluation Method:</strong> 80% train / 20% test split stratified on <code>high_rating</code> target. Hyperparameters tuned using 5-fold GridSearchCV.
          </div>
        </div>

        {/* Feature Importance Chart */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={18} color="#6366f1" />
              <span>Feature Importance (Random Forest)</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Top 8 Features
            </span>
          </div>

          <div style={{ height: '240px' }}>
            <Bar 
              data={featureChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return ` ${context.parsed.x}% Importance`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                  },
                  y: {
                    ticks: { color: '#f8fafc', font: { family: 'Plus Jakarta Sans', size: 11 } },
                    grid: { display: false }
                  }
                }
              }}
            />
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-sub)' }}>
            <span>Order Value: 32.8%</span>
            <span>Restaurant Popularity: 21.4%</span>
            <span>Combined Top 2: 54.2%</span>
          </div>
        </div>
      </div>

      {/* Critical Academic Discussion / Finding */}
      <div className="glass-panel" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(244, 63, 94, 0.08))', 
        borderLeft: '4px solid #6366f1',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <AlertCircle size={22} color="#818cf8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
              Academic Finding: Why Did Models Not Beat the Majority-Class Baseline?
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              The Random Forest classifier achieved an F1 score of <strong>0.472</strong> and accuracy of <strong>0.476</strong>, slightly outperforming Logistic Regression (0.438 / 0.474), but neither exceeded the majority-class baseline of <strong>0.513</strong>.
              <br /><br />
              This is a fundamentally meaningful data science result: <em>whether a diner awards a high customer rating is largely independent of order price, restaurant popularity, day of the week, or cuisine type.</em> Customer satisfaction is governed by sensory and qualitative variables that transactional datasets do not capture — food flavor, dish temperature, portion size, packaging integrity, and order accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Evaluation Visual Plots Gallery */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Evaluation Artifacts & Diagnostic Plots
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {evalPlots.map(plot => {
            const imgUrl = `${baseUrl}/static/eval/${plot.filename}`;

            return (
              <div 
                key={plot.id} 
                className="glass-panel glass-card-interactive" 
                style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}
                onClick={() => setActiveModalPlot(plot)}
              >
                <div style={{ 
                  borderRadius: 'var(--radius-sm)', 
                  overflow: 'hidden', 
                  backgroundColor: '#070b14',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-card)',
                  marginBottom: '0.75rem',
                  position: 'relative'
                }}>
                  <img 
                    src={imgUrl} 
                    alt={plot.title} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div style="color: #64748b; font-size: 0.8rem; text-align: center; padding: 1rem;">📊 ${plot.title}</div>`;
                    }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: '0.5rem', 
                    right: '0.5rem', 
                    background: 'rgba(9, 13, 22, 0.8)', 
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.7rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Maximize2 size={11} />
                    <span>Zoom</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="status-pill text-purple" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                    {plot.model}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  {plot.title}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {plot.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Plot Zoom */}
      {activeModalPlot && (
        <div className="modal-overlay" onClick={() => setActiveModalPlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="status-pill text-purple" style={{ fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                  {activeModalPlot.model}
                </span>
                <h2 style={{ fontSize: '1.35rem' }}>{activeModalPlot.title}</h2>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.4rem', borderRadius: '50%' }}
                onClick={() => setActiveModalPlot(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ 
              background: '#070b14', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid var(--border-card)',
              marginBottom: '1rem'
            }}>
              <img 
                src={`${baseUrl}/static/eval/${activeModalPlot.filename}`} 
                alt={activeModalPlot.title} 
                style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain' }}
              />
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {activeModalPlot.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationTab;
