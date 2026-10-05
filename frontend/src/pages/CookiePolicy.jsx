import { useNavigate } from "react-router-dom";

function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <header className="legal-header">
        <button className="legal-brand" onClick={() => navigate("/")}>
          <span className="legal-logo">H</span>
          <span>Hire<span>Flow</span></span>
        </button>

        <button className="legal-back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </header>

      <main className="legal-container">
        <div className="legal-hero">
          <span className="legal-badge">HIRE FLOW</span>
          <h1>Cookie Policy</h1>
          <p>Learn how HireFlow uses cookies and similar technologies.</p>
          <span className="legal-updated">Last updated: September 1, 2026</span>
        </div>

        <article className="legal-card">

          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you
              visit a website. They help websites remember information and
              support features such as sessions, preferences, and usage
              measurement.
            </p>
          </section>

          <section>
            <h2>2. How HireFlow Uses Cookies</h2>
            <p>
              HireFlow may use cookies, browser storage, or similar
              technologies to keep users signed in, remember preferences,
              maintain platform functionality, and understand how the
              platform is used.
            </p>
          </section>

          <section>
            <h2>3. Essential Cookies</h2>
            <p>
              Essential technologies are required for core HireFlow
              functionality, including authentication, account sessions,
              security, and other necessary platform features.
            </p>
          </section>

          <section>
            <h2>4. Analytics Cookies</h2>
            <p>
              If enabled, analytics technologies may help us understand
              how visitors use HireFlow so that we can improve the
              platform and its reliability.
            </p>
          </section>

          <section>
            <h2>5. Preference Cookies</h2>
            <p>
              Preference technologies may remember choices you make while
              using HireFlow so that the platform can provide a more
              consistent experience.
            </p>
          </section>

          <section>
            <h2>6. Managing Cookie Preferences</h2>
            <p>
              You can manage available optional cookie preferences through
              the Cookie Settings option provided in the HireFlow footer.
              Essential technologies may remain active because they are
              necessary for the platform to operate.
            </p>
          </section>

          <section>
            <h2>7. Browser Controls</h2>
            <p>
              Most browsers allow you to control or delete cookies through
              their settings. Disabling certain technologies may affect
              some HireFlow features or functionality.
            </p>
          </section>

          <section>
            <h2>8. Third-Party Services</h2>
            <p>
              HireFlow may use third-party services that apply their own
              cookies or similar technologies. Their use of information is
              governed by their respective policies.
            </p>
          </section>

          <section>
            <h2>9. Changes to This Cookie Policy</h2>
            <p>
              This Cookie Policy may be updated from time to time. Any
              changes will be published on this page with a new effective
              date.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              If you have questions about this Cookie Policy or HireFlow's
              use of cookies, please contact the HireFlow team.
            </p>
          </section>
        </article>
      </main>

      <footer className="legal-simple-footer">
        <span>© 2026 HireFlow. All rights reserved.</span>
        <button type="button" onClick={() => navigate("/")}>Home</button>
      </footer>
    </div>
  );
}

export default CookiePolicy;
