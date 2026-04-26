export type AmbulanceStatus = 'available' | 'on_duty' | 'maintenance';
export type TripStatus = 'completed' | 'active';
export type TripType = 'emergency' | 'scheduled' | 'transfer';
export type CrewStatus = 'on_duty' | 'standby' | 'off';
export type MaintenanceStatus = 'completed' | 'scheduled' | 'overdue';
export type AlertType = 'danger' | 'warning' | 'info';

export interface Ambulance {
  id: string;
  plate: string;
  model: string;
  driver: string;
  status: AmbulanceStatus;
  location: string;
  lat: number;
  lng: number;
  lastTrip: string;
  oxygenLevel: number;
  mileage: number;
}

export interface Trip {
  id: string;
  ambulanceId: string;
  driver: string;
  origin: string;
  destination: string;
  type: TripType;
  status: TripStatus;
  startTime: string;
  endTime: string;
  duration: number;
  patientName: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  certExpiry: string;
  assignedAmbulance: string;
  status: CrewStatus;
  shiftsThisMonth: number;
  tripsThisMonth: number;
}

export interface MaintenanceRecord {
  id: string;
  ambulanceId: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  scheduledDate: string;
  completedDate: string;
  status: MaintenanceStatus;
  cost: number;
  garage: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  time: string;
  ambulanceId: string;
}

export const ambulances: Ambulance[] = [
  { id: 'AMB-01', plate: '1842 KSA', model: 'Toyota HiAce', driver: 'Ahmed Al-Rashidi', status: 'available', location: 'King Fahad Rd, Dammam', lat: 26.42, lng: 50.09, lastTrip: '08:55', oxygenLevel: 85, mileage: 42300 },
  { id: 'AMB-02', plate: '3391 KSA', model: 'Mercedes Sprinter', driver: 'Khalid Mubarak', status: 'on_duty', location: 'En route to NMC', lat: 26.43, lng: 50.11, lastTrip: '09:22', oxygenLevel: 91, mileage: 38700 },
  { id: 'AMB-03', plate: '7710 KSA', model: 'Toyota HiAce', driver: 'Faris Al-Otaibi', status: 'available', location: 'Safa District', lat: 26.40, lng: 50.08, lastTrip: '08:10', oxygenLevel: 77, mileage: 55100 },
  { id: 'AMB-04', plate: '5503 KSA', model: 'Ford Transit', driver: 'Tariq Al-Zahrani', status: 'on_duty', location: 'Al-Hamra District', lat: 26.44, lng: 50.13, lastTrip: '09:05', oxygenLevel: 19, mileage: 61200 },
  { id: 'AMB-05', plate: '9921 KSA', model: 'Toyota HiAce', driver: 'Omar Bin Saeed', status: 'available', location: 'Al Noor Clinic Base', lat: 26.41, lng: 50.10, lastTrip: '07:40', oxygenLevel: 95, mileage: 29800 },
  { id: 'AMB-06', plate: '2204 KSA', model: 'Ford Transit', driver: 'Unassigned', status: 'maintenance', location: 'Al-Salam Garage', lat: 26.39, lng: 50.07, lastTrip: 'Apr 14', oxygenLevel: 0, mileage: 73400 },
];

