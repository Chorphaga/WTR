class ToastService {
  constructor() {
    this.toasts = [];
    this.listeners = [];
    this.nextId = 1;
  }

  // เพิ่ม listener สำหรับ component ที่จะแสดง toast
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // แจ้งเตือน listeners ทั้งหมด
  notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  // เพิ่ม toast ใหม่
  show(message, type = 'info', duration = 5000) {
    const toast = {
      id: this.nextId++,
      message,
      type, // success, error, info, warning
      duration,
      timestamp: Date.now()
    };

    this.toasts.push(toast);
    this.notify();

    // ลบ toast อัตโนมัติตาม duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }

    return toast.id;
  }

  // ลบ toast ตาม id
  remove(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  // ลบ toast ทั้งหมด
  clear() {
    this.toasts = [];
    this.notify();
  }

  // Methods สำหรับแต่ละประเภท
  success(message, duration = 5000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 7000) {
    return this.show(message, 'error', duration);
  }

  info(message, duration = 5000) {
    return this.show(message, 'info', duration);
  }

  warning(message, duration = 6000) {
    return this.show(message, 'warning', duration);
  }
}

// สร้าง instance เดียวสำหรับทั้งแอป
const toastService = new ToastService();
export default toastService;