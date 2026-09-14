import { ProfileData, Project, Experience, EducationItem, HobbyItem } from '../types';

export const initialEducation: EducationItem[] = [
  {
    id: 'edu-4',
    institution: 'UIN K.H. Saifuddin Zuhri Purwokerto (UIN Saizu)',
    period: 'Sekarang',
    status: 'Dalam Proses',
    description: 'Menempuh pendidikan perguruan tinggi aktif di UIN Saizu Purwokerto dengan fokus minat pada komunikasi, fotografi, dan pengembangan diri.',
  },
  {
    id: 'edu-3',
    institution: 'SMA IT Al-Qur\'aniyyah',
    period: 'Lulus',
    status: 'Selesai',
    description: 'Pendidikan Menengah Atas berbasis Islam Terpadu dengan penguatan karakter, kepemimpinan organisasi santri, dan tahfidz.',
  },
  {
    id: 'edu-2',
    institution: 'SMP IT Al-Qur\'aniyyah',
    period: 'Lulus',
    status: 'Selesai',
    description: 'Pendidikan Menengah Pertama dengan fondasi disiplin keagamaan dan keaktifan ekstrakurikuler kepesantrenan.',
  },
  {
    id: 'edu-1',
    institution: 'MI Fatahillah Ciledug',
    period: 'Lulus',
    status: 'Selesai',
    description: 'Pendidikan Dasar Madrasah Ibtidaiyah di Ciledug, Tangerang, Banten.',
  },
];

export const initialHobbies: HobbyItem[] = [
  {
    id: 'hobby-touring',
    title: 'Touring & Adventure',
    description: 'Mencari pengalaman dan perspektif baru di jalanan, menjelajahi rute perjalanan alam bebas dan pesisir nusantara.',
    iconName: 'Compass',
  },
  {
    id: 'hobby-fotografi',
    title: 'Fotografi Visual',
    description: 'Mengabadikan setiap momen dan detail perjalanan melalui lensa kamera untuk menciptakan narasi visual yang kuat dan bercerita.',
    iconName: 'Camera',
  },
  {
    id: 'hobby-membaca',
    title: 'Membaca',
    description: 'Secara aktif membaca buku dan referensi multidisiplin untuk memperluas pengetahuan, wawasan, dan cara pandang.',
    iconName: 'BookOpen',
  },
  {
    id: 'hobby-menulis',
    title: 'Menulis Reflektif',
    description: 'Menyalurkan wawasan dan perjalanan hidup melalui tulisan sebagai medium penting untuk merefleksikan dan mengkomunikasikan cerita hidup.',
    iconName: 'PenTool',
  },
];

