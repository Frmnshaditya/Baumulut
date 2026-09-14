export interface SocialLinks {
  email: string;
  github?: string;
  linkedin?: string;
  medium?: string;
  twitter?: string;
  phone?: string;
  linktree?: string;
  whatsapp?: string;
  instagram?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  period?: string;
  status: string;
  description?: string;
}

export interface HobbyItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  category: 'Public Speaking' | 'Photography' | 'Organization' | 'Writing' | 'Full Stack' | 'Frontend' | 'Mobile' | 'Open Source';
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  year: string;
  stars?: number;
  highlight?: string;
  image?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
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

