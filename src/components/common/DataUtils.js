// DataUtils.js - ใส่ใน src/components/common/DataUtils.js
export class DataUtils {
  static formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  static formatCurrency(amount) {
    return `฿${amount?.toLocaleString() || 0}`;
  }

  static getStatusVariant(status) {
    if (status === 'รอชำระ') return 'warning';
    if (status === 'ชำระแล้ว') return 'success';  
    if (status === 'ยกเลิก') return 'error';
    return 'default';
  }

  static filterData(data, searchTerm, statusFilter, searchFields = []) {
    return data.filter(item => {
      const matchesSearch = !searchTerm || searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesStatus = !statusFilter || statusFilter === 'ทั้งหมด' || 
                           item.status === statusFilter || item.billStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  static calculateStats(data, statusField = 'billStatus') {
    const total = data.length;
    const byStatus = data.reduce((acc, item) => {
      const status = item[statusField];
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return { total, ...byStatus };
  }

  static paginate(data, page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    
    return {
      data: data.slice(startIndex, endIndex),
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }
}