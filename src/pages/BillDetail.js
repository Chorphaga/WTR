import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Eye, 
  Receipt, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Building,
  CreditCard,
  FileText,
  Share2
} from 'lucide-react';

const BillDetail = ({ billId }) => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBill({
        billId: billId || 1,
        createDate: '2024-08-15T10:30:00',
        customerName: 'บริษัท ABC จำกัด',
        customerAddress: '123 ถนนสุขุมวิท กรุงเทพมหานคร 10110',
        customerPhone: '02-123-4567',
        employeeName: 'สมชาย ใจดี',
        billType: 'ช่าง',
        paymentMethod: 'TRANSFER',
        paymentStatus: 'รอชำระ',
        dueDate: '2024-08-22T00:00:00',
        subTotal: 14000,
        vatRate: 7,
        vatAmount: 980,
        grandTotal: 14980,
        remark: 'งานซ่อมแซมระบบไฟฟ้า',
        billItems: [
          {
            itemName: 'สายไฟ 2.5 ตร.มม.',
            quantity: 50,
            pricePerUnit: 15,
            totalPrice: 750
          },
          {
            itemName: 'เบรกเกอร์ 20A',
            quantity: 5,
            pricePerUnit: 250,
            totalPrice: 1250
          },
          {
            itemName: 'ค่าแรงช่าง',
            quantity: 1,
            pricePerUnit: 12000,
            totalPrice: 12000
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [billId]);

  const handleUpdatePaymentStatus = async (newStatus) => {
    if (window.confirm(`คุณต้องการเปลี่ยนสถานะเป็น "${newStatus}" หรือไม่?`)) {
      setUpdating(true);
      // Simulate API call
      setTimeout(() => {
        setBill({ ...bill, paymentStatus: newStatus });
        setUpdating(false);
        console.log('Payment status updated to:', newStatus);
      }, 1500);
    }
  };

  const handlePrint = () => {
    console.log('Print bill:', bill.billId);
    // Navigate to print page
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF:', bill.billId);
  };

  const handleDownloadImage = (format) => {
    console.log(`Download ${format}:`, bill.billId);
  };

  const handleShare = () => {
    console.log('Share bill:', bill.billId);
  };

  const handleInvoiceStyle = () => {
    console.log('Open invoice style:', bill.billId);
  };

  const getStatusColor = (status) => {
    const colors = {
      'รอชำระ': { bg: '#fef3c7', color: '#d97706', icon: Clock },
      'ชำระแล้ว': { bg: '#dcfce7', color: '#16a34a', icon: CheckCircle },
      'ชำระบางส่วน': { bg: '#e0e7ff', color: '#7c3aed', icon: AlertCircle },
      'ยกเลิก': { bg: '#fee2e2', color: '#dc2626', icon: AlertCircle }
    };
    return colors[status] || colors['รอชำระ'];
  };

  const PaymentMethodBadge = ({ method }) => {
    const methods = {
      'CASH': { label: '💵 เงินสด', color: '#10b981' },
      'TRANSFER': { label: '🏦 โอนเงิน', color: '#3b82f6' },
      'CREDIT': { label: '💳 บัตรเครดิต', color: '#8b5cf6' },
      'CHEQUE': { label: '📄 เช็ค', color: '#f59e0b' }
    };
    const methodInfo = methods[method] || { label: method, color: '#6b7280' };
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: `${methodInfo.color}20`,
        color: methodInfo.color
      }}>
        {methodInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <div style={{ color: '#6b7280' }}>กำลังโหลดข้อมูลบิล...</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#6b7280'
      }}>
        <AlertCircle size={48} style={{ marginBottom: '16px', color: '#ef4444' }} />
        <h3>ไม่พบข้อมูลบิล</h3>
        <p>บิลที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
      </div>
    );
  }

  const statusInfo = getStatusColor(bill.paymentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '32px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => console.log('Go back')}
            style={{
              padding: '8px',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#1f2937', 
              margin: 0 
            }}>
              📋 รายละเอียดบิล #{bill.billId}
            </h1>
            <p style={{ 
              color: '#6b7280', 
              margin: '4px 0 0 0' 
            }}>
              สร้างเมื่อ {new Date(bill.createDate).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '10px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={16} />
            พิมพ์
          </button>
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={handleDownloadPDF}
              style={{
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={16} />
              ดาวน์โหลด
            </button>
          </div>

          <button
            onClick={handleShare}
            style={{
              padding: '10px 16px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Share2 size={16} />
            แชร์
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Bill Info Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileText size={20} />
                ข้อมูลบิล
              </h2>
              
              <div style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <StatusIcon size={16} />
                {bill.paymentStatus}
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ประเภทบิล
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  marginTop: '4px'
                }}>
                  {bill.billType === 'ช่าง' ? '🔧 งานช่าง' : '👥 งานทั่วไป'}
                </div>
              </div>

              <div>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  วิธีการชำระ
                </label>
                <div style={{ marginTop: '4px' }}>
                  <PaymentMethodBadge method={bill.paymentMethod} />
                </div>
              </div>

              <div>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  กำหนดชำระ
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Calendar size={16} />
                  {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
                </div>
              </div>
            </div>

            {bill.remark && (
              <div style={{ marginTop: '20px' }}>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  หมายเหตุ
                </label>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  marginTop: '4px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {bill.remark}
                </div>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Building size={20} />
              ข้อมูลลูกค้า
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ชื่อลูกค้า
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  marginTop: '4px'
                }}>
                  {bill.customerName}
                </div>
              </div>

              <div>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  เบอร์โทรศัพท์
                </label>
                <div style={{ 
                  fontSize: '16px', 
                  color: '#374151',
                  marginTop: '4px'
                }}>
                  {bill.customerPhone || 'ไม่ระบุ'}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ที่อยู่
                </label>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  marginTop: '4px',
                  lineHeight: '1.5'
                }}>
                  {bill.customerAddress || 'ไม่ระบุ'}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 20px 0'
            }}>
              📦 รายการสินค้า/บริการ
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0 
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderRadius: '8px 0 0 8px'
                    }}>
                      รายการ
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'center', 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      จำนวน
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'right', 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      ราคา/หน่วย
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'right', 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderRadius: '0 8px 8px 0'
                    }}>
                      รวม
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bill.billItems.map((item, index) => (
                    <tr key={index} style={{ 
                      borderBottom: index < bill.billItems.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <td style={{ 
                        padding: '16px', 
                        fontSize: '14px', 
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        {item.itemName}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'center', 
                        fontSize: '14px', 
                        color: '#374151'
                      }}>
                        {item.quantity.toLocaleString()}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right', 
                        fontSize: '14px', 
                        color: '#374151'
                      }}>
                        ฿{item.pricePerUnit.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right', 
                        fontSize: '14px', 
                        color: '#374151',
                        fontWeight: '600'
                      }}>
                        ฿{item.totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ 
              borderTop: '2px solid #e5e7eb', 
              marginTop: '20px', 
              paddingTop: '20px' 
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                alignItems: 'flex-end'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '200px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#6b7280' }}>ยอดรวม:</span>
                  <span style={{ fontWeight: '500' }}>
                    ฿{bill.subTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '200px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#6b7280' }}>VAT {bill.vatRate}%:</span>
                  <span style={{ fontWeight: '500' }}>
                    ฿{bill.vatAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '200px',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937',
                  paddingTop: '8px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <span>ยอดสุทธิ:</span>
                  <span style={{ color: '#059669' }}>
                    ฿{bill.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Payment Status Update */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CreditCard size={18} />
              จัดการสถานะ
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['รอชำระ', 'ชำระบางส่วน', 'ชำระแล้ว', 'ยกเลิก'].map(status => {
                const isCurrentStatus = bill.paymentStatus === status;
                const statusColor = getStatusColor(status);
                
                return (
                  <button
                    key={status}
                    onClick={() => !isCurrentStatus && handleUpdatePaymentStatus(status)}
                    disabled={isCurrentStatus || updating}
                    style={{
                      padding: '12px 16px',
                      border: isCurrentStatus ? `2px solid ${statusColor.color}` : '2px solid #e5e7eb',
                      backgroundColor: isCurrentStatus ? statusColor.bg : 'white',
                      color: isCurrentStatus ? statusColor.color : '#6b7280',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isCurrentStatus ? 'default' : 'pointer',
                      opacity: updating ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isCurrentStatus && '✅ '}
                    {status}
                  </button>
                );
              })}
            </div>

            {updating && (
              <div style={{ 
                marginTop: '16px', 
                textAlign: 'center', 
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <div className="spinner-border spinner-border-sm me-2" />
                กำลังอัปเดต...
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              ⚡ การดำเนินการ
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleInvoiceStyle}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Receipt size={16} />
                Invoice Style
              </button>

              <button
                onClick={() => handleDownloadImage('PNG')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download size={16} />
                ดาวน์โหลด PNG
              </button>

              <button
                onClick={() => handleDownloadImage('JPEG')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download size={16} />
                ดาวน์โหลด JPEG
              </button>
            </div>
          </div>

          {/* Employee Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={18} />
              ผู้สร้างบิล
            </h3>

            <div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {bill.employeeName}
              </div>
              <div style={{ 
                fontSize: '14px',
                color: '#6b7280'
              }}>
                พนักงาน
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetail;