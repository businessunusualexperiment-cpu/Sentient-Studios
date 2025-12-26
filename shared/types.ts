export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface PaginatedResponse<T> {
  items: T[];
  next: string | null;
}
export const ALL_SPECIALTIES: string[] = [
  'Frontend', 'React', 'TypeScript', 'Web Performance',
  'Backend', 'Node.js', 'Microservices', 'AWS', 'System Design',
  'Product Management', 'Product Strategy', 'User Research', 'Agile', 'Roadmapping',
  'UX/UI Design', 'User Experience', 'Interaction Design', 'Figma', 'Design Systems',
  'Data Science', 'Machine Learning', 'Python', 'Data Visualization', 'Statistics',
  'DevOps', 'CI/CD', 'Kubernetes', 'Terraform', 'Site Reliability',
  'Marketing', 'Digital Marketing', 'SEO', 'Content Strategy', 'Brand Building',
  'Mobile Development', 'iOS', 'Swift', 'Android', 'Kotlin', 'React Native',
  'Cybersecurity', 'Network Security', 'Penetration Testing', 'Incident Response',
  'Venture Capital', 'Startups', 'Fundraising', 'Business Strategy', 'Pitching',
  'AI Research', 'Natural Language Processing', 'Deep Learning', 'PyTorch',
  'Entrepreneurship', 'Leadership', 'Product-Market Fit',
];
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  passwordHash?: string;
  isMentor?: boolean;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Catalyst Connect Mentor Type
export interface Mentor {
    id: string;
    name: string;
    title: string;
    company: string;
    specialties: string[];
    bio: string;
    imageUrl: string;
}
// Catalyst Connect Connection Type
export interface Connection {
    id:string;
    mentorId: string;
    menteeId: string;
    status: 'pending' | 'accepted' | 'declined';
    requestedAt: number;
    acceptedAt?: number;
    initialMessage?: string;
    chatId?: string; // Added to link connection to a chat
}