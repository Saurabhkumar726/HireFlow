import { useNavigate } from "react-router-dom";

function DataSecurity() {
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
          <h1>Data Security</h1>
          <p>Learn how HireFlow works to protect information handled through the platform.</p>
          <span className="legal-updated">Last updated: September 1, 2026</span>
        </div>

        <article className="legal-card">

          <section>
            <h2>1. Our Approach to Data Security</h2>
            <p>
              HireFlow takes reasonable measures to protect information
              handled through the platform against unauthorized access,
              misuse, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2>2. Account Security</h2>
            <p>
              Account access is protected through authentication
              mechanisms. Users are responsible for keeping their
              credentials confidential and should not share passwords
              with others.
            </p>
          </section>

          <section>
            <h2>3. Access Controls</h2>
            <p>
              HireFlow uses role-based access to help ensure that platform
              functionality and information are available according to
              the user's account role and permissions.
            </p>
          </section>

          <section>
            <h2>4. Data Protection</h2>
            <p>
              We use reasonable technical and organizational measures
              appropriate to the platform to protect stored information
              from unauthorized access and misuse.
            </p>
          </section>

          <section>
            <h2>5. Application Information</h2>
            <p>
              Information submitted as part of a job application may be
              shared with the relevant employer so that the recruitment
              process can take place.
            </p>
          </section>

          <section>
            <h2>6. Platform Monitoring</h2>
            <p>
              Security-related activity may be reviewed when necessary
              to help identify misuse, protect accounts, maintain platform
              reliability, and investigate potential security incidents.
            </p>
          </section>

          <section>
            <h2>7. Third-Party Services</h2>
            <p>
              Some HireFlow functionality may depend on third-party
              services. Those providers may maintain their own security
              practices and policies.
            </p>
          </section>

          <section>
            <h2>8. User Responsibilities</h2>
            <p>
              Users should use strong, private credentials, avoid sharing
              account access, and promptly report suspected unauthorized
              access or security issues to the HireFlow team.
            </p>
          </section>

          <section>
            <h2>9. Security Limitations</h2>
            <p>
              No online platform can guarantee absolute security.
              HireFlow therefore cannot guarantee that information will
              never be accessed, altered, or disclosed as a result of
              circumstances beyond reasonable control.
            </p>
          </section>

          <section>
            <h2>10. Changes to This Data Security Information</h2>
            <p>
              This information may be updated from time to time as
              HireFlow's platform, processes, or security practices change.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              If you have questions or concerns regarding data security,
              please contact the HireFlow team.
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

export default DataSecurity;
