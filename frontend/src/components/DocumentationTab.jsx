import React from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  Lightbulb, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const DocumentationTab = ({ onDownloadPdf, baseUrl = 'http://localhost:8000' }) => {
  const chapters = [
    {
      num: "01",
      title: "Introduction & Scope",
      content: "Online food ordering platforms generate high order volumes across varied cuisines. This project performs an end-to-end data science study on 1,898 orders from Kaggle's FoodHub dataset. Scope is strictly defined around order-level characteristics (cost, cuisine, restaurant volume, timing, ratings); delivery logistics (preparation and delivery time) were intentionally excluded."
    },
    {
      num: "02",
      title: "Data Quality & Cleaning",
      content: "Phase 1 confirmed 0 NaN values and 0 duplicate order IDs. 'Not given' ratings (736 records, 38.8%) were modeled as a valid engagement signal rather than dropped. Order values range from $4.47 to $35.41 with mean $16.50; no statistical outliers were identified by IQR."
    },
    {
      num: "03",
      title: "Exploratory Data Analysis",
      content: "American (584) and Japanese (470) represent over 55% of volume. Weekend volume heavily dominates weekday volume (71.2% vs 28.8%), while average spend per order remains identical across day types ($16.54 vs $16.40)."
    },
    {
      num: "04",
      title: "Feature Engineering & Modeling",
      content: "15 input features were engineered: restaurant popularity count, one-hot encoded cuisines, price tiers (Low <$10, Medium $10-$20, High >$20), and day type. Target 'high_rating' (4-5 stars) was created. Logistic Regression and Random Forest were trained using an 80/20 stratified split."
    },
    {
      num: "05",
      title: "Model Evaluation & Baseline Benchmark",
      content: "Random Forest achieved an F1 of 0.472 and accuracy of 0.476, while Logistic Regression reached 0.438 F1 and 0.474 accuracy. Crucially, neither model outperformed the 0.513 majority-class baseline. Satisfaction is governed by food quality, temperature, and order accuracy rather than transactional order cost."
    },
    {
      num: "06",
      title: "Business Recommendations",
      content: "Since order price and cuisine do not reliably predict customer rating, platforms should avoid trying to infer satisfaction indirectly. Instead, operational priorities should focus on: (1) Prompting the 39% of unrated orders with in-app rating incentives, and (2) Aligning courier and kitchen capacity with weekend 2.5x volume surges."
    },
    {
      num: "07",
      title: "Future Scope",
      content: "Incorporate granular item-level descriptions, promo/coupon usage flags, customer lifetime order history, and sentiment analysis of qualitative customer comments to improve predictive power."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Card */}
      <div className="glass-panel" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(16, 185, 129, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="status-pill text-cyan">
              <GraduationCap size={14} />
              <span>Academic Documentation</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              AIT CE-C | 5th Semester Mini Project
            </span>
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.4rem' }}>
            Food Order Analysis Using Data Science
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '780px' }}>
            Official project documentation following curriculum requirements for Python for Data Science (BE05000231). 
            Comprehensive 12-chapter analysis including source code, evaluation metrics, and conclusions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={onDownloadPdf}
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <Download size={18} />
            <span>Download Full PDF Report (516 KB)</span>
          </button>
          <a 
            href={`${baseUrl}/static/docs/Food_Order_Analysis_Documentation.pdf`} 
            target="_blank" 
            rel="noreferrer"
            className="btn-secondary"
            style={{ padding: '0.75rem 1.2rem', textDecoration: 'none' }}
          >
            <ExternalLink size={16} />
            <span>View PDF Online</span>
          </a>
        </div>
      </div>

      {/* Academic Meta Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Institution</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem' }}>Ahmedabad Institute of Technology</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Computer Engineering Department</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Subject Code</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem' }}>BE05000231</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Python for Data Science (Semester 5)</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Primary Dataset</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem' }}>FoodHub Order Records</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>1,898 Records | Kaggle Public Dataset</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Artifacts Generated</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem' }}>8 EDA Plots + 4 Eval Plots</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Random Forest & Logistic Regression</div>
        </div>
      </div>

      {/* Chapter Breakdown */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="var(--primary)" />
          <span>Documentation Chapter Walkthrough</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {chapters.map((ch) => (
            <div 
              key={ch.num} 
              style={{ 
                padding: '1.25rem', 
                background: 'rgba(255, 255, 255, 0.02)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-card)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
                <span style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 800, 
                  color: 'var(--primary)',
                  fontSize: '1rem'
                }}>
                  Ch {ch.num}
                </span>
                <h4 style={{ fontSize: '1rem' }}>{ch.title}</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {ch.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Conclusion Text View */}
      <div className="glass-panel" style={{ 
        background: 'rgba(13, 19, 34, 0.85)', 
        borderLeft: '4px solid var(--emerald)',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <CheckCircle2 size={22} color="var(--emerald)" />
          <h3 style={{ fontSize: '1.2rem' }}>
            Official Project Conclusion (from results/conclusion.txt)
          </h3>
        </div>

        <div style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.82rem', 
          lineHeight: 1.7, 
          color: '#cbd5e1', 
          background: 'rgba(0, 0, 0, 0.4)', 
          padding: '1.25rem', 
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          whiteSpace: 'pre-wrap'
        }}>
{`KEY PROJECT FINDINGS:
1. A large share of orders (about 39%) are never rated by the customer at all, which itself is a useful signal for engagement analysis.
2. Weekend orders substantially outnumber weekday orders (71% vs 29%), and American and Italian cuisines dominate order volume.
3. Order value varies meaningfully across cuisines, with some cuisines commanding a consistently higher average order value than others.
4. Order value and restaurant popularity were the strongest (though still modest) predictors among available features when attempting to classify whether an order receives a high rating.

BEST MODEL & BENCHMARK:
Random Forest achieved an F1 score of 0.472 and an accuracy of 0.476 for classifying whether an order receives a high rating (4 or 5 stars), but did NOT outperform the majority-class baseline of 0.513. This is itself a meaningful finding: whether a customer rates an order highly is not well explained by order value, cuisine, restaurant popularity, or timing alone -- satisfaction likely depends on factors this dataset does not capture (e.g., food quality, order accuracy, prior experience with the restaurant).

BUSINESS RECOMMENDATION:
Since rating behavior is difficult to predict from order-level attributes alone, platforms should focus on directly encouraging rating submission (since 39% of orders go unrated) rather than trying to infer satisfaction indirectly from order value or cuisine.`}
        </div>
      </div>
    </div>
  );
};

export default DocumentationTab;
