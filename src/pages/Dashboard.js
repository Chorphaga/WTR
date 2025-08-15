import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, TrendingUp, TrendingDown, Calendar, DollarSign,
  Star, ArrowUp, ArrowDown, Filter, Download, RefreshCw, ShoppingCart,
  Activity, Target, Award, Zap, Eye, Clock, Users, Box, PieChart, LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { billAPI, stockAPI, productAPI } from '../services/api';
import { Theme } from '../components/common/Theme';
import { StyleUtils } from '../components/common/StyleUtils';
import { DataUtils } from '../components/common/DataUtils';
import { FilterTab } from '../components/common/ComponentUtils';

class DashboardController {
  constructor() {
    this.state = {
      timeRange: 'month',
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      loading: false,
      dashboardData: this.getInitialData()
    };
  }

  getInitialData() {
    return {
      weeklySales: 125300,
      monthlySales: 485600,
      weeklyGrowth: 12.5,
      monthlyGrowth: 8.3,
      materialsImported: { count: 85, total: 287300, growth: 5.2 },
      topProducts: [
        { id: 1, name: 'ถุงดำ 30x40', quantity: 2500, revenue: 87500, growth: 15.2 },
        { id: 2, name: 'ถุงใส 6x14', quantity: 1890, revenue: 65650, growth: 12.8 },
        { id: 3, name: 'ถุงขยะสีเขียว', quantity: 1450, revenue: 52200, growth: 8.5 }
      ],
      bottomProducts: [
        { id: 1, name: 'ถุงร้อน 4x6', quantity: 25, revenue: 750, growth: -2.1 },
        { id: 2, name: 'ถุงร้อน 6x8', quantity: 18, revenue: 540, growth: -5.3 },
        { id: 3, name: 'ถุงหูหิ้ว', quantity: 12, revenue: 360, growth: -8.7 }
      ],
      soldItems: [
        { name: 'ถุงดำ 30x40', type: 'สินค้า', quantity: 2500, unit: 'ใบ' },
        { name: 'ถุงใส 6x14', type: 'สินค้า', quantity: 1890, unit: 'ใบ' },
        { name: 'กาวใส', type: 'วัสดุ', quantity: 45, unit: 'หลอด' },
        { name: 'ถุงขยะสีเขียว', type: 'สินค้า', quantity: 1450, unit: 'ใบ' },
        { name: 'เชือกฟาง', type: 'วัสดุ', quantity: 28, unit: 'เมตร' }
      ],
      recentActivity: [
        { type: 'sale', message: 'ขายสินค้า 15 รายการ มูลค่า ฿45,300', time: '5 นาทีที่แล้ว' },
        { type: 'import', message: 'นำเข้าวัสดุใหม่ 8 รายการ', time: '1 ชั่วโมงที่แล้ว' },
        { type: 'alert', message: 'สต็อกถุงใสเหลือน้อย (5 ชิ้น)', time: '2 ชั่วโมงที่แล้ว' }
      ],
      salesChart: [
        { name: 'ม.ค.', sales: 120000, target: 150000 },
        { name: 'ก.พ.', sales: 190000, target: 150000 },
        { name: 'มี.ค.', sales: 300000, target: 150000 },
        { name: 'เม.ย.', sales: 250000, target: 150000 },
        { name: 'พ.ค.', sales: 180000, target: 150000 },
        { name: 'มิ.ย.', sales: 485600, target: 150000 }
      ],
      categoryChart: [
        { name: 'ถุงพลาสติก', value: 45, color: '#6366f1' },
        { name: 'เชือก', value: 25, color: '#8b5cf6' },
        { name: 'กาว', value: 20, color: '#06b6d4' },
        { name: 'อื่นๆ', value: 10, color: '#10b981' }
      ]
    };
  }

