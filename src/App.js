import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import CustomerList from './pages/CustomerList';
import StockList from './pages/StockList';
import ProductList from './pages/ProductList';
import BillList from './pages/BillList';
import CreateBill from './pages/CreateBill';
import CompanySettings from './pages/CompanySettings'; 
import PaymentMethods from './pages/PaymentMethods';
import PrintReceipt from './pages/PrintReceipt';
import InvoiceStyleReceipt from './pages/InvoiceStyleReceipt';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ToastContainer from './components/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Homepage */}
            <Route path="/" element={
              <div className="homepage">
                {/* Hero Section */}
                <section className="hero-section">
                  <div className="hero-overlay"></div>
                  <div className="container">
                    <div className="row align-items-center min-vh-100">
                      <div className="col-lg-6">
                        <div className="hero-content text-white">
                          <h1 className="display-3 fw-bold mb-4 animate-slide-up">
                            <i className="fas fa-warehouse me-3"></i>
                            WTR Organization
                          </h1>
                          <p className="lead mb-5 animate-slide-up-delay">
                            ระบบจัดการคลังสินค้าที่ทันสมัย ครบครัน และใช้งานง่าย
                            <br />เพื่อประสิทธิภาพการทำงานที่ดีที่สุด
                          </p>
                          <div className="hero-buttons animate-fade-in">
                            <a href="/login" className="btn btn-light btn-lg me-3 shadow">
                              <i className="fas fa-sign-in-alt me-2"></i>
                              เข้าสู่ระบบ
                            </a>
                            <a href="/signup" className="btn btn-success btn-lg shadow">
                              <i className="fas fa-user-plus me-2"></i>
                              ลงทะเบียน
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="hero-image animate-float">
                          <div className="hero-card">
                            <i className="fas fa-chart-line fa-4x text-primary mb-3"></i>
                            <h4>เพิ่มประสิทธิภาพ</h4>
                            <p>จัดการคลังสินค้าอย่างมืออาชีพ</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Features Section */}
                <section className="features-section py-5">
                  <div className="container">
                    <div className="row text-center mb-5">
                      <div className="col-12">
                        <h2 className="display-5 fw-bold text-dark mb-3">ฟีเจอร์ครบครัน</h2>
                        <p className="lead text-muted">ระบบจัดการที่ตอบโจทย์ทุกความต้องการ</p>
                      </div>
                    </div>
                    
                    <div className="row g-4">
                      <div className="col-lg-3 col-md-6">
                        <div className="feature-card h-100">
                          <div className="feature-icon">
                            <i className="fas fa-users"></i>
                          </div>
                          <h5>จัดการพนักงาน</h5>
                          <p>ระบบจัดการข้อมูลพนักงานและสิทธิ์การใช้งานอย่างปลอดภัย</p>
                        </div>
                      </div>
                      
                      <div className="col-lg-3 col-md-6">
                        <div className="feature-card h-100">
                          <div className="feature-icon">
                            <i className="fas fa-handshake"></i>
                          </div>
                          <h5>จัดการลูกค้า</h5>
                          <p>บริหารข้อมูลลูกค้าและประวัติการซื้อขายอย่างมีประสิทธิภาพ</p>
                        </div>
                      </div>
                      
                      <div className="col-lg-3 col-md-6">
                        <div className="feature-card h-100">
                          <div className="feature-icon">
                            <i className="fas fa-boxes"></i>
                          </div>
                          <h5>จัดการสต็อก</h5>
                          <p>ติดตามสินค้าคงคลังและการเคลื่อนไหวแบบเรียลไทม์</p>
                        </div>
                      </div>
                      
                      <div className="col-lg-3 col-md-6">
                        <div className="feature-card h-100">
                          <div className="feature-icon">
                            <i className="fas fa-file-invoice-dollar"></i>
                          </div>
                          <h5>จัดการบิล</h5>
                          <p>สร้างและติดตามใบเสร็จรับเงินอย่างแม่นยำและรวดเร็ว</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="cta-card text-center">
                          <h3 className="mb-4">พร้อมเริ่มต้นใช้งานแล้วหรือยัง?</h3>
                          <p className="mb-4 text-muted">
                            พนักงานใหม่สามารถลงทะเบียนด้วยรหัสพนักงานที่ได้รับจากแอดมิน
                          </p>
                          <div className="cta-buttons">
                            <a href="/login" className="btn btn-primary btn-lg me-3">
                              <i className="fas fa-sign-in-alt me-2"></i>
                              เข้าสู่ระบบ
                            </a>
                            <a href="/signup" className="btn btn-outline-success btn-lg">
                              <i className="fas fa-user-plus me-2"></i>
                              ลงทะเบียนใหม่
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                  <div className="container">
                    <div className="row">
                      <div className="col-12 text-center">
                        <p className="mb-0 text-muted">
                          © 2024 WTR Organization. ระบบจัดการคลังสินค้า
                        </p>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <Dashboard />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/employees" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <EmployeeList />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/customers" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <CustomerList />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/stocks" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <StockList />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/products" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <ProductList />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/bills" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <BillList />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/bills/create" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <CreateBill />
                  </div>
                </>
              </PrivateRoute>
            } />

                 {/* ✨ เพิ่ม Route สำหรับพิมพ์ใบเสร็จ */}
            <Route path="/bills/:billId/print" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <PrintReceipt />
                </>
              </PrivateRoute>
            } />
            
            {/* ✨ เพิ่ม Route สำหรับ Invoice Style */}
            <Route path="/bills/:billId/invoice" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <InvoiceStyleReceipt />
                </>
              </PrivateRoute>

            } />
               {/*  เพิ่ม Routes ใหม่สำหรับ Company Settings และ Payment Methods */}
            <Route path="/settings/company" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <CompanySettings />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/settings/payment-methods" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <PaymentMethods />
                  </div>
                </>
              </PrivateRoute>
            } />

            <Route path="/change-password" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <div className="container-fluid py-4">
                    <ChangePassword />
                  </div>
                </>
              </PrivateRoute>
            } />

            {/* Redirect any unknown routes to dashboard if authenticated, otherwise to home */}
            <Route path="*" element={
              <PrivateRoute>
                <Navigate to="/dashboard" replace />
              </PrivateRoute>
            } />
          </Routes>
          
          {/* Toast Container แสดงในทุกหน้า */}
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;