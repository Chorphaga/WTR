import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Download } from 'lucide-react';
import { paymentMethodAPI } from '../services/api';
import toastService from '../services/ToastService';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    methodName: '',
    methodCode: ''
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await paymentMethodAPI.getAll();
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toastService.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefault = async () => {
    try {
      const response = await paymentMethodAPI.seedDefault();
      toastService.success(response.data.message);
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error seeding default payment methods:', error);
      toastService.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลเริ่มต้น');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.methodName.trim() || !formData.methodCode.trim()) {
      toastService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      if (editingMethod) {
        await paymentMethodAPI.update(editingMethod.paymentMethodId, formData);
        toastService.success('แก้ไขวิธีการชำระเงินสำเร็จ');
      } else {
        await paymentMethodAPI.create(formData);
        toastService.success('เพิ่มวิธีการชำระเงินสำเร็จ');
      }
      
      setShowModal(false);
      setEditingMethod(null);
      setFormData({ methodName: '', methodCode: '' });
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toastService.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      methodName: method.methodName,
      methodCode: method.methodCode
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบวิธีการชำระเงินนี้หรือไม่?')) {
      try {
        await paymentMethodAPI.delete(id);
        toastService.success('ลบวิธีการชำระเงินสำเร็จ');
        fetchPaymentMethods();
      } catch (error) {
        console.error('Error deleting payment method:', error);
        toastService.error('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  const resetForm = () => {
    setFormData({ methodName: '', methodCode: '' });
    setEditingMethod(null);
    setShowModal(false);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div className="me-3 p-3 bg-primary bg-opacity-10 rounded">
                <CreditCard size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="h3 mb-1 fw-bold">วิธีการชำระเงิน</h1>
                <p className="text-muted mb-0">จัดการวิธีการชำระเงินในระบบ</p>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={handleSeedDefault}
              >
                <Download size={16} className="me-2" />
                เพิ่มข้อมูลเริ่มต้น
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} className="me-2" />
                เพิ่มวิธีการชำระ
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">กำลังโหลด...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>รหัส</th>
                        <th>ชื่อวิธีการชำระ</th>
                        <th>รหัสวิธีการ</th>
                        <th>สถานะ</th>
                        <th className="text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentMethods.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            ไม่พบข้อมูลวิธีการชำระเงิน
                          </td>
                        </tr>
                      ) : (
                        paymentMethods.map((method) => (
                          <tr key={method.paymentMethodId}>
                            <td>{method.paymentMethodId}</td>
                            <td>{method.methodName}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {method.methodCode}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${method.isActive ? 'bg-success' : 'bg-danger'}`}>
                                {method.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(method)}
                                  title="แก้ไข"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(method.paymentMethodId)}
                                  title="ลบ"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingMethod ? 'แก้ไขวิธีการชำระเงิน' : 'เพิ่มวิธีการชำระเงิน'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">ชื่อวิธีการชำระ *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.methodName}
                      onChange={(e) => setFormData(prev => ({ ...prev, methodName: e.target.value }))}
                      placeholder="เช่น เงินสด, โอนเงิน"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">รหัสวิธีการ *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.methodCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, methodCode: e.target.value.toUpperCase() }))}
                      placeholder="เช่น CASH, TRANSFER"
                      required
                    />
                    <div className="form-text">
                      ใช้ตัวอักษรภาษาอังกฤษและตัวเลขเท่านั้น (ไม่เว้นวรรค)
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingMethod ? 'บันทึกการแก้ไข' : 'เพิ่มวิธีการชำระ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;