export const initialProfile: ProfileData = {
  name: 'Asqi Faizul Ikmaludin',
  title: 'Public Speaking & Adventure | Fotografer',
  location: 'Cluster Bungas, Kel. Peninggilan Utara, Kec. Ciledug, Banten',
  greeting: 'Assalamu \'alaikum warahmatullahi wabarakatuh. Salam hormat dan sejahtera, Saya Asqi Faizul Ikmaludin, Mahasiswa Universitas Islam Negeri K.H. Saifuddin Zuhri Purwokerto (UIN Saizu), dan Saya berprofesi sebagai fotografer.',
  bioNote: 'Public Speaking & Adventure | Fotografi Visual | Pengurus Organisasi Santri | Mahasiswa UIN Saizu',
  githubRepoUrl: 'https://linktr.ee/IKMLDN',
  avatarUrl: '/src/assets/images/asqi_avatar_1789372297465.jpg',
  badgeId: 'UIN-SAIZU-ASQI-2026',
  aboutText: [
    'Assalamu \'alaikum warahmatullahi wabarakatuh. Salam hormat dan sejahtera. Saya Asqi Faizul Ikmaludin, Mahasiswa Universitas Islam Negeri K.H. Saifuddin Zuhri Purwokerto (UIN Saizu), dan Saya berprofesi sebagai fotografer.',
    'Hobi utama saya berpusat pada eksplorasi dan ekspresi: Saya menikmati Touring untuk mencari pengalaman dan perspektif baru di jalanan, yang kemudian saya abadikan dalam detail melalui Fotografi untuk menciptakan narasi visual yang kuat. Sebagai pelengkap, saya secara aktif Membaca untuk memperluas pengetahuan. Semua pengalaman dan wawasan ini kemudian saya salurkan melalui Menulis, menjadikannya medium penting untuk merefleksikan dan mengkomunikasikan cerita hidup saya.'
  ],
  education: initialEducation,
  hobbies: initialHobbies,
  skills: {
    frontend: ['Moderator Acara', 'Public Speaking', 'Master of Ceremonies (MC)', 'Komunikasi Publik', 'Ice Breaking', 'Presentasi & Retorika'],
    backend: ['Fotografi Landscape', 'Street & Touring Photography', 'Visual Storytelling', 'Event Documentation', 'Komposisi & Framing', 'Lightroom & Editing'],
    databaseAndCloud: ['Ketua Bidang Kesehatan OSPP', 'Pengurus Takhosus Al-Qur\'an', 'Karang Taruna Sudimara Timur', 'Manajemen Tim Santri', 'Kepemimpinan'],
    toolsAndMethods: ['Penulisan Reflektif & Esai', 'Literasi & Riset', 'Digital Marketing Basics', 'Touring & Field Exploration', 'Manajemen Acara']
  },
  socials: {
    email: 'faizulasqi13@gmail.com',
    phone: '083152414790',
    linktree: 'https://linktr.ee/IKMLDN',
    whatsapp: 'https://wa.me/6283152414790',
    github: 'https://linktr.ee/IKMLDN',
    linkedin: 'https://linktr.ee/IKMLDN'
  }
};

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Moderator Seminar & Pelatihan Digital Marketing',
    description: 'Menjadi Moderator pada Acara Seminar dan Pelatihan bertema Digital Marketing di SMK Citra Bangsa Mandiri (CBM) pada tahun 2025.',
    longDescription: 'Bertanggung jawab memimpin alur komunikasi acara, memperkenalkan narasumber industri, memfasilitasi interaksi dua arah bersama ratusan peserta siswa-siswi, serta mengelola sesi tanya jawab interaktif seputar strategi pemasaran digital modern.',
    tags: ['Moderator', 'Public Speaking', 'SMK CBM', 'Digital Marketing', 'Event 2025'],
    category: 'Public Speaking',
    githubUrl: 'https://linktr.ee/IKMLDN',
    liveUrl: 'https://linktr.ee/IKMLDN',
    featured: true,
    year: '2025',
    highlight: 'Moderator Acara Seminar di SMK Citra Bangsa Mandiri (CBM)',
    image: '/src/assets/images/asqi_avatar_1789372297465.jpg'
  },
  {
    id: 'proj-2',
    title: 'Dokumentasi Visual & Fotografi Touring Adventure',
    description: 'Eksplorasi rute touring dan narasi visual fotografi pesisir pantai dan panorama alam bebas untuk mengabadikan cerita perjalanan.',
    longDescription: 'Seri karya fotografi yang memadukan hobi touring dengan seni fotografi lanskap. Menangkap perspektif baru di jalanan, interaksi humanis, serta siluet senja di pesisir pantai sebagai sarana visual storytelling.',
    tags: ['Fotografi', 'Touring', 'Visual Storytelling', 'Adventure', 'Landscape'],
    category: 'Photography',
    githubUrl: 'https://linktr.ee/IKMLDN',
    liveUrl: 'https://linktr.ee/IKMLDN',
    featured: true,
    year: '2024 - 2025',
    highlight: 'Karya Fotografi & Dokumentasi Petualangan Terpadu',
    image: '/src/assets/images/asqi_hobby_1789372311639.jpg'
  },
  {
    id: 'proj-3',
    title: 'Program Kerja Bidang Kesehatan OSPP Al-Qur\'aniyyah',
    description: 'Kepemimpinan sebagai Ketua Pengurus di Bidang Kesehatan Organisasi Santri Pondok Pesantren Al-Qur\'aniyyah (OSPP) periode 2022-2023.',
    longDescription: 'Menginisiasi program sanitasi lingkungan asrama santri, sistem posko kesehatan santri, pertolongan pertama, serta penyuluhan pola hidup bersih dan sehat di lingkungan pondok pesantren.',
    tags: ['OSPP', 'Ketua Kesehatan', 'Pesantren Al-Qur\'aniyyah', 'Kepemimpinan'],
    category: 'Organization',
    githubUrl: 'https://linktr.ee/IKMLDN',
    liveUrl: 'https://linktr.ee/IKMLDN',
    featured: true,
    year: '2022 - 2023',
    highlight: 'Ketua Pengurus Bidang Kesehatan OSPP 2022-2023'
  },
  {
    id: 'proj-4',
    title: 'Pengurus Takhosus Al-Qur\'an Ponpes Al-Qur\'aniyyah',
    description: 'Pengelolaan program intensif takhosus hafalan dan kajian Al-Qur\'an bagi para santri pada periode 2022-2023.',
    longDescription: 'Mendampingi santri dalam penjadwalan setoran hafalan, muraja\'ah bersama, penegakan kedisiplinan halaqah, serta pembinaan akhlak santri penghafal Al-Qur\'an.',
    tags: ['Takhosus Al-Qur\'an', 'Tahfidz', 'Mentoring', 'Pengurus Santri'],
    category: 'Organization',
    githubUrl: 'https://linktr.ee/IKMLDN',
    liveUrl: 'https://linktr.ee/IKMLDN',
    featured: false,
    year: '2022 - 2023',
    highlight: 'Pengurus Santri Takhosus Al-Qur\'an 2022-2023'
  },
  {
    id: 'proj-5',
    title: 'Pengurus Karang Taruna Sudimara Timur Ciledug',
    description: 'Partisipasi aktif dalam organisasi kepemudaan Karang Taruna Kelurahan Sudimara Timur, Kecamatan Ciledug pada tahun 2021.',
    longDescription: 'Menggerakkan pemuda setempat dalam kegiatan sosial kemasyarakatan, peringatan hari besar keagamaan dan nasional, bakti lingkungan, serta penguatan solidaritas pemuda.',
    tags: ['Karang Taruna', 'Sudimara Timur', 'Ciledug', 'Pemberdayaan Pemuda'],
    category: 'Organization',
    githubUrl: 'https://linktr.ee/IKMLDN',
    liveUrl: 'https://linktr.ee/IKMLDN',
    featured: false,
    year: '2021',
    highlight: 'Organisasi Karang Taruna Kel. Sudimara Timur 2021'
  },
  {
    id: 'proj-6',
    title: 'Karya Tulis & Refleksi Narasi Hidup',
    description: 'Rangkaian tulisan refleksi yang mensinergikan wawasan dari membaca, petualangan touring, dan pengalaman organisasi sosial.',
    longDescription: 'Dokumentasi pemikiran dan catatan perjalanan yang menjadi medium esensial dalam merefleksikan dan mengomunikasikan perjalanan hidup, pembelajaran kepemimpinan, dan nilai-nilai kemanusiaan.',
    tags: ['Menulis', 'Membaca', 'Literasi', 'Refleksi Diri'],
    category: 'Writing',
    githubUrl: 'https://linktr.ee/IKMLDN',
    liveUrl: 'https://linktr.ee/IKMLDN',
    featured: false,
    year: '2024 - 2026',
    highlight: 'Medium Refleksi & Komunikasi Cerita Hidup'
  }
];

