import { useState, useEffect, useMemo } from 'react';
import { vendors, allServices } from './data/vendors';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  // Extract all unique clients
  const allClients = useMemo(() => {
    const clientsSet = new Set();
    vendors.forEach(vendor => {
      vendor.clients.forEach(client => {
        clientsSet.add(client);
      });
    });
    return [...clientsSet].sort();
  }, []);

  // Filter vendors based on search and filters
  const filteredVendors = useMemo(() => {
    const filtered = vendors.filter(vendor => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        vendor.name.toLowerCase().includes(searchLower) ||
        vendor.description.toLowerCase().includes(searchLower) ||
        vendor.services.some(s => s.toLowerCase().includes(searchLower)) ||
        vendor.clients.some(c => c.toLowerCase().includes(searchLower));

      // Service filter
      const matchesService = selectedServices.length === 0 ||
        selectedServices.some(service => vendor.services.includes(service));

      // Client filter
      const matchesClient = selectedClients.length === 0 ||
        selectedClients.some(client => vendor.clients.includes(client));

      return matchesSearch && matchesService && matchesClient;
    });

    // Always put Green Dots first
    return filtered.sort((a, b) => {
      if (a.name === 'Green Dots') return -1;
      if (b.name === 'Green Dots') return 1;
      return 0;
    });
  }, [searchTerm, selectedServices, selectedClients]);

  // Toggle service filter
  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  // Toggle client filter
  const toggleClient = (client) => {
    setSelectedClients(prev =>
      prev.includes(client)
        ? prev.filter(c => c !== client)
        : [...prev, client]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedServices([]);
    setSelectedClients([]);
  };

  // Toggle card flip
  const toggleFlip = (id) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get logo initial
  const getLogoInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setServiceDropdownOpen(false);
        setClientDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const hasActiveFilters = searchTerm || selectedServices.length > 0 || selectedClients.length > 0;

  return (
    <div className="app">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="header">
        <div className="credits">
          Created by{' '}
          <a href="https://x.com/Eli5defi" target="_blank" rel="noopener noreferrer">
            eli5defi
          </a>
          {' '}x{' '}
          <a href="https://x.com/stacy_muur" target="_blank" rel="noopener noreferrer">
            Stacy Muur
          </a>
          {' '}(
          <a href="https://x.com/GREEND0TS" target="_blank" rel="noopener noreferrer">
            Green Dots
          </a>
          )
        </div>
        <h1 className="main-title">Web3 Marketing Agencies</h1>
        <p className="subtitle">Discover vetted marketing agencies for your Web3 project</p>
      </header>

      {/* Controls */}
      <div className="controls">
        {/* Search */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search agencies, services, clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filters-row">
            {/* Services dropdown */}
            <div className="dropdown-container">
              <label className="filter-label">Filter by Service</label>
              <button
                className="dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setServiceDropdownOpen(!serviceDropdownOpen);
                  setClientDropdownOpen(false);
                }}
              >
                {selectedServices.length === 0
                  ? 'All Services'
                  : `${selectedServices.length} selected`}
                <span className="dropdown-arrow">{serviceDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {serviceDropdownOpen && (
                <div className="dropdown-menu">
                  {allServices.map(service => (
                    <label
                      key={service}
                      className="dropdown-option"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                      />
                      <span className={selectedServices.includes(service) ? 'selected' : ''}>
                        {service}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Clients dropdown */}
            <div className="dropdown-container">
              <label className="filter-label">Filter by Client</label>
              <button
                className="dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setClientDropdownOpen(!clientDropdownOpen);
                  setServiceDropdownOpen(false);
                }}
              >
                {selectedClients.length === 0
                  ? 'All Clients'
                  : `${selectedClients.length} selected`}
                <span className="dropdown-arrow">{clientDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {clientDropdownOpen && (
                <div className="dropdown-menu">
                  {allClients.map(client => (
                    <label
                      key={client}
                      className="dropdown-option"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client)}
                        onChange={() => toggleClient(client)}
                      />
                      <span className={selectedClients.includes(client) ? 'selected' : ''}>
                        {client}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results counter */}
        <div className="results-counter">
          Showing {filteredVendors.length} of {vendors.length} agencies
        </div>
      </div>

      {/* Cards grid */}
      <div className="cards-grid">
        {filteredVendors.length === 0 ? (
          <div className="no-results">
            <h3>No agencies found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <div
              key={vendor.id}
              className={`flip-card ${flippedCards.has(vendor.id) ? 'flipped' : ''} ${vendor.name === 'Green Dots' ? 'featured-card' : ''}`}
              onClick={() => toggleFlip(vendor.id)}
            >
              <div className="flip-card-inner">
                {/* Front of card */}
                <div className="flip-card-front">
                  <div className="card-content">
                    <div className="card-header">
                      <div className="card-logo">
                        {getLogoInitial(vendor.name)}
                      </div>
                      <div className="card-title-section">
                        <h3 className="card-title">{vendor.name}</h3>
                      </div>
                    </div>

                    <div className="card-services">
                      {vendor.services.slice(0, 5).map((service, idx) => (
                        <span key={idx} className="service-tag">
                          {service}
                        </span>
                      ))}
                      {vendor.services.length > 5 && (
                        <span className="service-tag">+{vendor.services.length - 5} more</span>
                      )}
                    </div>

                    <div className="card-description">
                      {vendor.description}
                    </div>

                    {vendor.code && (
                      <div className="discount-badge">
                        {vendor.code}
                      </div>
                    )}

                    <div className="flip-hint">
                      Click to see clients & links ↻
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className="flip-card-back">
                  <div className="card-content">
                    <div className="card-header">
                      <div className="card-logo">
                        {getLogoInitial(vendor.name)}
                      </div>
                      <div className="card-title-section">
                        <h3 className="card-title">{vendor.name}</h3>
                      </div>
                    </div>

                    <div className="card-clients">
                      <div className="clients-label">Notable Clients</div>
                      {vendor.clients.length > 0 ? (
                        <div className="clients-list">
                          {vendor.clients.map((client, idx) => (
                            <span key={idx} className="client-tag">
                              {client}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                          No clients listed
                        </p>
                      )}
                    </div>

                    <div className="card-links">
                      {vendor.website && (
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🌐 Website
                        </a>
                      )}
                      {vendor.twitter && (
                        <a
                          href={vendor.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          𝕏 Twitter
                        </a>
                      )}
                      {vendor.email && (
                        <a
                          href={`mailto:${vendor.email}`}
                          className="card-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ✉️ Email
                        </a>
                      )}
                      {!vendor.website && !vendor.twitter && !vendor.email && (
                        <span className="card-link disabled">
                          No links available
                        </span>
                      )}
                    </div>

                    <div className="flip-hint">
                      Click to flip back ↻
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Animated background component
function AnimatedBackground() {
  useEffect(() => {
    // Create floating orbs
    const orbsContainer = document.querySelector('.floating-orbs');
    if (orbsContainer) {
      const colors = ['#00ffff', '#ff00ff', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];
      for (let i = 0; i < 6; i++) {
        const orb = document.createElement('div');
        orb.className = 'orb';
        orb.style.left = `${Math.random() * 100}%`;
        orb.style.top = `${Math.random() * 100}%`;
        orb.style.width = `${200 + Math.random() * 200}px`;
        orb.style.height = orb.style.width;
        orb.style.background = colors[i % colors.length];
        orb.style.setProperty('--duration', `${15 + Math.random() * 10}s`);
        orb.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
        orb.style.setProperty('--y', `${(Math.random() - 0.5) * 200}px`);
        orb.style.animationDelay = `${Math.random() * 5}s`;
        orbsContainer.appendChild(orb);
      }
    }

    // Create data stream lines
    const streamContainer = document.querySelector('.data-stream-bg');
    if (streamContainer) {
      const colors = ['#00ffff', '#ff00ff', '#8b5cf6', '#3b82f6'];
      for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'stream-line';
        line.style.left = `${(i / 20) * 100}%`;
        line.style.setProperty('--color', colors[i % colors.length]);
        line.style.setProperty('--duration', `${3 + Math.random() * 4}s`);
        line.style.animationDelay = `${Math.random() * 3}s`;
        streamContainer.appendChild(line);
      }
    }
  }, []);

  return (
    <>
      <div className="floating-orbs"></div>
      <div className="data-stream-bg"></div>
    </>
  );
}

export default App;
