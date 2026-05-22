import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SelectedBusinessContext } from '../context/SelectedBusinessContext'
import { UserLocationContext } from '../context/UserLocationContext'

const HOSPITAL_ICON = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
  <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z" fill="#E53935"/>
  <rect x="12" y="7" width="8" height="18" rx="1" fill="white"/>
  <rect x="7" y="12" width="18" height="8" rx="1" fill="white"/>
</svg>`)}`;

const SELECTED_ICON = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 32 42">
  <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z" fill="#02B1BF"/>
  <rect x="12" y="7" width="8" height="18" rx="1" fill="white"/>
  <rect x="7" y="12" width="18" height="8" rx="1" fill="white"/>
</svg>`)}`;

function Markers({ business }) {
  const { selectedBusiness, setSelectedBusiness } = useContext(SelectedBusinessContext);
  const { userLocation } = useContext(UserLocationContext);
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const [bouncing, setBouncing] = useState(false);

  const isSelected = selectedBusiness?.id === business.id;

  useEffect(() => {
    if (isSelected) {
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 1400);
      return () => clearTimeout(timer);
    } else {
      setBouncing(false);
    }
  }, [isSelected, selectedBusiness?.id]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${business.geometry.location.lat},${business.geometry.location.lng}&travelmode=walking`;

  return (
    <>
      <MarkerF
        position={business.geometry.location}
        onClick={() => setSelectedBusiness(business)}
        icon={{
          url: isSelected ? SELECTED_ICON : HOSPITAL_ICON,
          scaledSize: isSelected
            ? { width: 40, height: 52 }
            : { width: 28, height: 36 },
        }}
        animation={
          bouncing && window.google?.maps?.Animation?.BOUNCE
            ? window.google.maps.Animation.BOUNCE
            : null
        }
      />
      {isSelected && (
        <InfoWindowF
          position={business.geometry.location}
          options={{ pixelOffset: new window.google.maps.Size(0, -50) }}
          onCloseClick={() => setSelectedBusiness(null)}
        >
          <div style={{ fontFamily: 'sans-serif', maxWidth: 250 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>
              {business.name[currentLanguage] || business.name.en}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#555', lineHeight: 1.4 }}>
              {business.formatted_address[currentLanguage] || business.formatted_address.en}
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#0075ff', marginTop: 6, display: 'inline-block' }}
            >
              View on Google Maps
            </a>
          </div>
        </InfoWindowF>
      )}
    </>
  );
}

export default Markers;
