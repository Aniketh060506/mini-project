import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://n0j2j5nd48.execute-api.ap-south-1.amazonaws.com/prod';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // No authenticated user
  }
  return config;
});

export interface Tourist {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  deviceId: string;
  trekDestination: string;
  status: 'active' | 'inactive';
  alertStatus: 'safe' | 'warning' | 'critical' | 'offline';
  lastSeen: string;
  lat: number;
  lng: number;
  heartRate: number;
  spo2: number;
  temperature: number;
  emergencyContact: string;
  emergencyPhone: string;
  blockchainId: string;
  registrationDate: string;
  photo?: string;
}

export interface Alert {
  id: string;
  touristId: string;
  touristName: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  lat: number;
  lng: number;
  sensorData?: { heartRate?: number; spo2?: number; temperature?: number };
}

export interface TelemetryPoint {
  timestamp: string;
  heartRate: number;
  spo2: number;
  temperature: number;
  lat: number;
  lng: number;
}

export const getTourists = async (): Promise<Tourist[]> => {
  const res = await api.get('/tourists');
  const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  const raw = Array.isArray(data) ? data : (data.tourists || []);
  return raw.map((t: any) => ({
    id: t.touristId || t.id || '',
    name: t.name || '',
    age: t.age || 0,
    phone: t.phone || '',
    email: t.email || '',
    deviceId: t.deviceId || '',
    trekDestination: t.trekDestination || '',
    status: t.status || 'active',
    alertStatus: t.alertStatus || 'safe',
    lastSeen: t.registrationTime || t.lastSeen || new Date().toISOString(),
    lat: t.lat || 0,
    lng: t.lng || 0,
    heartRate: t.heartRate || 0,
    spo2: t.spo2 || 0,
    temperature: t.temperature || 0,
    emergencyContact: t.emergencyName || t.emergencyContact || '',
    emergencyPhone: t.emergencyContact || t.emergencyPhone || '',
    blockchainId: t.blockchainId ? String(t.blockchainId) : '',
    registrationDate: t.registrationTime || t.registrationDate || '',
  }));
};

export const getAlerts = async (): Promise<Alert[]> => {
  const res = await fetch(`${API_BASE_URL}/alerts?status=ACTIVE&_t=${Date.now()}`, { cache: 'no-store' });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  const raw = Array.isArray(data) ? data : (data.alerts || []);
  return raw.map((a: any) => ({
    id: a.alertId || a.id || '',
    touristId: a.touristId || '',
    touristName: a.touristName || a.touristId || 'Unknown',
    type: a.alertType || a.type || 'UNKNOWN',
    severity: (a.severity || 'info').toLowerCase() as 'critical' | 'warning' | 'info',
    message: a.message || '',
    timestamp: a.timestamp ? new Date(a.timestamp).toISOString() : new Date().toISOString(),
    acknowledged: a.status === 'ACKNOWLEDGED' || a.acknowledged || false,
    lat: a.latitude || a.lat || 0,
    lng: a.longitude || a.lng || 0,
    sensorData: a.sensorData,
  }));
};

export const getTelemetryHistory = async (deviceId: string): Promise<TelemetryPoint[]> => {
  const res = await fetch(`${API_BASE_URL}/telemetry/${deviceId}?limit=50&_t=${Date.now()}`, {
    cache: 'no-store'
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  const arrayData = Array.isArray(data) ? data : (data.telemetry || []);
  const raw = Array.isArray(arrayData) ? arrayData.flat() : [];
  return raw.map((pt: any) => ({
    timestamp: pt.timestamp ? new Date(pt.timestamp).toISOString() : new Date().toISOString(),
    heartRate: pt.heartRate || 0,
    spo2: pt.spo2 || 0,
    temperature: pt.temperature || 0,
    lat: pt.latitude || pt.lat || 0,
    lng: pt.longitude || pt.lng || 0,
  }));
};

// ==========================================
// MUTATIONS (POST Operations)
// ==========================================

export const addTourist = async (tourist: Partial<Tourist>): Promise<any> => {
  try {
    const res = await api.post('/tourists', tourist);
    return res.data;
  } catch (error) {
    console.error('Error adding tourist:', error);
    throw error;
  }
};

export const importTouristsBatch = async (data: any[]): Promise<any> => {
  try {
    // Assuming backend takes a batch array of tourists
    const res = await api.post('/tourists/batch', { tourists: data });
    return res.data;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

export const createAlert = async (alertData: Partial<Alert>): Promise<any> => {
  try {
    const res = await api.post('/alerts', alertData);
    return res.data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};
