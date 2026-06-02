import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from 'primereact/button';

// Fix for default Leaflet icons in Vite/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter the map when offers change based on bounds
function MapUpdater({ bounds }) {
  const map = useMap();
  React.useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [bounds, map]);
  return null;
}

  const formatarData = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(isoDate));
  };

export const MapaOfertas = ({ ofertas, onAgendarClick }) => {
  // Filter offers that have coordinates
  const ofertasComCoords = ofertas.filter(o => 
    o.endereco && 
    o.endereco.localizacao && 
    Array.isArray(o.endereco.localizacao) && 
    o.endereco.localizacao.length === 2
  );

  let bounds = null;
  let center = [-23.5505, -46.6333]; // SP default
  
  if (ofertasComCoords.length > 0) {
    const latLngs = ofertasComCoords.map(o => [o.endereco.localizacao[1], o.endereco.localizacao[0]]);
    bounds = L.latLngBounds(latLngs);
    center = bounds.getCenter();
  }

  return (
    <div className="w-full h-[70vh] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm z-0 relative">
      <MapContainer center={center} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bounds && <MapUpdater bounds={bounds} />}
        {ofertasComCoords.map((oferta) => {
          const lat = oferta.endereco.localizacao[1];
          const lng = oferta.endereco.localizacao[0];
          
          const isCortante = oferta.material?.cortante;
          const isAltoVolume = (oferta.quantidade_cacamba > 0) || (oferta.quantidade_kg > 500);

          let qtdeStr = [];
          if (oferta.quantidade_kg) qtdeStr.push(`${oferta.quantidade_kg} kg`);
          if (oferta.quantidade_cacamba) qtdeStr.push(`${oferta.quantidade_cacamba} caçamba(s)`);
          const quantidadeFinal = qtdeStr.join(' + ') || 'Não especificada';

          return (
            <Marker key={oferta.id} position={[lat, lng]}>
              <Popup className="custom-popup">
                <div className="flex flex-col gap-3 min-w-[240px] p-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-wider leading-none">
                        {oferta.material?.nome || 'Material Desconhecido'}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight m-0">
                        {quantidadeFinal}
                      </h3>
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 rounded-md px-1.5 py-0.5 whitespace-nowrap">
                      {formatarData(oferta.data_publicacao)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-start gap-2 text-gray-600">
                      <i className="pi pi-map-marker mt-[3px] text-[12px] text-gray-400"></i>
                      <div className="text-xs leading-tight">
                        {oferta.endereco 
                          ? [oferta.endereco.bairro, oferta.endereco.cidade].filter(Boolean).join(', ') || 'Endereço incompleto'
                          : 'Endereço não informado'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="pi pi-building text-[12px] text-gray-400"></i>
                      <div className="text-xs truncate font-medium">Por: {oferta.usuario?.name || 'Fábrica parceira'}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Boolean(isCortante) && (
                      <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded leading-none flex items-center">
                        <i className="pi pi-exclamation-triangle mr-1 text-[9px]"></i> Cortante
                      </span>
                    )}
                    {Boolean(isAltoVolume) && (
                      <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded leading-none flex items-center">
                        <i className="pi pi-chart-line mr-1 text-[9px]"></i> Alto Volume
                      </span>
                    )}
                  </div>

                  <Button 
                    label="Ver Detalhes" 
                    size="small"
                    className="mt-2 w-full p-button-sm theme-btn-primary text-xs py-1.5" 
                    onClick={() => onAgendarClick(oferta)}
                  />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
