import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, Users, DollarSign, Zap, Filter, Moon, Sun, Star, X, TrendingDown, AlertCircle, Calendar, Target, ArrowUpRight, ArrowDownRight, Minus, RefreshCw } from 'lucide-react';

export default function FPLDashboard() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState([]);
  const [teamFilter, setTeamFilter] = useState([]);
  const [minPrice, setMinPrice] = useState(4);
  const [maxPrice, setMaxPrice] = useState(15);
  const [sortBy, setSortBy] = useState('value');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePlayers, setComparePlayers] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(true);

  const positions = { 1: 'GKP', 2: 'DEF', 3: 'MID', 4: 'FWD' };
  const allPositions = ['GKP', 'DEF', 'MID', 'FWD'];

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fpl-watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
    const savedDarkMode = localStorage.getItem('fpl-darkmode');
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('fpl-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('fpl-darkmode', darkMode);
  }, [darkMode]);

  const toggleWatchlist = (playerId) => {
    setWatchlist(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
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
    const price = player.now_cost / 10;
    if (price === 0) return 0;

    const totalPoints = player.total_points;
    const form = parseFloat(player.form) || 0;
    const pointsPerGame = parseFloat(player.points_per_game) || 0;
    const selectedBy = parseFloat(player.selected_by_percent);

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

    // Hot streak bonus
    if (form > pointsPerGame * 1.3 && pointsPerGame > 3) {
      valueScore += 3;
    }

    // Cold form penalty
    if (form < pointsPerGame * 0.7 && pointsPerGame > 2) {
      valueScore -= 2;
    }

    // Price rising bonus
    if (parseFloat(player.cost_change_start) > 0) {
      valueScore += 1;
    }

    return parseFloat(valueScore.toFixed(2));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try with cors-anywhere proxy first
        let response;
        let data;
        
        try {
          response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) throw new Error('Direct fetch failed');
          data = await response.json();
        } catch (directError) {
          // If direct fetch fails, try with a CORS proxy
          console.log('Direct fetch failed, trying with proxy...');
          response = await fetch('https://corsproxy.io/?https://fantasy.premierleague.com/api/bootstrap-static/');
          
          if (!response.ok) throw new Error('Failed to fetch FPL data');
          data = await response.json();
        }
        
        const teamsMap = {};
        data.teams.forEach(team => {
          teamsMap[team.id] = team;
        });
        setTeams(teamsMap);

        // Fetch fixtures with same strategy
        let fixturesData = [];
        try {
          const fixturesResponse = await fetch('https://fantasy.premierleague.com/api/fixtures/', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          if (fixturesResponse.ok) {
            fixturesData = await fixturesResponse.json();
          }
        } catch (fixturesError) {
          try {
            const fixturesResponse = await fetch('https://corsproxy.io/?https://fantasy.premierleague.com/api/fixtures/');
            if (fixturesResponse.ok) {
              fixturesData = await fixturesResponse.json();
            }
          } catch (e) {
            console.log('Could not fetch fixtures, continuing without them');
          }
        }
        
        setFixtures(fixturesData);

        const activePlayers = data.elements
          .filter(p => p.minutes >= 90)
          .map(p => ({
            ...p,
            position: positions[p.element_type],
            teamName: teamsMap[p.team]?.name || 'Unknown',
            teamShort: teamsMap[p.team]?.short_name || '???'
          }));

        setPlayers(activePlayers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load FPL data. This might be due to CORS restrictions in the artifact environment. The app will work correctly when deployed to your website.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const price = player.now_cost / 10;
      const matchesSearch = player.web_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.teamName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter.length === 0 || positionFilter.includes(player.position);
      const matchesTeam = teamFilter.length === 0 || teamFilter.includes(player.team);
      const matchesPrice = price >= minPrice && price <= maxPrice;
      const matchesAvailability = !availableOnly || (player.status === 'a' && player.chance_of_playing_next_round === null || player.chance_of_playing_next_round === 100);

      return matchesSearch && matchesPosition && matchesTeam && matchesPrice && matchesAvailability;
    });
  }, [players, searchTerm, positionFilter, teamFilter, minPrice, maxPrice, availableOnly]);

  const sortedPlayers = useMemo(() => {
    const sorted = [...filteredPlayers];
    
    sorted.forEach(p => {
      p.valueScore = calculateValueScore(p);
    });

    switch(sortBy) {
      case 'value':
        return sorted.sort((a, b) => b.valueScore - a.valueScore);
      case 'points':
        return sorted.sort((a, b) => b.total_points - a.total_points);
      case 'form':
        return sorted.sort((a, b) => parseFloat(b.form) - parseFloat(a.form));
      case 'price':
        return sorted.sort((a, b) => a.now_cost - b.now_cost);
      case 'ownership':
        return sorted.sort((a, b) => parseFloat(a.selected_by_percent) - parseFloat(b.selected_by_percent));
      default:
        return sorted;
    }
  }, [filteredPlayers, sortBy, fixtures]);

  const topPlayers = sortedPlayers.slice(0, 50);

  const getValueRating = (score) => {
    if (score >= 15) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-500/20' };
    if (score >= 12) return { label: 'Very Good', color: 'text-blue-500', bg: 'bg-blue-500/20' };
    if (score >= 9) return { label: 'Good', color: 'text-cyan-500', bg: 'bg-cyan-500/20' };
    if (score >= 6) return { label: 'Decent', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
    return { label: 'Below Avg', color: 'text-orange-500', bg: 'bg-orange-500/20' };
  };

  const getFormTrend = (player) => {
    const form = parseFloat(player.form);
    const ppg = parseFloat(player.points_per_game);
    if (form > ppg * 1.2) return <ArrowUpRight className="text-green-500" size={16} />;
    if (form < ppg * 0.8) return <ArrowDownRight className="text-red-500" size={16} />;
    return <Minus className="text-gray-500" size={16} />;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return 'bg-green-500';
    if (difficulty === 3) return 'bg-yellow-500';
    if (difficulty === 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const addToCompare = (player) => {
    if (comparePlayers.length < 4 && !comparePlayers.find(p => p.id === player.id)) {
      setComparePlayers([...comparePlayers, player]);
    }
  };

  const removeFromCompare = (playerId) => {
    setComparePlayers(comparePlayers.filter(p => p.id !== playerId));
  };

  const uniqueTeams = useMemo(() => {
    return Object.values(teams).sort((a, b) => a.name.localeCompare(b.name));
  }, [teams]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700'}`}>
        <div className="text-center">
          <RefreshCw className={`animate-spin mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-white'}`} size={48} />
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-white'}`}>Loading FPL Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700'}`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-xl max-w-md`}>
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className={`text-2xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Error Loading Data</h2>
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/10'} backdrop-blur-md border-b ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className={darkMode ? 'text-purple-400' : 'text-yellow-300'} size={40} />
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>FPL Value Analyzer</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/80'}`}>Find hidden gems • Real-time data</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/20 hover:bg-white/30'} transition-all`}
            >
              {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-white" size={24} />}
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              placeholder="Search players or teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-white/20 text-white placeholder-white/60'} backdrop-blur-sm border ${darkMode ? 'border-gray-600' : 'border-white/30'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'} transition-all`}
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-md rounded-lg p-6 space-y-4`}>
              {/* Position Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-white'}`}>Positions</label>
                <div className="flex flex-wrap gap-2">
                  {allPositions.map(pos => (
                    <button
                      key={pos}
                      onClick={() => togglePosition(pos)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        positionFilter.includes(pos)
                          ? darkMode ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-white'}`}>Teams</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {uniqueTeams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => toggleTeam(team.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        teamFilter.includes(team.id)
                          ? darkMode ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {team.short_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-white'}`}>Min Price: £{minPrice}m</label>
                  <input
                    type="range"
                    min="4"
                    max="15"
                    step="0.5"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-white'}`}>Max Price: £{maxPrice}m</label>
                  <input
                    type="range"
                    min="4"
                    max="15"
                    step="0.5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Sort & Availability */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-white'}`}>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white/20 text-white border-white/30'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="value">Value Score</option>
                    <option value="points">Total Points</option>
                    <option value="form">Form</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="ownership">Ownership (Low to High)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className={`flex items-center gap-2 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-white'}`}>
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => setAvailableOnly(e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm">Available only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Compare Mode Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                compareMode
                  ? darkMode ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
                  : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Target size={18} />
              {compareMode ? 'Exit Compare Mode' : 'Compare Players'}
            </button>
            {comparePlayers.length > 0 && (
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/80'}`}>
                {comparePlayers.length}/4 selected
              </span>
            )}
          </div>

          {/* Compare Panel */}
          {comparePlayers.length > 0 && (
            <div className={`mt-4 ${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-md rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-white'}`}>Comparing Players</h3>
                <button
                  onClick={() => setComparePlayers([])}
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-white/70 hover:text-white'}`}
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {comparePlayers.map(player => (
                  <div key={player.id} className={`${darkMode ? 'bg-gray-700' : 'bg-white/20'} rounded-lg p-3 relative`}>
                    <button
                      onClick={() => removeFromCompare(player.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                    >
                      <X size={12} className="text-white" />
                    </button>
                    <div className="pr-6">
                      <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-white'}`}>{player.web_name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>{player.teamShort}</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-white/70'}>Value:</span>
                          <span className={`font-bold ${darkMode ? 'text-purple-400' : 'text-yellow-300'}`}>{player.valueScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-white/70'}>Points:</span>
                          <span className={darkMode ? 'text-white' : 'text-white'}>{player.total_points}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-white/70'}>Form:</span>
                          <span className={darkMode ? 'text-white' : 'text-white'}>{player.form}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-white/70'}>Price:</span>
                          <span className={darkMode ? 'text-white' : 'text-white'}>£{(player.now_cost / 10).toFixed(1)}m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-md rounded-lg p-4`}>
            <Users className={`mb-2 ${darkMode ? 'text-purple-400' : 'text-white'}`} size={24} />
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>{topPlayers.length}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>Players Shown</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-md rounded-lg p-4`}>
            <TrendingUp className={`mb-2 ${darkMode ? 'text-green-400' : 'text-white'}`} size={24} />
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>
              {topPlayers.filter(p => p.valueScore >= 12).length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>Top Value</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-md rounded-lg p-4`}>
            <DollarSign className={`mb-2 ${darkMode ? 'text-yellow-400' : 'text-white'}`} size={24} />
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>
              {topPlayers.filter(p => parseFloat(p.selected_by_percent) < 5 && p.valueScore >= 10).length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>Differentials</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-md rounded-lg p-4`}>
            <Star className={`mb-2 ${darkMode ? 'text-blue-400' : 'text-white'}`} size={24} />
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-white'}`}>{watchlist.length}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>Watchlist</p>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPlayers.map(player => {
            const rating = getValueRating(player.valueScore);
            const nextFixtures = getNextFixtures(player);
            const isWatchlisted = watchlist.includes(player.id);
            
            return (
              <div
                key={player.id}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-md rounded-lg p-5 transition-all cursor-pointer border ${darkMode ? 'border-gray-700' : 'border-white/20'} hover:shadow-xl hover:scale-105`}
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                      alt={player.web_name}
                      className="w-16 h-20 object-contain"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div>
                      <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-white'}`}>{player.web_name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>{player.teamShort} • {player.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${rating.bg} ${rating.color}`}>
                          {rating.label}
                        </span>
                        {getFormTrend(player)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(player.id);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-all"
                  >
                    <Star
                      size={20}
                      className={isWatchlisted ? 'fill-yellow-400 text-yellow-400' : darkMode ? 'text-gray-400' : 'text-white/60'}
                    />
                  </button>
                </div>

                {/* Value Score */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white/10'} rounded-lg p-3 mb-3`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>Value Score</span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-yellow-300'}`}>
                      {player.valueScore}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-white/60'}`}>Price</p>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-white'}`}>£{(player.now_cost / 10).toFixed(1)}m</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-white/60'}`}>Points</p>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-white'}`}>{player.total_points}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-white/60'}`}>Form</p>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-white'}`}>{player.form}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-white/60'}`}>Ownership</p>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-white'}`}>{player.selected_by_percent}%</p>
                  </div>
                </div>

                {/* Next Fixtures */}
                {nextFixtures.length > 0 && (
                  <div>
                    <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-white/60'}`}>Next 3 Fixtures</p>
                    <div className="flex gap-2">
                      {nextFixtures.map((fixture, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-white/10'} rounded p-2 text-center`}
                        >
                          <p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-white'}`}>
                            {fixture.isHome ? 'vs' : '@'} {fixture.opponent}
                          </p>
                          <div className={`mt-1 h-1.5 rounded ${getDifficultyColor(fixture.difficulty)}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compare Mode Button */}
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
                    className={`mt-3 w-full py-2 rounded-lg font-medium transition-all ${
                      comparePlayers.find(p => p.id === player.id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : darkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-white text-purple-600 hover:bg-white/90'
                    }`}
                  >
                    {comparePlayers.find(p => p.id === player.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {topPlayers.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white/10'} backdrop-blur-md rounded-lg`}>
            <AlertCircle className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-white/60'}`} size={48} />
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-white'}`}>No players match your filters</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/70'}`}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Player Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedPlayer(null)}>
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`sticky top-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6 flex items-start justify-between`}>
              <div className="flex items-center gap-4">
                <img
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${selectedPlayer.code}.png`}
                  alt={selectedPlayer.web_name}
                  className="w-20 h-24 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.web_name}</h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedPlayer.first_name} {selectedPlayer.second_name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{selectedPlayer.teamName} • {selectedPlayer.position}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getValueRating(selectedPlayer.valueScore).bg} ${getValueRating(selectedPlayer.valueScore).color}`}>
                      {getValueRating(selectedPlayer.valueScore).label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-all`}
              >
                <X size={24} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Value Score Highlight */}
              <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50' : 'bg-gradient-to-r from-purple-100 to-blue-100'} rounded-lg p-6`}>
                <div className="text-center">
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Value Score</p>
                  <p className={`text-5xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{selectedPlayer.valueScore}</p>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{getValueRating(selectedPlayer.valueScore).label}</p>
                </div>
              </div>

              {/* Key Stats */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>£{(selectedPlayer.now_cost / 10).toFixed(1)}m</p>
                    {parseFloat(selectedPlayer.cost_change_start) !== 0 && (
                      <p className={`text-xs mt-1 ${parseFloat(selectedPlayer.cost_change_start) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {parseFloat(selectedPlayer.cost_change_start) > 0 ? '↑' : '↓'} £{Math.abs(parseFloat(selectedPlayer.cost_change_start) / 10).toFixed(1)}m
                      </p>
                    )}
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Points</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.total_points}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Form</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.form}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>PPG</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.points_per_game}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ownership</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.selected_by_percent}%</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minutes Played</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.minutes}</p>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.goals_scored}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assists</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.assists}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Clean Sheets</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.clean_sheets}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bonus</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.bonus}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>YC / RC</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPlayer.yellow_cards} / {selectedPlayer.red_cards}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ICT Index</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{parseFloat(selectedPlayer.ict_index).toFixed(1)}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Fixtures */}
              {getNextFixtures(selectedPlayer, 5).length > 0 && (
                <div>
                  <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upcoming Fixtures</h3>
                  <div className="space-y-2">
                    {getNextFixtures(selectedPlayer, 5).map((fixture, idx) => (
                      <div key={idx} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${getDifficultyColor(fixture.difficulty)} flex items-center justify-center text-white font-bold`}>
                            {fixture.difficulty}
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {fixture.isHome ? 'vs' : 'at'} {fixture.opponent}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {fixture.isHome ? 'Home' : 'Away'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${
                            fixture.difficulty <= 2 ? 'text-green-500' :
                            fixture.difficulty === 3 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {fixture.difficulty <= 2 ? 'Easy' : fixture.difficulty === 3 ? 'Medium' : 'Hard'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggleWatchlist(selectedPlayer.id)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    watchlist.includes(selectedPlayer.id)
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <Star size={18} className="inline mr-2" />
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
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      comparePlayers.find(p => p.id === selectedPlayer.id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : darkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    <Target size={18} className="inline mr-2" />
                    {comparePlayers.find(p => p.id === selectedPlayer.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}