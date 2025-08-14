export interface DaycareProperties {
  OBJECTID: number;
  NAME: string;
  ADDRESS: string;
  WARD: number;
  PHONE: string;
  LINK: string;
  LONGITUDE: number;
  LATITUDE: number;
  TYPE: number;
  TYPE2: string;
  SGSPACE: number; // School age spaces
  IGSPACE: number; // Infant spaces
  TGSPACE: number; // Toddler spaces
  PGSPACE: number; // Preschool spaces
  KGSPACE: number; // Kindergarten spaces
  CWELCC_FLAG: string; // Canada-Wide Early Learning program
}

export interface DaycareFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: DaycareProperties;
}

export interface DaycareResponse {
  type: 'FeatureCollection';
  features: DaycareFeature[];
}