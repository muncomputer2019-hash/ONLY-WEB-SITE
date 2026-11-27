/// <reference types="google.maps" />
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiIsLoaded,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  ExternalLink,
  LocateFixed,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Search,
} from 'lucide-react';
import { formatFullAddress } from '../config/businessConfig';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import { getShopMapsUrl, parseLatLngFromInput } from '../services/publicData';

declare const __GOOGLE_MAPS_API_KEY__: string | undefined;

const GOOGLE_MAPS_API_KEY =
  (typeof globalThis !== 'undefined' &&
    (globalThis as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY) ||
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  (typeof __GOOGLE_MAPS_API_KEY__ !== 'undefined' ? __GOOGLE_MAPS_API_KEY__ : '') ||
  '';

const ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

type TravelModeOption = 'DRIVING' | 'WALKING' | 'TWO_WHEELER';

interface RouteSummary {
  distanceMeters: number;
  durationMillis: number;
}

interface SearchRequest {
  query: string;
  nonce: number;
}

function isQuotaError(err: unknown): boolean {
  const str = String(err || '').toUpperCase();
  return (
    str.includes('RESOURCE_EXHAUSTED') ||
    str.includes('OVER_QUERY_LIMIT') ||
    str.includes('OVERQUOTA') ||
    str.includes('QUOTAEXCEEDED') ||
    str.includes('429')
  );
}

interface InnerMapContentProps {
  businessName: string;
  officialAddress: string;
  savedCoords: google.maps.LatLngLiteral | null;
  originSearchRequest: SearchRequest | null;
  userGps: google.maps.LatLngLiteral | null;
  userOriginLabel: string;
  travelMode: TravelModeOption;
  onCentreResolved: (coords: google.maps.LatLngLiteral | null, formattedAddress: string) => void;
  onOriginResolved: (coords: google.maps.LatLngLiteral, label: string) => void;
  onOriginSearchError: (msg: string | null) => void;
  onRouteComputed: (summary: RouteSummary | null, errorMsg: string | null) => void;
}

const InnerMapContent: React.FC<InnerMapContentProps> = ({
  businessName,
  officialAddress,
  savedCoords,
  originSearchRequest,
  userGps,
  userOriginLabel,
  travelMode,
  onCentreResolved,
  onOriginResolved,
  onOriginSearchError,
  onRouteComputed,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');

  const [centreCoords, setCentreCoords] = useState<google.maps.LatLngLiteral | null>(savedCoords);
  const [resolvedAddress, setResolvedAddress] = useState<string>(officialAddress);
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const lastSavedKeyRef = useRef<string>('');

  // Use saved GPS coordinates directly when available; otherwise fallback to Places search
  useEffect(() => {
    if (!map) return;

    if (savedCoords) {
      const savedKey = `${savedCoords.lat},${savedCoords.lng},${officialAddress}`;
      setCentreCoords(savedCoords);
      setResolvedAddress(officialAddress);
      setInfoOpen(true);
      onCentreResolved(savedCoords, officialAddress);
      if (lastSavedKeyRef.current !== savedKey) {
        lastSavedKeyRef.current = savedKey;
        map.setCenter(savedCoords);
        map.setZoom(17);
      }
      return;
    }

    if (!placesLib) return;
    let cancelled = false;

    const locateCentre = async () => {
      try {
        const PlaceClass = placesLib.Place as unknown as {
          searchByText: (req: {
            textQuery: string;
            fields: string[];
            region?: string;
            maxResultCount?: number;
          }) => Promise<{ places?: google.maps.places.Place[] }>;
        };

        let response = await PlaceClass.searchByText({
          textQuery: `${businessName}, ${officialAddress}`,
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport'],
          region: 'IN',
          maxResultCount: 1,
        });

        if (!response?.places?.length) {
          response = await PlaceClass.searchByText({
            textQuery: officialAddress,
            fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport'],
            region: 'IN',
            maxResultCount: 1,
          });
        }

        if (cancelled) return;
        const firstPlace = response?.places?.[0];
        if (!firstPlace?.location) return;

        const loc = firstPlace.location;
        const coords: google.maps.LatLngLiteral = {
          lat: typeof loc.lat === 'function' ? loc.lat() : (loc as unknown as { lat: number }).lat,
          lng: typeof loc.lng === 'function' ? loc.lng() : (loc as unknown as { lng: number }).lng,
        };

        const formatted = officialAddress || firstPlace.formattedAddress || '';
        setCentreCoords(coords);
        setResolvedAddress(formatted);
        onCentreResolved(coords, formatted);

        if (firstPlace.viewport) {
          map.fitBounds(firstPlace.viewport);
        } else {
          map.setCenter(coords);
          map.setZoom(16);
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onCentreResolved(null, officialAddress);
      }
    };

    void locateCentre();
    return () => {
      cancelled = true;
    };
  }, [placesLib, map, businessName, officialAddress, savedCoords, onCentreResolved]);

  // Public visitor starting-point search (works even when browser GPS permission is blocked)
  useEffect(() => {
    if (!placesLib || !originSearchRequest) return;
    let cancelled = false;

    const findOrigin = async () => {
      try {
        onOriginSearchError(null);
        const parsedDirect = parseLatLngFromInput(originSearchRequest.query);
        if (parsedDirect) {
          onOriginResolved(
            parsedDirect,
            `${parsedDirect.lat.toFixed(4)}, ${parsedDirect.lng.toFixed(4)}`
          );
          return;
        }

        const PlaceClass = placesLib.Place as unknown as {
          searchByText: (req: {
            textQuery: string;
            fields: string[];
            region?: string;
            maxResultCount?: number;
          }) => Promise<{ places?: google.maps.places.Place[] }>;
        };

        const queryWithRegion = /west bengal|murshidabad|india/i.test(originSearchRequest.query)
          ? originSearchRequest.query
          : `${originSearchRequest.query}, Murshidabad, West Bengal`;

        let response = await PlaceClass.searchByText({
          textQuery: queryWithRegion,
          fields: ['displayName', 'formattedAddress', 'location'],
          region: 'IN',
          maxResultCount: 1,
        });

        if (!response?.places?.length) {
          response = await PlaceClass.searchByText({
            textQuery: originSearchRequest.query,
            fields: ['displayName', 'formattedAddress', 'location'],
            region: 'IN',
            maxResultCount: 1,
          });
        }

        if (cancelled) return;
        const firstPlace = response?.places?.[0];
        if (!firstPlace?.location) {
          onOriginSearchError(
            'Starting place not found. Try a nearby village, bazaar, or town name (e.g. Domkal, Islampur, Juginda).'
          );
          return;
        }

        const loc = firstPlace.location;
        const coords: google.maps.LatLngLiteral = {
          lat: typeof loc.lat === 'function' ? loc.lat() : (loc as unknown as { lat: number }).lat,
          lng: typeof loc.lng === 'function' ? loc.lng() : (loc as unknown as { lng: number }).lng,
        };
        onOriginResolved(
          coords,
          firstPlace.displayName || firstPlace.formattedAddress || originSearchRequest.query
        );
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          onOriginSearchError(
            'Could not find that starting place right now. Try Open in Google Maps below.'
          );
        }
      }
    };

    void findOrigin();
    return () => {
      cancelled = true;
    };
  }, [placesLib, originSearchRequest, onOriginResolved, onOriginSearchError]);

  // Compute route when visitor provides GPS OR starting town
  useEffect(() => {
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!routesLib || !map || !userGps || !centreCoords) {
      return;
    }

    let cancelled = false;

    const calculateRoute = async () => {
      try {
        const RouteClass = routesLib.Route as unknown as {
          computeRoutes: (req: {
            origin: google.maps.LatLngLiteral;
            destination: google.maps.LatLngLiteral;
            travelMode: TravelModeOption;
            fields: string[];
          }) => Promise<{
            routes?: Array<{
              distanceMeters?: number;
              durationMillis?: number;
              viewport?: google.maps.LatLngBounds;
              createPolylines?: () => google.maps.Polyline[];
            }>;
          }>;
        };

        const response = await RouteClass.computeRoutes({
          origin: userGps,
          destination: centreCoords,
          travelMode,
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        });

        if (cancelled) return;

        const primaryRoute = response?.routes?.[0];
        if (!primaryRoute) {
          onRouteComputed(null, 'No road route could be calculated from that starting location.');
          return;
        }

        if (typeof primaryRoute.createPolylines === 'function') {
          const newPolylines = primaryRoute.createPolylines();
          newPolylines.forEach((polyline) => {
            polyline.setOptions({
              strokeColor: '#1e40af',
              strokeWeight: 5,
            });
            polyline.setMap(map);
          });
          polylinesRef.current = newPolylines;
        }

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        onRouteComputed(
          {
            distanceMeters: primaryRoute.distanceMeters ?? 0,
            durationMillis: primaryRoute.durationMillis ?? 0,
          },
          null
        );
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onRouteComputed(
          null,
          'Unable to calculate route automatically. Use the Google Maps directions link below.'
        );
      }
    };

    void calculateRoute();

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, userGps, centreCoords, travelMode, onRouteComputed]);

  return (
    <>
      {centreCoords && (
        <>
          <AdvancedMarker
            ref={markerRef}
            position={centreCoords}
            title={businessName}
            onClick={() => setInfoOpen(true)}
          >
            <Pin background="#1e40af" borderColor="#1e3a8a" glyphColor="#ffffff" scale={1.15} />
          </AdvancedMarker>

          {infoOpen && marker && (
            <InfoWindow anchor={marker} maxWidth={270} onCloseClick={() => setInfoOpen(false)}>
              <div className="space-y-1 text-slate-900 p-0.5">
                <p className="font-bold text-xs">{businessName}</p>
                <p className="text-[11px] text-slate-600 leading-snug">{resolvedAddress}</p>
              </div>
            </InfoWindow>
          )}
        </>
      )}

      {userGps && (
        <AdvancedMarker position={userGps} title={userOriginLabel || 'Your Starting Location'}>
          <Pin background="#047857" borderColor="#064e3b" glyphColor="#ffffff" scale={1.0} />
        </AdvancedMarker>
      )}
    </>
  );
};

const MapStatusOverlay: React.FC = () => {
  const isLoaded = useApiIsLoaded();
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="absolute inset-0 bg-slate-50/95 flex items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-2">
          <MapPin className="w-6 h-6 text-blue-800 mx-auto" />
          <p className="text-sm font-semibold text-slate-900">
            Interactive map unavailable right now
          </p>
          <p className="text-xs text-slate-600">
            Please use the direct Google Maps GPS Directions button below to navigate to MUN
            COMPUTER.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
        Loading Google Maps GPS view...
      </div>
    );
  }

  return null;
};

