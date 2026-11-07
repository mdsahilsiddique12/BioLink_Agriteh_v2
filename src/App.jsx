import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SectorSwitcher from './components/SectorSwitcher';
import HomePage from './pages/HomePage';
import InstitutionalPage from './pages/InstitutionalPage';
import RetailShopPage from './pages/RetailShopPage';
import LogisticsPage from './pages/LogisticsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LabReportsPage from './pages/LabReportsPage';
import NurseryGuidePage from './pages/NurseryGuidePage';
import SampleOrderPage from './pages/SampleOrderPage';
import { AuthProvider } from './context/AuthContext';
import { PartnerAuthProvider } from './context/PartnerAuthContext';
import { SubdomainProvider, useSubdomain } from './context/SubdomainContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Sector router helper that syncs path to sector
function SectorRouteSync({ sector }) {
  const { switchTenant, tenant } = useSubdomain();
  useEffect(() => {
    if (sector && tenant.id !== sector) {
      switchTenant(sector);
    }
  }, [sector, tenant.id, switchTenant]);

  return <HomePage />;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      {/* BioLink Multi-Sector Network Switcher Bar */}
      <SectorSwitcher />
      <Navbar />
      <Routes>
        {/* Dynamic Multi-Tenant Home */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dedicated Sector Subdomain Spaces / Path Aliases */}
        <Route path="/manure" element={<SectorRouteSync sector="manure" />} />
        <Route path="/feed" element={<SectorRouteSync sector="feed" />} />
        <Route path="/seabuckthorn" element={<SectorRouteSync sector="seabuckthorn" />} />
        <Route path="/wellness" element={<SectorRouteSync sector="seabuckthorn" />} />

        {/* Core Commerce & Operations */}
        <Route path="/sample" element={<SampleOrderPage />} />
        <Route path="/sample-order" element={<SampleOrderPage />} />
        <Route path="/samples" element={<SampleOrderPage />} />
        <Route path="/institutional" element={<InstitutionalPage />} />
        <Route path="/shop" element={<RetailShopPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/lab-reports" element={<LabReportsPage />} />
        <Route path="/help" element={<NurseryGuidePage />} />

        {/* Corporate & Identity */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Portals */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/partner" element={<PartnerLoginPage />} />
        <Route path="/partner/login" element={<PartnerLoginPage />} />
        <Route path="/partner-login" element={<PartnerLoginPage />} />
        <Route path="/partner/dashboard" element={<PartnerDashboardPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SubdomainProvider>
        <AuthProvider>
          <PartnerAuthProvider>
            <AppContent />
          </PartnerAuthProvider>
        </AuthProvider>
      </SubdomainProvider>
    </BrowserRouter>
  );
}
