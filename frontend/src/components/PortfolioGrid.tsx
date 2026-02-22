function PortfolioGrid() {
  return (
    <section className="section">
      <h2>Portfolio</h2>

      <div className="portfolio-grid">
        <div className="portfolio-card">
          <h4>AI Resume Builder</h4>
          <p>LLM integrated resume generation tool.</p>
        </div>

        <div className="portfolio-card">
          <h4>Modern Dashboard</h4>
          <p>Analytics dashboard with clean UI.</p>
        </div>

        <div className="portfolio-card">
          <h4>ML Prediction System</h4>
          <p>Production ML API integration.</p>
        </div>
      </div>
    </section>
  );
}

export default PortfolioGrid;