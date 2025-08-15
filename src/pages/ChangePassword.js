// src/pages/ChangePassword.js - อัพเดทให้ใช้ AuthContext
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'อ่อน', color: 'danger' };
      case 2: return { text: 'ปานกลาง', color: 'warning' };
      case 3: return { text: 'ดี', color: 'info' };
      case 4:
      case 5: return { text: 'แข็งแรง', color: 'success' };
      default: return { text: '', color: '' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }

    if (formData.newPassword.length < 6) {
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (result.success) {
        // Reset form on success
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
      }
    } catch (error) {
      console.error('Change password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const strengthIndicator = getPasswordStrengthText();

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              <i className="fas fa-key me-2"></i>
              เปลี่ยนรหัสผ่าน
            </h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="mb-3">
                <label className="form-label">
                  <i className="fas fa-lock me-2"></i>
                  รหัสผ่านเดิม *
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="กรอกรหัสผ่านเดิม"
                  required
                  disabled={loading}
                />
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="form-label">
                  <i className="fas fa-key me-2"></i>
                  รหัสผ่านใหม่ *
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="กรอกรหัสผ่านใหม่"
                  minLength="6"
                  required
                  disabled={loading}
                />
                <div className="form-text">
                  รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="d-flex align-items-center">
                      <span className="me-2 small">ความแข็งแรง:</span>
                      <span className={`badge bg-${strengthIndicator.color} me-2`}>
                        {strengthIndicator.text}
                      </span>
                      <div className="progress flex-grow-1" style={{height: '4px'}}>
                        <div 
                          className={`progress-bar bg-${strengthIndicator.color}`}
                          style={{width: `${(passwordStrength / 5) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="mb-4">
                <label className="form-label">
                  <i className="fas fa-shield-alt me-2"></i>
                  ยืนยันรหัสผ่านใหม่ *
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="ยืนยันรหัสผ่านใหม่อีกครั้ง"
                  required
                  disabled={loading}
                />

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1">
                    {formData.newPassword === formData.confirmPassword ? (
                      <small className="text-success">
                        <i className="fas fa-check me-1"></i>
                        รหัสผ่านตรงกัน
                      </small>
                    ) : (
                      <small className="text-danger">
                        <i className="fas fa-times me-1"></i>
                        รหัสผ่านไม่ตรงกัน
                      </small>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFormData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordStrength(0);
                  }}
                  disabled={loading}
                >
                  <i className="fas fa-undo me-2"></i>
                  รีเซ็ต
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 6}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      กำลังเปลี่ยน...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      เปลี่ยนรหัสผ่าน
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Password Tips */}
          <div className="card-footer bg-light">
            <div className="text-center">
              <h6 className="text-muted mb-2">เคล็ดลับรหัสผ่านที่แข็งแรง:</h6>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <small className="badge bg-secondary">อย่างน้อย 8 ตัวอักษร</small>
                <small className="badge bg-secondary">ตัวพิมพ์ใหญ่</small>
                <small className="badge bg-secondary">ตัวเลข</small>
                <small className="badge bg-secondary">สัญลักษณ์พิเศษ</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;