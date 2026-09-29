import React, { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Store, 
  Star, 
  Calendar, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingUp,
  Award,
  Sparkles,
  BrainCircuit,
  Flame,
  Utensils,
  UploadCloud,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const OverviewTab = ({ stats, cuisines, onSelectTab }) => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [dragActive, setDragActive] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleUpload = async (file) => {
    if (!file) return;
    setUploadStatus('uploading');
    setUploadMessage(`Uploading ${file.name}...`);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Upload failed');
      }
      setUploadStatus('success');
      setUploadMessage('Dataset successfully uploaded! Restart backend or refresh to see new stats.');
    } catch (err) {
      setUploadStatus('error');
      setUploadMessage(err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  // Culinary color palette for Cuisines
  const cuisineChartData = cuisines ? {
    labels: cuisines.labels.map(l => {
      const emojiMap = {
        'American': '🍔 American',
        'Japanese': '🍣 Japanese',
        'Italian': '🍕 Italian',
        'Chinese': '🥡 Chinese',
        'Mexican': '🌮 Mexican',
        'Indian': '🍛 Indian',
        'Middle Eastern': '🥙 Middle Eastern',
        'Mediterranean': '🥗 Mediterranean',
        'French': '🥐 French',
        'Southern': '🍗 Southern',
        'Korean': '🍲 Korean',
        'Spanish': '🥘 Spanish',
        'Thai': '🍜 Thai',
        'Vietnamese': '🥣 Vietnamese'
      };
      return emojiMap[l] || `🍽️ ${l}`;
    }),
    datasets: [
      {
        data: cuisines.data,
        backgroundColor: [
          '#ea580c', // American (Smoky Paprika)
          '#f43f5e', // Japanese (Salmon Rose)
          '#10b981', // Italian (Basil Emerald)
          '#f59e0b', // Chinese (Golden Saffron)
          '#84cc16', // Mexican (Avocado Lime)
          '#d97706', // Indian (Turmeric Curry)
          '#06b6d4', // Middle Eastern (Mediterranean Sea)
          '#059669', // Mediterranean (Olive Forest)
          '#d946ef', // French (Wine Plum)
          '#ca8a04', // Southern (Golden Biscuit)
          '#ef4444', // Korean (Chili Gochujang)
          '#e11d48', // Spanish (Saffron Crimson)
          '#f97316', // Thai (Lemongrass Orange)
          '#64748b'  // Vietnamese
        ],
        borderWidth: 2,
        borderColor: '#130d0a',
        hoverOffset: 6
      },
    ],
  } : null;

  // Day of the Week Chart Data
  const dayChartData = stats ? {
    labels: ['🎉 Weekend Feasts (Sat & Sun)', '💼 Weekday Dinners (Mon - Fri)'],
    datasets: [
      {
        label: 'Orders Count',
        data: [stats.weekend_orders, stats.weekday_orders],
        backgroundColor: ['rgba(249, 115, 22, 0.88)', 'rgba(245, 158, 11, 0.82)'],
        borderColor: ['#f97316', '#f59e0b'],
        borderWidth: 1.5,
        borderRadius: 8,
      }
    ]
  } : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner with Warm Food Theme */}
      <div className="glass-panel" style={{ 
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.18), rgba(245, 158, 11, 0.1), rgba(225, 29, 72, 0.08))',
        borderLeft: '4px solid #f97316',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="status-pill" style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem', background: 'rgba(249, 115, 22, 0.15)', color: '#fed7aa', borderColor: 'rgba(249, 115, 22, 0.35)' }}>
              🍕 Food Order Analytics Project
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Ahmedabad Institute of Technology &bull; Computer Engineering (BE05000231)
            </span>
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.3rem' }}>
            FoodHub Culinary Intelligence & Rating Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '820px' }}>
            Exploratory order analytics, cuisine revenue dynamics, and machine learning rating predictions across 1,898 restaurant meals.
            Pure order-level transactional dynamics; delivery logistics excluded.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onSelectTab('predictor')}>
            <Sparkles size={16} />
            <span>AI Rating Chef</span>
          </button>
          <button className="btn-secondary" onClick={() => onSelectTab('eda')}>
            <span>8 EDA Kitchen Plots</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* CSV File Upload Zone */}
      <div 
        className={`glass-panel upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".csv" 
          className="upload-input" 
          onChange={handleChange}
          disabled={uploadStatus === 'uploading'}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', pointerEvents: 'none' }}>
          {uploadStatus === 'idle' && (
            <>
              <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <UploadCloud size={32} color="#f97316" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Upload Food Dataset</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Drag & drop your CSV file here, or click to browse
                </p>
              </div>
            </>
          )}

          {uploadStatus === 'uploading' && (
            <>
              <div className="status-dot" style={{ width: '12px', height: '12px', background: '#f97316', boxShadow: '0 0 12px #f97316' }}></div>
              <h4 style={{ fontSize: '1.1rem', color: '#f97316' }}>{uploadMessage}</h4>
            </>
          )}

          {uploadStatus === 'success' && (
            <>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <CheckCircle size={32} color="#10b981" />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: '#34d399' }}>{uploadMessage}</h4>
            </>
          )}

          {uploadStatus === 'error' && (
            <>
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <AlertCircle size={32} color="#fb7185" />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: '#fb7185' }}>{uploadMessage}</h4>
            </>
          )}
        </div>
      </div>

      {/* Food KPI Stats Grid */}
      <div className="stats-grid">
        {/* Total Meals Ordered */}
        <div className="glass-panel stat-card">
          <div>
            <div className="stat-label">Total Meals Ordered</div>
            <div className="stat-value">{stats ? stats.total_orders.toLocaleString() : '1,898'}</div>
            <div className="stat-trend text-orange">
              <span>🍽️ Across 1,200 Customers</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: '#f97316' }}>
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Avg Order Ticket */}
        <div className="glass-panel stat-card">
          <div>
            <div className="stat-label">Average Meal Ticket</div>
            <div className="stat-value">${stats ? stats.avg_cost : '16.50'}</div>
            <div className="stat-trend text-muted">
              <span>Range: ${stats ? stats.min_cost : '4.47'} - ${stats ? stats.max_cost : '35.41'}</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: '#f59e0b' }}>
            <DollarSign size={22} />
          </div>
        </div>

        {/* Partner Kitchens */}
        <div className="glass-panel stat-card">
          <div>
            <div className="stat-label">Partner Kitchens</div>
            <div className="stat-value">{stats ? stats.total_restaurants : '178'}</div>
            <div className="stat-trend text-amber">
              <span>🍳 14 Global Cuisines</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: '#fbbf24' }}>
            <Store size={22} />
          </div>
        </div>

        {/* Unrated Orders Feedback Gap */}
        <div className="glass-panel stat-card">
          <div>
            <div className="stat-label">Silent Diners (Unrated)</div>
            <div className="stat-value">{stats ? `${stats.unrated_pct}%` : '38.8%'}</div>
            <div className="stat-trend text-amber">
              <AlertCircle size={14} />
              <span>736 orders without rating</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: '#f59e0b' }}>
            <Star size={22} />
          </div>
        </div>

        {/* Weekend Feasting Share */}
        <div className="glass-panel stat-card">
          <div>
            <div className="stat-label">Weekend Feasting Share</div>
            <div className="stat-value">{stats ? `${stats.weekend_pct}%` : '71.2%'}</div>
            <div className="stat-trend text-emerald">
              <span>🎉 1,351 Weekend Feasts</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: '#10b981' }}>
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Cuisine Share */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Global Cuisine Popularity</span>
                <span style={{ fontSize: '1.2rem' }}>🍜</span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Order volume breakdown across all 14 culinary categories
              </p>
            </div>
            <button className="chip-btn" onClick={() => onSelectTab('eda')}>
              Inspect in EDA
            </button>
          </div>

          <div style={{ height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {cuisineChartData ? (
              <Doughnut
                data={cuisineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#d4bda8',
                        font: { family: 'Plus Jakarta Sans', size: 11 },
                        boxWidth: 14,
                        padding: 8
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return ` ${label}: ${value} orders (${percentage}%)`;
                        }
                      }
                    }
                  },
                  cutout: '66%'
                }}
              />
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Loading culinary data...</div>
            )}
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1rem', 
            background: 'rgba(249, 115, 22, 0.06)', 
            border: '1px solid rgba(249, 115, 22, 0.18)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <strong style={{ color: '#fed7aa' }}>Chef's Observation:</strong> American (584) & Japanese (470) represent over 55% of all orders, demonstrating concentrated diner preference for burgers & sushi.
          </div>
        </div>

        {/* Day of Week Breakdown */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Dining Rush: Weekend vs Weekday</span>
                <span style={{ fontSize: '1.2rem' }}>🍷</span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Comparison of meal ordering volume across days
              </p>
            </div>
            <span className="status-pill" style={{ fontSize: '0.75rem', background: 'rgba(249, 115, 22, 0.15)', color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}>
              2.47x Weekend Surge
            </span>
          </div>

          <div style={{ height: '320px' }}>
            {dayChartData ? (
              <Bar
                data={dayChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return ` ${context.parsed.y} Orders`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: '#d4bda8', font: { family: 'Plus Jakarta Sans', size: 12 } },
                      grid: { display: false }
                    },
                    y: {
                      ticks: { color: '#d4bda8' },
                      grid: { color: 'rgba(255, 200, 150, 0.06)' }
                    }
                  }
                }}
              />
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Loading temporal data...</div>
            )}
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1rem', 
            background: 'rgba(249, 115, 22, 0.06)', 
            border: '1px solid rgba(249, 115, 22, 0.18)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <strong style={{ color: '#fed7aa' }}>Kitchen Operation Tip:</strong> Restaurants should concentrate kitchen staff and prep work on weekends, when 71% of dining orders occur.
          </div>
        </div>
      </div>

      {/* Executive Highlights & Findings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <Award size={18} color="#f97316" />
            <h4 style={{ fontSize: '1rem' }}>⭐ Rating Engagement Gap</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Nearly <strong>39% of food orders</strong> are never rated by diners. The primary restaurant priority is driving post-meal rating prompts with in-app perks rather than attempting to infer satisfaction from ticket price.
          </p>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <DollarSign size={18} color="#f59e0b" />
            <h4 style={{ fontSize: '1rem' }}>🥩 Order Ticket Consistency</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Average spend is <strong>$16.50</strong> with remarkable consistency between weekdays ($16.40) and weekends ($16.54). Specialty cuisines (French, Southern, Spanish) command higher ticket averages ($19-$22).
          </p>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <BrainCircuit size={18} color="#ea580c" />
            <h4 style={{ fontSize: '1rem' }}>👨‍🍳 AI Classification Insight</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Random Forest achieved an <strong>F1 score of 0.472</strong>, but did not beat the <strong>0.513 baseline</strong>. Customer delight depends on food flavor, dish temperature, and order accuracy rather than transactional order size.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