export const trips: Trip[] = [
  { id: 'TRP-2801', ambulanceId: 'AMB-02', driver: 'Khalid Mubarak', origin: 'Al Noor Base', destination: 'National Medical Center', type: 'emergency', status: 'active', startTime: '09:22', endTime: '', duration: 18, patientName: 'Sami Al-Harbi' },
  { id: 'TRP-2800', ambulanceId: 'AMB-04', driver: 'Tariq Al-Zahrani', origin: 'Al-Hamra District', destination: 'King Fahad Hospital', type: 'emergency', status: 'active', startTime: '09:05', endTime: '', duration: 22, patientName: 'Nadia Khalil' },
  { id: 'TRP-2799', ambulanceId: 'AMB-01', driver: 'Ahmed Al-Rashidi', origin: 'King Fahad Rd', destination: 'Al Noor Base', type: 'scheduled', status: 'completed', startTime: '08:30', endTime: '08:55', duration: 25, patientName: 'Yousef Alotaibi' },
  { id: 'TRP-2798', ambulanceId: 'AMB-03', driver: 'Faris Al-Otaibi', origin: 'Safa District', destination: 'Dammam Central Hospital', type: 'transfer', status: 'completed', startTime: '07:50', endTime: '08:10', duration: 20, patientName: 'Maryam Hassan' },
  { id: 'TRP-2797', ambulanceId: 'AMB-05', driver: 'Omar Bin Saeed', origin: 'Al Noor Clinic', destination: 'Al Zahraa Hospital', type: 'scheduled', status: 'completed', startTime: '07:10', endTime: '07:40', duration: 30, patientName: 'Fahad Al-Shammari' },
  { id: 'TRP-2796', ambulanceId: 'AMB-01', driver: 'Ahmed Al-Rashidi', origin: 'King Abdulaziz St', destination: 'National Medical Center', type: 'emergency', status: 'completed', startTime: '06:40', endTime: '07:00', duration: 20, patientName: 'Reem Al-Dosari' },
  { id: 'TRP-2795', ambulanceId: 'AMB-02', driver: 'Khalid Mubarak', origin: 'Al Noor Base', destination: 'Qatif General Hospital', type: 'transfer', status: 'completed', startTime: '06:15', endTime: '06:55', duration: 40, patientName: 'Ibrahim Al-Qahtani' },
  { id: 'TRP-2794', ambulanceId: 'AMB-03', driver: 'Faris Al-Otaibi', origin: 'Al Andalus District', destination: 'NMC Emergency', type: 'emergency', status: 'completed', startTime: '05:55', endTime: '06:12', duration: 17, patientName: 'Sara Al-Maliki' },
  { id: 'TRP-2793', ambulanceId: 'AMB-04', driver: 'Tariq Al-Zahrani', origin: 'Dammam Corniche', destination: 'Saudi Aramco Hospital', type: 'scheduled', status: 'completed', startTime: '05:20', endTime: '05:50', duration: 30, patientName: 'Hassan Al-Ghamdi' },
  { id: 'TRP-2792', ambulanceId: 'AMB-05', driver: 'Omar Bin Saeed', origin: 'Al Noor Base', destination: 'King Fahad Hospital', type: 'transfer', status: 'completed', startTime: '04:45', endTime: '05:15', duration: 30, patientName: 'Amira Al-Zahrani' },
  { id: 'TRP-2791', ambulanceId: 'AMB-01', driver: 'Ahmed Al-Rashidi', origin: 'Prince Muhammad Rd', destination: 'Dammam Central', type: 'emergency', status: 'completed', startTime: '04:10', endTime: '04:30', duration: 20, patientName: 'Majed Al-Farhan' },
  { id: 'TRP-2790', ambulanceId: 'AMB-03', driver: 'Faris Al-Otaibi', origin: 'Al-Shula District', destination: 'Al Noor Base', type: 'scheduled', status: 'completed', startTime: '03:30', endTime: '04:00', duration: 30, patientName: 'Layla Al-Ahmad' },
  { id: 'TRP-2789', ambulanceId: 'AMB-02', driver: 'Khalid Mubarak', origin: 'Al Badiyah', destination: 'NMC ICU', type: 'emergency', status: 'completed', startTime: '02:55', endTime: '03:22', duration: 27, patientName: 'Saleh Al-Muzaini' },
  { id: 'TRP-2788', ambulanceId: 'AMB-05', driver: 'Omar Bin Saeed', origin: 'Al Noor Clinic', destination: 'Dammam Medical Tower', type: 'transfer', status: 'completed', startTime: '02:20', endTime: '02:50', duration: 30, patientName: 'Noura Al-Subaie' },
  { id: 'TRP-2787', ambulanceId: 'AMB-04', driver: 'Tariq Al-Zahrani', origin: 'King Khalid District', destination: 'King Fahad Hospital', type: 'emergency', status: 'completed', startTime: '01:50', endTime: '02:12', duration: 22, patientName: 'Waleed Al-Mutairi' },
  { id: 'TRP-2786', ambulanceId: 'AMB-01', driver: 'Ahmed Al-Rashidi', origin: 'Al Adama', destination: 'National Medical Center', type: 'scheduled', status: 'completed', startTime: '01:10', endTime: '01:40', duration: 30, patientName: 'Fatima Al-Bishi' },
  { id: 'TRP-2785', ambulanceId: 'AMB-03', driver: 'Faris Al-Otaibi', origin: 'Al Noor Base', destination: 'Qatif Central', type: 'transfer', status: 'completed', startTime: '00:30', endTime: '01:05', duration: 35, patientName: 'Abdullah Al-Dossary' },
  { id: 'TRP-2784', ambulanceId: 'AMB-02', driver: 'Khalid Mubarak', origin: 'Al Khobar Highway', destination: 'NMC Emergency', type: 'emergency', status: 'completed', startTime: 'Apr 25 23:45', endTime: 'Apr 25 00:05', duration: 20, patientName: 'Hana Al-Rasheed' },
  { id: 'TRP-2783', ambulanceId: 'AMB-05', driver: 'Omar Bin Saeed', origin: 'Industrial Area', destination: 'Aramco Hospital', type: 'emergency', status: 'completed', startTime: 'Apr 25 23:10', endTime: 'Apr 25 23:38', duration: 28, patientName: 'Mahmoud Al-Qahtani' },
  { id: 'TRP-2782', ambulanceId: 'AMB-04', driver: 'Tariq Al-Zahrani', origin: 'Dammam Port', destination: 'King Fahad Hospital', type: 'transfer', status: 'completed', startTime: 'Apr 25 22:40', endTime: 'Apr 25 23:05', duration: 25, patientName: 'Samar Alotaibi' },
];

