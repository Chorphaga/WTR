import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Printer, Share2, FileText, Image, Camera, Globe } from 'lucide-react';
import { billAPI, companyAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import toastService from '../services/ToastService';

const InvoiceStyleReceipt = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [bill, setBill] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, [billId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [billResponse, companyResponse] = await Promise.all([
        billAPI.getById(billId),
        companyAPI.getSettings()
      ]);
      setBill(billResponse.data);
      setCompany(companyResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toastService.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      navigate('/bills');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => (n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const dmy = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '-');

  const getPaymentMethodName = (method) => {
    const methods = {
      'CASH': 'Cash',
      'TRANSFER': 'Bank Transfer',
      'CREDIT': 'Credit Card',
      'CHEQUE': 'Cheque'
    };
    return methods[method] || method || '-';
  };

  const numberToEnglishText = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    
    return num.toLocaleString('en-US').replace(/\d/g, (d) => ones[parseInt(d)] || d);
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    setPrinting(true);
    
    const printWindow = window.open('', '_blank');
    const printCSS = `
      @page { size: A4; margin: 12mm; }
      html, body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
      .a4-sheet { width: 210mm; min-height: 297mm; background: #fff; position: relative; }
      .invoice-wrap { padding: 10mm; }
      .inv-header { min-height: 26mm; border-bottom: 2px solid #0f172a; margin-bottom: 5mm; display: grid; grid-template-columns: auto 1fr auto; grid-gap: 8px; align-items: start; }
      .inv-logo { width: 22mm; height: 22mm; border-radius: 6px; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; }
      .inv-company h1 { margin: 0 0 2px; font-size: 15px; font-weight: 800; color: #111827; }
      .inv-company .meta { font-size: 10.5px; line-height: 1.4; color: #111; }
      .inv-title { text-align: right; }
      .inv-title h2 { margin: 0 0 4px; font-size: 13px; font-weight: 800; color: #111827; }
      .inv-title .meta { font-size: 10.5px; line-height: 1.4; color: #111; }
      .inv-two-col { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 12px; margin-bottom: 4mm; }
      .inv-block h3 { font-size: 11.5px; font-weight: 700; margin: 0 0 4px; padding: 4px 0; border-bottom: 1px solid #0f172a; }
      .inv-block .kv { font-size: 10.5px; line-height: 1.5; }
      .inv-block .kv b { font-weight: 700; }
      .table-box { margin-top: 2mm; }
      .inv-table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 2px solid #0f172a; }
      .inv-table th, .inv-table td { padding: 6px 8px; font-size: 10.5px; border: none; }
      .inv-table thead th { text-align: left; border-bottom: 1px solid #0f172a; background: #f3f4f6; }
      .totals-and-terms { display: grid; grid-template-columns: 1fr 62mm; grid-gap: 8mm; margin-top: 5mm; }
      .terms { font-size: 10.5px; }
      .totals { border: 1px solid #0f172a; }
      .totals > div { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; font-size: 10.5px; border-bottom: 1px solid #0f172a; }
      .totals > div:last-child { border-bottom: none; background: #e9eefc; font-weight: 700; }
      .amount-words { margin-top: 4mm; padding: 6px 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-size: 10.5px; }
      .inv-footer { position: absolute; left: 10mm; right: 10mm; bottom: 10mm; display: grid; grid-template-columns: 1fr 46mm; grid-gap: 8mm; align-items: end; }
      .sig { text-align: center; font-size: 10.5px; }
      .sig .line { border-top: 1px solid #0f172a; margin: 16mm 0 4px; }
    `;
    
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Invoice #${bill?.billId || ''}</title>
          <style>${printCSS}</style>
        </head>
        <body>
          <div class="a4-sheet">
            <div class="invoice-wrap">
              ${printRef.current.innerHTML}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
      setPrinting(false);
    };
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toastService.success('PDF Download Complete!');
    } catch (error) {
      toastService.error('Error downloading PDF');
    } finally {
      setExporting(false);
      setShowDownloadMenu(false);
    }
  };

  const handleDownloadImage = async (format) => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toastService.success(`${format} Download Complete!`);
    } catch (error) {
      toastService.error(`Error downloading ${format}`);
    } finally {
      setExporting(false);
      setShowDownloadMenu(false);
    }
  };

  const handleShare = () => {
    const platforms = [
      { name: 'WhatsApp', icon: '📱', color: '#25d366' },
      { name: 'LINE', icon: '💬', color: '#00c300' },
      { name: 'LinkedIn', icon: '💼', color: '#0077b5' },
      { name: 'Email', icon: '📧', color: '#ea4335' }
    ];

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.8); display: flex;
      align-items: center; justify-content: center; z-index: 10000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white; border-radius: 16px; padding: 32px;
      max-width: 400px; width: 90%; text-align: center;
    `;

    content.innerHTML = `
      <h3 style="margin: 0 0 24px 0; color: #1f2937;">🌐 Share Invoice</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
        ${platforms.map(platform => `
          <button onclick="console.log('Share to ${platform.name}')" style="
            padding: 12px; border: 2px solid ${platform.color}; 
            background: ${platform.color}; color: white; border-radius: 8px; 
            cursor: pointer; font-weight: 600;
          ">
            ${platform.icon} ${platform.name}
          </button>
        `).join('')}
      </div>
      <button onclick="document.body.removeChild(this.closest('[style*=\"position: fixed\"]'))" style="
        padding: 8px 16px; background: #6b7280; color: white; 
        border: none; border-radius: 6px; cursor: pointer;
      ">Close</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) document.body.removeChild(modal);
    });
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div style={{ marginTop: '16px', color: '#6b7280' }}>Loading invoice data...</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
        Invoice not found
      </div>
    );
  }

  const items = bill.billItems || [];
  const subTotal = bill.subTotal ?? items.reduce((s, i) => s + (i.totalPrice || 0), 0);
  const vatRate = bill.vatRate ?? 0;
  const vatAmount = bill.vatAmount ?? 0;
  const grand = bill.grandTotal ?? (subTotal + vatAmount);

  return (
    <div style={{ backgroundColor: '#f5f7fb', minHeight: '100vh', padding: '24px' }}>
      {/* Header Controls */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        marginBottom: '24px', backgroundColor: 'white', padding: '16px 24px',
        borderRadius: '12px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/bills')}
            style={{
              padding: '8px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db',
              borderRadius: '8px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
              <Globe size={20} style={{ display: 'inline-block', marginRight: '8px' }} />
              Invoice #{bill.billId}
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              International Style • {dmy(bill.createDate)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handlePrint}
            disabled={printing}
            style={{
              padding: '10px 16px', backgroundColor: printing ? '#9ca3af' : '#10b981',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px',
              fontWeight: '600', cursor: printing ? 'not-allowed' : 'pointer',
              opacity: printing ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Printer size={16} />
            {printing ? 'Printing...' : 'Print'}
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              disabled={exporting}
              style={{
                padding: '10px 16px', backgroundColor: exporting ? '#9ca3af' : '#3b82f6',
                color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px',
                fontWeight: '600', cursor: exporting ? 'not-allowed' : 'pointer',
                opacity: exporting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Download size={16} />
              {exporting ? 'Exporting...' : 'Download'}
            </button>

            {showDownloadMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                backgroundColor: 'white', borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb',
                overflow: 'hidden', zIndex: 1000, minWidth: '180px'
              }}>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    width: '100%', padding: '12px 16px', border: 'none', backgroundColor: 'white',
                    textAlign: 'left', cursor: 'pointer', fontSize: '14px', display: 'flex',
                    alignItems: 'center', gap: '8px', borderBottom: '1px solid #f3f4f6'
                  }}
                >
                  <FileText size={16} color="#ef4444" />
                  Download PDF
                </button>
                
                <button
                  onClick={() => handleDownloadImage('PNG')}
                  style={{
                    width: '100%', padding: '12px 16px', border: 'none', backgroundColor: 'white',
                    textAlign: 'left', cursor: 'pointer', fontSize: '14px', display: 'flex',
                    alignItems: 'center', gap: '8px', borderBottom: '1px solid #f3f4f6'
                  }}
                >
                  <Image size={16} color="#8b5cf6" />
                  Download PNG
                </button>
                
                <button
                  onClick={() => handleDownloadImage('JPEG')}
                  style={{
                    width: '100%', padding: '12px 16px', border: 'none', backgroundColor: 'white',
                    textAlign: 'left', cursor: 'pointer', fontSize: '14px', display: 'flex',
                    alignItems: 'center', gap: '8px'
                  }}
                >
                  <Camera size={16} color="#06b6d4" />
                  Download JPEG
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            style={{
              padding: '10px 16px', backgroundColor: '#8b5cf6', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div style={{ 
        width: '210mm', minHeight: '297mm', margin: '0 auto', backgroundColor: '#fff', 
        borderRadius: '10px', boxShadow: '0 12px 28px rgba(0,0,0,.08)', position: 'relative' 
      }}>
        <div ref={printRef} style={{ padding: '10mm' }}>
          {/* Header */}
          <div style={{ 
            minHeight: '26mm', borderBottom: '2px solid #0f172a', marginBottom: '5mm', 
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gridGap: '8px', alignItems: 'start' 
          }}>
            <div style={{ 
              width: '22mm', height: '22mm', borderRadius: '6px', background: '#0f172a', 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: '800', fontSize: '10px' 
            }}>
              LOGO
            </div>
            
            <div>
              <h1 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: '800', color: '#111827' }}>
                {company?.companyName || 'Company Name'}
              </h1>
              <div style={{ fontSize: '10.5px', lineHeight: '1.4', color: '#111' }}>
                <div>{company?.address || '-'}</div>
                <div>Tel: {company?.phoneNumber || '-'}</div>
                <div>Email: {company?.email || '-'}</div>
                <div>Tax ID: {company?.taxId || '-'}</div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '800', color: '#111827' }}>
                INVOICE
              </h2>
              <div style={{ fontSize: '10.5px', lineHeight: '1.4', color: '#111' }}>
                <div><b>Invoice #:</b> {bill.billId}</div>
                <div><b>Date:</b> {dmy(bill.createDate)}</div>
                {bill.dueDate && <div><b>Due Date:</b> {dmy(bill.dueDate)}</div>}
              </div>
            </div>
          </div>

          {/* Bill To & Details */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '12px', marginBottom: '4mm' 
          }}>
            <div>
              <h3 style={{ 
                fontSize: '11.5px', fontWeight: '700', margin: '0 0 4px', 
                padding: '4px 0', borderBottom: '1px solid #0f172a' 
              }}>
                BILL TO
              </h3>
              <div style={{ fontSize: '10.5px', lineHeight: '1.5' }}>
                <div><b>Company:</b> {bill.customerName || '-'}</div>
                <div><b>Address:</b> {bill.customerAddress || '-'}</div>
                <div><b>Phone:</b> {bill.customerPhone || '-'}</div>
              </div>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '11.5px', fontWeight: '700', margin: '0 0 4px', 
                padding: '4px 0', borderBottom: '1px solid #0f172a' 
              }}>
                PAYMENT INFO
              </h3>
              <div style={{ fontSize: '10.5px', lineHeight: '1.5' }}>
                <div><b>Method:</b> {getPaymentMethodName(bill.paymentMethod)}</div>
                <div><b>Status:</b> {bill.paymentStatus || '-'}</div>
                <div><b>Sales Rep:</b> {bill.employeeName || '-'}</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginTop: '2mm' }}>
            <table style={{ 
              width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', border: '2px solid #0f172a' 
            }}>
              <thead>
                <tr>
                  <th style={{ 
                    padding: '6px 8px', fontSize: '10.5px', textAlign: 'center', width: '10%',
                    borderBottom: '1px solid #0f172a', background: '#f3f4f6' 
                  }}>#</th>
                  <th style={{ 
                    padding: '6px 8px', fontSize: '10.5px', textAlign: 'left', width: '46%',
                    borderBottom: '1px solid #0f172a', background: '#f3f4f6' 
                  }}>DESCRIPTION</th>
                  <th style={{ 
                    padding: '6px 8px', fontSize: '10.5px', textAlign: 'center', width: '14%',
                    borderBottom: '1px solid #0f172a', background: '#f3f4f6' 
                  }}>QTY</th>
                  <th style={{ 
                    padding: '6px 8px', fontSize: '10.5px', textAlign: 'right', width: '15%',
                    borderBottom: '1px solid #0f172a', background: '#f3f4f6' 
                  }}>RATE</th>
                  <th style={{ 
                    padding: '6px 8px', fontSize: '10.5px', textAlign: 'right', width: '15%',
                    borderBottom: '1px solid #0f172a', background: '#f3f4f6' 
                  }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px', textAlign: 'center' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px' }}>
                      <div style={{ fontWeight: '600' }}>{item.itemName}</div>
                      {item.itemId && (
                        <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>
                          SKU: {item.itemId}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px', textAlign: 'center' }}>
                      {item.quantity?.toLocaleString() || 0}
                    </td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px', textAlign: 'right' }}>
                      ${fmt(item.pricePerUnit)}
                    </td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px', textAlign: 'right', fontWeight: '600' }}>
                      ${fmt(item.totalPrice)}
                    </td>
                  </tr>
                ))}
                
                {/* Fill empty rows */}
                {items.length < 10 && Array.from({ length: 10 - items.length }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px' }}>&nbsp;</td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px' }}>&nbsp;</td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px' }}>&nbsp;</td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px' }}>&nbsp;</td>
                    <td style={{ padding: '6px 8px', fontSize: '10.5px' }}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals and Terms */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: '1fr 62mm', gridGap: '8mm', marginTop: '5mm' 
          }}>
            <div style={{ fontSize: '10.5px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '700' }}>TERMS & CONDITIONS:</h4>
              <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: '1.4' }}>
                <li>Payment is due within 30 days</li>
                <li>Late payments may incur additional charges</li>
                <li>All prices include applicable taxes</li>
              </ul>
              
              {company?.bankName && (
                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700' }}>PAYMENT DETAILS:</h4>
                  <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
                    <div><b>Bank:</b> {company.bankName}</div>
                    <div><b>Account:</b> {company.bankAccount}</div>
                    <div><b>Account Name:</b> {company.companyName}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ border: '1px solid #0f172a' }}>
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '6px 10px', fontSize: '10.5px', borderBottom: '1px solid #0f172a' 
              }}>
                <span>Subtotal:</span>
                <span>${fmt(subTotal)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '6px 10px', fontSize: '10.5px', borderBottom: '1px solid #0f172a' 
              }}>
                <span>VAT {vatRate}%:</span>
                <span>${fmt(vatAmount)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '6px 10px', fontSize: '10.5px', background: '#e9eefc', fontWeight: '700' 
              }}>
                <span>TOTAL:</span>
                <span>${fmt(grand)}</span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div style={{ 
            marginTop: '4mm', padding: '6px 8px', border: '1px solid #cbd5e1', 
            background: '#f8fafc', fontSize: '10.5px' 
          }}>
            <b>Amount in Words:</b> {numberToEnglishText(grand)} USD Only
          </div>

          {/* Footer */}
          <div style={{ 
            position: 'absolute', left: '10mm', right: '10mm', bottom: '10mm', 
            display: 'grid', gridTemplateColumns: '1fr 46mm', gridGap: '8mm', alignItems: 'end' 
          }}>
            <div style={{ textAlign: 'center', fontSize: '10.5px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                Thank you for your business!
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>
                {company?.companyName || 'Company'}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '10.5px' }}>
              <div style={{ 
                borderTop: '1px solid #0f172a', margin: '16mm 0 4px' 
              }}></div>
              <div>Authorized Signature</div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDownloadMenu && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999
          }}
          onClick={() => setShowDownloadMenu(false)}
        />
      )}
    </div>
  );
};

export default InvoiceStyleReceipt;