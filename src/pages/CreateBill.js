
// src/pages/CreateBill.js - Updated v2: single combobox (type-less), inline add-item, delivery/create dates
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShoppingCart, User, CreditCard, FileText, Save, ArrowLeft, Calculator, Building2, Search, Box } from 'lucide-react';
import { billAPI, customerAPI, employeeAPI, stockAPI, productAPI } from '../services/api';
import toastService from '../services/ToastService';

/**
 * Combined combobox: single input + dropdown suggestions (no Enter required).
 * - Merges stocks + products; displays as list while typing
 * - Clicking an option triggers onSelect(option)
 */
const ComboBox = ({
  placeholder = 'พิมพ์เพื่อค้นหา...',
  options = [],
  onSelect,
  inputStyle = {},
  optionItemStyle = {},
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const norm = (s) => (s || '').toString().toLowerCase();
  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return options.slice(0, 50);
    return options.filter(o => norm(o.label).includes(q)).slice(0, 50);
  }, [options, query]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 36px 12px 12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            ...inputStyle
          }}
        />
        <Search size={16} style={{ position: 'absolute', right: 10, top: 12, opacity: 0.6 }} />
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginTop: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          maxHeight: 280,
          overflowY: 'auto',
          zIndex: 20
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 12, color: '#6b7280', fontSize: 14 }}>ไม่พบรายการที่ตรงกับ “{query}”</div>
          ) : filtered.map(opt => (
            <button
              key={`${opt.type}-${opt.id}`}
              type="button"
              onClick={() => {
                onSelect?.(opt);
                setQuery(opt.label);
                setOpen(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                background: 'white',
                border: 'none',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 8,
                alignItems: 'center',
                ...optionItemStyle
              }}
            >
              <span style={{ fontSize: 18 }}>{opt.type === 'stock' ? '📦' : '🔧'}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{opt.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {opt.type === 'stock' ? 'วัสดุ/อุปกรณ์' : 'สินค้า'}
                  {opt.unit ? ` • ${opt.unit}` : ''}
                  {typeof opt.remaining !== 'undefined' ? ` • คงเหลือ ${opt.remaining}${opt.unit ? ' ' + opt.unit : ''}` : ''}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>
                ฿{Number(opt.pricePreview || 0).toLocaleString('th-TH')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateBill = () => {
  const navigate = useNavigate();

  // Master data
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    billType: 'ทั่วไป',
    customerId: '',
    employeeId: '',
    paymentMethod: 'CASH',
    paymentStatus: 'รอชำระ',
    dueDate: '',
    vatRate: 0,
    remark: '',
    paymentTerms: '',
    // bank transfer fields
    bankName: '',
    bankAccount: '',
    accountName: '',
    // dates
    deliveryDate: '',
    createDate: new Date().toISOString().split('T')[0],
    billItems: []
  });

  // UI states
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Inline "current item" without type selector
  const [currentItem, setCurrentItem] = useState({
    type: null, // will be 'stock' or 'product' after select
    itemId: '',
    productId: '',
    quantity: 1,
    pricePerUnit: 0,
    itemName: '',
    unit: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [customersRes, employeesRes, stocksRes, productsRes] = await Promise.all([
        customerAPI.getAll(),
        employeeAPI.getAll(),
        stockAPI.getAll(),
        productAPI.getAll()
      ]);

      setCustomers(customersRes.data || []);
      setEmployees(employeesRes.data || []);
      setStocks((stocksRes.data || []).filter(s => (s.isActive ?? true)));
      setProducts((productsRes.data || []).filter(p => (p.isActive ?? true)));
    } catch (error) {
      console.error('Error fetching data:', error);
      toastService.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // Build unified options for combobox
  const unifiedOptions = useMemo(() => {
    const stockOpts = (stocks || []).map(s => ({
      type: 'stock',
      id: s.itemId,
      name: s.itemName,
      unit: s.unit,
      remaining: s.amount,
      pricePreview: s.exportPrice,
      data: s,
      label: `${s.itemName} ${s.amount != null ? `(คงเหลือ: ${s.amount}${s.unit ? ' ' + s.unit : ''})` : ''}`.trim()
    }));
    const productOpts = (products || []).map(p => ({
      type: 'product',
      id: p.productId,
      name: p.productName,
      unit: p.unit,
      remaining: p.amount,
      // preview use normalPrice; final price chooses by billType
      pricePreview: p.normalPrice ?? p.partnerPrice,
      data: p,
      label: `${p.productName} ${p.amount != null ? `(คงเหลือ: ${p.amount}${p.unit ? ' ' + p.unit : ''})` : ''}`.trim()
    }));
    return [...stockOpts, ...productOpts];
  }, [stocks, products]);

  // Totals
  const calculateTotals = () => {
    const subTotal = formData.billItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const vatAmount = subTotal * (formData.vatRate / 100);
    const grandTotal = subTotal + vatAmount;
    return { subTotal, vatAmount, grandTotal };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'customerId') {
      const customer = customers.find(c => c.customerId === parseInt(value));
      setSelectedCustomer(customer || null);
    }
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
      ...(method !== 'TRANSFER' && { bankName: '', bankAccount: '', accountName: '' })
    }));
  };

  // When a combobox option is selected, fill current item
  const handleSelectOption = (opt) => {
    if (!opt) return;
    if (opt.type === 'stock') {
      const s = opt.data;
      setCurrentItem({
        type: 'stock',
        itemId: s.itemId,
        productId: '',
        quantity: 1,
        pricePerUnit: Number(s.exportPrice || 0),
        itemName: s.itemName,
        unit: s.unit || ''
      });
    } else {
      const p = opt.data;
      const price = formData.billType === 'ช่าง' ? (p.partnerPrice ?? p.normalPrice ?? 0) : (p.normalPrice ?? p.partnerPrice ?? 0);
      setCurrentItem({
        type: 'product',
        itemId: '',
        productId: p.productId,
        quantity: 1,
        pricePerUnit: Number(price || 0),
        itemName: p.productName,
        unit: p.unit || ''
      });
    }
  };

  const handleQtyPriceChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value || '1', 10)) : Number(value || 0)
    }));
  };

  const addItemInline = () => {
    if (!currentItem.type) {
      toastService.warning('กรุณาเลือกสินค้า/วัสดุจากช่องค้นหา');
      return;
    }
    if (currentItem.quantity <= 0) {
      toastService.warning('กรุณาระบุจำนวนให้ถูกต้อง');
      return;
    }
    const totalPrice = currentItem.quantity * currentItem.pricePerUnit;
    const newItem = {
      id: Date.now(),
      itemId: currentItem.type === 'stock' ? parseInt(currentItem.itemId) : null,
      productId: currentItem.type === 'product' ? parseInt(currentItem.productId) : null,
      name: currentItem.itemName,
      quantity: currentItem.quantity,
      pricePerUnit: currentItem.pricePerUnit,
      totalPrice,
      type: currentItem.type,
      unit: currentItem.unit || ''
    };
    setFormData(prev => ({ ...prev, billItems: [...prev.billItems, newItem] }));
    setCurrentItem({
      type: null,
      itemId: '',
      productId: '',
      quantity: 1,
      pricePerUnit: 0,
      itemName: '',
      unit: ''
    });
    toastService.success('เพิ่มรายการเรียบร้อย');
  };

  const removeItemFromBill = (rowId) => {
    setFormData(prev => ({
      ...prev,
      billItems: prev.billItems.filter(item => item.id !== rowId)
    }));
    toastService.success('ลบสินค้าเรียบร้อย');
  };

  // New customer submit
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    customerType: 'ลูกค้าทั่วไป'
  });
  const handleNewCustomerSubmit = async () => {
    if (!newCustomer.name.trim()) {
      toastService.error('กรุณากรอกชื่อลูกค้า');
      return;
    }
    try {
      const response = await customerAPI.create(newCustomer);
      const createdCustomer = response.data;
      setCustomers(prev => [...prev, createdCustomer]);
      setFormData(prev => ({ ...prev, customerId: createdCustomer.customerId }));
      setSelectedCustomer(createdCustomer);
      setShowNewCustomerForm(false);
      setNewCustomer({ name: '', phoneNumber: '', address: '', customerType: 'ลูกค้าทั่วไป' });
      toastService.success('เพิ่มลูกค้าใหม่เรียบร้อย');
    } catch (error) {
      console.error('Error creating customer:', error);
      toastService.error('เกิดข้อผิดพลาดในการเพิ่มลูกค้า');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId || !formData.employeeId) {
      toastService.warning('กรุณาเลือกลูกค้าและพนักงาน');
      return;
    }
    if (formData.billItems.length === 0) {
      toastService.warning('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ');
      return;
    }
    if (formData.paymentMethod === 'TRANSFER') {
      if (!formData.bankName || !formData.bankAccount || !formData.accountName) {
        toastService.warning('กรุณากรอกข้อมูลธนาคารให้ครบถ้วน');
        return;
      }
    }

    try {
      setSaving(true);
      // Append dates to remark to avoid schema change if deliveryDate not in DB
      const remarkWithDates = [
        formData.remark,
        formData.deliveryDate ? `วันที่นัดส่ง: ${formData.deliveryDate}` : null,
        formData.createDate ? `วันที่สร้างรายการ: ${formData.createDate}` : null
      ].filter(Boolean).join(' | ');

      const billData = {
        billType: formData.billType,
        customerId: parseInt(formData.customerId),
        employeeId: parseInt(formData.employeeId),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        dueDate: formData.dueDate || null,
        vatRate: parseFloat(formData.vatRate),
        remark: remarkWithDates,
        paymentTerms: formData.paymentTerms,
        ...(formData.paymentMethod === 'TRANSFER' && {
          paymentTerms: `${formData.paymentTerms ? formData.paymentTerms + ' | ' : ''}ธนาคาร: ${formData.bankName} | บัญชี: ${formData.bankAccount} | ชื่อบัญชี: ${formData.accountName}`
        }),
        billItems: formData.billItems.map(item => ({
          itemId: item.itemId,
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit
        }))
      };

      const response = await billAPI.create(billData);
      if (response.data) {
        toastService.success('สร้างบิลเรียบร้อย');
        navigate('/bills');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toastService.error('เกิดข้อผิดพลาดในการสร้างบิล');
    } finally {
      setSaving(false);
    }
  };

  const { subTotal, vatAmount, grandTotal } = calculateTotals();

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
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ color: '#6b7280', fontWeight: '500' }}>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white'
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '700' }}>
            📝 สร้างบิลใหม่
          </h1>
          <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
            เพิ่มข้อมูลบิลและรายการสินค้า
          </p>
        </div>
        <button
          onClick={() => navigate('/bills')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} />
          กลับ
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '24px' }}>
          
          {/* ข้อมูลพื้นฐาน + วันที่ */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 20px', 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={20} />
              ข้อมูลพื้นฐาน
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              
              {/* ประเภทบิล */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  ประเภทบิล *
                </label>
                <select
                  name="billType"
                  value={formData.billType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <option value="ทั่วไป">ทั่วไป</option>
                  <option value="ช่าง">ช่าง</option>
                </select>
              </div>

              {/* พนักงาน */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  พนักงาน *
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <option value="">เลือกพนักงาน</option>
                  {employees.map(employee => (
                    <option key={employee.employeeId} value={employee.employeeId}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* วันที่นัดส่ง */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  วันที่นัดส่ง
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                />
              </div>

              {/* วันที่สร้างรายการ (แสดงเฉย ๆ) */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  วันที่สร้างรายการ
                </label>
                <input
                  type="date"
                  name="createDate"
                  value={formData.createDate}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#f9fafb',
                    color: '#6b7280',
                    transition: 'border-color 0.2s ease'
                  }}
                />
                <small style={{ color: '#6b7280' }}>ระบบจะบันทึกตามเวลาจริงของฐานข้อมูลด้วย</small>
              </div>

            </div>
          </div>

          {/* ข้อมูลลูกค้า */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <User size={20} />
                ข้อมูลลูกค้า
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={16} />
                เพิ่มลูกค้าใหม่
              </button>
            </div>

            {!showNewCustomerForm ? (
              <>
                {/* เลือกลูกค้าที่มีอยู่ */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    เลือกลูกค้า *
                  </label>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <option value="">เลือกลูกค้า</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name} - {customer.customerType || 'ลูกค้าทั่วไป'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* แสดงข้อมูลลูกค้าที่เลือก */}
                {selectedCustomer && (
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: '12px',
                    border: '2px solid #0ea5e9'
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#0369a1', fontSize: '16px', fontWeight: '600' }}>
                      ℹ️ ข้อมูลลูกค้าที่เลือก
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div><strong>📝 ชื่อ:</strong> {selectedCustomer.name}</div>
                      <div><strong>📱 เบอร์โทร:</strong> {selectedCustomer.phoneNumber || 'ไม่ระบุ'}</div>
                      <div><strong>🏠 ที่อยู่:</strong> {selectedCustomer.address || 'ไม่ระบุ'}</div>
                      <div><strong>👤 ประเภท:</strong> {selectedCustomer.customerType || 'ลูกค้าทั่วไป'}</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ฟอร์มเพิ่มลูกค้าใหม่ */
              <div style={{ 
                padding: '24px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '12px',
                border: '2px solid #10b981'
              }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#065f46', fontSize: '18px', fontWeight: '600' }}>
                  ➕ เพิ่มลูกค้าใหม่
                </h4>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500', 
                      color: '#374151'
                    }}>
                      📝 ชื่อลูกค้า *
                    </label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white'
                      }}
                      placeholder="กรอกชื่อลูกค้า"
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500', 
                      color: '#374151'
                    }}>
                      📱 เบอร์โทร
                    </label>
                    <input
                      type="tel"
                      value={newCustomer.phoneNumber}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white'
                      }}
                      placeholder="กรอกเบอร์โทร"
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500', 
                      color: '#374151'
                    }}>
                      👤 ประเภทลูกค้า
                    </label>
                    <select
                      value={newCustomer.customerType}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, customerType: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white'
                      }}
                    >
                      <option value="ลูกค้าทั่วไป">ลูกค้าทั่วไป</option>
                      <option value="ช่าง">ช่าง</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500', 
                    color: '#374151'
                  }}>
                    🏠 ที่อยู่
                  </label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #10b981',
                      borderRadius: '8px',
                      fontSize: '14px',
                      minHeight: '80px',
                      resize: 'vertical',
                      background: 'white'
                    }}
                    placeholder="กรอกที่อยู่"
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={handleNewCustomerSubmit} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <Save size={16} />
                    บันทึกลูกค้า
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowNewCustomerForm(false)} 
                    style={{
                      padding: '12px 20px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#374151',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ข้อมูลการชำระเงิน */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 20px', 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CreditCard size={20} />
              ข้อมูลการชำระเงิน
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              
              {/* วิธีการชำระเงิน */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  วิธีการชำระเงิน *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handlePaymentMethodChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <option value="CASH">💵 เงินสด</option>
                  <option value="TRANSFER">💳 โอนเงิน</option>
                  <option value="CREDIT">🏦 เครดิต</option>
                  <option value="CHEQUE">📄 เช็ค</option>
                </select>
              </div>

              {/* สถานะการชำระ */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  สถานะการชำระ
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <option value="รอชำระ">⏳ รอชำระ</option>
                  <option value="ชำระแล้ว">✅ ชำระแล้ว</option>
                  <option value="ชำระบางส่วน">💳 ชำระบางส่วน</option>
                  <option value="ยกเลิก">❌ ยกเลิก</option>
                </select>
              </div>

              {/* วันที่ครบกำหนด */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  วันที่ครบกำหนด
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                />
              </div>

              {/* VAT */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  อัตรา VAT (%)
                </label>
                <input
                  type="number"
                  name="vatRate"
                  value={formData.vatRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                />
              </div>

            </div>

            {/* ฟิลด์ข้อมูลธนาคาร - แสดงเมื่อเลือกโอนเงิน */}
            {formData.paymentMethod === 'TRANSFER' && (
              <div style={{
                marginTop: '20px',
                padding: '20px',
                background: 'linear-gradient(135deg, #e0f2fe 0%, #e1f5fe 100%)',
                borderRadius: '12px',
                border: '2px solid #0284c7'
              }}>
                <h4 style={{ 
                  margin: '0 0 16px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#0c4a6e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Building2 size={18} />
                  ข้อมูลการโอนเงิน
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  
                  {/* ชื่อธนาคาร */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#0c4a6e' }}>
                      ชื่อธนาคาร *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="เช่น ธนาคารกสิกรไทย"
                      required={formData.paymentMethod === 'TRANSFER'}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #0284c7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        transition: 'border-color 0.2s ease'
                      }}
                    />
                  </div>

                  {/* เลขที่บัญชี */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#0c4a6e' }}>
                      เลขที่บัญชี *
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      placeholder="xxx-x-xxxxx-x"
                      required={formData.paymentMethod === 'TRANSFER'}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #0284c7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        transition: 'border-color 0.2s ease'
                      }}
                    />
                  </div>

                  {/* ชื่อบัญชี */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#0c4a6e' }}>
                      ชื่อบัญชี *
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="ชื่อเจ้าของบัญชี"
                      required={formData.paymentMethod === 'TRANSFER'}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #0284c7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        transition: 'border-color 0.2s ease'
                      }}
                    />
                  </div>

                </div>

                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'rgba(12, 74, 110, 0.1)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#0c4a6e'
                }}>
                  💡 ข้อมูลนี้จะแสดงในใบเสร็จสำหรับลูกค้าทำการโอนเงิน
                </div>
              </div>
            )}

            {/* หมายเหตุการชำระ */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                หมายเหตุการชำระ
              </label>
              <textarea
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                rows="3"
                placeholder="ระบุเงื่อนไขการชำระเงิน..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>

          </div>

          {/* เพิ่มรายการสินค้า - inline (combobox) */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShoppingCart size={20} />
                🛒 เพิ่มรายการสินค้า/วัสดุ
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '16px',
              alignItems: 'end'
            }}>
              {/* ค้นหาและเลือก (combobox) */}
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>
                  ค้นหาและเลือกสินค้า/วัสดุ
                </label>
                <ComboBox
                  options={unifiedOptions}
                  onSelect={handleSelectOption}
                />
              </div>

              {/* จำนวน */}
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>จำนวน</label>
                <input
                  type="number"
                  name="quantity"
                  value={currentItem.quantity}
                  onChange={handleQtyPriceChange}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* ราคา/หน่วย */}
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>ราคา/หน่วย</label>
                <input
                  type="number"
                  step="0.01"
                  name="pricePerUnit"
                  value={currentItem.pricePerUnit}
                  onChange={handleQtyPriceChange}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="เลือกรายการเพื่ออัตโนมัติ"
                />
              </div>

              {/* รวม */}
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>ราคารวม</label>
                <input
                  type="text"
                  value={`฿${(currentItem.quantity * currentItem.pricePerUnit).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#f9fafb',
                    color: '#6b7280'
                  }}
                />
              </div>

              {/* ปุ่มเพิ่ม */}
              <div>
                <button
                  type="button"
                  onClick={addItemInline}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  disabled={!currentItem.type}
                  title={!currentItem.type ? 'โปรดเลือกสินค้า/วัสดุก่อน' : 'เพิ่มรายการ'}
                >
                  <Plus size={16} />
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>

          {/* รายการสินค้า */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShoppingCart size={20} />
                รายการสินค้า ({formData.billItems.length} รายการ)
              </h3>
            </div>

            {formData.billItems.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>สินค้า</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>จำนวน</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>ราคา/หน่วย</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>รวม</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.billItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              background: item.type === 'stock' ? '#dbeafe' : '#fef3c7',
                              color: item.type === 'stock' ? '#1d4ed8' : '#d97706'
                            }}>
                              {item.type === 'stock' ? '📦' : '🔧'}
                            </span>
                            <span style={{ fontWeight: '500' }}>{item.name}</span>
                            {item.unit ? <span style={{ color: '#6b7280', fontSize: 12 }}>• {item.unit}</span> : null}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          ฿{Number(item.pricePerUnit).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                          ฿{Number(item.totalPrice).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => removeItemFromBill(item.id)}
                            style={{
                              padding: '6px',
                              background: '#fee2e2',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#dc2626',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '2px dashed #d1d5db'
              }}>
                <ShoppingCart size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '500' }}>ยังไม่มีสินค้าในบิล</p>
                <p style={{ margin: 0, fontSize: '14px' }}>เพิ่มรายการจากส่วนด้านบน</p>
              </div>
            )}
          </div>

          {/* สรุปยอดเงิน */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 20px', 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calculator size={20} />
              สรุปยอดเงิน
            </h3>

            <div style={{ display: 'grid', gap: '12px', maxWidth: '400px', marginLeft: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#6b7280' }}>ยอดรวม (ก่อน VAT):</span>
                <span style={{ fontWeight: '500' }}>
                  ฿{subTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#6b7280' }}>VAT ({formData.vatRate}%):</span>
                <span style={{ fontWeight: '500', color: '#f59e0b' }}>
                  ฿{vatAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '12px 0',
                borderTop: '2px solid #e5e7eb',
                fontSize: '18px',
                fontWeight: '700',
                color: '#059669'
              }}>
                <span>ยอดรวมทั้งสิ้น:</span>
                <span>฿{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* หมายเหตุ */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 16px', 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={20} />
              หมายเหตุ
            </h3>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleInputChange}
              rows="4"
              placeholder="ระบุหมายเหตุเพิ่มเติม..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          {/* ปุ่มบันทึก */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/bills')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '12px',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving || formData.billItems.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                background: saving ? '#9ca3af' : 'linear-gradient(135deg, #059669, #047857)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              {saving ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save size={16} />
                  บันทึกบิล
                </>
              )}
            </button>
          </div>

        </div>
      </form>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

    </div>
  );
};

export default CreateBill;