export const CentreLocationMap: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const businessName = settings.businessName || 'MUN COMPUTER';
  const officialAddress = formatFullAddress(settings);

  const isInsideIframe = useMemo(() => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
  }, []);

  const currentPageHref = typeof window !== 'undefined' ? window.location.href : '/';

  const savedCoords = useMemo<google.maps.LatLngLiteral | null>(() => {
    if (
      typeof settings.shopLat === 'number' &&
      typeof settings.shopLng === 'number' &&
      Number.isFinite(settings.shopLat) &&
      Number.isFinite(settings.shopLng)
    ) {
      return { lat: settings.shopLat, lng: settings.shopLng };
    }
    return null;
  }, [settings.shopLat, settings.shopLng]);

  const [centreCoords, setCentreCoords] = useState<google.maps.LatLngLiteral | null>(savedCoords);
  const [resolvedAddress, setResolvedAddress] = useState<string>(officialAddress);
  const [userGps, setUserGps] = useState<google.maps.LatLngLiteral | null>(null);
  const [userOriginLabel, setUserOriginLabel] = useState<string>('');
  const [originInput, setOriginInput] = useState<string>('');
  const [originSearchRequest, setOriginSearchRequest] = useState<SearchRequest | null>(null);
  const [travelMode, setTravelMode] = useState<TravelModeOption>('DRIVING');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsPermissionBlocked, setGpsPermissionBlocked] = useState(false);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    setResolvedAddress(officialAddress);
    if (savedCoords) {
      setCentreCoords(savedCoords);
    }
  }, [officialAddress, savedCoords]);

  const handleCentreResolved = useCallback(
    (coords: google.maps.LatLngLiteral | null, formatted: string) => {
      if (coords) setCentreCoords(coords);
      if (formatted) setResolvedAddress(formatted);
    },
    []
  );

  const handleRouteComputed = useCallback(
    (summary: RouteSummary | null, errMsg: string | null) => {
      setRouteSummary(summary);
      setRouteError(errMsg);
    },
    []
  );

  const handleOriginResolved = useCallback(
    (coords: google.maps.LatLngLiteral, label: string) => {
      setUserGps(coords);
      setUserOriginLabel(label);
      setGpsError(null);
      setGpsPermissionBlocked(false);
      setRouteError(null);
    },
    []
  );

  const handleOriginSearchError = useCallback((msg: string | null) => {
    if (msg) {
      setGpsError(msg);
    }
  }, []);

  const handleLocateUserGps = () => {
    setGpsError(null);
    setGpsPermissionBlocked(false);
    setRouteError(null);

    if (!('geolocation' in navigator)) {
      setGpsError(
        'GPS geolocation is not supported on this browser. Enter your starting village below instead.'
      );
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setUserOriginLabel('Your GPS Location');
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsPermissionBlocked(true);
          setGpsError(
            isInsideIframe
              ? 'Browser preview blocked automatic GPS access. Enter your village/town below to preview your route, or open this page in a new tab / Google Maps.'
              : 'Location access was denied by browser settings. Enter your village/town below to preview your route, or use Open in Google Maps.'
          );
        } else {
          setGpsError(
            'Unable to detect your GPS location right now. Type your starting village/town below instead.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSearchVisitorOrigin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = originInput.trim();
    if (!trimmed) return;
    setGpsError(null);
    setGpsPermissionBlocked(false);
    setRouteError(null);
    setOriginSearchRequest({ query: trimmed, nonce: Date.now() });
  };

  const activeCoords = savedCoords || centreCoords;
  const directionsQuery = activeCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeCoords.lat},${activeCoords.lng}`
    : getShopMapsUrl(settings);

  return (
    <div className="card-3d rounded-2xl overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/70 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-800">
              <MapPin className="w-4 h-4" />
              <span>GPS Centre Locator</span>
              {savedCoords && (
                <span className="font-mono-tabular text-[11px] text-emerald-700 font-semibold">
                  · Exact Shop Pin ({savedCoords.lat.toFixed(5)}, {savedCoords.lng.toFixed(5)})
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-slate-950">
              {businessName} — Location &amp; GPS Directions
            </h3>
            <p className="text-xs text-slate-600">{resolvedAddress || officialAddress}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {GOOGLE_MAPS_API_KEY && (
              <button
                type="button"
                onClick={handleLocateUserGps}
                disabled={gpsLoading}
                className="btn-3d-blue inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                {gpsLoading ? 'Detecting GPS...' : 'Use My GPS & Show Route'}
              </button>
            )}

            <a
              href={directionsQuery}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-white inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 rounded-lg whitespace-nowrap"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-800" />
              Open in Google Maps
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Starting Village/Place Route Input (Always works even if browser GPS is blocked) */}
        {GOOGLE_MAPS_API_KEY && (
          <form
            onSubmit={handleSearchVisitorOrigin}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1"
          >
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                placeholder="Or enter your village / town to show road route (e.g., Domkal, Juginda, Islampur)"
                className="input-3d w-full pl-8 pr-3 py-2 text-xs rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={!originInput.trim()}
              className="btn-3d-white inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-900 rounded-lg disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <RouteIcon className="w-3.5 h-3.5" />
              <span>Show Route From Here</span>
            </button>
          </form>
        )}
      </div>

      {(userGps || gpsError || routeError || routeSummary) && (
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {userGps && (
              <>
                <span className="font-medium text-slate-700 mr-1">
                  {userOriginLabel ? `From ${userOriginLabel} ·` : ''} Mode:
                </span>
                {(['DRIVING', 'TWO_WHEELER', 'WALKING'] as TravelModeOption[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTravelMode(mode)}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      travelMode === mode ? 'nav-3d-active' : 'nav-3d text-slate-700'
                    }`}
                  >
                    {mode === 'TWO_WHEELER' ? 'Bike' : mode === 'DRIVING' ? 'Car' : 'Walk'}
                  </button>
                ))}
              </>
            )}
          </div>

          {routeSummary && (
            <div className="flex items-center gap-4 font-medium text-slate-900">
              <span className="inline-flex items-center gap-1.5">
                <RouteIcon className="w-3.5 h-3.5 text-blue-800" />
                Distance:{' '}
                <strong className="font-mono-tabular">
                  {(routeSummary.distanceMeters / 1000).toFixed(2)} km
                </strong>
              </span>
              <span>
                Est. Travel Time:{' '}
                <strong className="font-mono-tabular">
                  {Math.max(1, Math.round(routeSummary.durationMillis / 60000))} mins
                </strong>
              </span>
            </div>
          )}

          {(gpsError || routeError) && (
            <div className="flex flex-wrap items-center gap-2.5 text-red-700 font-medium">
              <span>{gpsError || routeError}</span>
              {gpsPermissionBlocked && isInsideIframe && (
                <a
                  href={currentPageHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-white inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-900 rounded-md whitespace-nowrap"
                >
                  <span>Open Full Page for GPS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100">
        {GOOGLE_MAPS_API_KEY ? (
          <APIProvider
            apiKey={GOOGLE_MAPS_API_KEY}
            libraries={['places', 'marker', 'routes']}
            language="en"
            region="IN"
          >
            <GoogleMap
              mapId="DEMO_MAP_ID"
              defaultCenter={savedCoords || { lat: 0, lng: 0 }}
              defaultZoom={savedCoords ? 17 : 2}
              gestureHandling="cooperative"
              streetViewControl={false}
              mapTypeControl={true}
              internalUsageAttributionIds={ATTRIBUTION_IDS}
              style={{ width: '100%', height: '100%' }}
            >
              <InnerMapContent
                businessName={businessName}
                officialAddress={officialAddress}
                savedCoords={savedCoords}
                originSearchRequest={originSearchRequest}
                userGps={userGps}
                userOriginLabel={userOriginLabel}
                travelMode={travelMode}
                onCentreResolved={handleCentreResolved}
                onOriginResolved={handleOriginResolved}
                onOriginSearchError={handleOriginSearchError}
                onRouteComputed={handleRouteComputed}
              />
            </GoogleMap>
            <MapStatusOverlay />
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50">
            <MapPin className="w-7 h-7 text-blue-800" />
            <div className="space-y-1 max-w-md">
              <p className="text-sm font-semibold text-slate-950">{businessName}</p>
              <p className="text-xs text-slate-600">{officialAddress}</p>
            </div>
            <a
              href={directionsQuery}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-blue inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg"
            >
              <Navigation className="w-3.5 h-3.5" />
              Open GPS Directions in Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
