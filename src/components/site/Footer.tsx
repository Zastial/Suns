export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__word" aria-hidden="true">Sûns</div>
      <div className="footer__row">
        <span>© {new Date().getFullYear()} Sûns</span>
        <a href="#top">Haut de page ↑</a>
      </div>
    </footer>
  );
}
