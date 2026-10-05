import { useNavigate } from "react-router-dom";

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="legal-header">

        <button
          className="legal-brand"
          onClick={() => navigate("/")}
        >
          <span className="legal-logo">H</span>

          <span>
            Hire<span>Flow</span>
          </span>
        </button>

        <button
          className="legal-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="legal-container">

        <div className="legal-hero">

          <span className="legal-badge">
            HIRE FLOW
          </span>

          <h1>
            Privacy Policy
          </h1>

          <p>
            Learn how HireFlow collects, uses, and protects
            your information.
          </p>

          <span className="legal-updated">
            Last updated: September 1, 2026
          </span>

        </div>


        <article className="legal-card">

          <section>
            <h2>1. Information We Collect</h2>

            <p>
              When you create or use a HireFlow account, we
              may collect information such as your full name,
              email address, account role, and information
              provided through your profile or applications.
            </p>
          </section>


          <section>
            <h2>2. Account Information</h2>

            <p>
              We use your account information to provide
              access to HireFlow features and to maintain
              your account.
            </p>

            <p>
              You are responsible for ensuring that the
              information associated with your account is
              accurate and up to date.
            </p>
          </section>


          <section>
            <h2>3. Job Applications</h2>

            <p>
              If you apply for a job through HireFlow,
              information submitted as part of your
              application may be made available to the
              relevant employer for recruitment purposes.
            </p>
          </section>


          <section>
            <h2>4. Saved Jobs</h2>

            <p>
              When you save a job, HireFlow stores the saved
              job information so that you can access it later
              from your account.
            </p>
          </section>


          <section>
            <h2>5. How We Use Information</h2>

            <p>
              Information collected through HireFlow may be
              used to:
            </p>

            <ul>
              <li>Provide and maintain the HireFlow platform.</li>
              <li>Manage user accounts.</li>
              <li>Support job searching and applications.</li>
              <li>Allow employers to manage job listings and applications.</li>
              <li>Improve the functionality and reliability of the platform.</li>
            </ul>
          </section>


          <section>
            <h2>6. Information Security</h2>

            <p>
              We take reasonable measures to protect
              information stored within HireFlow from
              unauthorized access, misuse, or disclosure.
            </p>

            <p>
              However, no online service can guarantee
              complete security of information.
            </p>
          </section>


          <section>
            <h2>7. Information Sharing</h2>

            <p>
              HireFlow does not provide user information to
              other users except where necessary to operate
              platform features, such as sharing candidate
              application information with the employer to
              whom the candidate has applied.
            </p>
          </section>


          <section>
            <h2>8. Cookies and Similar Technologies</h2>

            <p>
              HireFlow may use browser storage or similar
              technologies to maintain login sessions and
              remember information required for the platform
              to function properly.
            </p>
          </section>


          <section>
            <h2>9. Third-Party Services</h2>

            <p>
              HireFlow may use third-party services to support
              certain platform functionality. Such services
              may process information according to their own
              privacy policies.
            </p>
          </section>


          <section>
            <h2>10. Data Retention</h2>

            <p>
              We retain account and platform information for
              as long as reasonably necessary to provide
              HireFlow services, maintain records, and comply
              with applicable requirements.
            </p>
          </section>


          <section>
            <h2>11. Your Choices</h2>

            <p>
              You may review or update information associated
              with your account where the platform provides
              these options. You may also contact the HireFlow
              team regarding questions about your information.
            </p>
          </section>


          <section>
            <h2>12. Changes to This Privacy Policy</h2>

            <p>
              This Privacy Policy may be updated from time to
              time. Any updates will be published on this page
              with a new effective date.
            </p>
          </section>


          <section>
            <h2>13. Contact</h2>

            <p>
              If you have questions or concerns about this
              Privacy Policy, please contact the HireFlow team.
            </p>
          </section>

        </article>

      </main>


      {/* =====================================================
          SIMPLE FOOTER
      ===================================================== */}

      <footer className="legal-simple-footer">

        <span>
          © 2026 HireFlow. All rights reserved.
        </span>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Home
        </button>

      </footer>

    </div>
  );
}

export default Privacy;