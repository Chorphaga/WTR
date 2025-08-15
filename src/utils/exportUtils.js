// exportUtils.js - Export & Share Utilities (แก้ไข Error แล้ว)

// ตรวจสอบว่า library พร้อมใช้งานหรือไม่
const checkLibraryAvailable = (libName) => {
  switch (libName) {
    case 'html2canvas':
      return typeof window !== 'undefined' && window.html2canvas;
    case 'jsPDF':
      return typeof window !== 'undefined' && window.jsPDF;
    default:
      return false;
  }
};

// โหลด external libraries
export const loadExternalLibraries = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window object not available'));
      return;
    }

    const scripts = [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        check: () => window.html2canvas
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        check: () => window.jsPDF
      }
    ];

    let loadedCount = 0;
    
    scripts.forEach(({ src, check }) => {
      if (check()) {
        loadedCount++;
        if (loadedCount === scripts.length) {
          resolve();
        }
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        loadedCount++;
        if (loadedCount === scripts.length) {
          resolve();
        }
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  });
};

// ฟังก์ชันแปลง HTML element เป็น Canvas
export const htmlToCanvas = async (element, options = {}) => {
  if (!checkLibraryAvailable('html2canvas')) {
    throw new Error('html2canvas library is not loaded. Please call loadExternalLibraries() first.');
  }

  const defaultOptions = {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    ...options
  };

  try {
    const canvas = await window.html2canvas(element, defaultOptions);
    return canvas;
  } catch (error) {
    console.error('Error converting HTML to canvas:', error);
    throw error;
  }
};

// ฟังก์ชันแปลง Canvas เป็น Image Blob
export const canvasToBlob = (canvas, format = 'image/png', quality = 0.92) => {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, format, quality);
    } catch (error) {
      reject(error);
    }
  });
};

