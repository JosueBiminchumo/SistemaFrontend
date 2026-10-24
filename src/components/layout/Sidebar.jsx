import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ items = [], currentPath = '' }) {
  return (
    <aside className="app-sidebar">
      <nav className="app-sidebar-nav">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`app-sidebar-link ${currentPath === item.path ? 'active' : ''}`}
          >
            <span className="app-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;