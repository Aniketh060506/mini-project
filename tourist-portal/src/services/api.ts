import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract whatever the backend specifically throws
    const data = error.response?.data;
    let details = '';
    if (typeof data === 'object') {
      details = data.error || data.message || JSON.stringify(data);
    } else {
      details = String(data) || error.message;
    }
    const message = `API Error: ${details}`;
    return Promise.reject(new Error(message));
  }
);

export interface Tourist {
  id: string;
  fullName: string;
  age: number;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  deviceId: string;
  trekDestination: string;
  trekStartDate: string;
  trekEndDate: string;
  blockchainId: string;
  registrationDate: string;
}

export interface Telemetry {
  deviceId: string;
  latitude: number;
  longitude: number;
  heartRate: number;
  spo2: number;
  temperature: number;
  timestamp: string;
  isActive: boolean;
}

export interface RegisterPayload {
  fullName: string;
  age: number;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  deviceId: string;
  trekDestination: string;
  trekStartDate: string;
  trekEndDate: string;
}

export const registerTourist = async (data: RegisterPayload) => {
  const res = await api.post('/register', data);
  return res.data;
};

export const getAllTourists = async (): Promise<Tourist[]> => {
  const res = await fetch(`${API_BASE_URL}/tourists?_t=${Date.now()}`, { cache: 'no-store' });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  let raw: any[] = [];
  if (Array.isArray(data)) raw = data.flat(Infinity);
  else if (data.tourists && Array.isArray(data.tourists)) raw = data.tourists.flat(Infinity);
  else if (data.Items && Array.isArray(data.Items)) raw = data.Items.flat(Infinity);

  return raw.map((t: any) => ({
    id: t.touristId || t.id || '',
    fullName: t.name || t.fullName || '',
    age: t.age || 0,
    email: t.email || '',
    phone: t.phone || '',
    emergencyContactName: t.emergencyName || t.emergencyContactName || '',
    emergencyContactPhone: t.emergencyContact || t.emergencyContactPhone || '',
    deviceId: t.deviceId || '',
    trekDestination: t.trekDestination || '',
    trekStartDate: t.trekStartDate || '',
    trekEndDate: t.trekEndDate || '',
    blockchainId: t.blockchainId ? String(t.blockchainId) : '',
    registrationDate: t.registrationTime || t.registrationDate || '',
  }));
};

export const getTelemetry = async (deviceId: string): Promise<Telemetry> => {
  const res = await fetch(`${API_BASE_URL}/telemetry/${deviceId}?_t=${Date.now()}`, { cache: 'no-store' });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  let raw: any[] = [];
  if (Array.isArray(data)) raw = data.flat(Infinity);
  else if (data.telemetry && Array.isArray(data.telemetry)) raw = data.telemetry.flat(Infinity);
  else if (data.Items && Array.isArray(data.Items)) raw = data.Items.flat(Infinity);

  const latest = raw[0]; // already sorted newest-first by Lambda
  if (!latest) throw new Error('No telemetry data available');
  return {
    deviceId: latest.deviceId || deviceId,
    latitude: latest.latitude || 0,
    longitude: latest.longitude || 0,
    heartRate: latest.heartRate || 0,
    spo2: latest.spo2 || 0,
    temperature: latest.temperature || 0,
    timestamp: latest.timestamp ? new Date(latest.timestamp).toISOString() : new Date().toISOString(),
    isActive: true,
  };
};

// Mock data for demo purposes
export const getMockTourist = (id: string): Tourist => ({
  id,
  fullName: 'Rajesh Kumar',
  age: 28,
  email: 'rajesh@example.com',
  phone: '+919876543210',
  emergencyContactName: 'Priya Kumar',
  emergencyContactPhone: '+919876543211',
  deviceId: 'ESP32-A1B2C3',
  trekDestination: 'Kedarkantha Peak',
  trekStartDate: '2026-04-10',
  trekEndDate: '2026-04-15',
  blockchainId: '0x7a3b...f4e2d1c8',
  registrationDate: '2026-04-01',
});

export const getMockTelemetry = (): Telemetry => ({
  deviceId: 'ESP32-A1B2C3',
  latitude: 31.0167 + (Math.random() - 0.5) * 0.01,
  longitude: 78.1833 + (Math.random() - 0.5) * 0.01,
  heartRate: 72 + Math.floor(Math.random() * 20),
  spo2: 94 + Math.floor(Math.random() * 5),
  temperature: 36.2 + Math.random() * 1.5,
  timestamp: new Date().toISOString(),
  isActive: true,
});

export default api;
