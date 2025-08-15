
import React, { useState, useEffect } from 'react';
import { Search, Users, Eye, Trash2 } from 'lucide-react';
import { customerAPI } from '../services/api';
import { Theme } from '../components/common/Theme';
import { StyleUtils } from '../components/common/StyleUtils';
import { FilterTab, ActionButton } from '../components/common/ComponentUtils';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ทั้งหมด');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTabs = [
    { key: 'ทั้งหมด', label: 'ทั้งหมด', icon: Users },
    { key: 'ลูกค้าทั่วไป', label: 'ลูกค้าทั่วไป', icon: Users },
    { key: 'ช่าง', label: 'ช่าง', icon: Users }
  ];

  const filteredCustomers = customers.filter(cus => {
    const matchesSearch = cus.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ทั้งหมด' || cus.customerType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={StyleUtils.layout().container}>
      <div style={StyleUtils.layout().header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Theme.spacing.md }}>
          <div style={{ padding: Theme.spacing.md, backgroundColor: Theme.colors.primaryLight, borderRadius: Theme.radius.lg }}>
            <Users size={32} style={{ color: Theme.colors.primary }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: Theme.colors.gray[800], margin: 0 }}>ลูกค้า</h1>
            <p style={{ margin: 0, color: Theme.colors.gray[500] }}>รายชื่อลูกค้าทั้งหมด</p>
          </div>
        </div>
        <button style={StyleUtils.button('success')}>
          + เพิ่มลูกค้า
        </button>
      </div>

      <div style={{ ...StyleUtils.card(), padding: Theme.spacing.lg, marginBottom: Theme.spacing.xl }}>
        <div style={{ marginBottom: Theme.spacing.md, display: 'flex', gap: Theme.spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
          {filterTabs.map(tab => (
            <FilterTab
              key={tab.key}
              active={typeFilter === tab.key}
              onClick={() => setTypeFilter(tab.key)}
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
              placeholder="ค้นหาชื่อลูกค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...StyleUtils.input(), paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
      </div>

      <div style={StyleUtils.card()}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ backgroundColor: Theme.colors.gray[50] }}>
              <tr>
                <th style={headerCell()}>รหัส</th>
                <th style={headerCell()}>ชื่อ</th>
                <th style={headerCell()}>เบอร์โทร</th>
                <th style={headerCell()}>ที่อยู่</th>
                <th style={headerCell()}>ประเภทลูกค้า</th>
                <th style={headerCell()}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={cell({ textAlign: 'center' })}>กำลังโหลด...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={cell({ textAlign: 'center' })}>ไม่พบข้อมูล</td>
                </tr>
              ) : (
                filteredCustomers.map(cus => (
                  <tr key={cus.customerId}>
                    <td style={cell()}>{cus.customerId}</td>
                    <td style={cell()}>{cus.name}</td>
                    <td style={cell()}>{cus.phoneNumber}</td>
                    <td style={cell()}>{cus.address}</td>
                    <td style={cell()}>{cus.customerType}</td>
                    <td style={cell()}>
                      <div style={{ display: 'flex', gap: Theme.spacing.sm }}>
                        <ActionButton icon={Eye} onClick={() => {}} variant="view" title="ดู" />
                        <ActionButton icon={Trash2} onClick={() => {}} variant="error" title="ลบ" />
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

export default CustomerList;
