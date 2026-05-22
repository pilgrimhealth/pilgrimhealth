import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SelectedBusinessContext } from '../context/SelectedBusinessContext';
import { UserLocationContext } from '../context/UserLocationContext';
import Markers from './Markers';

function GoogleMapView({ businessList }) {
  const { userLocation, setUserLocation } = useContext(UserLocationContext);
  const { selectedBusiness, setSelectedBusiness } = useContext(
    SelectedBusinessContext
  );
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const [map, setMap] = useState();

  const containerStyle = {
    width: '100%',
    height: '76vh',
  };

  useEffect(() => {
    if (!map) return;
    if (selectedBusiness) {
      map.panTo(selectedBusiness.geometry.location);
      map.setZoom(16);
    } else if (userLocation) {
      map.panTo(userLocation);
      map.setZoom(14);
    }
  }, [selectedBusiness]);

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        mapIds={['my-map-id']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={
            !selectedBusiness?.name
              ? userLocation
              : selectedBusiness.geometry.location
          }
          options={{ mapId: 'my-map-id' }}
          zoom={14}
          onLoad={(map) => setMap(map)}
        >
          <MarkerF
            position={userLocation}
            icon={{
              url: '/user-location.png',
              scaledSize: {
                width: 50,
                height: 50,
              },
            }}
          />
          {businessList &&
            businessList.map((item) => (
              <Markers business={item} key={item.id} />
            ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default GoogleMapView;
