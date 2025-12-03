import { useEffect, useRef } from "react";
import "./EmbassyInfo.css";

function EmbassyInfo({ embassy }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (embassy && embassy.address_embassy && window.google) {
      initMap();
    }
  }, [embassy]);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 },
    });

    const geocoder = new window.google.maps.Geocoder();
    const address = `${embassy.address_embassy}, ${embassy.original_country_name}`;

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        map.setCenter(results[0].geometry.location);
        new window.google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
      }
    });
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "nvt";
    return phone.split("\n")[0].trim();
  };

  const isNumberAvailable = (number) => {
    const formatted = formatPhoneNumber(number);
    return formatted && formatted !== "nvt" && formatted !== "";
  };

  return (
    <div className="embassy-info-container">
      <div className="country-title-bar">
        {embassy.flag && (
          <img
            src={embassy.flag.replace("23px", "100px")}
            alt={`${embassy.original_country_name} flag`}
          />
        )}
        <h1 className="country-name">
          {embassy.original_country_name} ({embassy.country_number})
        </h1>
      </div>

      <div className="emergency-grid">
        <a
          href={
            isNumberAvailable(embassy.police)
              ? `tel:${formatPhoneNumber(embassy.police)}`
              : "#"
          }
          className={`emergency-card police-dept ${
            !isNumberAvailable(embassy.police) ? "disabled" : ""
          }`}
        >
          <div className="icon">
            <div className="title">Politie</div>
            <img src="/images/police_icon_shade.png" alt="Police" />
            <div className="number">{formatPhoneNumber(embassy.police)}</div>
          </div>
        </a>

        <a
          href={
            isNumberAvailable(embassy.ambulance)
              ? `tel:${formatPhoneNumber(embassy.ambulance)}`
              : "#"
          }
          className={`emergency-card ambulance-dept ${
            !isNumberAvailable(embassy.ambulance) ? "disabled" : ""
          }`}
        >
          <div className="icon">
            <div className="title">Ambulance</div>
            <img src="/images/ambulance_icon_shade.png" alt="Ambulance" />
            <div className="number">{formatPhoneNumber(embassy.ambulance)}</div>
          </div>
        </a>

        <a
          href={
            isNumberAvailable(embassy.fire)
              ? `tel:${formatPhoneNumber(embassy.fire)}`
              : "#"
          }
          className={`emergency-card fire-dept ${
            !isNumberAvailable(embassy.fire) ? "disabled" : ""
          }`}
        >
          <div className="icon">
            <div className="title">Brandweer</div>
            <img src="/images/fire_icon_shade.png" alt="Fire" />
            <div className="number">{formatPhoneNumber(embassy.fire)}</div>
          </div>
        </a>

        <a
          href={
            isNumberAvailable(embassy.phone_embassy)
              ? `tel:${formatPhoneNumber(embassy.phone_embassy)}`
              : "#"
          }
          className={`emergency-card embassy-dept ${
            !isNumberAvailable(embassy.phone_embassy) ? "disabled" : ""
          }`}
        >
          <div className="icon">
            <div className="title">Ambassade</div>
            <img src="/images/embassador_icon_shade.png" alt="Embassy" />
            <div className="number">
              {formatPhoneNumber(embassy.phone_embassy)}
            </div>
          </div>
        </a>

        <div className="flag-icon">
          <img src="/images/phone_icon.png" alt="Phone" />
        </div>
      </div>

      {(embassy.opening_hours_embassy ||
        embassy.e_mail_embassy ||
        embassy.name_embassador ||
        embassy.address_embassy) && (
        <div className="embassy-information">
          <h1>Ambassade informatie</h1>

          {embassy.opening_hours_embassy && (
            <div className="info-row">
              <div className="embassy-icon">🕐</div>
              <div className="info-content">
                {embassy.opening_hours_embassy}
              </div>
            </div>
          )}

          {embassy.e_mail_embassy && (
            <div className="info-row">
              <div className="embassy-icon">✉️</div>
              <div className="info-content">
                <a href={`mailto:${embassy.e_mail_embassy}`}>
                  {embassy.e_mail_embassy}
                </a>
              </div>
            </div>
          )}

          {embassy.name_embassador && (
            <div className="info-row">
              <div className="embassy-icon">👤</div>
              <div className="info-content">{embassy.name_embassador}</div>
            </div>
          )}

          {embassy.address_embassy && (
            <div className="info-row">
              <div className="embassy-icon">🏠</div>
              <div className="info-content">{embassy.address_embassy}</div>
            </div>
          )}
        </div>
      )}

      {embassy.address_embassy && <div ref={mapRef} id="map"></div>}
    </div>
  );
}

export default EmbassyInfo;
