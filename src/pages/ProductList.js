
import React, { useState, useEffect } from 'react';
import { Box, Eye, Trash2, Search } from 'lucide-react';
import { productAPI } from '../services/api';
import { Theme } from '../components/common/Theme';
import { StyleUtils } from '../components/common/StyleUtils';
import { StatusBadge, ActionButton, FilterTab } from '../components/common/ComponentUtils';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('ทั้งหมด');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (amount) => {
    if (amount <= 0) return 'หมด';
    if (amount <= 10) return 'เหลือน้อย';
    return 'เพียงพอ';
  };

  const getVariant = (status) => {
    if (status === 'หมด') return 'error';
    if (status === 'เหลือน้อย') return 'warning';
    return 'success';
  };

  const filterTabs = [
    { key: 'ทั้งหมด', label: 'ทั้งหมด', icon: Box },
    { key: 'เพียงพอ', label: 'เพียงพอ', icon: Box },
    { key: 'เหลือน้อย', label: 'เหลือน้อย', icon: Box },
    { key: 'หมด', label: 'หมด', icon: Box }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === 'ทั้งหมด' || getStockStatus(product.amount) === stockFilter;
    return matchesSearch && matchesStock;
  });

  return (
    <div style={StyleUtils.layout().container}>
      {/* Header */}
      <div style={StyleUtils.layout().header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Theme.spacing.md }}>
          <div style={{ padding: Theme.spacing.md, backgroundColor: Theme.colors.primaryLight, borderRadius: Theme.radius.lg }}>
            <Box size={32} style={{ color: Theme.colors.primary }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: Theme.colors.gray[800], margin: 0 }}>รายการสินค้า</h1>
            <p style={{ margin: 0, color: Theme.colors.gray[500] }}>จัดการสินค้าในระบบ</p>
          </div>
        </div>
        <button style={StyleUtils.button('success')}>
          + เพิ่มสินค้า
        </button>
      </div>

      {/* Filters */}
      <div style={{ ...StyleUtils.card(), padding: Theme.spacing.lg, marginBottom: Theme.spacing.xl }}>
        <div style={{ marginBottom: Theme.spacing.md, display: 'flex', gap: Theme.spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
          {filterTabs.map(tab => (
            <FilterTab
              key={tab.key}
              active={stockFilter === tab.key}
              onClick={() => setStockFilter(tab.key)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: Theme.spacing.lg }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: Theme.spacing.lg, top: '50%', transform: 'translateY(-50%)', color: Theme.colors.gray[400] }} />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...StyleUtils.input(), paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={StyleUtils.card()}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ backgroundColor: Theme.colors.gray[50] }}>
              <tr>
                <th style={cellHeader()}>รหัส</th>
                <th style={cellHeader()}>ชื่อสินค้า</th>
                <th style={cellHeader()}>หน่วย</th>
                <th style={cellHeader()}>ราคาปกติ</th>
                <th style={cellHeader()}>ราคาพาร์ทเนอร์</th>
                <th style={cellHeader()}>จำนวน</th>
                <th style={cellHeader()}>สถานะสต็อก</th>
                <th style={cellHeader()}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={cell({ textAlign: 'center' })}>กำลังโหลด...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={cell({ textAlign: 'center' })}>ไม่พบข้อมูล</td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const status = getStockStatus(product.amount);
                  return (
                    <tr key={product.productId}>
                      <td style={cell()}>{product.productId}</td>
                      <td style={cell()}>{product.productName}</td>
                      <td style={cell()}>{product.unit}</td>
                      <td style={cell()}>{product.normalPrice?.toLocaleString()} บาท</td>
                      <td style={cell()}>{product.partnerPrice?.toLocaleString()} บาท</td>
                      <td style={cell()}>{product.amount}</td>
                      <td style={cell()}><StatusBadge status={status} variant={getVariant(status)} /></td>
                      <td style={cell()}>
                        <div style={{ display: 'flex', gap: Theme.spacing.sm }}>
                          <ActionButton icon={Eye} onClick={() => {}} variant="view" title="ดู" />
                          <ActionButton icon={Trash2} onClick={() => {}} variant="error" title="ลบ" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const cellHeader = () => ({
  padding: Theme.spacing.lg,
  fontSize: '0.875rem',
  fontWeight: 600,
  color: Theme.colors.gray[700],
  textAlign: 'left'
});

const cell = (extra = {}) => ({
  padding: Theme.spacing.lg,
  fontSize: '0.875rem',
  color: Theme.colors.gray[800],
  ...extra
});

export default ProductList;