// ฟังก์ชันดาวน์โหลดไฟล์
export const downloadFile = (blob, filename) => {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

// ฟังก์ชันสร้าง PDF จาก Canvas
export const canvasToPDF = async (canvas, filename = 'document.pdf') => {
  if (!checkLibraryAvailable('jsPDF')) {
    throw new Error('jsPDF library is not loaded. Please call loadExternalLibraries() first.');
  }

  try {
    const { jsPDF } = window;
    
    // คำนวณขนาดกระดาษ A4
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // ดาวน์โหลด PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
};

// ฟังก์ชันดาวน์โหลดเป็น PNG
export const downloadAsPNG = async (element, filename = 'image.png') => {
  try {
    const canvas = await htmlToCanvas(element);
    const blob = await canvasToBlob(canvas, 'image/png');
    downloadFile(blob, filename);
    return true;
  } catch (error) {
    console.error('Error downloading PNG:', error);
    throw error;
  }
};

// ฟังก์ชันดาวน์โหลดเป็น JPEG
export const downloadAsJPEG = async (element, filename = 'image.jpg', quality = 0.92) => {
  try {
    const canvas = await htmlToCanvas(element);
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    downloadFile(blob, filename);
    return true;
  } catch (error) {
    console.error('Error downloading JPEG:', error);
    throw error;
  }
};

// ฟังก์ชันดาวน์โหลดเป็น PDF
export const downloadAsPDF = async (element, filename = 'document.pdf') => {
  try {
    const canvas = await htmlToCanvas(element);
    await canvasToPDF(canvas, filename);
    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

// ฟังก์ชัน Share ผ่าน Web Share API (สำหรับมือถือ)
export const shareNative = async (data) => {
  if (!navigator.share) {
    throw new Error('Web Share API is not supported in this browser');
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      // ผู้ใช้ยกเลิกการแชร์
      return false;
    }
    throw error;
  }
};

// ฟังก์ชัน Share ผ่าง URL schemes
export const shareViaApp = (platform, data) => {
  const { title, text, url } = data;
  
  const urls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${text}\n${url || ''}`)}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url || window.location.href)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || window.location.href)}&quote=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n${text}`)}&url=${encodeURIComponent(url || '')}`,
    gmail: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url || ''}`)}`
  };

  if (urls[platform]) {
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
    return true;
  }
  
  return false;
};

// ฟังก์ชัน Share รูปภาพ
export const shareImage = async (element, options = {}) => {
  const {
    title = 'Document',
    text = 'Shared document',
    filename = 'document.png',
    platform = null
  } = options;

  try {
    const canvas = await htmlToCanvas(element);
    const blob = await canvasToBlob(canvas, 'image/png');
    
    // สำหรับ Web Share API (มือถือ)
    if (navigator.share && navigator.canShare) {
      const shareData = {
        title,
        text,
        files: [new File([blob], filename, { type: 'image/png' })]
      };
      
      if (navigator.canShare(shareData)) {
        return await shareNative(shareData);
      }
    }
    
    // Fallback: ดาวน์โหลดรูปแล้วให้ผู้ใช้แชร์เอง
    downloadFile(blob, filename);
    
    // แสดง modal หรือ popup สำหรับเลือกแพลตฟอร์ม
    if (platform) {
      const imageUrl = URL.createObjectURL(blob);
      shareViaApp(platform, { title, text, url: imageUrl });
      setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
    }
    
    return true;
  } catch (error) {
    console.error('Error sharing image:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับแสดง Share Modal
export const showShareModal = (element, documentData = {}) => {
  const { title = 'Document', billId = '', totalAmount = '' } = documentData;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  `;

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '📱', color: '#25d366' },
    { id: 'line', name: 'LINE', icon: '💬', color: '#00c300' },
    { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877f2' },
    { id: 'gmail', name: 'Gmail', icon: '📧', color: '#ea4335' }
  ];

  content.innerHTML = `
    <h3 style="margin: 0 0 24px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
      📤 Share ${title}
    </h3>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
      ${platforms.map(platform => `
        <button 
          data-platform="${platform.id}"
          style="
            padding: 12px; 
            border: 2px solid ${platform.color}; 
            background: ${platform.color}; 
            color: white; 
            border-radius: 8px; 
            cursor: pointer; 
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
          "
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'"
        >
          ${platform.icon} ${platform.name}
        </button>
      `).join('')}
    </div>
    <button 
      id="closeModal" 
      style="
        padding: 8px 16px; 
        background: #6b7280; 
        color: white; 
        border: none; 
        border-radius: 6px; 
        cursor: pointer;
        font-size: 14px;
      "
    >
      Close
    </button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Event listeners สำหรับ platform buttons
  content.querySelectorAll('[data-platform]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const platform = btn.dataset.platform;
      try {
        await shareImage(element, {
          title: `${title} #${billId}`,
          text: `${title} ${totalAmount ? `จำนวน ${totalAmount} บาท` : ''}`,
          platform
        });
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Share error:', error);
        alert('เกิดข้อผิดพลาดในการแชร์');
      }
    });
  });

  // Event listener สำหรับปุ่มปิด
  content.querySelector('#closeModal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Event listener สำหรับคลิกนอก modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  return modal;
};

// ฟังก์ชัน Helper สำหรับใช้งานง่าย
export const exportDocument = async (element, options = {}) => {
  const { format = 'png', filename, quality = 0.92 } = options;
  
  try {
    // โหลด libraries ก่อนใช้งาน
    await loadExternalLibraries();
    
    switch (format.toLowerCase()) {
      case 'png':
        return await downloadAsPNG(element, filename || 'document.png');
      case 'jpeg':
      case 'jpg':
        return await downloadAsJPEG(element, filename || 'document.jpg', quality);
      case 'pdf':
        return await downloadAsPDF(element, filename || 'document.pdf');
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

// Export default แยกต่างหาก
const exportUtils = {
  loadExternalLibraries,
  htmlToCanvas,
  canvasToBlob,
  downloadFile,
  canvasToPDF,
  downloadAsPNG,
  downloadAsJPEG,
  downloadAsPDF,
  shareNative,
  shareViaApp,
  shareImage,
  showShareModal,
  exportDocument
};

export default exportUtils;