import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Store, 
  Calendar, 
  DollarSign,
  RefreshCw,
  UtensilsCrossed,
  Receipt
} from 'lucide-react';

const ExplorerTab = ({ apiUrl = 'http://localhost:8000/api' }) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [dayType, setDayType] = useState('All');
  const [rating, setRating] = useState('All');

  const cuisineEmojis = {
    'American': '🍔',
    'Japanese': '🍣',
    'Italian': '🍕',
    'Chinese': '🥡',
    'Mexican': '🌮',
    'Indian': '🍛',
    'Middle Eastern': '🥙',
    'Mediterranean': '🥗',
    'French': '🥐',
    'Southern': '🍗',
    'Korean': '🍲',
    'Spanish': '🥘',
    'Thai': '🍜',
    'Vietnamese': '🥣'
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        cuisine: cuisine !== 'All' ? cuisine : undefined,
        day_type: dayType !== 'All' ? dayType : undefined,
        rating: rating !== 'All' ? rating : undefined,
        search: search.trim() ? search.trim() : undefined
      };

      const res = await axios.get(`${apiUrl}/orders`, { params });
      setOrders(res.data.orders);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error("Error fetching orders:", err);
      // Fallback mock sample if backend not reachable
      const fallbackSample = [
        { order_id: 1477147, customer_id: 337525, restaurant_name: "Hangawi", cuisine_type: "Korean", cost_of_the_order: 30.75, day_of_the_week: "Weekend", rating: "Not given" },
        { order_id: 1477685, customer_id: 358141, restaurant_name: "Blue Ribbon Sushi", cuisine_type: "Japanese", cost_of_the_order: 12.08, day_of_the_week: "Weekend", rating: "5" },
        { order_id: 1477070, customer_id: 66393, restaurant_name: "Cafe Habana", cuisine_type: "Mexican", cost_of_the_order: 12.23, day_of_the_week: "Weekday", rating: "5" },
        { order_id: 1477334, customer_id: 106968, restaurant_name: "Blue Ribbon Fried Chicken", cuisine_type: "American", cost_of_the_order: 24.20, day_of_the_week: "Weekend", rating: "5" },
        { order_id: 1477245, customer_id: 79649, restaurant_name: "Dirty Bird To Go", cuisine_type: "American", cost_of_the_order: 11.59, day_of_the_week: "Weekday", rating: "4" },
        { order_id: 1477224, customer_id: 147468, restaurant_name: "Tandoori Oven", cuisine_type: "Indian", cost_of_the_order: 25.22, day_of_the_week: "Weekday", rating: "4" },
        { order_id: 1477819, customer_id: 152965, restaurant_name: "Shake Shack", cuisine_type: "American", cost_of_the_order: 15.28, day_of_the_week: "Weekend", rating: "5" },
        { order_id: 1477784, customer_id: 85509, restaurant_name: "The Meatball Shop", cuisine_type: "Italian", cost_of_the_order: 22.89, day_of_the_week: "Weekend", rating: "4" },
        { order_id: 1477880, customer_id: 56554, restaurant_name: "Nobu Next Door", cuisine_type: "Japanese", cost_of_the_order: 21.05, day_of_the_week: "Weekend", rating: "Not given" },
        { order_id: 1476943, customer_id: 289899, restaurant_name: "Parm", cuisine_type: "Italian", cost_of_the_order: 16.05, day_of_the_week: "Weekday", rating: "3" },
      ];
      setOrders(fallbackSample);
      setTotal(fallbackSample.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, cuisine, dayType, rating]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="status-pill" style={{ fontSize: '0.72rem', background: 'rgba(249, 115, 22, 0.15)', color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}>
              🍽️ FoodHub Order Ledger
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              1,898 Real-World Dining Records
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Order Menu & Dining History Explorer</span>
            <Receipt size={22} color="#f97316" />
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Browse individual dining tickets, filter by culinary dish style, dining day, and customer rating.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="status-pill" style={{ fontSize: '0.82rem', background: 'rgba(249, 115, 22, 0.15)', color: '#fed7aa', borderColor: 'rgba(249, 115, 22, 0.3)' }}>
            <strong>{total.toLocaleString()}</strong> Matching Meals
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
            <label className="form-label">Search Restaurant / Meal ID</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Shake Shack, Sushi, Parm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }} />
            </div>
          </form>

          {/* Cuisine Filter */}
          <div>
            <label className="form-label">Culinary Style</label>
            <select 
              className="form-control"
              value={cuisine}
              onChange={(e) => { setCuisine(e.target.value); setPage(1); }}
            >
              <option value="All">All Cuisines (14 Styles)</option>
              <option value="American">🍔 American</option>
              <option value="Japanese">🍣 Japanese</option>
              <option value="Italian">🍕 Italian</option>
              <option value="Chinese">🥡 Chinese</option>
              <option value="Mexican">🌮 Mexican</option>
              <option value="Indian">🍛 Indian</option>
              <option value="Middle Eastern">🥙 Middle Eastern</option>
              <option value="Mediterranean">🥗 Mediterranean</option>
              <option value="French">🥐 French</option>
              <option value="Southern">🍗 Southern</option>
              <option value="Korean">🍲 Korean</option>
              <option value="Spanish">🥘 Spanish</option>
              <option value="Thai">🍜 Thai</option>
              <option value="Vietnamese">🥣 Vietnamese</option>
            </select>
          </div>

          {/* Day Type Filter */}
          <div>
            <label className="form-label">Dining Schedule</label>
            <select 
              className="form-control"
              value={dayType}
              onChange={(e) => { setDayType(e.target.value); setPage(1); }}
            >
              <option value="All">All Days</option>
              <option value="Weekend">🎉 Weekend Feasts (71%)</option>
              <option value="Weekday">💼 Weekday Dinners (29%)</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="form-label">Customer Rating</label>
            <select 
              className="form-control"
              value={rating}
              onChange={(e) => { setRating(e.target.value); setPage(1); }}
            >
              <option value="All">All Ratings</option>
              <option value="5">⭐️⭐️⭐️⭐️⭐️ (5 Stars)</option>
              <option value="4">⭐️⭐️⭐️⭐️ (4 Stars)</option>
              <option value="3">⭐️⭐️⭐️ (3 Stars)</option>
              <option value="Not given">Silent Diner (Unrated)</option>
            </select>
          </div>

          {/* Apply / Refresh */}
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={fetchOrders}
            style={{ height: '42px', justifyContent: 'center' }}
          >
            <RefreshCw size={15} className={loading ? 'status-dot' : ''} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Orders Grid / Table */}
      <div className="glass-panel" style={{ padding: '0.5rem' }}>
        <div className="custom-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Restaurant / Kitchen</th>
                <th>Cuisine</th>
                <th>Meal Spend</th>
                <th>Schedule</th>
                <th>Customer Rating</th>
                <th>Delight Class</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Fetching dining orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No meals match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const isHigh = ord.rating === '4' || ord.rating === '5';
                  const isUnrated = ord.rating === 'Not given';
                  const emoji = cuisineEmojis[ord.cuisine_type] || '🍽️';

                  return (
                    <tr key={ord.order_id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        #{ord.order_id}
                      </td>
                      <td style={{ fontWeight: 600, color: '#fef7ee' }}>
                        {ord.restaurant_name}
                      </td>
                      <td>
                        <span className="cuisine-pill">
                          <span>{emoji}</span>
                          <span>{ord.cuisine_type}</span>
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fbbf24', fontSize: '0.92rem' }}>
                        ${ord.cost_of_the_order.toFixed(2)}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: ord.day_of_the_week === 'Weekend' ? '#fdba74' : '#d4bda8' }}>
                          {ord.day_of_the_week === 'Weekend' ? '🎉 Weekend' : '💼 Weekday'}
                        </span>
                      </td>
                      <td>
                        {isUnrated ? (
                          <span style={{ color: 'var(--text-sub)', fontStyle: 'italic', fontSize: '0.78rem' }}>
                            Unrated (Not given)
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontWeight: 700 }}>
                            <Star size={13} fill="#fbbf24" color="#fbbf24" />
                            <span>{ord.rating} / 5</span>
                          </span>
                        )}
                      </td>
                      <td>
                        {isUnrated ? (
                          <span className="status-pill" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', color: 'var(--text-sub)', borderColor: 'rgba(255,200,150,0.1)' }}>
                            No Feedback
                          </span>
                        ) : isHigh ? (
                          <span className="status-pill text-emerald" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                            High Delight (4-5 ⭐️)
                          </span>
                        ) : (
                          <span className="status-pill text-rose" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                            Moderate (&lt;4 ⭐️)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing page <strong>{page}</strong> of <strong>{totalPages || 1}</strong> ({total.toLocaleString()} total entries)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn-secondary" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              style={{ padding: '0.4rem 0.75rem' }}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              style={{ padding: '0.4rem 0.75rem' }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorerTab;
