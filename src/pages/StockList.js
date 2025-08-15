
import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, Box } from 'lucide-react';
import { stockAPI } from '../services/api';
import { Theme } from '../components/common/Theme';
import { StyleUtils } from '../components/common/StyleUtils';
import { StatusBadge, ActionButton, FilterTab } from '../components/common/ComponentUtils';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [stocks, searchTerm, filterStatus]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await stockAPI.getAll();
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
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

  const applyFilters = () => {
    let filtered = [...stocks];
    if (searchTerm) {
      filtered = filtered.filter(stock =>
        stock.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'ทั้งหมด') {
      filtered = filtered.filter(stock => getStockStatus(stock.amount) === filterStatus);
    }
    setFilteredStocks(filtered);
  };

  const filterTabs = [
    { key: 'ทั้งหมด', label: 'ทั้งหมด', icon: Box },
    { key: 'เพียงพอ', label: 'เพียงพอ', icon: Box },
    { key: 'เหลือน้อย', label: 'เหลือน้อย', icon: Box },
    { key: 'หมด', label: 'หมด', icon: Box }
  ];

  return (
    <div style={StyleUtils.layout().container}>
      {/* Header */}
      <div style={StyleUtils.layout().header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Theme.spacing.md }}>
          <div style={{ padding: Theme.spacing.md, backgroundColor: Theme.colors.primaryLight, borderRadius: Theme.radius.lg }}>
            <Box size={32} style={{ color: Theme.colors.primary }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: Theme.colors.gray[800], margin: 0 }}>วัสดุในคลัง</h1>
            <p style={{ margin: 0, color: Theme.colors.gray[500] }}>จัดการรายการวัสดุ</p>
          </div>
        </div>
        <button style={StyleUtils.button('success')}>
          + เพิ่มวัสดุ
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{ ...StyleUtils.card(), padding: Theme.spacing.lg, marginBottom: Theme.spacing.xl }}>
        <div style={{ marginBottom: Theme.spacing.md, display: 'flex', gap: Theme.spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
          {filterTabs.map(tab => (
            <FilterTab
              key={tab.key}
              active={filterStatus === tab.key}
              onClick={() => setFilterStatus(tab.key)}
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
              placeholder="ค้นหาวัสดุ..."
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
                <th style={headerCell()}>รหัส</th>
                <th style={headerCell()}>ชื่อวัสดุ</th>
                <th style={headerCell()}>หน่วย</th>
                <th style={headerCell()}>ราคาซื้อ</th>
                <th style={headerCell()}>ราคาขาย</th>
                <th style={headerCell()}>จำนวน</th>
                <th style={headerCell()}>สถานะสต็อก</th>
                <th style={headerCell()}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={cell({ textAlign: 'center' })}>กำลังโหลด...</td>
                </tr>
              ) : filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={cell({ textAlign: 'center' })}>ไม่พบข้อมูล</td>
                </tr>
              ) : (
                filteredStocks.map(stock => {
                  const status = getStockStatus(stock.amount);
                  return (
                    <tr key={stock.itemId}>
                      <td style={cell()}>{stock.itemId}</td>
                      <td style={cell()}>{stock.itemName}</td>
                      <td style={cell()}>{stock.unit}</td>
                      <td style={cell()}>{stock.importPrice?.toLocaleString()} บาท</td>
                      <td style={cell()}>{stock.exportPrice?.toLocaleString()} บาท</td>
                      <td style={cell()}>{stock.amount}</td>
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

const headerCell = () => ({
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

export default StockList;
