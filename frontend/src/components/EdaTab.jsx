import React, { useState } from 'react';
import { 
  Maximize2, 
  X, 
  Filter, 
  Layers, 
  Info, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

const EdaTab = ({ edaPlots, baseUrl = 'http://localhost:8000' }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalPlot, setActiveModalPlot] = useState(null);

  const defaultPlots = [
    {
      id: "eda_01",
      filename: "01_order_value_distribution.png",
      title: "Order Value Distribution",
      category: "Order Characteristics",
      summary: "Right-skewed distribution peaking around $12-$16 with a maximum of $35.41. Most orders fall within the $10-$20 range.",
      insight: "Mean order value is $16.50, standard deviation is $7.48. No statistical outliers were detected via IQR."
    },
    {
      id: "eda_02",
      filename: "02_top_cuisines.png",
      title: "Top Cuisines by Order Volume",
      category: "Cuisine Analysis",
      summary: "American (584 orders) and Japanese (470 orders) represent over 55% of all orders, followed by Italian (298) and Chinese (215).",
      insight: "Top 4 cuisines account for 82.5% of total platform volume, suggesting concentrated customer culinary preference."
    },
    {
      id: "eda_03",
      filename: "03_top_restaurants.png",
      title: "Top 10 High-Volume Restaurants",
      category: "Restaurant Performance",
      summary: "Shake Shack, The Meatball Shop, Blue Ribbon Sushi, and Blue Ribbon Fried Chicken dominate the order distribution.",
      insight: "A small fraction of popular brands generate disproportionate traffic and high customer trust."
    },
    {
      id: "eda_04",
      filename: "04_orders_by_day_type.png",
      title: "Orders by Day Type (Weekend vs Weekday)",
      category: "Temporal Patterns",
      summary: "Weekends account for 1,351 orders (71.2%), while weekdays represent 547 orders (28.8%).",
      insight: "Food ordering demand peaks heavily on Saturday and Sunday; staffing and promotional pushes should align with weekends."
    },
    {
      id: "eda_05",
      filename: "05_rating_distribution.png",
      title: "Customer Rating Distribution",
      category: "Customer Satisfaction",
      summary: "38.8% of orders are 'Not given'. Of rated orders, 588 are 5-star, 386 are 4-star, and 188 are 3-star.",
      insight: "Rated orders are predominantly positive (5-star is the mode), but the massive unrated share represents a major engagement gap."
    },
    {
      id: "eda_06",
      filename: "06_cost_by_cuisine.png",
      title: "Cost of Order by Cuisine Type",
      category: "Cuisine Analysis",
      summary: "French, Southern, and Spanish exhibit higher average order costs ($19-$22), while Korean and Vietnamese average lower.",
      insight: "Cuisine type has a clear influence on average order value, informing premium pricing and commission tiers."
    },
    {
      id: "eda_07",
      filename: "07_cost_by_day_type.png",
      title: "Order Cost by Day Type",
      category: "Temporal Patterns",
      summary: "Average order cost is virtually identical across Weekday ($16.40) and Weekend ($16.54).",
      insight: "While weekend volume surges by 2.5x, customers spend approximately the same per order regardless of day."
    },
    {
      id: "eda_08",
      filename: "08_rating_vs_cost.png",
      title: "Rating vs Order Cost",
      category: "Customer Satisfaction",
      summary: "Rating distribution across cost buckets shows minimal variation between 3-star, 4-star, and 5-star orders.",
      insight: "Order price alone does not drive higher satisfaction, explaining why ML models based on transactional features hit baseline limits."
    }
  ];

  const plots = edaPlots && edaPlots.length > 0 ? edaPlots : defaultPlots;
  const categories = ['All', ...new Set(plots.map(p => p.category))];

  const filteredPlots = selectedCategory === 'All' 
    ? plots 
    : plots.filter(p => p.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header & Category Filter */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
            Exploratory Data Analysis (Phase 3 Visualizations)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Visual distribution analyses of order values, cuisine popularity, ratings, and temporal ordering dynamics.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)', marginRight: '0.3rem' }} />
          {categories.map(cat => (
            <button
              key={cat}
              className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
              style={selectedCategory === cat ? {
                background: 'var(--primary)',
                color: '#fff',
                borderColor: 'var(--primary)'
              } : {}}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plots Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredPlots.map((plot) => {
          const imgUrl = `${baseUrl}/static/eda/${plot.filename}`;

          return (
            <div 
              key={plot.id} 
              className="glass-panel glass-card-interactive" 
              style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem' }}
              onClick={() => setActiveModalPlot(plot)}
            >
              {/* Image Preview Container */}
              <div style={{ 
                position: 'relative', 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', 
                backgroundColor: '#070b14',
                height: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-card)'
              }}>
                <img 
                  src={imgUrl} 
                  alt={plot.title} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div style="color: #64748b; font-size: 0.82rem; text-align: center; padding: 1rem;">📊 ${plot.title}<br/><span style="font-size: 0.72rem;">(Plot Image Preview)</span></div>`;
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '0.6rem', 
                  right: '0.6rem', 
                  background: 'rgba(9, 13, 22, 0.8)', 
                  backdropFilter: 'blur(4px)',
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Maximize2 size={12} />
                  <span>Inspect</span>
                </div>
              </div>

              {/* Meta & Info */}
              <div style={{ marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="status-pill text-cyan" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                    {plot.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>
                    {plot.filename.split('_')[0]}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.45rem' }}>
                  {plot.title}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem', flex: 1 }}>
                  {plot.summary}
                </p>

                <div style={{ 
                  padding: '0.6rem 0.75rem', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  color: '#cbd5e1',
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <strong>Insight:</strong> {plot.insight}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Modal */}
      {activeModalPlot && (
        <div className="modal-overlay" onClick={() => setActiveModalPlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="status-pill text-cyan" style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                  {activeModalPlot.category}
                </span>
                <h2 style={{ fontSize: '1.4rem' }}>{activeModalPlot.title}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  File: {activeModalPlot.filename} | Phase 3 Exploratory Data Analysis
                </p>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.4rem', borderRadius: '50%' }}
                onClick={() => setActiveModalPlot(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* High-res image */}
            <div style={{ 
              background: '#070b14', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid var(--border-card)',
              marginBottom: '1.5rem',
              maxHeight: '520px',
              overflow: 'hidden'
            }}>
              <img 
                src={`${baseUrl}/static/eda/${activeModalPlot.filename}`} 
                alt={activeModalPlot.title} 
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>

            {/* In-depth details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Info size={15} color="var(--primary)" />
                  <span>Key Observations</span>
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {activeModalPlot.summary}
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={15} color="var(--emerald)" />
                  <span>Strategic Implication</span>
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {activeModalPlot.insight}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EdaTab;