  async fetchData(timeRange, month, year) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getInitialData();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

const Dashboard = () => {
  const [controller] = useState(new DashboardController());
  const [state, setState] = useState(controller.state);
  const [itemFilter, setItemFilter] = useState('ทั้งหมด'); // เพิ่ม state สำหรับ filter

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    fetchDashboardData();
  }, [state.timeRange, state.selectedMonth, state.selectedYear]);

  const fetchDashboardData = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await controller.fetchData(state.timeRange, state.selectedMonth, state.selectedYear);
      setState(prev => ({ ...prev, dashboardData: data }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const getTimeRangeText = () => {
    if (state.timeRange === 'week') return `สัปดาห์ที่ 1-4 ${months[state.selectedMonth - 1]} ${state.selectedYear}`;
    if (state.timeRange === 'month') return `${months[state.selectedMonth - 1]} ${state.selectedYear}`;
    return `ปี ${state.selectedYear}`;
  };

  return (
    <div style={StyleUtils.layout().container}>
      {/* Header */}
      <HeaderSection 
        onRefresh={fetchDashboardData}
        loading={state.loading}
      />

      {/* Time Filter Section */}
      <TimeFilterSection 
        timeRange={state.timeRange}
        selectedMonth={state.selectedMonth}
        selectedYear={state.selectedYear}
        months={months}
        years={years}
        onTimeRangeChange={(range) => updateState({ timeRange: range })}
        onMonthChange={(month) => updateState({ selectedMonth: month })}
        onYearChange={(year) => updateState({ selectedYear: year })}
        getTimeRangeText={getTimeRangeText}
      />

      {/* Revenue Cards */}
      <RevenueSection data={state.dashboardData} />

      {/* Quick Stats Bar */}
      <QuickStatsSection data={state.dashboardData} />

      {/* Main Content Grid - Improved Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: Theme.spacing.lg, marginBottom: Theme.spacing.lg }}>
        {/* Left Column - Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Theme.spacing.lg }}>
          <SalesChartSection data={state.dashboardData.salesChart} />
          <SoldItemsSection 
            items={state.dashboardData.soldItems} 
            itemFilter={itemFilter}
            setItemFilter={setItemFilter}
          />
        </div>

        {/* Right Column - Compact Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Theme.spacing.lg }}>
          <CategoryChartSection data={state.dashboardData.categoryChart} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: Theme.spacing.md }}>
            <MaterialImportSection data={state.dashboardData.materialsImported} />
            <RecentActivitySection activities={state.dashboardData.recentActivity} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <ProductRankingSection 
        topProducts={state.dashboardData.topProducts}
        bottomProducts={state.dashboardData.bottomProducts}
      />
    </div>
  );
};

// Header Component
const HeaderSection = ({ onRefresh, loading }) => (
  <div style={StyleUtils.layout().header}>
    <div style={{ display: 'flex', alignItems: 'center', gap: Theme.spacing.md }}>
      <div style={{ 
        padding: Theme.spacing.lg, 
        backgroundColor: Theme.colors.gray[100],
        borderRadius: Theme.radius.xl,
        border: `1px solid ${Theme.colors.gray[200]}`
      }}>
        <BarChart3 size={36} style={{ color: Theme.colors.gray[600] }} />
      </div>
      <div>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          margin: 0, 
          color: Theme.colors.gray[900]
        }}>
          📊 แดชบอร์ด Analytics
        </h1>
        <p style={{ margin: 0, color: Theme.colors.gray[600], fontSize: '1.1rem' }}>
          ภาพรวมยอดขายและสถิติการจัดการคลังสินค้า • อัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH')}
        </p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: Theme.spacing.sm }}>
      <button 
        onClick={onRefresh}
        style={{ 
          ...StyleUtils.button('primary'), 
          padding: '12px 20px',
          backgroundColor: loading ? Theme.colors.gray[400] : Theme.colors.primary
        }}
        disabled={loading}
      >
        <RefreshCw size={16} style={{ marginRight: '8px' }} />
        {loading ? 'กำลังโหลด...' : 'รีเฟรช'}
      </button>
      <button style={{ 
        ...StyleUtils.button('success'), 
        padding: '12px 20px'
      }}>
        <Download size={16} style={{ marginRight: '8px' }} />
        ส่งออกรายงาน
      </button>
    </div>
  </div>
);

// Time Filter Component
const TimeFilterSection = ({ 
  timeRange, selectedMonth, selectedYear, months, years,
  onTimeRangeChange, onMonthChange, onYearChange, getTimeRangeText 
}) => (
  <div style={{ 
    ...StyleUtils.card(), 
    padding: Theme.spacing.lg, 
    marginBottom: Theme.spacing.lg,
    background: 'white',
    border: `1px solid ${Theme.colors.gray[200]}`
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: Theme.spacing.md, marginBottom: Theme.spacing.lg }}>
      <div style={{ 
        padding: '8px', 
        backgroundColor: Theme.colors.gray[100], 
        borderRadius: Theme.radius.md,
        border: `1px solid ${Theme.colors.gray[200]}`
      }}>
        <Filter size={20} style={{ color: Theme.colors.gray[600] }} />
      </div>
      <h3 style={{ margin: 0, fontWeight: 700, color: Theme.colors.gray[700] }}>
        🗓️ ช่วงเวลา: {getTimeRangeText()}
      </h3>
    </div>
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: Theme.spacing.md, alignItems: 'center' }}>
      <FilterTab 
        icon={Calendar} 
        label="รายสัปดาห์" 
        active={timeRange === 'week'} 
        onClick={() => onTimeRangeChange('week')} 
      />
      <FilterTab 
        icon={Calendar} 
        label="รายเดือน" 
        active={timeRange === 'month'} 
        onClick={() => onTimeRangeChange('month')} 
      />
      <FilterTab 
        icon={Calendar} 
        label="รายปี" 
        active={timeRange === 'year'} 
        onClick={() => onTimeRangeChange('year')} 
      />

      {timeRange !== 'year' && (
        <select 
          value={selectedMonth} 
          onChange={(e) => onMonthChange(Number(e.target.value))} 
          style={{ ...StyleUtils.input(), maxWidth: 150 }}
        >
          {months.map((month, index) => (
            <option key={index + 1} value={index + 1}>{month}</option>
          ))}
        </select>
      )}

      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        style={{ ...StyleUtils.input(), maxWidth: 120 }}
      >
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>
);

// Revenue Section
const RevenueSection = ({ data }) => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: Theme.spacing.lg, 
    marginBottom: Theme.spacing.lg 
  }}>
    <EnhancedRevenueCard 
      icon={TrendingUp}
      title="ยอดขายรายสัปดาห์"
      value={data.weeklySales}
      growth={data.weeklyGrowth}
      period="สัปดาห์นี้"
    />
    <EnhancedRevenueCard 
      icon={DollarSign}
      title="ยอดขายรายเดือน"
      value={data.monthlySales}
      growth={data.monthlyGrowth}
      period="เดือนนี้"
    />
    <EnhancedRevenueCard 
      icon={Package}
      title="นำเข้าวัสดุทั้งหมด"
      value={data.materialsImported.total}
      growth={data.materialsImported.growth}
      period={`${data.materialsImported.count} รายการ`}
      isCount={false}
    />
    <EnhancedRevenueCard 
      icon={Activity}
      title="รายการที่ขายได้"
      value={data.soldItems.length}
      period="รายการทั้งหมด"
      isCount={true}
      hideGrowth={true}
    />
  </div>
);

// Enhanced Revenue Card (Minimal Design) - เพิ่ม icons ในกรอบเหลือง
const EnhancedRevenueCard = ({ 
  icon: Icon, title, value, growth, period, isCount = false, hideGrowth = false 
}) => (
  <div style={{ 
    ...StyleUtils.card(), 
    padding: Theme.spacing.xl,
    background: 'white',
    border: `1px solid ${Theme.colors.gray[200]}`,
    transition: 'all 0.3s ease',
    position: 'relative'
  }}>
    {/* Icon ในกรอบเหลือง */}
    <div style={{
      position: 'absolute',
      top: Theme.spacing.md,
      right: Theme.spacing.md,
      width: 48,
      height: 48,
      backgroundColor: '#fef3c7',
      border: '2px solid #f59e0b',
      borderRadius: Theme.radius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon size={24} style={{ color: '#d97706' }} />
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: Theme.spacing.md, marginBottom: Theme.spacing.lg }}>
      <div style={{ 
        padding: '12px', 
        backgroundColor: Theme.colors.gray[50], 
        borderRadius: Theme.radius.lg,
        border: `1px solid ${Theme.colors.gray[200]}`
      }}>
        <Icon size={24} style={{ color: Theme.colors.gray[600] }} />
      </div>
      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: Theme.colors.gray[700] }}>
        {title}
      </span>
    </div>
    
    <div style={{ marginBottom: Theme.spacing.md }}>
      <span style={{ fontSize: '2.25rem', fontWeight: 800, color: Theme.colors.gray[900] }}>
        {isCount ? value.toLocaleString() : DataUtils.formatCurrency(value)}
      </span>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.9rem', color: Theme.colors.gray[500] }}>
        {period}
      </span>
      {!hideGrowth && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '6px',
          backgroundColor: growth > 0 ? '#f0f9ff' : '#fef2f2'
        }}>
          {growth > 0 ? (
            <ArrowUp size={16} style={{ color: '#059669' }} />
          ) : (
            <ArrowDown size={16} style={{ color: '#dc2626' }} />
          )}
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 600,
            color: growth > 0 ? '#059669' : '#dc2626'
          }}>
            {Math.abs(growth)}%
          </span>
        </div>
      )}
    </div>
  </div>
);

