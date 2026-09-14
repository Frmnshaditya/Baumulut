import { jsPDF } from 'jspdf';
import { ProfileData, Experience, CVFileInfo } from '../types';

const CV_STORAGE_KEY = 'neobrutalism_portfolio_custom_cv';

/**
 * Saves uploaded CV to localStorage with safety fallback
 */
export function saveCustomCVLocally(cvInfo: CVFileInfo): void {
  try {
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvInfo));
  } catch (err) {
    console.warn('Could not store full CV in localStorage, file might be large:', err);
  }
}

/**
 * Loads stored CV from localStorage if available
 */
export function loadCustomCVLocally(): CVFileInfo | null {
  try {
    const raw = localStorage.getItem(CV_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as CVFileInfo;
    }
  } catch (err) {
    console.warn('Error reading CV from localStorage:', err);
  }
  return null;
}

/**
 * Removes custom CV from localStorage
 */
export function removeCustomCVLocally(): void {
  try {
    localStorage.removeItem(CV_STORAGE_KEY);
  } catch (err) {
    console.warn('Error removing CV from localStorage:', err);
  }
}

/**
 * Reads a user-uploaded File and converts it to a CVFileInfo object
 */
export function processUploadedCVFile(file: File): Promise<CVFileInfo> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      reject(new Error('File harus berformat PDF (.pdf)'));
      return;
    }

    // Limit size to reasonable web storage limit (15MB)
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error('Ukuran file PDF terlalu besar (maksimal 15MB)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Gagal membaca data file PDF'));
        return;
      }

      const cvInfo: CVFileInfo = {
        name: file.name,
        dataUrl,
        size: file.size,
        updatedAt: new Date().toISOString(),
      };

      saveCustomCVLocally(cvInfo);
      resolve(cvInfo);
    };

    reader.onerror = () => reject(new Error('Gagal memproses file PDF'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a base64 Data URL to a Blob
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Triggers download of the CV:
 * 1. If user provided their own PDF file, downloads that exact uploaded file.
 * 2. If no file was inputted, generates a clean, professional PDF document using jsPDF.
 */
export function downloadCV(profile: ProfileData, experiences: Experience[] = []): void {
  // 1. Check if user inputted/uploaded their own custom CV PDF
  const customCV = profile.cvFile || loadCustomCVLocally();

  if (customCV && customCV.dataUrl) {
    try {
      const blob = dataUrlToBlob(customCV.dataUrl);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;

      let filename = customCV.name || `${profile.name.replace(/\s+/g, '_')}_CV.pdf`;
      if (!filename.toLowerCase().endsWith('.pdf')) {
        filename += '.pdf';
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return;
    } catch (err) {
      console.warn('Falling back to direct anchor download for custom CV:', err);
      const link = document.createElement('a');
      link.href = customCV.dataUrl;
      link.download = customCV.name.endsWith('.pdf') ? customCV.name : `${customCV.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  }

  // 2. Generate a professional CV in PDF format using jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 20;

  // Header Banner / Accent Line (Neobrutalism orange & black)
  doc.setFillColor(255, 107, 0); // #FF6B00
  doc.rect(margin, y, pageWidth - margin * 2, 3, 'F');
  y += 10;

  // Candidate Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text(profile.name.toUpperCase(), margin, y);
  y += 7;

  // Job Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 107, 0);
  doc.text(profile.title, margin, y);
  y += 6;

  // Contact Info Line
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const contactText = [
    `Domisili: ${profile.location}`,
    `Email: ${profile.socials.email}`,
    profile.socials.phone ? `Telp: ${profile.socials.phone}` : null,
    profile.socials.linktree ? `Linktree: ${profile.socials.linktree}` : null,
  ]
    .filter(Boolean)
    .join('  |  ');
  const contactLines = doc.splitTextToSize(contactText, pageWidth - margin * 2);
  doc.text(contactLines, margin, y);
  y += contactLines.length * 4 + 2;

  // Horizontal divider line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Section: Ringkasan Profil
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(0, 0, 0);
  doc.text('RINGKASAN PROFIL', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const summaryLines = doc.splitTextToSize(
    `${profile.greeting} ${profile.aboutText.join(' ')}`,
    pageWidth - margin * 2
  );
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.2 + 5;

  // Section: Perjalanan Pendidikan
  if (profile.education && profile.education.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(0, 0, 0);
    doc.text('PERJALANAN PENDIDIKAN', margin, y);
    y += 5;

    profile.education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
      doc.text(`• ${edu.institution}`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      const statusText = `${edu.status} ${edu.period ? `(${edu.period})` : ''}`;
      doc.text(statusText, pageWidth - margin, y, { align: 'right' });
      y += 4.5;
    });
    y += 4;
  }

  // Section: Experience
  if (experiences.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(0, 0, 0);
    doc.text('KOMPETENSI & PENGALAMAN ORGANISASI', margin, y);
    y += 5;

    experiences.forEach((exp) => {
      // Role & Company
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
      doc.text(`${exp.role} - ${exp.company}`, margin, y);

      // Period & Location
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      const meta = `${exp.period} | ${exp.location}`;
      doc.text(meta, pageWidth - margin, y, { align: 'right' });
      y += 4;

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const descLines = doc.splitTextToSize(exp.description, pageWidth - margin * 2);
      doc.text(descLines, margin, y);
      y += descLines.length * 3.8 + 1.5;

      // Bullet achievements
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((ach) => {
          doc.setTextColor(255, 107, 0);
          doc.text('•', margin + 2, y);
          doc.setTextColor(50, 50, 50);
          const achLines = doc.splitTextToSize(ach, pageWidth - margin * 2 - 8);
          doc.text(achLines, margin + 5, y);
          y += achLines.length * 3.6 + 1;
        });
      }

      y += 2.5;
    });
  }

  // Section: Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(0, 0, 0);
  doc.text('KEAHLIAN & KOMPETENSI', margin, y);
  y += 5;

  doc.setFontSize(8.5);
  const skillsList = [
    { label: 'Public Speaking', items: profile.skills.frontend.join(', ') },
    { label: 'Fotografi & Visual', items: profile.skills.backend.join(', ') },
    { label: 'Kepemimpinan', items: profile.skills.databaseAndCloud.join(', ') },
    { label: 'Menulis & Literasi', items: profile.skills.toolsAndMethods.join(', ') },
  ];

  skillsList.forEach((sk) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${sk.label}: `, margin, y);
    const labelWidth = doc.getTextWidth(`${sk.label}: `);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const skillLines = doc.splitTextToSize(sk.items, pageWidth - margin * 2 - labelWidth);
    doc.text(skillLines, margin + labelWidth, y);
    y += skillLines.length * 3.8 + 1;
  });

  // Footer Note
  y = Math.max(y + 8, doc.internal.pageSize.getHeight() - 15);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y - 3, pageWidth - margin, y - 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Curriculum Vitae - ${profile.name} | Generated via Neobrutalism Portfolio (${new Date().getFullYear()})`,
    margin,
    y
  );

  // Save the PDF file
  const outputFileName = `${profile.name.replace(/\s+/g, '_')}_CV.pdf`;
  doc.save(outputFileName);
}
