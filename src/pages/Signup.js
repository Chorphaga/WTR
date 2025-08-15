// src/pages/Signup.js - อัพเดทให้ใช้ AuthContext
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
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
    
    if (name === 'password') {
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

  const validateForm = () => {
    if (!formData.employeeId) {
      return { valid: false, message: 'กรุณากรอกรหัสพนักงาน' };
    }
    
    if (formData.password.length < 6) {
      return { valid: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
    }
    
    if (formData.password !== formData.confirmPassword) {
      return { valid: false, message: 'รหัสผ่านไม่ตรงกัน' };
    }
    
    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.valid) {
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        employeeId: parseInt(formData.employeeId),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (result.success) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const strengthIndicator = getPasswordStrengthText();

  return (
    <div className="auth-container" style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="auth-card p-5">
              
              {/* Header */}
              <div className="auth-header">
                <div className="mb-3">
                  <i className="fas fa-user-plus fa-3x" style={{color: '#6366f1'}}></i>
                </div>
                <h2 className="fw-bold" style={{color: '#6366f1'}}>ลงทะเบียน</h2>
                <p className="text-muted">ตั้งรหัสผ่านสำหรับพนักงานใหม่</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Employee ID */}
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-id-badge me-2"></i>
                    รหัสพนักงาน
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="กรอกรหัสพนักงาน"
                    required
                    disabled={loading}
                  />
                  <div className="form-text">
                    <i className="fas fa-info-circle me-1"></i>
                    ใช้รหัสพนักงานที่ได้รับจากผู้ดูแลระบบ
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-lock me-2"></i>
                    รหัสผ่าน
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="ตั้งรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                    minLength="6"
                    required
                    disabled={loading}
                  />
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
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

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label">
                    <i className="fas fa-shield-alt me-2"></i>
                    ยืนยันรหัสผ่าน
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                    minLength="6"
                    required
                    disabled={loading}
                  />
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-1">
                      {formData.password === formData.confirmPassword ? (
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
                <button
                  type="submit"
                  className="btn w-100 mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      กำลังลงทะเบียน...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      ลงทะเบียน
                    </>
                  )}
                </button>
              </form>

              {/* Navigation Links */}
              <div className="text-center">
                <div className="mb-3">
                  <span className="text-muted">มีบัญชีแล้ว? </span>
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    เข้าสู่ระบบ
                  </Link>
                </div>
                
                <div className="border-top pt-3">
                  <Link to="/" className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-arrow-left me-2"></i>
                    กลับหน้าหลัก
                  </Link>
                </div>
              </div>

              {/* Password Tips */}
              <div className="mt-4 pt-3 border-top">
                <div className="text-center">
                  <h6 className="text-muted mb-2">เคล็ดลับรหัสผ่านที่แข็งแรง:</h6>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <small className="badge bg-light text-dark">อย่างน้อย 8 ตัวอักษร</small>
                    <small className="badge bg-light text-dark">ตัวพิมพ์ใหญ่</small>
                    <small className="badge bg-light text-dark">ตัวเลข</small>
                    <small className="badge bg-light text-dark">สัญลักษณ์พิเศษ</small>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;