export const crew: CrewMember[] = [
  { id: 'CRW-01', name: 'Ahmed Al-Rashidi', role: 'Senior EMT', certifications: ['BLS', 'ACLS'], certExpiry: '2025-08-14', assignedAmbulance: 'AMB-01', status: 'on_duty', shiftsThisMonth: 18, tripsThisMonth: 24 },
  { id: 'CRW-02', name: 'Khalid Mubarak', role: 'Paramedic', certifications: ['BLS', 'ACLS', 'PALS'], certExpiry: '2024-05-20', assignedAmbulance: 'AMB-02', status: 'on_duty', shiftsThisMonth: 20, tripsThisMonth: 31 },
  { id: 'CRW-03', name: 'Faris Al-Otaibi', role: 'EMT', certifications: ['BLS'], certExpiry: '2025-11-30', assignedAmbulance: 'AMB-03', status: 'on_duty', shiftsThisMonth: 16, tripsThisMonth: 19 },
  { id: 'CRW-04', name: 'Tariq Al-Zahrani', role: 'Paramedic', certifications: ['BLS', 'ACLS'], certExpiry: '2024-05-10', assignedAmbulance: 'AMB-04', status: 'on_duty', shiftsThisMonth: 22, tripsThisMonth: 28 },
  { id: 'CRW-05', name: 'Omar Bin Saeed', role: 'Senior EMT', certifications: ['BLS', 'ACLS'], certExpiry: '2025-09-01', assignedAmbulance: 'AMB-05', status: 'standby', shiftsThisMonth: 14, tripsThisMonth: 17 },
  { id: 'CRW-06', name: 'Nasser Al-Ghamdi', role: 'EMT', certifications: ['BLS'], certExpiry: '2025-12-15', assignedAmbulance: '—', status: 'off', shiftsThisMonth: 12, tripsThisMonth: 14 },
  { id: 'CRW-07', name: 'Saad Al-Harbi', role: 'Paramedic', certifications: ['BLS', 'ACLS', 'ITLS'], certExpiry: '2025-07-22', assignedAmbulance: '—', status: 'standby', shiftsThisMonth: 19, tripsThisMonth: 23 },
  { id: 'CRW-08', name: 'Majid Al-Sulaiman', role: 'EMT', certifications: ['BLS'], certExpiry: '2024-05-05', assignedAmbulance: '—', status: 'off', shiftsThisMonth: 10, tripsThisMonth: 11 },
];

