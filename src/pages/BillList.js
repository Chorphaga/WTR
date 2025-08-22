import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่ม import นี้
import { Eye, Printer, Receipt, Trash2, Search, Package, Calendar, CheckCircle, CreditCard } from 'lucide-react';

const BillList = () => {
  const navigate = useNavigate(); // เพิ่มการใช้ useNavigate

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

  // ✅ แก้ไขฟังก์ชันการ navigate
  const handleViewBill = (billId) => {
    console.log('View Bill Detail:', billId);
    navigate(`/bills/${billId}/detail`); // หรือ path ที่ต้องการ
  };

  const handlePrintBill = (billId) => {
    console.log('Print Bill:', billId);
    navigate(`/bills/${billId}/print`); // ไปหน้า PrintReceipt
  };

  const handleInvoiceStyle = (billId) => {
    console.log('Invoice Style:', billId);
    navigate(`/bills/${billId}/invoice`); // ไปหน้า InvoiceStyleReceipt
  };

  const handleCreateNewBill = () => {
    navigate('/bills/create'); // ไปหน้าสร้างบิลใหม่
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
            onClick={handleCreateNewBill} // เปลี่ยนจาก console.log เป็น navigate
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
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={24} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.total}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>บิลทั้งหมด</div>
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={24} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.pending}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>รอชำระ</div>
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={24} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.paid}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>ชำระแล้ว</div>
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={24} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  ฿{stats.totalAmount.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>ยอดรวมทั้งหมด</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={cardStyle}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {filterTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = statusFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setStatusFilter(tab.key)}
                      style={{
                        padding: '8px 16px',
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
                  👤 ลูกค้า
                </th>
                <th style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  textAlign: 'left'
                }}>
                  👷 พนักงาน
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
                  ⚙️ การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    ไม่พบข้อมูลบิล
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill, index) => (
                  <tr 
                    key={bill.billId} 
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                      #{bill.billId}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                      {new Date(bill.createDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>
                      {bill.customerName}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                      {bill.employeeName}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1f2937', textAlign: 'right' }}>
                      ฿{(bill.grandTotal || bill.totalPrice || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {getStatusBadge(bill.paymentStatus)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleViewBill(bill.billId)} // ✅ แก้ไขแล้ว
                          style={{
                            padding: '6px',
                            backgroundColor: '#dbeafe',
                            color: '#3b82f6',
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
                          onClick={() => handlePrintBill(bill.billId)} // ✅ แก้ไขแล้ว
                          style={{
                            padding: '6px',
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="พิมพ์ใบเสร็จ"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          onClick={() => handleInvoiceStyle(bill.billId)} // ✅ แก้ไขแล้ว
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