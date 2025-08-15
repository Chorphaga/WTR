// src/pages/InvoiceStyleReceipt.js — A4 v2 (smaller header + single-page)
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { billAPI, companyAPI } from '../services/api';
import toastService from '../services/ToastService';
import '../styles/invoice-print.css';

const PRINT_CSS = `
@page { size: A4; margin: 12mm; }
html, body { margin: 0; padding: 0; }
.a4-screen { background: #f5f7fb; min-height: 100vh; padding: 24px; }
.a4-sheet { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 12px 28px rgba(0,0,0,.08); position: relative; }
.invoice-wrap { padding: 10mm; }

.inv-header { min-height: 26mm; border-bottom: 2px solid #0f172a; margin-bottom: 5mm; display: grid; grid-template-columns: auto 1fr auto; grid-gap: 8px; align-items: start; }
.inv-logo { width: 22mm; height: 22mm; border-radius: 6px; background: #0f172a; color: #fff; display:flex; align-items:center; justify-content:center; font-weight: 800; font-size: 10px; }
.inv-company h1 { margin: 0 0 2px; font-size: 15px; font-weight: 800; color:#111827; }
.inv-company .meta { font-size: 10.5px; line-height: 1.4; color:#111; }
.inv-title { text-align: right; }
.inv-title h2 { margin: 0 0 4px; font-size: 13px; font-weight: 800; color:#111827; }
.inv-title .meta { font-size: 10.5px; line-height: 1.4; color:#111; }

.inv-two-col { display:grid; grid-template-columns: 1fr 1fr; grid-gap: 12px; margin-bottom: 4mm; }
.inv-block h3 { font-size: 11.5px; font-weight: 700; margin: 0 0 4px; padding: 4px 0; border-bottom: 1px solid #0f172a; }
.inv-block .kv { font-size: 10.5px; line-height: 1.5; }
.inv-block .kv b { font-weight: 700; }

.table-box { margin-top: 2mm; }
.inv-table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 2px solid #0f172a; }
.inv-table th, .inv-table td { padding: 6px 8px; font-size: 10.5px; }
.inv-table thead th { text-align: left; border-bottom: 1px solid #0f172a; background: #f3f4f6; }
.inv-table .col-sn { width: 10%; text-align: center; }
.inv-table .col-desc { width: 46%; }
.inv-table .col-qty { width: 14%; text-align: center; }
.inv-table .col-rate { width: 15%; text-align: right; }
.inv-table .col-amount { width: 15%; text-align: right; }
.inv-table th, .inv-table td { border: none; }

.inv-items-body { display: block; height: 98mm; }
.inv-items-body tr { display: table; width: 100%; table-layout: fixed; }
.inv-table thead, .inv-table tfoot { display: table; width: 100%; table-layout: fixed; }

.totals-and-terms { display: grid; grid-template-columns: 1fr 62mm; grid-gap: 8mm; margin-top: 5mm; }
.terms { font-size: 10.5px; }
.totals { border: 1px solid #0f172a; }
.totals .row { display:flex; justify-content:space-between; align-items:center; padding: 6px 10px; font-size: 10.5px; border-bottom: 1px solid #0f172a; }
.totals .row:last-child { border-bottom: none; background: #e9eefc; font-weight: 700; }

.amount-words { margin-top: 4mm; padding: 6px 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-size: 10.5px; }

.inv-footer { position: absolute; left: 10mm; right: 10mm; bottom: 10mm; display: grid; grid-template-columns: 1fr 46mm; grid-gap: 8mm; align-items: end; }
.sig { text-align: center; font-size: 10.5px; }
.sig .line { border-top: 1px solid #0f172a; margin: 16mm 0 4px; }

.inv-header, .inv-two-col, .table-box, .totals-and-terms, .amount-words, .inv-footer { page-break-inside: avoid; }

@media print {
  .a4-screen { background: #fff; padding: 0; }
  .a4-sheet { box-shadow: none; border-radius: 0; min-height: 297mm; }
}
`;

