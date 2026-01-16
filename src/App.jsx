import { useState, useEffect, useMemo } from 'react';
import { vendors, allServices, allStatuses } from './data/vendors';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());

  // Filter vendors based on search and filters
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
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

      // Status filter
      const matchesStatus = selectedStatus.length === 0 ||
        selectedStatus.includes(vendor.status);

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [searchTerm, selectedServices, selectedStatus]);

  // Toggle service filter
  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  // Toggle status filter
  const toggleStatus = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedServices([]);
    setSelectedStatus([]);
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

  const hasActiveFilters = searchTerm || selectedServices.length > 0 || selectedStatus.length > 0;

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
          {/* Status filter */}
          <div className="filter-group">
            <div className="filter-label">Status</div>
            <div className="filter-tags">
              {allStatuses.map(status => (
                <button
                  key={status}
                  className={`filter-tag ${selectedStatus.includes(status) ? 'active' : ''}`}
                  onClick={() => toggleStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Services filter */}
          <div className="filter-group">
            <div className="filter-label">Services</div>
            <div className="filter-tags">
              {allServices.map(service => (
                <button
                  key={service}
                  className={`filter-tag ${selectedServices.includes(service) ? 'active' : ''}`}
                  onClick={() => toggleService(service)}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
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
              className={`flip-card ${flippedCards.has(vendor.id) ? 'flipped' : ''}`}
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
                        <span className={`card-status ${vendor.status.toLowerCase().replace('-', '')}`}>
                          {vendor.status}
                        </span>
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
