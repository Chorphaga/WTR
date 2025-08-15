import React, { useState, useEffect } from 'react';
import { Eye, Printer, Receipt, Trash2, Search, Package, Calendar, CheckCircle, CreditCard } from 'lucide-react';

const BillList = () => {
  // Mock data for demonstration
  const [bills, setBills] = useState([
    {
      billId: 1,
      createDate: '2024-08-15T10:30:00',
      customerName: 'บริษัท ABC จำกัด',
      employeeName: 'สมชาย ใจดี',
      billType: 'ช่าง',
      grandTotal: 15000,
      totalPrice: 15000,
      vatAmount: 1050,
      paymentStatus: 'รอชำระ'
    },
    {
      billId: 2,
      createDate: '2024-08-14T14:20:00',
      customerName: 'คุณสมหญิง สวยงาม',
      employeeName: 'สมศรี เก่งจริง',
      billType: 'ทั่วไป',
      grandTotal: 8500,
      totalPrice: 8500,
      vatAmount: 595,
      paymentStatus: 'ชำระแล้ว'
    },
    {
      billId: 3,
      createDate: '2024-08-13T09:15:00',
      customerName: 'ร้าน XYZ',
      employeeName: 'สมปอง ขยัน',
      billType: 'ช่าง',
      grandTotal: 25000,
      totalPrice: 25000,
      vatAmount: 1750,
      paymentStatus: 'ชำระบางส่วน'
    }
  ]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredBills(bills);
  }, [bills]);

  useEffect(() => {
    applyFilters();
  }, [bills, searchTerm, statusFilter]);

  const applyFilters = () => {
    let filtered = [...bills];
    
    if (searchTerm) {
      filtered = filtered.filter(bill => 
        bill.billId?.toString().includes(searchTerm) ||
        bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ทั้งหมด') {
      filtered = filtered.filter(bill => bill.paymentStatus === statusFilter);
    }
    
    setFilteredBills(filtered);
  };

  const handleViewBill = (billId) => {
    console.log('View Bill Detail:', billId);
    // navigate(`/bills/detail/${billId}`);
  };

  const handlePrintBill = (billId) => {
    console.log('Print Bill:', billId);
    // navigate(`/bills/print/${billId}`);
  };

  const handleInvoiceStyle = (billId) => {
    console.log('Invoice Style:', billId);
    // navigate(`/bills/invoice/${billId}`);
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('คุณต้องการลบบิลนี้หรือไม่?')) {
      console.log('Delete Bill:', billId);
      // Remove from local state for demo
      setBills(bills.filter(b => b.billId !== billId));
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'รอชำระ': { bg: '#fef3c7', color: '#d97706', text: '⏳ รอชำระ' },
      'ชำระแล้ว': { bg: '#dcfce7', color: '#16a34a', text: '✅ ชำระแล้ว' },
      'ชำระบางส่วน': { bg: '#e0e7ff', color: '#7c3aed', text: '💜 บางส่วน' },
      'ยกเลิก': { bg: '#fee2e2', color: '#dc2626', text: '❌ ยกเลิก' }
    };

    const variant = variants[status] || variants['รอชำระ'];

    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: variant.bg,
        color: variant.color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {variant.text}
      </span>
    );
  };

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

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    marginBottom: '24px'
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              📋 รายการบิล
            </h1>
            <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
              จัดการและติดตามสถานะบิลทั้งหมด
            </p>
          </div>
          <button
            onClick={() => console.log('Create new bill')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ สร้างบิลใหม่
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{stats.total}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>บิลทั้งหมด</div>
          </div>
          <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{stats.pending}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>รอชำระ</div>
          </div>
          <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{stats.paid}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>ชำระแล้ว</div>
          </div>
          <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
              ฿{stats.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>ยอดรวมทั้งหมด</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={cardStyle}>
        <div style={{ padding: '24px' }}>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {filterTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  style={{
                    padding: '10px 16px',
                    border: `2px solid ${isActive ? tab.color : '#e5e7eb'}`,
                    backgroundColor: isActive ? tab.color : 'white',
                    color: isActive ? 'white' : '#6b7280',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af' 
              }} 
            />
            <input
              type="text"
              placeholder="ค้นหาเลขที่บิล, ชื่อลูกค้า, พนักงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
            📊 แสดงผล {filteredBills.length} รายการ
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
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>ไม่พบข้อมูลบิล</div>
                    <div style={{ fontSize: '14px' }}>ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</div>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.billId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      #{bill.billId}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      {new Date(bill.createDate).toLocaleDateString('th-TH')}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      <div style={{ fontWeight: '600' }}>{bill.customerName || 'ไม่ระบุ'}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>พนักงาน: {bill.employeeName}</div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: bill.billType === 'ช่าง' ? '#fef3c7' : '#dbeafe',
                        color: bill.billType === 'ช่าง' ? '#d97706' : '#2563eb'
                      }}>
                        {bill.billType === 'ช่าง' ? '🔧 ช่าง' : '👥 ทั่วไป'}
                      </span>
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