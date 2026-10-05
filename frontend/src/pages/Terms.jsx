import { useNavigate } from "react-router-dom";

function Terms() {
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
            Terms of Service
          </h1>

          <p>
            Please read these terms carefully before using
            HireFlow.
          </p>

          <span className="legal-updated">
            Last updated: September 1, 2026
          </span>

        </div>


        <article className="legal-card">

          <section>
            <h2>1. Acceptance of Terms</h2>

            <p>
              By creating an account or using HireFlow,
              you agree to follow these Terms of Service.
              If you do not agree with these terms, please
              do not use the platform.
            </p>
          </section>


          <section>
            <h2>2. Account Registration</h2>

            <p>
              You are responsible for providing accurate
              information when creating your HireFlow account.
              You are also responsible for keeping your
              account credentials secure.
            </p>

            <p>
              You should not share your password or allow
              another person to use your account.
            </p>
          </section>


          <section>
            <h2>3. Candidates</h2>

            <p>
              Candidates may browse available jobs, save
              jobs for later, and submit applications through
              HireFlow.
            </p>

            <p>
              Candidates are responsible for ensuring that
              the information provided in their applications
              is accurate and truthful.
            </p>
          </section>


          <section>
            <h2>4. Employers</h2>

            <p>
              Employers may create and manage job listings
              and review applications submitted through
              HireFlow.
            </p>

            <p>
              Employers are responsible for ensuring that
              their job listings contain accurate and
              appropriate information.
            </p>
          </section>


          <section>
            <h2>5. Job Listings</h2>

            <p>
              HireFlow provides a platform for connecting
              candidates and employers. We do not guarantee
              the availability, accuracy, quality, or outcome
              of any job listing or application.
            </p>
          </section>


          <section>
            <h2>6. Prohibited Activities</h2>

            <p>
              Users must not use HireFlow to:
            </p>

            <ul>
              <li>Provide false or misleading information.</li>
              <li>Attempt to access another user's account.</li>
              <li>Abuse or disrupt the platform.</li>
              <li>Upload harmful or malicious content.</li>
              <li>Use the platform for unlawful activities.</li>
            </ul>
          </section>


          <section>
            <h2>7. Account Suspension</h2>

            <p>
              HireFlow may restrict or suspend an account if
              there is a violation of these Terms of Service
              or misuse of the platform.
            </p>
          </section>


          <section>
            <h2>8. Platform Availability</h2>

            <p>
              We aim to keep HireFlow available and reliable,
              but we cannot guarantee that the platform will
              always be available without interruptions,
              errors, or maintenance.
            </p>
          </section>


          <section>
            <h2>9. Limitation of Liability</h2>

            <p>
              HireFlow is provided as a platform for
              connecting candidates and employers. Users are
              responsible for their own decisions regarding
              jobs, applications, interviews, and employment.
            </p>
          </section>


          <section>
            <h2>10. Changes to These Terms</h2>

            <p>
              These Terms of Service may be updated from time
              to time. Updated terms will be published on this
              page with a new effective date.
            </p>
          </section>


          <section>
            <h2>11. Contact</h2>

            <p>
              If you have questions about these Terms of
              Service, please contact the HireFlow team.
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

export default Terms;