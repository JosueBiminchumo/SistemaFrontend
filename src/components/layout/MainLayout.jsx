import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

function MainLayout({ children, menuItems = [], currentPath = '', userName, userRole, onLogout }) {
  return (
    <div className="main-layout">
      <Header userName={userName} userRole={userRole} onLogout={onLogout} />
      <div className="main-layout-body">
        <Sidebar items={menuItems} currentPath={currentPath} />
        <main className="main-layout-content">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;