import React, { useState } from 'react';
import { 
  Layers, 
  GitBranch, 
  Workflow, 
  Maximize2, 
  X, 
  CheckCircle, 
  ArrowRight,
  Database,
  Cpu,
  FileCheck
} from 'lucide-react';

const ArchitectureTab = ({ baseUrl = 'http://localhost:8000' }) => {
  const [activeDiagram, setActiveDiagram] = useState(null);

  const diagrams = [
    {
      id: "architecture",
      title: "System Architecture (Chapter 5.1)",
      filename: "architecture.png",
      tag: "6-Layer Architecture",
      desc: "Architectural separation of concerns across Data, Processing, Analysis, Modeling, Evaluation, and Output layers.",
      layers: [
        { name: "Data Layer", desc: "Raw foodhub_order.csv storage & versioning" },
        { name: "Processing Layer", desc: "Pandas & NumPy data cleaning, imputation, and feature engineering" },
        { name: "Analysis Layer", desc: "Matplotlib & Seaborn order analysis visualizations (EDA)" },
        { name: "Modeling Layer", desc: "scikit-learn Logistic Regression & Random Forest classifiers" },
        { name: "Evaluation Layer", desc: "Stratified k-fold cross-validation, confusion matrices, F1 benchmarking" },
        { name: "Output Layer", desc: "Serialized models (.pkl), CSV metrics, charts, and automated PDF report" }
      ]
    },
    {
      id: "flowchart",
      title: "End-to-End Workflow Flowchart (Chapter 5.2)",
      filename: "flowchart.png",
      tag: "11-Step Pipeline",
      desc: "Complete procedural flowchart illustrating data ingestion, preprocessing, training, validation, and documentation generation."
    },
    {
      id: "module_diagram",
      title: "Modular Script Architecture (Chapter 5.3)",
      filename: "module_diagram.png",
      tag: "7 Sequential Phases",
      desc: "Seven modular Python scripts (phase1 through phase7) operating around shared data, models, and plot registries."
    }
  ];

  const phases = [
    {
      step: "01",
      title: "Data Collection & Understanding",
      script: "phase1_data_understanding.py",
      summary: "Loads 1,898 raw records, validates schema, checks missing values, and identifies data types."
    },
    {
      step: "02",
      title: "Data Cleaning & Preprocessing",
      script: "phase2_data_cleaning.py",
      summary: "Drops out-of-scope delivery logistics columns (prep time, delivery time), cleans ratings, and checks outliers."
    },
    {
      step: "03",
      title: "Exploratory Data Analysis",
      script: "phase3_eda.py",
      summary: "Generates 8 diagnostic plots covering order value, cuisine share, restaurant volume, and day-type trends."
    },
    {
      step: "04",
      title: "Feature Engineering",
      script: "phase4_feature_engineering.py",
      summary: "Engineers 15 features: restaurant order count, one-hot encoded cuisines, price tiers, and high_rating target."
    },
    {
      step: "05",
      title: "Model Building",
      script: "phase5_model_building.py",
      summary: "Stratified 80/20 train-test split, StandardScaler, training Logistic Regression & Random Forest classifiers."
    },
    {
      step: "06",
      title: "Model Evaluation",
      script: "phase6_model_evaluation.py",
      summary: "Evaluates Accuracy, Precision, Recall, F1; builds confusion matrices and feature importance charts."
    },
    {
      step: "07",
      title: "Results & Documentation",
      script: "phase7_results_conclusion.py",
      summary: "Consolidates findings into business recommendations and builds the 20+ page academic documentation PDF."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="status-pill text-cyan" style={{ fontSize: '0.72rem' }}>
              System Design & Engineering
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ReportLab & Matplotlib Generated Assets
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
            Architecture, Flowcharts & Module Design
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Visual system diagrams and sequential execution flow from Chapter 5 of the project documentation.
          </p>
        </div>
      </div>

      {/* Diagrams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {diagrams.map(diag => {
          const imgUrl = `${baseUrl}/static/assets/${diag.filename}`;

          return (
            <div 
              key={diag.id} 
              className="glass-panel glass-card-interactive" 
              style={{ display: 'flex', flexDirection: 'column' }}
              onClick={() => setActiveDiagram(diag)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="status-pill text-cyan" style={{ fontSize: '0.7rem' }}>
                  {diag.tag}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <Maximize2 size={12} />
                  <span>Click to Expand</span>
                </div>
              </div>

              {/* Image Thumbnail */}
              <div style={{ 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', 
                backgroundColor: '#070b14',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-card)',
                marginBottom: '1rem',
                padding: '0.5rem'
              }}>
                <img 
                  src={imgUrl} 
                  alt={diag.title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div style="color: #64748b; font-size: 0.85rem; text-align: center;">📐 ${diag.title}</div>`;
                  }}
                />
              </div>

              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                {diag.title}
              </h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', flex: 1 }}>
                {diag.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* 7-Phase Execution Workflow Roadmap */}
      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Workflow size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.2rem' }}>
            7-Phase Data Science Execution Pipeline
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {phases.map((p, idx) => (
            <div 
              key={p.step} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.9rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-card)',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-heading)',
                flexShrink: 0
              }}>
                {p.step}
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem' }}>{p.title}</h4>
                  <code style={{ fontSize: '0.72rem', color: 'var(--text-sub)', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {p.script}
                  </code>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {p.summary}
                </p>
              </div>

              <div className="status-pill text-emerald" style={{ fontSize: '0.7rem' }}>
                <CheckCircle size={12} />
                <span>Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Diagram Modal */}
      {activeDiagram && (
        <div className="modal-overlay" onClick={() => setActiveDiagram(null)}>
          <div className="modal-content" style={{ maxWidth: '1000px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="status-pill text-cyan" style={{ fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                  {activeDiagram.tag}
                </span>
                <h2 style={{ fontSize: '1.35rem' }}>{activeDiagram.title}</h2>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.4rem', borderRadius: '50%' }}
                onClick={() => setActiveDiagram(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ 
              background: '#070b14', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.25rem', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid var(--border-card)',
              marginBottom: '1.25rem'
            }}>
              <img 
                src={`${baseUrl}/static/assets/${activeDiagram.filename}`} 
                alt={activeDiagram.title} 
                style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
              />
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {activeDiagram.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureTab;