export const maintenance: MaintenanceRecord[] = [
  { id: 'MNT-01', ambulanceId: 'AMB-06', type: 'repair', description: 'Engine overhaul — cooling system failure', scheduledDate: '2024-04-14', completedDate: '', status: 'overdue', cost: 4200, garage: 'Al-Salam Garage' },
  { id: 'MNT-02', ambulanceId: 'AMB-04', type: 'inspection', description: 'Annual safety inspection', scheduledDate: '2024-04-28', completedDate: '', status: 'scheduled', cost: 350, garage: 'Al-Salam Garage' },
  { id: 'MNT-03', ambulanceId: 'AMB-03', type: 'routine', description: 'Oil change + filter replacement', scheduledDate: '2024-04-20', completedDate: '2024-04-20', status: 'completed', cost: 180, garage: 'Fleet Auto Service' },
  { id: 'MNT-04', ambulanceId: 'AMB-01', type: 'routine', description: 'Brake pad replacement', scheduledDate: '2024-04-10', completedDate: '2024-04-10', status: 'completed', cost: 620, garage: 'Fleet Auto Service' },
  { id: 'MNT-05', ambulanceId: 'AMB-02', type: 'inspection', description: 'Medical equipment compliance check', scheduledDate: '2024-05-05', completedDate: '', status: 'scheduled', cost: 200, garage: 'NMC Maintenance Dept' },
  { id: 'MNT-06', ambulanceId: 'AMB-05', type: 'routine', description: 'Tire rotation + alignment', scheduledDate: '2024-04-18', completedDate: '2024-04-18', status: 'completed', cost: 280, garage: 'Fleet Auto Service' },
];

export const alerts: Alert[] = [
  { id: 'ALT-01', type: 'danger', title: 'Critical Oxygen Low', description: 'AMB-04 oxygen cylinder at 19% — immediate restock required before next dispatch.', time: '09:08', ambulanceId: 'AMB-04' },
  { id: 'ALT-02', type: 'warning', title: 'Certification Expiring', description: 'Khalid Mubarak (CRW-02) ACLS certification expires in 24 days.', time: '08:30', ambulanceId: 'AMB-02' },
  { id: 'ALT-03', type: 'danger', title: 'Vehicle Overdue Maintenance', description: 'AMB-06 engine repair overdue by 12 days. Unit grounded.', time: '08:00', ambulanceId: 'AMB-06' },
  { id: 'ALT-04', type: 'warning', title: 'Inspection Due', description: 'AMB-04 annual safety inspection scheduled in 2 days.', time: '07:00', ambulanceId: 'AMB-04' },
  { id: 'ALT-05', type: 'info', title: 'Fleet Utilization High', description: 'Today\'s utilization at 72% — above weekly average of 61%.', time: '06:00', ambulanceId: '' },
];

export const kpis = {
  available: 3,
  onDuty: 2,
  avgResponseTime: 7.4,
  openAlerts: 3,
  tripsToday: 18,
  avgDuration: 19,
  utilization: 72,
  incidents: 0,
  weeklyTrips: [12, 15, 11, 17, 14, 10, 18],
  monthlyRevenue: 14200,
};

export const dailyTrips = [
  { day: 'Apr 1', trips: 14 }, { day: 'Apr 2', trips: 16 }, { day: 'Apr 3', trips: 11 },
  { day: 'Apr 4', trips: 9 }, { day: 'Apr 5', trips: 13 }, { day: 'Apr 6', trips: 18 },
  { day: 'Apr 7', trips: 15 }, { day: 'Apr 8', trips: 12 }, { day: 'Apr 9', trips: 10 },
  { day: 'Apr 10', trips: 17 }, { day: 'Apr 11', trips: 14 }, { day: 'Apr 12', trips: 19 },
  { day: 'Apr 13', trips: 16 }, { day: 'Apr 14', trips: 8 }, { day: 'Apr 15', trips: 11 },
  { day: 'Apr 16', trips: 15 }, { day: 'Apr 17', trips: 13 }, { day: 'Apr 18', trips: 17 },
  { day: 'Apr 19', trips: 20 }, { day: 'Apr 20', trips: 14 }, { day: 'Apr 21', trips: 12 },
  { day: 'Apr 22', trips: 16 }, { day: 'Apr 23', trips: 18 }, { day: 'Apr 24', trips: 15 },
  { day: 'Apr 25', trips: 11 }, { day: 'Apr 26', trips: 18 },
];

export const responseTimeTrend = [
  { week: 'W1', time: 8.2 }, { week: 'W2', time: 7.9 }, { week: 'W3', time: 8.5 }, { week: 'W4', time: 7.4 },
];

export const fleetUtilization = [
  { id: 'AMB-01', utilization: 78 },
  { id: 'AMB-02', utilization: 85 },
  { id: 'AMB-03', utilization: 71 },
  { id: 'AMB-04', utilization: 82 },
  { id: 'AMB-05', utilization: 65 },
  { id: 'AMB-06', utilization: 0 },
];