export const initialExperiences: Experience[] = [
  {
    id: 'exp-moderator',
    role: 'Moderator Seminar & Pelatihan Digital Marketing',
    company: 'SMK Citra Bangsa Mandiri (CBM)',
    period: '2025',
    location: 'Purwokerto',
    description: 'Moderator pada Acara Seminar dan Pelatihan di SMK Citra Bangsa Mandiri (CBM) dengan tema Digital Marketing pada tahun 2025.',
    achievements: [
      'Memandu jalannya sesi seminar interaktif bersama pembicara dan ratusan siswa SMK CBM.',
      'Menjembatani sesi diskusi tanya-jawab secara komunikatif, hidup, dan tepat waktu.',
      'Menerapkan teknik public speaking profesional untuk menjaga antusiasme audiens.'
    ],
    technologies: ['Public Speaking', 'Moderator', 'Digital Marketing', 'Event Moderation']
  },
  {
    id: 'exp-ospp-kesehatan',
    role: 'Ketua Pengurus Bidang Kesehatan',
    company: 'Organisasi Santri Pondok Pesantren Al-Qur\'aniyyah (OSPP)',
    period: '2022 — 2023',
    location: 'Pondok Pesantren Al-Qur\'aniyyah',
    description: 'Menjadi Ketua Pengurus di Bidang Kesehatan Pada Organisasi Santri Pondok Pesantren Al-Qur\'aniyyah (OSPP) Tahun 2022-2023.',
    achievements: [
      'Memimpin divisi kesehatan santri dan koordinasi pertolongan pertama (P3K) di lingkungan pesantren.',
      'Mengawasi kebersihan dan sanitasi asrama santri untuk menciptakan lingkungan yang sehat.',
      'Mengelola logistik pos kesehatan pesantren dan jadwal piket tim pengurus kesehatan.'
    ],
    technologies: ['Leadership', 'Health Management', 'Santri Leadership', 'OSPP']
  },
  {
    id: 'exp-takhosus',
    role: 'Pengurus Organisasi Santri Takhosus Al-Qur\'an',
    company: 'Pondok Pesantren Al-Qur\'aniyyah',
    period: '2022 — 2023',
    location: 'Pondok Pesantren Al-Qur\'aniyyah',
    description: 'Organisasi Santri Pengurus Takhosus Al-Qur\'an Ponpes Al-Qur\'aniyyah tahun 2022-2023.',
    achievements: [
      'Mengkoordinasikan agenda halaqah dan setoran hafalan santri program takhosus.',
      'Membantu ustadz dan pengasuh dalam monitoring ketertiban dan kedisiplinan santri.',
      'Membina suasana spiritual dan solidaritas antar santri penghafal Al-Qur\'an.'
    ],
    technologies: ['Takhosus Al-Qur\'an', 'Tahfidz', 'Pondok Pesantren', 'Kedisiplinan']
  },
  {
    id: 'exp-karang-taruna',
    role: 'Pengurus Karang Taruna',
    company: 'Karang Taruna Kel. Sudimara Timur, Kec. Ciledug',
    period: '2021',
    location: 'Ciledug, Banten',
    description: 'Organisasi Karang Taruna Kel. Sudimara Timur, Kec. Ciledug pada tahun 2021.',
    achievements: [
      'Berpartisipasi aktif dalam kegiatan sosial kemasyarakatan dan kepemudaan kelurahan.',
      'Membantu koordinasi perayaan hari besar dan bakti sosial lingkungan warga.',
      'Membangun jejaring komunikasi pemuda di lingkungan Sudimara Timur.'
    ],
    technologies: ['Karang Taruna', 'Sosial Masyarakat', 'Pemberdayaan Pemuda', 'Ciledug']
  }
];