// Quick Stats Section
const QuickStatsSection = ({ data }) => (
  <div style={{ 
    ...StyleUtils.card(), 
    padding: Theme.spacing.lg, 
    marginBottom: Theme.spacing.lg,
    background: 'white',
    border: `1px solid ${Theme.colors.gray[200]}`
  }}>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: Theme.spacing.lg 
    }}>
      <QuickStat icon="🎯" label="เป้าหมายยอดขาย" value="500,000 บาท" progress={97} />
      <QuickStat icon="📊" label="สินค้าขายดี" value="85%" progress={85} />
      <QuickStat icon="⚡" label="ประสิทธิภาพ" value="92%" progress={92} />
      <QuickStat icon="👥" label="ลูกค้าใหม่" value="12 คน" progress={60} />
    </div>
  </div>
);

const QuickStat = ({ icon, label, value, progress }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontWeight: 600, color: Theme.colors.gray[700], marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: Theme.colors.gray[900], marginBottom: '8px' }}>{value}</div>
    <div style={{ 
      width: '100%', 
      height: '6px', 
      backgroundColor: Theme.colors.gray[200], 
      borderRadius: '3px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: `${progress}%`, 
        height: '100%', 
        backgroundColor: Theme.colors.primary,
        transition: 'width 1s ease'
      }} />
    </div>
  </div>
);

