import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Statistics from './pages/Statistics';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Orangutans from './pages/Orangutans';
import OrangutanDetail from './pages/OrangutanDetail';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import UserDonations from './pages/user/Donations';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrangutans from './pages/admin/Orangutans';
import AdminArticles from './pages/admin/Articles';
import AdminDonations from './pages/admin/Donations';
import AdminUsers from './pages/admin/Users';
import AdminFAQs from './pages/admin/FAQs';
import AdminContacts from './pages/admin/Contacts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="orangutans" element={<Orangutans />} />
            <Route path="orangutans/:id" element={<OrangutanDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="donations" element={<UserDonations />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orangutans" element={<AdminOrangutans />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
