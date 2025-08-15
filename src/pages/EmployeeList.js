
import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, User } from 'lucide-react';
import { employeeAPI } from '../services/api';
import { Theme } from '../components/common/Theme';
import { StyleUtils } from '../components/common/StyleUtils';
import { StatusBadge, ActionButton } from '../components/common/ComponentUtils';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = employees.filter((emp) =>
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phoneNumber.includes(searchTerm)
  );

  const statusText = (status) => {
    if (status === 'active') return 'ทำงานอยู่';
    if (status === 'leave') return 'ลาพัก';
    if (status === 'resigned') return 'ลาออก';
    return 'ไม่ระบุ';
  };

  const statusVariant = (status) => {
    if (status === 'active') return 'success';
    if (status === 'leave') return 'warning';
    if (status === 'resigned') return 'error';
    return 'default';
  };

  return (
    <div style={StyleUtils.layout().container}>
      <div style={StyleUtils.layout().header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Theme.spacing.md }}>
          <div style={{ padding: Theme.spacing.md, backgroundColor: Theme.colors.primaryLight, borderRadius: Theme.radius.lg }}>
            <User size={32} style={{ color: Theme.colors.primary }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: Theme.colors.gray[800], margin: 0 }}>พนักงาน</h1>
            <p style={{ margin: 0, color: Theme.colors.gray[500] }}>รายชื่อพนักงานทั้งหมด</p>
          </div>
        </div>
        <button style={StyleUtils.button('success')}>
          + เพิ่มพนักงาน
        </button>
      </div>

      <div style={{ ...StyleUtils.card(), padding: Theme.spacing.lg, marginBottom: Theme.spacing.xl }}>
        <div style={{ position: 'relative', maxWidth: '24rem' }}>
          <Search size={18} style={{ position: 'absolute', left: Theme.spacing.lg, top: '50%', transform: 'translateY(-50%)', color: Theme.colors.gray[400] }} />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, เบอร์โทร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...StyleUtils.input(), paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div style={StyleUtils.card()}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ backgroundColor: Theme.colors.gray[50] }}>
              <tr>
                <th style={cellHeader()}>รหัส</th>
                <th style={cellHeader()}>ชื่อ-นามสกุล</th>
                <th style={cellHeader()}>เบอร์โทร</th>
                <th style={cellHeader()}>ตำแหน่ง</th>
                <th style={cellHeader()}>สถานะ</th>
                <th style={cellHeader()}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={cell({ textAlign: 'center' })}>กำลังโหลด...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={cell({ textAlign: 'center' })}>ไม่พบข้อมูล</td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.employeeId} style={{ backgroundColor: Theme.colors.gray[50] }}>
                    <td style={cell()}>{emp.employeeId}</td>
                    <td style={cell()}>{emp.firstName} {emp.lastName}</td>
                    <td style={cell()}>{emp.phoneNumber}</td>
                    <td style={cell()}>{emp.role}</td>
                    <td style={cell()}>
                      <StatusBadge status={statusText(emp.status)} variant={statusVariant(emp.status)} />
                    </td>
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

export default EmployeeList;
