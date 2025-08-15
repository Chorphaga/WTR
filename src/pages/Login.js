// src/pages/Login.js - อัพเดทให้ใช้ AuthContext
import React, { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toastService from '../services/ToastService';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        toastService.success('เข้าสู่ระบบสำเร็จ!');
        
        // ✅ อย่าใช้ setTimeout หรือรอ state — ไป dashboard ทันที
        navigate('/dashboard', { replace: true });
      } else {
        toastService.error(result.message || 'เข้าสู่ระบบล้มเหลว');
      }
    } catch (error) {
      console.error('Login error:', error);
      toastService.error('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toastService.info('กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน');
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="auth-card p-5">
              <div className="auth-header">
                <div className="mb-3">
                  <i className="fas fa-user-circle fa-3x text-primary"></i>
                </div>
                <h2 className="fw-bold">เข้าสู่ระบบ</h2>
                <p className="text-muted">ระบบจัดการคลังสินค้า WTR Organization</p>
              </div>

              <form onSubmit={handleSubmit}>
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
                    placeholder="กรอกรหัสพนักงาน (เช่น 1)"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
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
                    placeholder="กรอกรหัสผ่าน"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      เข้าสู่ระบบ
                    </>
                  )}
                </button>
              </form>

              <div className="text-center">
                <div className="mb-3">
                  <span className="text-muted">พนักงานใหม่? </span>
                  <Link to="/signup" className="text-decoration-none fw-semibold">
                    ลงทะเบียนที่นี่
                  </Link>
                </div>
                
                <div className="border-top pt-3">
                  <Link to="/" className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-arrow-left me-2"></i>
                    กลับหน้าหลัก
                  </Link>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <small className="text-muted d-block text-center">
                  <i className="fas fa-info-circle me-1"></i>
                  <button 
                    type="button"
                    className="btn-link text-muted p-0 border-0 bg-transparent text-decoration-underline"
                    onClick={handleForgotPassword}
                    style={{ fontSize: 'inherit', cursor: 'pointer' }}
                  >
                    ติดต่อผู้ดูแลระบบหากลืมรหัสผ่าน
                  </button>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;