// Sales Chart Section - Improved Height
const SalesChartSection = ({ data }) => (
  <div style={{ ...StyleUtils.card(), background: 'white', border: `1px solid ${Theme.colors.gray[200]}` }}>
    <div style={{ padding: Theme.spacing.lg }}>
      <h2 style={{ 
        ...StyleUtils.typography().cardTitle, 
        display: 'flex', 
        alignItems: 'center', 
        gap: Theme.spacing.sm,
        fontSize: '1.25rem',
        color: Theme.colors.gray[900]
      }}>
        <LineChart size={24} style={{ color: Theme.colors.gray[600] }} />
        📈 แนวโน้มยอดขาย
      </h2>
      <div style={{ height: 350, marginTop: Theme.spacing.lg }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={Theme.colors.gray[200]} />
            <XAxis dataKey="name" stroke={Theme.colors.gray[500]} />
            <YAxis stroke={Theme.colors.gray[500]} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: `1px solid ${Theme.colors.gray[200]}`,
                borderRadius: Theme.radius.md,
                boxShadow: Theme.shadows.sm
              }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke={Theme.colors.gray[400]} 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// Category Chart Section - Optimized Size
const CategoryChartSection = ({ data }) => (
  <div style={{ ...StyleUtils.card(), background: 'white', border: `1px solid ${Theme.colors.gray[200]}` }}>
    <div style={{ padding: Theme.spacing.lg }}>
      <h2 style={{ 
        ...StyleUtils.typography().cardTitle,
        display: 'flex', 
        alignItems: 'center', 
        gap: Theme.spacing.sm,
        color: Theme.colors.gray[900]
      }}>
        <PieChart size={24} style={{ color: Theme.colors.gray[600] }} />
        🎯 หมวดหมู่ยอดนิยม
      </h2>
      <div style={{ height: 280, marginTop: Theme.spacing.lg }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// Sold Items Section (เพิ่ม Filter)
const SoldItemsSection = ({ items }) => {
  const [itemFilter, setItemFilter] = useState('ทั้งหมด');

  const filterTabs = [
    { key: 'ทั้งหมด', label: 'ทั้งหมด', icon: ShoppingCart },
    { key: 'สินค้า', label: 'สินค้า', icon: Package },
    { key: 'วัสดุ', label: 'วัสดุ', icon: Box }
  ];

  const filteredItems = items.filter(item => {
    return itemFilter === 'ทั้งหมด' || item.type === itemFilter;
  });

  const getCount = (type) => {
    return type === 'ทั้งหมด' ? items.length : items.filter(item => item.type === type).length;
  };

  return (
    <div style={{ ...StyleUtils.card(), background: 'white', border: `1px solid ${Theme.colors.gray[200]}` }}>
      <div style={{ padding: Theme.spacing.lg }}>
        <h2 style={{ 
          ...StyleUtils.typography().cardTitle, 
          display: 'flex', 
          alignItems: 'center', 
          gap: Theme.spacing.sm,
          fontSize: '1.25rem',
          color: Theme.colors.gray[900]
        }}>
          <ShoppingCart size={24} style={{ color: Theme.colors.gray[600] }} />
          🛒 รายการสินค้า/วัสดุที่ขายได้
          <span style={{ 
            fontSize: '0.8rem', 
            backgroundColor: Theme.colors.gray[100], 
            color: Theme.colors.gray[600],
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 600
          }}>
            {filteredItems.length} รายการ
          </span>
        </h2>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: Theme.spacing.sm, 
          marginTop: Theme.spacing.md,
          marginBottom: Theme.spacing.lg,
          flexWrap: 'wrap'
        }}>
          {filterTabs.map(tab => (
            <FilterTab
              key={tab.key}
              active={itemFilter === tab.key}
              onClick={() => setItemFilter(tab.key)}
              icon={tab.icon}
              label={tab.label}
              count={getCount(tab.key)}
            />
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: Theme.spacing.md
        }}>
          {filteredItems.map((item, index) => (
            <div key={index} style={{ 
              padding: Theme.spacing.md, 
              background: 'white',
              borderRadius: Theme.radius.lg,
              border: `1px solid ${Theme.colors.gray[200]}`,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1rem' }}>
                  {item.type === 'สินค้า' ? '📦' : '🔧'}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  backgroundColor: item.type === 'สินค้า' ? '#f0f9ff' : '#fef3c7',
                  color: item.type === 'สินค้า' ? '#0369a1' : '#d97706',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontWeight: 600
                }}>
                  {item.type}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: Theme.colors.gray[800], marginBottom: '4px' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: Theme.colors.gray[600] }}>
                <strong>{item.quantity.toLocaleString()}</strong> {item.unit}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: Theme.spacing.xl, 
            color: Theme.colors.gray[500] 
          }}>
            ไม่พบรายการ {itemFilter === 'ทั้งหมด' ? '' : itemFilter}
          </div>
        )}
      </div>
    </div>
  );
};

