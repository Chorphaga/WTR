import React, { useState, useEffect } from 'react';
import { Building, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { companyAPI } from '../services/api';
import toastService from '../services/ToastService';

const CompanySettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    phoneNumber: '',
    mobileNumber: '',
    email: '',
    taxId: '',
    bankAccount: '',
    bankName: ''
  });

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getSettings();
      if (response.data) {
        setFormData({
          companyName: response.data.companyName || '',
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || '',
          mobileNumber: response.data.mobileNumber || '',
          email: response.data.email || '',
          taxId: response.data.taxId || '',
          bankAccount: response.data.bankAccount || '',
          bankName: response.data.bankName || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
      toastService.error('เกิดข้อผิดพลาดในการดึงข้อมูลบริษัท');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyName.trim()) {
      toastService.error('กรุณากรอกชื่อบริษัท');
      return;
    }

    try {
      setSaving(true);
      await companyAPI.updateSettings(formData);
      toastService.success('บันทึกข้อมูลบริษัทสำเร็จ');
    } catch (error) {
      console.error('Error saving company settings:', error);
      toastService.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 p-3 bg-primary bg-opacity-10 rounded">
              <Building size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="h3 mb-1 fw-bold">ตั้งค่าบริษัท</h1>
              <p className="text-muted mb-0">จัดการข้อมูลและการตั้งค่าของบริษัท</p>
            </div>
          </div>

          {/* Form */}
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <Building size={20} className="me-2" />
                    ข้อมูลบริษัท
                  </h5>
                </div>
                
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {/* Company Name */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          ชื่อบริษัท <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="กรอกชื่อบริษัท"
                          required
                        />
                      </div>

                      {/* Tax ID */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          เลขประจำตัวผู้เสียภาษี
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleChange}
                          placeholder="0000000000000"
                          maxLength="13"
                        />
                      </div>

                      {/* Address */}
                      <div className="col-12 mb-3">
                        <label className="form-label fw-semibold">
                          ที่อยู่
                        </label>
                        <textarea
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="กรอกที่อยู่บริษัท"
                          rows="3"
                        />
                      </div>

                      {/* Phone Numbers */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          เบอร์โทรศัพท์
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="02-xxx-xxxx"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          เบอร์มือถือ
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="08x-xxx-xxxx"
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          อีเมล
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="company@example.com"
                        />
                      </div>

                      {/* Bank Name */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          ธนาคาร
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleChange}
                          placeholder="ชื่อธนาคาร"
                        />
                      </div>

                      {/* Bank Account */}
                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold">
                          เลขที่บัญชีธนาคาร
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="bankAccount"
                          value={formData.bankAccount}
                          onChange={handleChange}
                          placeholder="xxx-x-xxxxx-x"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            กำลังบันทึก...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="me-2" />
                            บันทึกข้อมูล
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">
                    <AlertCircle size={16} className="me-2" />
                    ข้อมูลสำคัญ
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                    <CheckCircle size={16} className="text-success me-2 mt-1" />
                    <div>
                      <strong>ชื่อบริษัท</strong>
                      <p className="mb-0 small text-muted">
                        จะแสดงในใบเสร็จและเอกสารทั้งหมด
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-3">
                    <CheckCircle size={16} className="text-success me-2 mt-1" />
                    <div>
                      <strong>เลขประจำตัวผู้เสียภาษี</strong>
                      <p className="mb-0 small text-muted">
                        สำหรับการออกใบกำกับภาษี
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <CheckCircle size={16} className="text-success me-2 mt-1" />
                    <div>
                      <strong>ข้อมูลธนาคาร</strong>
                      <p className="mb-0 small text-muted">
                        สำหรับแจ้งลูกค้าในการโอนเงิน
                      </p>
                    </div>
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

export default CompanySettings;