const InvoiceStyleReceipt = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [bill, setBill] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [b, c] = await Promise.all([billAPI.getById(billId), companyAPI.getSettings()]);
        setBill(b.data);
        setCompany(c.data || null);
      } catch (e) {
        console.error(e);
        toastService.error('โหลดข้อมูลไม่สำเร็จ');
        navigate('/bills');
      } finally {
        setLoading(false);
      }
    })();
  }, [billId, navigate]);

  const fmt = (n) => (n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const dmy = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '-');
  const dmyTH = (d) => (d ? new Date(d).toLocaleDateString('th-TH') : '-');

  const wordsTH = (num) => '฿ ' + (num ?? 0).toLocaleString('th-TH', { minimumFractionDigits: 2 });

  const handlePrint = () => {
    if (!printRef.current) return;
    setPrinting(true);
    const w = window.open('', '_blank');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>Invoice #${bill?.billId||''}</title><style>${PRINT_CSS}</style></head><body class="a4-screen"><div class="a4-sheet"><div class="invoice-wrap">${printRef.current.innerHTML}</div></div></body></html>`);
    w.document.close();
    w.onload = () => { w.print(); w.close(); setPrinting(false); };
  };

  if (loading) return <div style={{padding:40, textAlign:'center'}}>กำลังโหลด…</div>;
  if (!bill) return <div style={{padding:40, textAlign:'center'}}>ไม่พบข้อมูล</div>;

  const items = bill.billItems || [];
  const subTotal = bill.subTotal ?? bill.totalPrice ?? items.reduce((s,i)=>s+(i.totalPrice||0),0);
  const vatRate = bill.vatRate ?? 0;
  const vatAmount = bill.vatAmount ?? 0;
  const grand = bill.grandTotal ?? (subTotal + vatAmount);

  return (
    <div className="a4-screen">
      <div style={{maxWidth:1040, margin:'0 auto 16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontWeight:800, fontSize:18}}>Invoice Style #{bill.billId}</div>
          <div style={{color:'#6b7280', fontSize:12}}>รูปแบบ A4</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button onClick={()=>navigate('/bills')} style={{padding:'10px 16px',borderRadius:8,border:'none',background:'#6b7280',color:'#fff',cursor:'pointer'}}><ArrowLeft size={14}/> กลับ</button>
          <button onClick={()=>toastService.info('จะมีในเวอร์ชันถัดไป')} style={{padding:'10px 16px',borderRadius:8,border:'none',background:'#f59e0b',color:'#fff',cursor:'pointer'}}><Download size={14}/> ดาวน์โหลด PDF</button>
          <button onClick={handlePrint} disabled={printing} style={{padding:'10px 16px',borderRadius:8,border:'none',background:'#10b981',color:'#fff',cursor:printing?'not-allowed':'pointer', opacity:printing?0.7:1}}><Printer size={14}/> พิมพ์</button>
        </div>
      </div>

      <div className="a4-sheet">
        <div ref={printRef} className="invoice-wrap">
          <div className="inv-header">
            <div className="inv-logo">LOGO</div>
            <div className="inv-company">
              <h1>{company?.companyName || 'YOUR COMPANY'}</h1>
              <div className="meta">
                <div>Address: {company?.address || '-'}</div>
                <div>Phone: {company?.phoneNumber || '-'}</div>
                <div>Email: {company?.email || '-'}</div>
                <div>Tax ID: {company?.taxId || '-'}</div>
              </div>
            </div>
            <div className="inv-title">
              <h2>INVOICE / CASH MEMO</h2>
              <div className="meta">
                <div><b>Date:</b> {dmy(bill.createDate)}</div>
                <div><b>Due Date:</b> {dmy(bill.dueDate)}</div>
                <div><b>Invoice #:</b> {bill.billId}</div>
              </div>
            </div>
          </div>

          <div className="inv-two-col">
            <div className="inv-block">
              <h3>Bill To</h3>
              <div className="kv">
                <div><b>M/s:</b> {bill.customerName || '-'}</div>
                <div><b>Address:</b> {bill.customerAddress || '-'}</div>
                <div><b>Phone:</b> {bill.customerPhone || '-'}</div>
                <div><b>Type:</b> {bill.billType || '-'}</div>
              </div>
            </div>
            <div className="inv-block">
              <h3>Invoice Details</h3>
              <div className="kv">
                <div><b>Order Date:</b> {dmyTH(bill.createDate)}</div>
                <div><b>Delivery Date:</b> {bill.deliveryDate ? dmyTH(bill.deliveryDate) : '-'}</div>
                <div><b>Payment Method:</b> {bill.paymentMethodName || bill.paymentMethod || '-'}</div>
                <div><b>Status:</b> {bill.paymentStatus || '-'}</div>
              </div>
            </div>
          </div>

          <div className="table-box">
            <table className="inv-table">
              <thead>
                <tr>
                  <th className="col-sn">S.N</th>
                  <th className="col-desc">Description of Goods</th>
                  <th className="col-qty">Quantity</th>
                  <th className="col-rate">Rate</th>
                  <th className="col-amount">Amount</th>
                </tr>
              </thead>
              <tbody className="inv-items-body">
                {(items.length ? items : Array.from({length:1})).map((it, idx) => (
                  <tr key={idx}>
                    <td className="col-sn" style={{textAlign:'center'}}>{(idx < items.length) ? (idx+1) : ''}</td>
                    <td className="col-desc">
                      {(idx < items.length) && (<>
                        <div style={{fontWeight:600}}>{it.itemName || it.productName}</div>
                        <div style={{fontSize:10, color:'#6b7280', marginTop:2}}>{it.itemId ? '(Material)' : '(Product)'} — Unit: {it.unit}</div>
                      </>)}
                    </td>
                    <td className="col-qty" style={{textAlign:'center'}}>{(idx < items.length) ? (it.quantity ?? 0).toLocaleString('en-US') : ''}</td>
                    <td className="col-rate" style={{textAlign:'right'}}>{(idx < items.length) ? fmt(it.pricePerUnit) : ''}</td>
                    <td className="col-amount" style={{textAlign:'right'}}>{(idx < items.length) ? fmt(it.totalPrice) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals-and-terms">
            <div className="terms">
              <div style={{fontWeight:700, marginBottom:6}}>Terms & Conditions:</div>
              <div>1. Payment due within {bill.paymentTerms || '30 days'}</div>
              <div>2. VAT @ {vatRate || 0}%</div>
              <div>3. All disputes are subject to local jurisdiction</div>
            </div>
            <div className="totals">
              <div className="row"><span>Sub Total</span><span>{fmt(subTotal)}</span></div>
              <div className="row"><span>VAT {vatRate || 0}%</span><span>{fmt(vatAmount)}</span></div>
              <div className="row"><span>Total</span><span>{fmt(grand)}</span></div>
            </div>
          </div>

          <div className="amount-words">
            <b>Amount in words:</b> {wordsTH(grand)}
          </div>

          <div className="inv-footer">
            <div style={{fontSize:10, color:'#6b7280'}}>
              • This is a computer generated invoice.<br/>
              • Late payment charges may apply.
            </div>
            <div className="sig">
              <div className="line"></div>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStyleReceipt;
