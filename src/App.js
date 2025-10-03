import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Shield, Users, DollarSign, Zap, Filter, Download, BarChart3, TrendingDown } from 'lucide-react';

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  banner: {
    background: 'rgba(34, 197, 94, 0.2)',
    border: '1px solid rgba(34, 197, 94, 0.5)',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    marginBottom: '24px',
    color: '#86efac',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '8px',
    flexWrap: 'wrap'
  },
  subtitle: {
    color: '#e9d5ff',
    fontSize: '18px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    color: '#e9d5ff',
    fontSize: '13px',
    marginBottom: '4px'
  },
  statValue: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  section: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  gemsSection: {
    background: 'linear-gradient(90deg, rgba(120, 53, 15, 0.4), rgba(146, 64, 14, 0.4))',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid rgba(234, 179, 8, 0.3)',
    marginBottom: '24px'
  },
  gemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  gemCard: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(234, 179, 8, 0.5)',
    transition: 'all 0.3s',
    cursor: 'pointer',
    height: 'auto',
    minHeight: '200px'
  },
  playerCard: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s',
    cursor: 'pointer',
    height: 'auto'
  },
  playersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    maxHeight: '800px',
    overflowY: 'auto',
    paddingRight: '8px'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  input: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  label: {
    color: '#e9d5ff',
    fontSize: '14px',
    marginBottom: '8px',
    display: 'block'
  },
  valueScore: {
    background: 'linear-gradient(90deg, #9333ea, #3b82f6)',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    marginBottom: '12px'
  },
  button: {
    background: 'linear-gradient(90deg, #9333ea, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    color: '#e9d5ff',
    fontSize: '13px',
    lineHeight: '1.6'
  },
  securityLog: {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    marginBottom: '24px',
    fontFamily: 'monospace',
    fontSize: '11px'
  },
  logEntry: {
    marginBottom: '4px'
  },
  loader: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  spinner: {
    border: '4px solid rgba(167, 139, 250, 0.3)',
    borderTop: '4px solid #a78bfa',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  badge: {
    background: 'rgba(234, 179, 8, 0.3)',
    color: '#fbbf24',
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginTop: '4px'
  },
  trendingBadge: {
    background: 'rgba(34, 197, 94, 0.3)',
    color: '#4ade80',
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px'
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .gem-card:hover {
    transform: scale(1.05);
    border-color: #fbbf24 !important;
  }
  .player-card:hover {
    transform: scale(1.02);
    border-color: #a78bfa !important;
  }
  .export-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
  }
`;
document.head.appendChild(styleSheet);

export default function FPLDashboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(15);
  const [minPrice, setMinPrice] = useState(4);
  const [sortBy, setSortBy] = useState('value');
  const [securityLog, setSecurityLog] = useState([]);
  const [fixtureData, setFixtureData] = useState({});

  const addSecurityLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setSecurityLog(prev => [{timestamp, message, type}, ...prev.slice(0, 4)]);
  };

  const calculateMomentumScore = (player) => {
    const form = player.form || 0;
    const pointsPerGame = player.points_per_game || 0;
    
    if (form > pointsPerGame * 1.3) {
      return 'hot';
    } else if (form < pointsPerGame * 0.7) {
      return 'cold';
    }
    return 'stable';
  };

  const calculateValueScore = (player) => {
    const price = player.price;
    if (price === 0) return 0;
    
    const totalPoints = player.total_points;
    const form = player.form;
    const pointsPerGame = player.points_per_game;
    const selectedBy = player.selected_by;
    
    const pointsPerMillion = totalPoints / price;
    const ownershipFactor = Math.max(0, (50 - selectedBy) / 50);
    
    const momentum = calculateMomentumScore(player);
    let momentumBonus = 0;
    if (momentum === 'hot') momentumBonus = 3;
    else if (momentum === 'cold') momentumBonus = -2;
    
    const baseScore = (
      pointsPerMillion * 0.35 +
      form * 3 * 0.35 +
      pointsPerGame * 2 * 0.15 +
      ownershipFactor * 10 * 0.15
    );
    
    const finalScore = baseScore + momentumBonus;
    return parseFloat(Math.max(0, finalScore).toFixed(2));
  };

  const fetchRealData = async () => {
    addSecurityLog('🔗 Connecting to Official FPL API...', 'info');
    const startTime = Date.now();
    try {
      addSecurityLog('Bypassing CORS with proxy...', 'info');
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const apiUrl = 'https://fantasy.premierleague.com/api/bootstrap-static/';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(corsProxy + encodeURIComponent(apiUrl), {signal: controller.signal});
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      addSecurityLog(`✓ Response received in ${responseTime}ms`, 'success');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      addSecurityLog('📊 Parsing player data...', 'info');
      const data = await response.json();
      if (!data.elements || !data.teams) throw new Error('Invalid data structure');
      
      const teamsMap = {};
      const teamDifficulty = {};
      data.teams.forEach(team => {
        teamsMap[team.id] = team.name;
        teamDifficulty[team.id] = team.strength || 3;
      });
      
      const positions = {1: 'GKP', 2: 'DEF', 3: 'MID', 4: 'FWD'};
      const realPlayers = data.elements.filter(p => p.minutes >= 200).map(player => {
        const playerData = {
          id: player.id,
          name: player.web_name,
          full_name: player.first_name + ' ' + player.second_name,
          team: teamsMap[player.team],
          position: positions[player.element_type],
          price: player.now_cost / 10,
          total_points: player.total_points,
          form: parseFloat(player.form) || 0,
          points_per_game: parseFloat(player.points_per_game) || 0,
          selected_by: parseFloat(player.selected_by_percent),
          minutes: player.minutes,
          goals: player.goals_scored,
          assists: player.assists,
          clean_sheets: player.clean_sheets,
          bonus: player.bonus || 0,
          bps: player.bps || 0,
          influence: parseFloat(player.influence) || 0,
          creativity: parseFloat(player.creativity) || 0,
          threat: parseFloat(player.threat) || 0,
          ict_index: parseFloat(player.ict_index) || 0,
          expected_goals: parseFloat(player.expected_goals) || 0,
          expected_assists: parseFloat(player.expected_assists) || 0,
          expected_goal_involvements: parseFloat(player.expected_goal_involvements) || 0,
          valueScore: 0,
          momentum: 'stable'
        };
        playerData.momentum = calculateMomentumScore(playerData);
        playerData.valueScore = calculateValueScore(playerData);
        return playerData;
      });
      
      addSecurityLog(`✅ Loaded ${realPlayers.length} REAL players!`, 'success');
      setPlayers(realPlayers);
      setLoading(false);
    } catch (err) {
      addSecurityLog(`⚠ API Error: ${err.message}`, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    addSecurityLog('Initializing FPL Analyzer (LIVE MODE)', 'info');
    fetchRealData();
  }, []);

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
    const matchesPrice = p.price <= maxPrice && p.price >= minPrice;
    return matchesSearch && matchesPosition && matchesPrice;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'value': return b.valueScore - a.valueScore;
      case 'points': return b.total_points - a.total_points;
      case 'form': return b.form - a.form;
      case 'price': return a.price - b.price;
      case 'xG': return b.expected_goals - a.expected_goals;
      case 'xA': return b.expected_assists - a.expected_assists;
      default: return 0;
    }
  });

  const underratedGems = players.filter(p => p.selected_by < 10).sort((a, b) => b.valueScore - a.valueScore).slice(0, 5);
  const hotPlayers = players.filter(p => p.momentum === 'hot').sort((a, b) => b.valueScore - a.valueScore).slice(0, 5);
  
  const stats = {
    totalPlayers: filteredPlayers.length,
    avgPrice: filteredPlayers.length > 0 ? (filteredPlayers.reduce((sum, p) => sum + p.price, 0) / filteredPlayers.length).toFixed(1) : '0.0',
    avgValue: filteredPlayers.length > 0 ? (filteredPlayers.reduce((sum, p) => sum + p.valueScore, 0) / filteredPlayers.length).toFixed(2) : '0.00',
    topValue: filteredPlayers[0]?.valueScore || 0,
    hotPlayers: players.filter(p => p.momentum === 'hot').length,
    coldPlayers: players.filter(p => p.momentum === 'cold').length
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Team', 'Position', 'Price', 'Total Points', 'Form', 'Value Score', 'Momentum', 'xG', 'xA', 'Ownership %'];
    const rows = filteredPlayers.map(p => [
      p.name, p.team, p.position, p.price, p.total_points, p.form, p.valueScore, p.momentum, 
      p.expected_goals.toFixed(2), p.expected_assists.toFixed(2), p.selected_by
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fpl_analysis.csv';
    a.click();
    addSecurityLog('✓ Exported data to CSV', 'success');
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner}></div>
        <p style={{color: 'white', fontSize: '20px'}}>Loading Real FPL Data...</p>
        <p style={{color: '#e9d5ff', fontSize: '14px', marginTop: '8px'}}>Connecting to Official API...</p>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.banner}>
          <Zap size={20} />
          <span style={{fontWeight: 'bold'}}>LIVE MODE</span>
          <span style={{color: '#bbf7d0'}}>Connected to Official FPL API</span>
        </div>
        <div style={styles.header}>
          <div style={styles.title}>
            <Zap size={48} color="#facc15" />
            <span>FPL Value Analyzer</span>
          </div>
          <p style={styles.subtitle}>Find Underrated Gems with AI-Powered Analytics</p>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', color: '#e9d5ff', fontSize: '14px', flexWrap: 'wrap'}}>
            <Shield size={16} />
            <span>Secure API • Real-time Data • Advanced Metrics • xG & xA</span>
          </div>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Players Found</div>
              <div style={styles.statValue}>{stats.totalPlayers}</div>
            </div>
            <Users size={28} color="#c084fc" />
          </div>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Avg Price</div>
              <div style={styles.statValue}>£{stats.avgPrice}m</div>
            </div>
            <DollarSign size={28} color="#4ade80" />
          </div>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Avg Value</div>
              <div style={styles.statValue}>{stats.avgValue}</div>
            </div>
            <TrendingUp size={28} color="#60a5fa" />
          </div>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Top Value</div>
              <div style={styles.statValue}>{stats.topValue}</div>
            </div>
            <Zap size={28} color="#facc15" />
          </div>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Hot Streak</div>
              <div style={styles.statValue}>{stats.hotPlayers}</div>
            </div>
            <TrendingUp size={28} color="#f87171" />
          </div>
        </div>
        <div style={styles.securityLog}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            <Shield size={20} color="#4ade80" />
            <h3 style={{color: 'white', fontWeight: 'bold', margin: 0}}>Security Monitor</h3>
          </div>
          {securityLog.map((log, i) => (
            <div key={i} style={{...styles.logEntry, color: log.type === 'error' ? '#f87171' : log.type === 'success' ? '#4ade80' : '#60a5fa'}}>
              [{log.timestamp}] {log.message}
            </div>
          ))}
        </div>
        
        <div style={{...styles.gemsSection, background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.3), rgba(239, 68, 68, 0.3))'}}>
          <h2 style={styles.sectionTitle}>
            🔥 Hot Streak Players
            <span style={{fontSize: '14px', fontWeight: 'normal', color: '#fef08a'}}>(Form &gt; Season Average)</span>
          </h2>
          <div style={styles.gemsGrid}>
            {hotPlayers.map(player => (
              <div key={player.id} style={{...styles.gemCard, borderColor: 'rgba(239, 68, 68, 0.5)'}} className="gem-card">
                <div style={{color: '#fbbf24', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px'}}>{player.name}</div>
                <div style={{color: 'white', fontSize: '13px', marginBottom: '8px'}}>{player.team}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <span style={{color: '#e9d5ff', fontSize: '11px'}}>{player.position}</span>
                  <span style={{color: '#4ade80', fontWeight: 'bold', fontSize: '13px'}}>£{player.price}m</span>
                </div>
                <div style={{background: 'rgba(239, 68, 68, 0.2)', borderRadius: '4px', padding: '8px', textAlign: 'center', marginBottom: '8px'}}>
                  <div style={{color: '#fde047', fontSize: '11px'}}>Value Score</div>
                  <div style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>{player.valueScore}</div>
                </div>
                <div style={styles.trendingBadge}>
                  <TrendingUp size={12} />
                  <span>Form: {player.form} (↑)</span>
                </div>
                <div style={{marginTop: '8px', fontSize: '11px', color: '#d1d5db'}}>
                  {player.total_points} pts • {player.selected_by}% owned
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.gemsSection}>
          <h2 style={styles.sectionTitle}>
            💎 Top Underrated Gems
            <span style={{fontSize: '14px', fontWeight: 'normal', color: '#fef08a'}}>(Owned by &lt;10%)</span>
          </h2>
          <div style={styles.gemsGrid}>
            {underratedGems.map(player => (
              <div key={player.id} style={styles.gemCard} className="gem-card">
                <div style={{color: '#fbbf24', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px'}}>{player.name}</div>
                <div style={{color: 'white', fontSize: '13px', marginBottom: '8px'}}>{player.team}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <span style={{color: '#e9d5ff', fontSize: '11px'}}>{player.position}</span>
                  <span style={{color: '#4ade80', fontWeight: 'bold', fontSize: '13px'}}>£{player.price}m</span>
                </div>
                <div style={{background: 'rgba(234, 179, 8, 0.2)', borderRadius: '4px', padding: '8px', textAlign: 'center', marginBottom: '8px'}}>
                  <div style={{color: '#fde047', fontSize: '11px'}}>Value Score</div>
                  <div style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>{player.valueScore}</div>
                </div>
                {player.momentum === 'hot' && (
                  <div style={styles.trendingBadge}>
                    <TrendingUp size={12} />
                    <span>On Fire!</span>
                  </div>
                )}
                <div style={{marginTop: '8px', fontSize: '11px', color: '#d1d5db'}}>
                  xG: {player.expected_goals.toFixed(1)} • xA: {player.expected_assists.toFixed(1)}
                </div>
                <div style={{fontSize: '11px', color: '#d1d5db'}}>
                  {player.total_points} pts • {player.selected_by}% owned
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.section}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Filter size={20} color="#c084fc" />
              <h3 style={{color: 'white', fontWeight: 'bold', margin: 0, fontSize: '18px'}}>Filters & Search</h3>
            </div>
            <button onClick={exportToCSV} style={styles.button} className="export-btn">
              <Download size={16} />
              Export to CSV
            </button>
          </div>
          <div style={styles.filterGrid}>
            <div>
              <label style={styles.label}>Search Player/Team</label>
              <div style={{position: 'relative'}}>
                <Search size={16} style={{position: 'absolute', left: '12px', top: '12px', color: '#9ca3af', pointerEvents: 'none'}} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{...styles.input, paddingLeft: '36px'}} />
              </div>
            </div>
            <div>
              <label style={styles.label}>Position</label>
              <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} style={styles.select}>
                <option value="ALL">All Positions</option>
                <option value="GKP">Goalkeeper</option>
                <option value="DEF">Defender</option>
                <option value="MID">Midfielder</option>
                <option value="FWD">Forward</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Price Range: £{minPrice}m - £{maxPrice}m</label>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <input type="range" min="4" max="15" step="0.5" value={minPrice} onChange={(e) => setMinPrice(parseFloat(e.target.value))} style={{width: '100%'}} />
                <input type="range" min="4" max="15" step="0.5" value={maxPrice} onChange={(e) => setMaxPrice(parseFloat(e.target.value))} style={{width: '100%'}} />
              </div>
            </div>
            <div>
              <label style={styles.label}>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
                <option value="value">Value Score</option>
                <option value="points">Total Points</option>
                <option value="form">Form</option>
                <option value="price">Price (Low to High)</option>
                <option value="xG">Expected Goals (xG)</option>
                <option value="xA">Expected Assists (xA)</option>
              </select>
            </div>
          </div>
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Players ({filteredPlayers.length})</h2>
          <div style={styles.playersGrid}>
            {filteredPlayers.map(player => (
              <div key={player.id} style={styles.playerCard} className="player-card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <h3 style={{color: 'white', fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{player.name}</h3>
                    <p style={{color: '#e9d5ff', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{player.team}</p>
                  </div>
                  <span style={{background: '#9333ea', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', flexShrink: 0, marginLeft: '8px'}}>{player.position}</span>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px'}}>
                  <div style={{background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '8px', textAlign: 'center'}}>
                    <div style={{color: '#d1d5db', fontSize: '11px'}}>Price</div>
                    <div style={{color: '#4ade80', fontWeight: 'bold', fontSize: '14px'}}>£{player.price}m</div>
                  </div>
                  <div style={{background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '8px', textAlign: 'center'}}>
                    <div style={{color: '#d1d5db', fontSize: '11px'}}>Points</div>
                    <div style={{color: '#60a5fa', fontWeight: 'bold', fontSize: '14px'}}>{player.total_points}</div>
                  </div>
                  <div style={{background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '8px', textAlign: 'center'}}>
                    <div style={{color: '#d1d5db', fontSize: '11px'}}>Form</div>
                    <div style={{color: '#facc15', fontWeight: 'bold', fontSize: '14px'}}>{player.form}</div>
                  </div>
                </div>
                <div style={styles.valueScore}>
                  <div style={{color: 'white', fontSize: '11px'}}>VALUE SCORE</div>
                  <div style={{color: 'white', fontWeight: 'bold', fontSize: '24px'}}>{player.valueScore}</div>
                </div>
                {player.momentum === 'hot' && (
                  <div style={styles.trendingBadge}>
                    <TrendingUp size={12} />
                    <span>Hot Streak</span>
                  </div>
                )}
                {player.momentum === 'cold' && (
                  <div style={{...styles.trendingBadge, background: 'rgba(239, 68, 68, 0.3)', color: '#f87171'}}>
                    <TrendingDown size={12} />
                    <span>Cold Form</span>
                  </div>
                )}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', fontSize: '11px', color: '#d1d5db', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '4px', padding: '8px', marginTop: '8px'}}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#9ca3af'}}>⚽ Goals</div>
                    <div style={{fontWeight: 'bold'}}>{player.goals}</div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#9ca3af'}}>🎯 Assists</div>
                    <div style={{fontWeight: 'bold'}}>{player.assists}</div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#9ca3af'}}>🛡️ CS</div>
                    <div style={{fontWeight: 'bold'}}>{player.clean_sheets}</div>
                  </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px', color: '#d1d5db', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px', padding: '6px', marginTop: '4px'}}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#9ca3af'}}>xG</div>
                    <div style={{fontWeight: 'bold', color: '#fbbf24'}}>{player.expected_goals.toFixed(1)}</div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{color: '#9ca3af'}}>xA</div>
                    <div style={{fontWeight: 'bold', color: '#fbbf24'}}>{player.expected_assists.toFixed(1)}</div>
                  </div>
                </div>
                <div style={{fontSize: '11px', color: '#9ca3af', display: 'flex', justifyContent: 'space-between', marginTop: '8px'}}>
                  <span>{player.selected_by}% owned</span>
                  <span>{player.minutes} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.footer}>
          <p>Built with React • Powered by Official FPL API • Informatics Project</p>
        </div>
      </div>
    </div>
  );
}