import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

function Navbar({ embassies, searchTerm, onSearchChange, onSelectEmbassy }) {
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const filteredEmbassies = embassies.filter((embassy) =>
    embassy.original_country_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowResults(value.length > 0);
  };

  const handleSelectCountry = (embassy) => {
    onSelectEmbassy(embassy);
    setShowResults(false);
  };

  const handleClear = () => {
    onSearchChange("");
    setShowResults(false);
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <img src="/images/phone_icon.png" alt="Logo" />
          <div className="logo-text">Find My Embassy</div>
        </div>

        <div className="search" ref={searchRef}>
          <input
            type="text"
            className={`search-bar ${searchTerm ? "active" : ""}`}
            placeholder="Zoek een land..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => searchTerm && setShowResults(true)}
          />
          {searchTerm && (
            <button className="close-btn active" onClick={handleClear}>
              ×
            </button>
          )}

          {showResults && (
            <div className="search-results">
              {filteredEmbassies.map((embassy, index) => (
                <div
                  key={index}
                  className="search-country"
                  onClick={() => handleSelectCountry(embassy)}
                >
                  {embassy.original_country_name}
                </div>
              ))}
              {filteredEmbassies.length === 0 && (
                <div className="search-country">Geen resultaten gevonden</div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
