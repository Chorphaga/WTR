import React, { useState, useEffect } from 'react';
import toastService from '../services/ToastService';
import './toast.css';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Subscribe to toast service
    const unsubscribe = toastService.subscribe(setToasts);
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const handleClose = (id) => {
    toastService.remove(id);
  };

  const getToastConfig = (type) => {
    const configs = {
      success: {
        icon: 'fas fa-check-circle',
        title: 'Success'
      },
      error: {
        icon: 'fas fa-times-circle', 
        title: 'Error'
      },
      info: {
        icon: 'fas fa-info-circle',
        title: 'Info'
      },
      warning: {
        icon: 'fas fa-exclamation-triangle',
        title: 'Warning'
      }
    };
    return configs[type] || configs.info;
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);
        return (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type}`}
          >
            <div className="toast-content">
              <div className="toast-icon">
                <i className={config.icon}></i>
              </div>
              <div className="toast-body">
                <div className="toast-title">{config.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
            </div>
            <button
              className="toast-close"
              onClick={() => handleClose(toast.id)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;