// Material Import Section - Compact Design
const MaterialImportSection = ({ data }) => (
  <div style={{ ...StyleUtils.card(), background: 'white', border: `1px solid ${Theme.colors.gray[200]}` }}>
    <div style={{ padding: Theme.spacing.md }}>
      <h2 style={{ 
        ...StyleUtils.typography().cardTitle,
        display: 'flex', 
        alignItems: 'center', 
        gap: Theme.spacing.sm,
        color: Theme.colors.gray[900],
        fontSize: '1rem',
        marginBottom: Theme.spacing.md
      }}>
        <Box size={20} style={{ color: Theme.colors.gray[600] }} />
        📥 สรุปการนำเข้าวัสดุ
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: Theme.spacing.sm }}>
        <div style={{ textAlign: 'center', padding: Theme.spacing.sm, border: `1px solid ${Theme.colors.gray[200]}`, borderRadius: Theme.radius.md }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: Theme.colors.gray[900] }}>
            {data.count}
          </div>
          <div style={{ fontSize: '0.8rem', color: Theme.colors.gray[600] }}>รายการ</div>
        </div>
        <div style={{ textAlign: 'center', padding: Theme.spacing.sm, border: `1px solid ${Theme.colors.gray[200]}`, borderRadius: Theme.radius.md }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: Theme.colors.gray[900] }}>
            ฿{(data.total / 1000).toFixed(0)}K
          </div>
          <div style={{ fontSize: '0.8rem', color: Theme.colors.gray[600] }}>มูลค่ารวม</div>
        </div>
        <div style={{ textAlign: 'center', padding: Theme.spacing.sm, border: `1px solid ${Theme.colors.gray[200]}`, borderRadius: Theme.radius.md }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <ArrowUp size={16} style={{ color: '#059669' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>
              {data.growth}%
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: Theme.colors.gray[600] }}>เติบโต</div>
        </div>
      </div>
    </div>
  </div>
);

