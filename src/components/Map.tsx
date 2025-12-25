import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapProps {
  address: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export default function Map({ address }: MapProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsDark] = useState(false);

  useEffect(() => {
    // Detect dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!address || !address.trim()) {
      setLoading(false);
      return;
    }

    // Debounce to avoid rate limiting (Nominatim requires 1 req/sec)
    const timeoutId = setTimeout(() => {
      geocodeAddress();
    }, 500);

    const geocodeAddress = async () => {
      try {
        setError(null);

        // Try to geocode with multiple strategies for better international support
        let data = await tryGeocode(address);

        // If exact address not found, try fallback strategies
        if (!data || data.length === 0) {
          console.log('Trying fallback geocoding strategies...');

          // Extract city/region from address (look for common patterns)
          const cityMatch = address.match(/([^,]+(?:\/[^,]+)?)\s*$/); // Last part after comma or with /
          if (cityMatch) {
            const cityPart = cityMatch[1].trim();
            console.log('Trying city/region:', cityPart);
            data = await tryGeocode(cityPart);
          }

          // If still no results, try extracting just major location (Istanbul, Paris, etc)
          if (!data || data.length === 0) {
            const majorCity = address.match(
              /([A-Za-zıİğĞüÜşŞöÖçÇ]+(?:\s+[A-Za-zıİğĞüÜşŞöÖçÇ]+)*)[,/]/
            );
            if (majorCity) {
              console.log('Trying major city:', majorCity[1]);
              data = await tryGeocode(majorCity[1]);
            }
          }
        }

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
          console.log('Geocoded to:', data[0].display_name);
        } else {
          setError(
            `Could not locate "${address}". Try formats like:\n• US: "123 Main St, New York, NY 10001"\n• UK: "10 Downing Street, London, SW1A 2AA"\n• International: "Eiffel Tower, Paris, France" or "Shibuya, Tokyo, Japan"\n• City only: "Istanbul, Turkey"`
          );
          console.warn('No results found for:', address);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError('Failed to load map. Please try again later.');
        console.error('Geocoding error:', errorMessage, err);
      } finally {
        setLoading(false);
      }
    };

    const tryGeocode = async (searchQuery: string) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'React Router Contact App',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      return await response.json();
    };

    return () => clearTimeout(timeoutId);
  }, [address]);

  if (!address || !address.trim()) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
        <p className="text-slate-600 dark:text-slate-400 m-0">Loading map...</p>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
        <p className="text-slate-600 dark:text-slate-400 m-0 whitespace-pre-line leading-relaxed">
          {error || 'Unable to display map for this address'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={13}
        className="h-75 w-full rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lon]}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
