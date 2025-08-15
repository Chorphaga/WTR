// src/pages/BillList.js - อัพเดทให้รองรับ VAT และ Payment Methods (แก้ไข Syntax Error แล้ว)
import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, Package, Calendar, CheckCircle, CreditCard, Percent, FileText, Plus, Filter, Printer, Receipt } from 'lucide-react';
import { billAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toastService from '../services/ToastService';

const BillList = () => {
  const navigate = useNavigate();

  // States
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [paymentFilter, setPaymentFilter] = useState('ทั้งหมด');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billAPI.getAll();
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toastService.error('เกิดข้อผิดพลาดในการดึงข้อมูลบิล');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('คุณต้องการลบบิลนี้หรือไม่?')) return;

    try {
      await billAPI.delete(billId);
      toastService.success('ลบบิลสำเร็จ');
      fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error);
      toastService.error('เกิดข้อผิดพลาดในการลบบิล');
    }
  };

  const handleViewBill = (billId) => {
    navigate(`/bills/${billId}`);
  };

  const handlePrintBill = (billId) => {
    navigate(`/bills/${billId}/print`);
  };

  const handleInvoiceStyle = (billId) => {
    navigate(`/bills/${billId}/invoice`);
  };

  // Filter และ Search
  const filteredBills = bills.filter(bill => {
    const matchesSearch = !searchTerm || 
      bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bill.billId?.toString().includes(searchTerm) ||
      bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ทั้งหมด' || bill.paymentStatus === statusFilter;
    const matchesPayment = paymentFilter === 'ทั้งหมด' || bill.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getCount = (status) => status === 'ทั้งหมด' ? 
    bills.length : bills.filter(b => b.paymentStatus === status).length;

  const getPaymentMethodCount = (method) => method === 'ทั้งหมด' ? 
    bills.length : bills.filter(b => b.paymentMethod === method).length;

  // สถิติ
  const stats = {
    total: bills.length,
    pending: bills.filter(b => b.paymentStatus === 'รอชำระ').length,
    paid: bills.filter(b => b.paymentStatus === 'ชำระแล้ว').length,
    partial: bills.filter(b => b.paymentStatus === 'ชำระบางส่วน').length,
    totalAmount: bills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0),
    paidAmount: bills.filter(b => b.paymentStatus === 'ชำระแล้ว').reduce((sum, bill) => sum + (bill.grandTotal || 0), 0)
  };

  const filterTabs = [
    { key: 'ทั้งหมด', label: 'ทั้งหมด', icon: Package, color: '#3b82f6' },
    { key: 'รอชำระ', label: 'รอชำระ', icon: Calendar, color: '#f59e0b' },
    { key: 'ชำระแล้ว', label: 'ชำระแล้ว', icon: CheckCircle, color: '#10b981' },
    { key: 'ชำระบางส่วน', label: 'บางส่วน', icon: CreditCard, color: '#8b5cf6' },
    { key: 'ยกเลิก', label: 'ยกเลิก', icon: Trash2, color: '#ef4444' }
  ];

  const paymentMethods = ['ทั้งหมด', 'CASH', 'TRANSFER', 'CREDIT', 'CHEQUE'];

  // Styles
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    marginBottom: '24px'
  };

  const buttonStyle = (variant = 'primary') => {
    const variants = {
      primary: { backgroundColor: '#3b82f6', color: 'white' },
      success: { backgroundColor: '#10b981', color: 'white' },
      outline: { backgroundColor: 'white', color: '#6b7280', border: '2px solid #e5e7eb' }
    };
    
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ...variants[variant]
    };
  };

  const getStatusBadge = (status) => {
    const variants = {
      'รอชำระ': { bg: '#fef3c7', color: '#d97706', text: '⏳ รอชำระ' },
      'ชำระแล้ว': { bg: '#dcfce7', color: '#16a34a', text: '✅ ชำระแล้ว' },
      'ชำระบางส่วน': { bg: '#e0e7ff', color: '#7c3aed', text: '💳 บางส่วน' },
      'เครดิต': { bg: '#dbeafe', color: '#2563eb', text: '🏦 เครดิต' },
      'ยกเลิก': { bg: '#fee2e2', color: '#dc2626', text: '❌ ยกเลิก' }
    };
    
    const variant = variants[status] || variants['รอชำระ'];
    
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: variant.bg,
        color: variant.color
      }}>
        {variant.text}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const variants = {
      'CASH': { bg: '#f0fdf4', color: '#16a34a', text: '💵 เงินสด' },
      'TRANSFER': { bg: '#eff6ff', color: '#2563eb', text: '💳 โอนเงิน' },
      'CREDIT': { bg: '#fdf4ff', color: '#a855f7', text: '🏦 เครดิต' },
      'CHEQUE': { bg: '#fffbeb', color: '#d97706', text: '📄 เช็ค' }
    };
    
    const variant = variants[method] || { bg: '#f3f4f6', color: '#6b7280', text: method };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '500',
        backgroundColor: variant.bg,
        color: variant.color
      }}>
        {variant.text}
      </span>
    );
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
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#dbeafe', 
            borderRadius: '16px',
            border: '2px solid #3b82f6'
          }}>
            <Package size={32} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📋 รายการบิล
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>
              จัดการบิลและใบเสร็จทั้งหมด
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/bills/create')}
          style={buttonStyle('success')}
        >
          <Plus size={16} />
          สร้างบิลใหม่
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '24px' 
      }}>
        <div style={{
          ...cardStyle,
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Package size={24} />
            <h3 style={{ margin: 0, fontSize: '16px' }}>บิลทั้งหมด</h3>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            ฿{stats.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div style={{
          ...cardStyle,
          padding: '20px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Calendar size={24} />
            <h3 style={{ margin: 0, fontSize: '16px' }}>รอชำระ</h3>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.pending}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {((stats.pending / (stats.total || 1)) * 100).toFixed(1)}% ของทั้งหมด
          </div>
        </div>

        <div style={{
          ...cardStyle,
          padding: '20px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <CheckCircle size={24} />
            <h3 style={{ margin: 0, fontSize: '16px' }}>ชำระแล้ว</h3>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.paid}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            ฿{stats.paidAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div style={{
          ...cardStyle,
          padding: '20px',
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <CreditCard size={24} />
            <h3 style={{ margin: 0, fontSize: '16px' }}>บางส่วน</h3>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.partial}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            ต้องติดตาม
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={cardStyle}>
        <div style={{ padding: '24px' }}>
          {/* Status Filter */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              📊 กรองตามสถานะ
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: statusFilter === tab.key ? `2px solid ${tab.color}` : '2px solid #e5e7eb',
                    backgroundColor: statusFilter === tab.key ? tab.color : 'white',
                    color: statusFilter === tab.key ? 'white' : '#6b7280',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  <span style={{
                    backgroundColor: statusFilter === tab.key ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                    color: statusFilter === tab.key ? 'white' : '#6b7280',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {getCount(tab.key)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Filter */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              💳 กรองตามวิธีการชำระ
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {paymentMethods.map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentFilter(method)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    border: paymentFilter === method ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    backgroundColor: paymentFilter === method ? '#3b82f6' : 'white',
                    color: paymentFilter === method ? 'white' : '#6b7280',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {method === 'ทั้งหมด' ? 'ทั้งหมด' : getPaymentMethodBadge(method).props.children}
                  <span style={{
                    backgroundColor: paymentFilter === method ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                    color: paymentFilter === method ? 'white' : '#6b7280',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}>
                    {getPaymentMethodCount(method)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#6b7280' 
            }} />
            <input
              type="text"
              placeholder="ค้นหาบิล, ลูกค้า, เลขที่บิล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <div style={{ 
              position: 'absolute', 
              right: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {filteredBills.length} รายการ
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'left',
                  borderRadius: '12px 0 0 0'
                }}>
                  🔢 เลขที่บิล
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'left'
                }}>
                  📅 วันที่
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'left'
                }}>
                  👥 ลูกค้า
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'center'
                }}>
                  📋 ประเภท
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'center'
                }}>
                  💳 การชำระ
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'right'
                }}>
                  💰 ยอดรวม
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'center'
                }}>
                  📊 สถานะ
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'center',
                  borderRadius: '0 12px 0 0'
                }}>
                  🛠️ จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#6b7280',
                    fontSize: '16px'
                  }}>
                    📭 ไม่พบข้อมูลบิลที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill, index) => (
                  <tr key={bill.billId} style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      <div style={{ fontWeight: '600' }}>#{bill.billId}</div>
                      {bill.billNumber && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{bill.billNumber}</div>
                      )}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      {new Date(bill.createDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {new Date(bill.createDate).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      <div style={{ fontWeight: '600' }}>{bill.customerName}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{bill.billType}</div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: bill.billType === 'ช่าง' ? '#fef3c7' : '#dbeafe',
                        color: bill.billType === 'ช่าง' ? '#d97706' : '#2563eb'
                      }}>
                        {bill.billType === 'ช่าง' ? '🔧 ช่าง' : '👥 ทั่วไป'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {getPaymentMethodBadge(bill.paymentMethod)}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      fontSize: '14px', 
                      color: '#374151',
                      textAlign: 'right'
                    }}>
                      <div style={{ fontWeight: '600' }}>
                        ฿{(bill.grandTotal || bill.totalPrice || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </div>
                      {bill.vatAmount > 0 && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          VAT: ฿{bill.vatAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {getStatusBadge(bill.paymentStatus)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleViewBill(bill.billId)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#dbeafe',
                            color: '#2563eb',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="ดูรายละเอียด"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handlePrintBill(bill.billId)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="พิมพ์ใบเสร็จ (ไทย)"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          onClick={() => handleInvoiceStyle(bill.billId)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="Invoice Style"
                        >
                          <Receipt size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill.billId)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
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
      </div>
    </div>
  );
};

export default BillList;