// Recent Activity Section - Compact Design
const RecentActivitySection = ({ activities }) => (
  <div style={{ ...StyleUtils.card(), background: 'white', border: `1px solid ${Theme.colors.gray[200]}` }}>
    <div style={{ padding: Theme.spacing.md }}>
      <h2 style={{ 
        ...StyleUtils.typography().cardTitle,
        display: 'flex', 
        alignItems: 'center', 
        gap: Theme.spacing.sm,
        color: Theme.colors.gray[900],
        fontSize: '1rem',
        marginBottom: Theme.spacing.md
      }}>
        <Clock size={20} style={{ color: Theme.colors.gray[600] }} />
        🕐 กิจกรรมล่าสุด
      </h2>
      <div>
        {activities.map((activity, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: Theme.spacing.sm,
            marginBottom: index < activities.length - 1 ? Theme.spacing.xs : 0,
            backgroundColor: Theme.colors.gray[50],
            borderRadius: Theme.radius.md,
            border: `1px solid ${Theme.colors.gray[200]}`,
            gap: Theme.spacing.sm
          }}>
            <div style={{ 
              padding: '4px', 
              borderRadius: '50%',
              backgroundColor: 'white',
              border: `1px solid ${Theme.colors.gray[200]}`,
              fontSize: '0.8rem'
            }}>
              {activity.type === 'sale' ? '💰' : activity.type === 'import' ? '📦' : '⚠️'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: Theme.colors.gray[800] }}>
                {activity.message}
              </div>
              <div style={{ fontSize: '0.7rem', color: Theme.colors.gray[500] }}>
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Product Ranking Section (Minimal Design)
const ProductRankingSection = ({ topProducts, bottomProducts }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: Theme.spacing.lg }}>
    <ProductRankCard 
      title="🔥 ขายดีที่สุด (Top 3)"
      products={topProducts}
      isTop={true}
      icon={Star}
    />
    <ProductRankCard 
      title="📉 ขายน้อยที่สุด (Bottom 3)"
      products={bottomProducts}
      isTop={false}
      icon={TrendingDown}
    />
  </div>
);

const ProductRankCard = ({ title, products, isTop, icon: Icon }) => (
  <div style={{ ...StyleUtils.card(), background: 'white', border: `1px solid ${Theme.colors.gray[200]}` }}>
    <div style={{ padding: Theme.spacing.lg }}>
      <h2 style={{ 
        ...StyleUtils.typography().cardTitle, 
        display: 'flex', 
        alignItems: 'center', 
        gap: Theme.spacing.sm,
        color: Theme.colors.gray[900]
      }}>
        <Icon size={24} style={{ color: Theme.colors.gray[600] }} />
        {title}
      </h2>
      <div style={{ marginTop: Theme.spacing.lg }}>
        {products.map((product, index) => (
          <ProductRankItem 
            key={product.id}
            rank={index + 1}
            product={product}
            isTop={isTop}
          />
        ))}
      </div>
    </div>
  </div>
);

const ProductRankItem = ({ rank, product, isTop }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.gray[50],
    borderRadius: Theme.radius.lg,
    border: `1px solid ${Theme.colors.gray[200]}`,
    transition: 'all 0.2s ease'
  }}>
    <div style={{ 
      width: 40, 
      height: 40, 
      borderRadius: '50%', 
      background: isTop ? '#f0f9ff' : '#fef2f2',
      color: isTop ? '#0369a1' : '#dc2626',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '1.1rem',
      marginRight: Theme.spacing.md,
      border: `2px solid ${isTop ? '#0369a1' : '#dc2626'}20`
    }}>
      {rank}
    </div>
    
    <div style={{ flex: 1 }}>
      <div style={{ 
        fontWeight: 700, 
        fontSize: '1rem', 
        color: Theme.colors.gray[800],
        marginBottom: '4px'
      }}>
        {product.name}
      </div>
      <div style={{ 
        fontSize: '0.85rem', 
        color: Theme.colors.gray[600],
        display: 'flex',
        gap: '12px'
      }}>
        <span>📦 {product.quantity.toLocaleString()} ชิ้น</span>
        <span>💰 {DataUtils.formatCurrency(product.revenue)}</span>
      </div>
    </div>
    
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      backgroundColor: product.growth > 0 ? '#f0f9ff' : '#fef2f2',
      border: `1px solid ${product.growth > 0 ? '#0369a1' : '#dc2626'}20`
    }}>
      {product.growth > 0 ? (
        <ArrowUp size={16} style={{ color: '#059669' }} />
      ) : (
        <ArrowDown size={16} style={{ color: '#dc2626' }} />
      )}
      <span style={{ 
        fontSize: '0.9rem', 
        fontWeight: 700,
        color: product.growth > 0 ? '#059669' : '#dc2626'
      }}>
        {Math.abs(product.growth)}%
      </span>
    </div>
  </div>
);

export default Dashboard;