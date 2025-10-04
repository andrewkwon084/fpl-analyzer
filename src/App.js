import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Shield, Users, DollarSign, Zap, Filter, Download, TrendingDown, Moon, Sun, Star, X, Target, ArrowUpRight, ArrowDownRight, Minus, RefreshCw, Award } from 'lucide-react';

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'all 0.3s'
  },
  appDark: {
    minHeight: '100vh',
    background: '#111827',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'all 0.3s'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
    position: 'relative'
  },
  darkModeToggle: {
    position: 'absolute',
    top: '0',
    right: '0',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s'
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
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
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
  playersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    maxHeight: '800px',
    overflowY: 'auto',
    paddingRight: '8px'
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
  valueScore: {
    background: 'linear-gradient(90deg, #9333ea, #3b82f6)',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    marginBottom: '12px'
  },
  compareTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px'
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  const [teams, setTeams] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState([]);
  const [teamFilter, setTeamFilter] = useState([]);
  const [maxPrice, setMaxPrice] = useState(15);
  const [minPrice, setMinPrice] = useState(4);
  const [sortBy, setSortBy] = useState('value');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePlayers, setComparePlayers] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [autoTeam, setAutoTeam] = useState(null);
  const [showAutoTeam, setShowAutoTeam] = useState(false);

  const positions = { 1: 'GKP', 2: 'DEF', 3: 'MID', 4: 'FWD' };
  const allPositions = ['GKP', 'DEF', 'MID', 'FWD'];

  useEffect(() => {
    const saved = localStorage.getItem('fpl-watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
    const savedDarkMode = localStorage.getItem('fpl-darkmode');
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('fpl-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('fpl-darkmode', darkMode);
  }, [darkMode]);

  const toggleWatchlist = (playerId) => {
    setWatchlist(prev => 
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  const togglePosition = (pos) => {
    setPositionFilter(prev =>
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    );
  };

  const toggleTeam = (teamId) => {
    setTeamFilter(prev =>
      prev.includes(teamId) ? prev.filter(t => t !== teamId) : [...prev, teamId]
    );
  };

  const calculateFixtureDifficulty = (player, nextGames = 5) => {
    if (!fixtures.length) return 3;
    
    const teamFixtures = fixtures.filter(f => 
      (f.team_h === player.team && !f.finished) || 
      (f.team_a === player.team && !f.finished)
    ).slice(0, nextGames);

    if (!teamFixtures.length) return 3;

    const difficulties = teamFixtures.map(f => {
      const isHome = f.team_h === player.team;
      return isHome ? f.team_h_difficulty : f.team_a_difficulty;
    });

    return difficulties.reduce((a, b) => a + b, 0) / difficulties.length;
  };

  const getNextFixtures = (player, count = 3) => {
    if (!fixtures.length) return [];
    
    return fixtures
      .filter(f => 
        ((f.team_h === player.team || f.team_a === player.team) && !f.finished)
      )
      .slice(0, count)
      .map(f => {
        const isHome = f.team_h === player.team;
        const opponent = isHome ? teams[f.team_a] : teams[f.team_h];
        const difficulty = isHome ? f.team_h_difficulty : f.team_a_difficulty;
        return {
          opponent: opponent?.short_name || '???',
          isHome,
          difficulty
        };
      });
  };

  const calculateValueScore = (player) => {
    const price = player.price;
    if (price === 0) return 0;

    const totalPoints = player.total_points;
    const form = parseFloat(player.form) || 0;
    const pointsPerGame = parseFloat(player.points_per_game) || 0;
    const selectedBy = parseFloat(player.selected_by);

    const pointsPerMillion = totalPoints / price;
    const ownershipFactor = Math.max(0, (50 - selectedBy) / 50);
    const fixtureDifficulty = calculateFixtureDifficulty(player);
    const fixtureFactor = (6 - fixtureDifficulty) / 5;

    let valueScore = (
      pointsPerMillion * 0.35 +
      form * 3 * 0.25 +
      pointsPerGame * 2 * 0.15 +
      ownershipFactor * 10 * 0.1 +
      fixtureFactor * 10 * 0.15
    );

    if (form > pointsPerGame * 1.3 && pointsPerGame > 3) valueScore += 3;
    if (form < pointsPerGame * 0.7 && pointsPerGame > 2) valueScore -= 2;
    if (parseFloat(player.cost_change_start) > 0) valueScore += 1;

    return parseFloat(valueScore.toFixed(2));
  };

  const buildOptimalTeam = () => {
    const budget = 100;
    const byPosition = {
      GKP: players.filter(p => p.position === 'GKP').sort((a, b) => b.valueScore - a.valueScore),
      DEF: players.filter(p => p.position === 'DEF').sort((a, b) => b.valueScore - a.valueScore),
      MID: players.filter(p => p.position === 'MID').sort((a, b) => b.valueScore - a.valueScore),
      FWD: players.filter(p => p.position === 'FWD').sort((a, b) => b.valueScore - a.valueScore)
    };

    const team = {
      GKP: byPosition.GKP.slice(0, 2),
      DEF: byPosition.DEF.slice(0, 5),
      MID: byPosition.MID.slice(0, 5),
      FWD: byPosition.FWD.slice(0, 3)
    };

    const allPlayers = [...team.GKP, ...team.DEF, ...team.MID, ...team.FWD];
    const totalCost = allPlayers.reduce((sum, p) => sum + p.price, 0);
    const avgValue = allPlayers.reduce((sum, p) => sum + p.valueScore, 0) / allPlayers.length;

    const captain = allPlayers
      .filter(p => p.position !== 'GKP')
      .sort((a, b) => {
        const aFixDiff = calculateFixtureDifficulty(a, 1);
        const bFixDiff = calculateFixtureDifficulty(b, 1);
        return (b.form * (6 - bFixDiff)) - (a.form * (6 - aFixDiff));
      })[0];

    setAutoTeam({
      squad: team,
      totalCost: totalCost.toFixed(1),
      remaining: (budget - totalCost).toFixed(1),
      avgValue: avgValue.toFixed(2),
      captain: captain
    });
    setShowAutoTeam(true);
  };

  const getFormTrend = (player) => {
    const form = parseFloat(player.form);
    const ppg = parseFloat(player.points_per_game);
    if (form > ppg * 1.2) return <ArrowUpRight color="#4ade80" size={16} />;
    if (form < ppg * 0.8) return <ArrowDownRight color="#f87171" size={16} />;
    return <Minus color="#9ca3af" size={16} />;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return '#4ade80';
    if (difficulty === 3) return '#facc15';
    if (difficulty === 4) return '#fb923c';
    return '#f87171';
  };

  const addToCompare = (player) => {
    if (comparePlayers.length < 4 && !comparePlayers.find(p => p.id === player.id)) {
      setComparePlayers([...comparePlayers, player]);
    }
  };

  const removeFromCompare = (playerId) => {
    setComparePlayers(comparePlayers.filter(p => p.id !== playerId));
  };

  const uniqueTeams = Object.values(teams).sort((a, b) => a.name.localeCompare(b.name));
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response, data;
        
        try {
          response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
          if (!response.ok) throw new Error('Direct fetch failed');
          data = await response.json();
        } catch (directError) {
          response = await fetch('https://corsproxy.io/?https://fantasy.premierleague.com/api/bootstrap-static/');
          if (!response.ok) throw new Error('Failed to fetch FPL data');
          data = await response.json();
        }
        
        const teamsMap = {};
        data.teams.forEach(team => {
          teamsMap[team.id] = team;
        });
        setTeams(teamsMap);

        let fixturesData = [];
        try {
          const fixturesResponse = await fetch('https://fantasy.premierleague.com/api/fixtures/');
          if (fixturesResponse.ok) fixturesData = await fixturesResponse.json();
        } catch (e) {
          try {
            const fixturesResponse = await fetch('https://corsproxy.io/?https://fantasy.premierleague.com/api/fixtures/');
            if (fixturesResponse.ok) fixturesData = await fixturesResponse.json();
          } catch (err) {
            console.log('Could not fetch fixtures');
          }
        }
        
        setFixtures(fixturesData);

        const activePlayers = data.elements.filter(p => p.minutes >= 90).map(player => ({
          id: player.id,
          name: player.web_name,
          team: player.team,
          teamName: teamsMap[player.team]?.name || 'Unknown',
          teamShort: teamsMap[player.team]?.short_name || '???',
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
          expected_goals: parseFloat(player.expected_goals) || 0,
          expected_assists: parseFloat(player.expected_assists) || 0,
          cost_change_start: player.cost_change_start,
          code: player.code,
          status: player.status,
          chance_of_playing_next_round: player.chance_of_playing_next_round,
          bonus: player.bonus,
          yellow_cards: player.yellow_cards,
          red_cards: player.red_cards,
          ict_index: player.ict_index,
          first_name: player.first_name,
          second_name: player.second_name
        }));

        activePlayers.forEach(p => {
          p.valueScore = calculateValueScore(p);
        });

        setPlayers(activePlayers);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        player.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter.length === 0 || positionFilter.includes(player.position);
    const matchesTeam = teamFilter.length === 0 || teamFilter.includes(player.team);
    const matchesPrice = player.price >= minPrice && player.price <= maxPrice;
    const matchesAvailability = !availableOnly || (player.status === 'a' && (player.chance_of_playing_next_round === null || player.chance_of_playing_next_round === 100));

    return matchesSearch && matchesPosition && matchesTeam && matchesPrice && matchesAvailability;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch(sortBy) {
      case 'value': return b.valueScore - a.valueScore;
      case 'points': return b.total_points - a.total_points;
      case 'form': return b.form - a.form;
      case 'price': return a.price - b.price;
      case 'xG': return b.expected_goals - a.expected_goals;
      case 'xA': return b.expected_assists - a.expected_assists;
      case 'ownership': return a.selected_by - b.selected_by;
      default: return 0;
    }
  });

  const topPlayers = sortedPlayers.slice(0, 50);

  const exportToCSV = () => {
    const headers = ['Name', 'Team', 'Position', 'Price', 'Total Points', 'Form', 'Value Score', 'xG', 'xA', 'Ownership %'];
    const rows = sortedPlayers.map(p => [
      p.name, p.teamName, p.position, p.price, p.total_points, p.form, p.valueScore, 
      p.expected_goals.toFixed(2), p.expected_assists.toFixed(2), p.selected_by
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fpl_analysis.csv';
    a.click();
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <RefreshCw color="#a78bfa" size={48} style={{animation: 'spin 1s linear infinite', marginBottom: '16px'}} />
        <p style={{color: 'white', fontSize: '20px'}}>Loading FPL Data...</p>
      </div>
    );
  }
  return (
    <div style={darkMode ? styles.appDark : styles.app}>
      <div style={styles.container}>
        {/* Player Modal */}
        {selectedPlayer && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}} onClick={() => setSelectedPlayer(null)}>
            <div style={{background: darkMode ? '#1f2937' : 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '2px solid rgba(147, 51, 234, 0.5)'}} onClick={(e) => e.stopPropagation()}>
              <div style={{padding: '24px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
                  <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                    <img
                      src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${selectedPlayer.code}.png`}
                      alt={selectedPlayer.name}
                      style={{width: '80px', height: '96px', objectFit: 'contain'}}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div>
                      <h2 style={{color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0'}}>{selectedPlayer.name}</h2>
                      <p style={{color: '#e9d5ff', fontSize: '16px', margin: 0}}>{selectedPlayer.teamName} • {selectedPlayer.position}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPlayer(null)} style={{background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', fontSize: '24px', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer'}}>×</button>
                </div>
                
                <div style={{background: 'linear-gradient(90deg, #9333ea, #3b82f6)', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center'}}>
                  <div style={{color: 'white', fontSize: '14px', marginBottom: '8px'}}>VALUE SCORE</div>
                  <div style={{color: 'white', fontSize: '48px', fontWeight: 'bold'}}>{selectedPlayer.valueScore}</div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px'}}>
                  <div style={{background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px', textAlign: 'center'}}>
                    <div style={{color: '#9ca3af', fontSize: '12px', marginBottom: '4px'}}>Price</div>
                    <div style={{color: '#4ade80', fontSize: '24px', fontWeight: 'bold'}}>£{selectedPlayer.price}m</div>
                  </div>
                  <div style={{background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px', textAlign: 'center'}}>
                    <div style={{color: '#9ca3af', fontSize: '12px', marginBottom: '4px'}}>Points</div>
                    <div style={{color: '#60a5fa', fontSize: '24px', fontWeight: 'bold'}}>{selectedPlayer.total_points}</div>
                  </div>
                  <div style={{background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px', textAlign: 'center'}}>
                    <div style={{color: '#9ca3af', fontSize: '12px', marginBottom: '4px'}}>Form</div>
                    <div style={{color: '#facc15', fontSize: '24px', fontWeight: 'bold'}}>{selectedPlayer.form}</div>
                  </div>
                </div>

                {getNextFixtures(selectedPlayer, 5).length > 0 && (
                  <div style={{marginBottom: '20px'}}>
                    <h3 style={{color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px'}}>Upcoming Fixtures</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      {getNextFixtures(selectedPlayer, 5).map((fixture, idx) => (
                        <div key={idx} style={{background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <div style={{width: '48px', height: '48px', borderRadius: '50%', background: getDifficultyColor(fixture.difficulty), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>
                              {fixture.difficulty}
                            </div>
                            <div>
                              <div style={{color: 'white', fontWeight: '500'}}>{fixture.isHome ? 'vs' : 'at'} {fixture.opponent}</div>
                              <div style={{color: '#9ca3af', fontSize: '12px'}}>{fixture.isHome ? 'Home' : 'Away'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{display: 'flex', gap: '12px'}}>
                  <button
                    onClick={() => toggleWatchlist(selectedPlayer.id)}
                    style={{flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: watchlist.includes(selectedPlayer.id) ? '#facc15' : 'rgba(255, 255, 255, 0.1)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                  >
                    <Star size={18} fill={watchlist.includes(selectedPlayer.id) ? 'white' : 'none'} />
                    {watchlist.includes(selectedPlayer.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </button>
                  {compareMode && (
                    <button
                      onClick={() => {
                        if (comparePlayers.find(p => p.id === selectedPlayer.id)) {
                          removeFromCompare(selectedPlayer.id);
                        } else {
                          addToCompare(selectedPlayer);
                        }
                        setSelectedPlayer(null);
                      }}
                      style={{flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: comparePlayers.find(p => p.id === selectedPlayer.id) ? '#f87171' : '#9333ea', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                    >
                      <Target size={18} />
                      {comparePlayers.find(p => p.id === selectedPlayer.id) ? 'Remove' : 'Compare'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => setDarkMode(!darkMode)} style={styles.darkModeToggle}>
            {darkMode ? <Sun color="#facc15" size={24} /> : <Moon color="white" size={24} />}
          </button>
          <div style={styles.title}>
            <Zap size={48} color="#facc15" />
            <span>FPL Value Analyzer</span>
          </div>
          <p style={styles.subtitle}>Find hidden gems • Real-time data • Advanced analytics</p>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Players</div>
              <div style={styles.statValue}>{topPlayers.length}</div>
            </div>
            <Users size={28} color="#c084fc" />
          </div>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Top Value</div>
              <div style={styles.statValue}>{topPlayers.filter(p => p.valueScore >= 12).length}</div>
            </div>
            <TrendingUp size={28} color="#4ade80" />
          </div>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Differentials</div>
              <div style={styles.statValue}>{topPlayers.filter(p => p.selected_by < 5 && p.valueScore >= 10).length}</div>
            </div>
            <DollarSign size={28} color="#facc15" />
          </div>
          <div style={styles.statCard}>
            <div>
              <div style={styles.statLabel}>Watchlist</div>
              <div style={styles.statValue}>{watchlist.length}</div>
            </div>
            <Star size={28} color="#60a5fa" />
          </div>
        </div>

        {/* Auto Team Builder Section */}
        {showAutoTeam && autoTeam && (
          <div style={styles.section}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={styles.sectionTitle}>
                <Award size={24} color="#facc15" />
                Optimal Team Builder
              </h2>
              <button onClick={() => setShowAutoTeam(false)} style={{background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'}}>
                Close
              </button>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px'}}>
              <div style={{background: 'rgba(74, 222, 128, 0.2)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(74, 222, 128, 0.5)'}}>
                <div style={{color: '#9ca3af', fontSize: '12px'}}>Total Cost</div>
                <div style={{color: '#4ade80', fontSize: '28px', fontWeight: 'bold'}}>£{autoTeam.totalCost}m</div>
              </div>
              <div style={{background: 'rgba(96, 165, 250, 0.2)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(96, 165, 250, 0.5)'}}>
                <div style={{color: '#9ca3af', fontSize: '12px'}}>Remaining Budget</div>
                <div style={{color: '#60a5fa', fontSize: '28px', fontWeight: 'bold'}}>£{autoTeam.remaining}m</div>
              </div>
              <div style={{background: 'rgba(192, 132, 252, 0.2)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(192, 132, 252, 0.5)'}}>
                <div style={{color: '#9ca3af', fontSize: '12px'}}>Avg Value Score</div>
                <div style={{color: '#c084fc', fontSize: '28px', fontWeight: 'bold'}}>{autoTeam.avgValue}</div>
              </div>
              <div style={{background: 'rgba(251, 191, 36, 0.2)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(251, 191, 36, 0.5)'}}>
                <div style={{color: '#9ca3af', fontSize: '12px'}}>Recommended Captain</div>
                <div style={{color: '#fbbf24', fontSize: '18px', fontWeight: 'bold'}}>{autoTeam.captain?.name}</div>
              </div>
            </div>

            {Object.entries(autoTeam.squad).map(([pos, plist]) => (
              <div key={pos} style={{marginBottom: '20px'}}>
                <h3 style={{color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px'}}>{pos} ({plist.length})</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px'}}>
                  {plist.map(player => (
                    <div key={player.id} style={{background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', padding: '12px', border: player.id === autoTeam.captain?.id ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.2)'}}>
                      {player.id === autoTeam.captain?.id && (
                        <div style={{background: '#fbbf24', color: '#1e1b4b', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', display: 'inline-block'}}>
                          CAPTAIN
                        </div>
                      )}
                      <div style={{color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>{player.name}</div>
                      <div style={{color: '#9ca3af', fontSize: '12px', marginBottom: '8px'}}>{player.teamShort}</div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
                        <span style={{color: '#4ade80'}}>£{player.price}m</span>
                        <span style={{color: '#c084fc'}}>Value: {player.valueScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compare Panel with Better Table */}
        {comparePlayers.length > 0 && (
          <div style={{...styles.section, marginBottom: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <h3 style={{color: 'white', fontWeight: 'bold', margin: 0}}>Player Comparison ({comparePlayers.length}/4)</h3>
              <button onClick={() => setComparePlayers([])} style={{background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'}}>
                Clear All
              </button>
            </div>
            
            <div style={{overflowX: 'auto'}}>
              <table style={styles.compareTable}>
                <thead>
                  <tr style={{borderBottom: '2px solid rgba(255, 255, 255, 0.2)'}}>
                    <th style={{padding: '12px', textAlign: 'left', color: '#e9d5ff', fontSize: '14px'}}>Stat</th>
                    {comparePlayers.map(p => (
                      <th key={p.id} style={{padding: '12px', textAlign: 'center', color: 'white', fontSize: '14px'}}>
                        <div>{p.name}</div>
                        <div style={{fontSize: '12px', color: '#9ca3af', fontWeight: 'normal'}}>{p.teamShort}</div>
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          style={{marginTop: '8px', background: '#f87171', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px'}}
                        >
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Value Score</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: '#c084fc', fontWeight: 'bold', fontSize: '18px'}}>{p.valueScore}</td>
                    ))}
                  </tr>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Price</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: '#4ade80', fontWeight: 'bold'}}>£{p.price}m</td>
                    ))}
                  </tr>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Total Points</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold'}}>{p.total_points}</td>
                    ))}
                  </tr>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Form</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: '#facc15', fontWeight: 'bold'}}>{p.form}</td>
                    ))}
                  </tr>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Points Per Game</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: 'white'}}>{p.points_per_game}</td>
                    ))}
                  </tr>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Goals</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: 'white'}}>{p.goals}</td>
                    ))}
                  </tr>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Assists</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: 'white'}}>{p.assists}</td>
                    ))}
                  </tr>
                  <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <td style={{padding: '12px', color: '#e9d5ff'}}>Ownership</td>
                    {comparePlayers.map(p => (
                      <td key={p.id} style={{padding: '12px', textAlign: 'center', color: 'white'}}>{p.selected_by}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Filters Section */}
        <div style={styles.section}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{...styles.button, padding: '10px 16px'}}
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={() => setCompareMode(!compareMode)}
                style={{...styles.button, padding: '10px 16px', background: compareMode ? '#f87171' : 'linear-gradient(90deg, #9333ea, #3b82f6)'}}
              >
                <Target size={18} />
                {compareMode ? 'Exit Compare' : 'Compare Mode'}
              </button>
              <button
                onClick={buildOptimalTeam}
                style={{...styles.button, padding: '10px 16px', background: 'linear-gradient(90deg, #facc15, #fb923c)'}}
              >
                <Users size={18} />
                Build Best Team
              </button>
            </div>
            <button onClick={exportToCSV} style={styles.button} className="export-btn">
              <Download size={16} />
              Export CSV
            </button>
          </div>

          {showFilters && (
            <>
              <div style={styles.filterGrid}>
                <div>
                  <label style={styles.label}>Search</label>
                  <div style={{position: 'relative'}}>
                    <Search size={16} style={{position: 'absolute', left: '12px', top: '12px', color: '#9ca3af', pointerEvents: 'none'}} />
                    <input type="text" placeholder="Player or team..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{...styles.input, paddingLeft: '36px'}} />
                  </div>
                </div>
                
                <div>
                  <label style={styles.label}>Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
                    <option value="value">Value Score</option>
                    <option value="points">Total Points</option>
                    <option value="form">Form</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="ownership">Ownership (Low to High)</option>
                    <option value="xG">Expected Goals</option>
                    <option value="xA">Expected Assists</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Price Range: £{minPrice}m - £{maxPrice}m</label>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input type="range" min="4" max="15" step="0.5" value={minPrice} onChange={(e) => setMinPrice(parseFloat(e.target.value))} style={{width: '100%'}} />
                    <input type="range" min="4" max="15" step="0.5" value={maxPrice} onChange={(e) => setMaxPrice(parseFloat(e.target.value))} style={{width: '100%'}} />
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#e9d5ff', cursor: 'pointer'}}>
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => setAvailableOnly(e.target.checked)}
                      style={{width: '18px', height: '18px'}}
                    />
                    <span>Available only</span>
                  </label>
                </div>
              </div>

              <div style={{marginTop: '16px'}}>
                <label style={styles.label}>Positions</label>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  {allPositions.map(pos => (
                    <button
                      key={pos}
                      onClick={() => togglePosition(pos)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: positionFilter.includes(pos) ? '#9333ea' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: positionFilter.includes(pos) ? 'bold' : 'normal',
                        transition: 'all 0.2s'
                      }}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{marginTop: '16px'}}>
                <label style={styles.label}>Teams</label>
                <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto', padding: '4px'}}>
                  {uniqueTeams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => toggleTeam(team.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: teamFilter.includes(team.id) ? '#9333ea' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: teamFilter.includes(team.id) ? 'bold' : 'normal',
                        transition: 'all 0.2s'
                      }}
                    >
                      {team.short_name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Players Grid */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Players ({topPlayers.length})</h2>
          <div style={styles.playersGrid}>
            {topPlayers.map(player => {
              const isWatchlisted = watchlist.includes(player.id);
              const nextFixtures = getNextFixtures(player);
              
              return (
                <div key={player.id} style={styles.playerCard} className="player-card" onClick={() => setSelectedPlayer(player)}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0}}>
                      <img
                        src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                        alt={player.name}
                        style={{width: '48px', height: '60px', objectFit: 'contain'}}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div style={{flex: 1, minWidth: 0}}>
                        <h3 style={{color: 'white', fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{player.name}</h3>
                        <p style={{color: '#e9d5ff', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{player.teamShort} • {player.position}</p>
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
                          {getFormTrend(player)}
                          <span style={{fontSize: '11px', color: '#9ca3af'}}>
                            {player.form > player.points_per_game * 1.2 ? 'Hot' : player.form < player.points_per_game * 0.8 ? 'Cold' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(player.id);
                      }}
                      style={{background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px'}}
                    >
                      <Star size={20} color="#facc15" fill={isWatchlisted ? '#facc15' : 'none'} />
                    </button>
                  </div>

                  <div style={styles.valueScore}>
                    <div style={{color: 'white', fontSize: '11px'}}>VALUE SCORE</div>
                    <div style={{color: 'white', fontWeight: 'bold', fontSize: '24px'}}>{player.valueScore}</div>
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

                  {nextFixtures.length > 0 && (
                    <div style={{marginBottom: '12px'}}>
                      <div style={{color: '#9ca3af', fontSize: '11px', marginBottom: '6px'}}>Next 3 Fixtures</div>
                      <div style={{display: 'flex', gap: '4px'}}>
                        {nextFixtures.map((fixture, idx) => (
                          <div
                            key={idx}
                            style={{flex: 1, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', padding: '6px', textAlign: 'center'}}
                          >
                            <div style={{color: 'white', fontSize: '10px', fontWeight: '500', marginBottom: '4px'}}>
                              {fixture.isHome ? 'vs' : '@'} {fixture.opponent}
                            </div>
                            <div style={{height: '4px', borderRadius: '2px', background: getDifficultyColor(fixture.difficulty)}}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', fontSize: '11px', color: '#d1d5db', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '4px', padding: '8px'}}>
                    <div style={{textAlign: 'center'}}>
                      <div style={{color: '#9ca3af'}}>Goals</div>
                      <div style={{fontWeight: 'bold'}}>{player.goals}</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{color: '#9ca3af'}}>Assists</div>
                      <div style={{fontWeight: 'bold'}}>{player.assists}</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{color: '#9ca3af'}}>Own %</div>
                      <div style={{fontWeight: 'bold'}}>{player.selected_by}%</div>
                    </div>
                  </div>

                  {compareMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (comparePlayers.find(p => p.id === player.id)) {
                          removeFromCompare(player.id);
                        } else {
                          addToCompare(player);
                        }
                      }}
                      style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: comparePlayers.find(p => p.id === player.id) ? '#f87171' : '#9333ea',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {comparePlayers.find(p => p.id === player.id) ? 'Remove from Compare' : 'Add to Compare'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {topPlayers.length === 0 && (
            <div style={{textAlign: 'center', padding: '40px', color: '#9ca3af'}}>
              <p style={{fontSize: '18px', marginBottom: '8px'}}>No players match your filters</p>
              <p style={{fontSize: '14px'}}>Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        <div style={{marginTop: '32px', textAlign: 'center', color: '#e9d5ff', fontSize: '13px'}}>
          <p>Built with React • Powered by Official FPL API</p>
        </div>
      </div>
    </div>
  );
}