import { useNavigate } from "react-router-dom";

function InformationSecurity() {
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
          <h1>Information Security</h1>
          <p>Learn about the security practices supporting HireFlow accounts and information.</p>
          <span className="legal-updated">Last updated: September 1, 2026</span>
        </div>

        <article className="legal-card">

          <section>
            <h2>1. Information Security</h2>
            <p>
              HireFlow is designed with reasonable security measures to
              help protect information processed through the platform and
              support the safe operation of user accounts and services.
            </p>
          </section>

          <section>
            <h2>2. Authentication</h2>
            <p>
              Users must authenticate before accessing account-specific
              features. Account credentials should be kept confidential
              and must not be shared with other people.
            </p>
          </section>

          <section>
            <h2>3. Role-Based Access</h2>
            <p>
              HireFlow separates candidate and recruiter functionality
              according to account roles. Access to platform features is
              intended to follow the permissions associated with the
              user's role.
            </p>
          </section>

          <section>
            <h2>4. Secure Data Handling</h2>
            <p>
              Information is handled using reasonable technical and
              organizational safeguards intended to reduce the risk of
              unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2>5. Application and Recruitment Data</h2>
            <p>
              Candidate application information may be accessible to the
              employer associated with the relevant application. Users
              should only submit information they are comfortable sharing
              for recruitment purposes.
            </p>
          </section>

          <section>
            <h2>6. Security Reviews</h2>
            <p>
              Security-related events and platform activity may be reviewed
              when reasonably necessary to maintain service security,
              investigate suspected misuse, or protect users.
            </p>
          </section>

          <section>
            <h2>7. Third-Party Providers</h2>
            <p>
              HireFlow may rely on third-party providers for selected
              platform services. Those providers may have separate
              security controls and privacy policies.
            </p>
          </section>

          <section>
            <h2>8. Protecting Your Account</h2>
            <p>
              Users should use secure passwords, keep login information
              private, and notify the HireFlow team if they suspect that
              an account has been accessed without authorization.
            </p>
          </section>

          <section>
            <h2>9. Security Limitations</h2>
            <p>
              While reasonable safeguards are used, no internet-based
              system can provide a guarantee of complete security.
            </p>
          </section>

          <section>
            <h2>10. Updates</h2>
            <p>
              This Information Security page may be updated when
              HireFlow's platform, security processes, or requirements
              change. Updated information will be published here.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              If you have questions about information security at HireFlow,
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

export default InformationSecurity;
