import Footer from './Footer';
import './PublicLayout.css';

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <main className="public-layout-content">{children}</main>
      <Footer />
    </div>
  );
}

export default PublicLayout;