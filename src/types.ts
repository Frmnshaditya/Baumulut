export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  year?: string;
  stars?: number;
  highlight?: string;
  image?: string;
}

export interface EducationItem {
  id?: string;
  institution: string;
  period: string;
  degree?: string;
  field?: string;
  location?: string;
  description?: string;
  status?: string;
  activities?: string[];
}

export interface HobbyItem {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  icon?: string;
  iconName?: string;
  description?: string;
  favorite?: string;
  detail?: string;
}

export interface SocialLinks {
  email: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin: string;
  github: string;
  linktree?: string;
  tiktok?: string;
  address?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  type?: 'Pendidikan' | 'Organisasi' | 'Kepanitiaan' | 'Karier' | 'Moderator & Event' | string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface CVFileInfo {
  name: string;
  dataUrl: string;
  size?: number;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  greeting: string;
  bioNote: string;
  githubRepoUrl: string;
  avatarUrl?: string;
  badgeId?: string;
  cvFile?: CVFileInfo;
  aboutText: string[];
  education?: EducationItem[];
  hobbies?: HobbyItem[];
  skills: {
    frontend: string[]; // Public Speaking & Moderasi
    backend: string[]; // Fotografi & Visual
    databaseAndCloud: string[]; // Kepemimpinan & Organisasi
    toolsAndMethods: string[]; // Menulis & Media
  };
  socials: SocialLinks;
}
