import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FAQ() {
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is HireFlow?",
      answer:
        "HireFlow is a job platform that connects candidates with companies. Candidates can discover jobs, apply for opportunities, manage applications, and save jobs for later.",
    },
    {
      question: "How do I create a HireFlow account?",
      answer:
        "Click the Sign Up button and choose whether you want to join as a Candidate or Recruiter. Enter your details and create your account.",
    },
    {
      question: "How can I apply for a job?",
      answer:
        "Create a Candidate account, browse available jobs, open a job to view its details, and use the application option to submit your application.",
    },
    {
      question: "Can I save jobs for later?",
      answer:
        "Yes. Candidates can click the heart icon on a job card to save a job. Saved jobs can be accessed from the Saved Jobs section.",
    },
    {
      question: "How can recruiters post jobs?",
      answer:
        "Recruiters can create an account and access the recruiter dashboard, where they can create, manage, and update job postings.",
    },
    {
      question: "Can I track my job applications?",
      answer:
        "Yes. Candidates can view their submitted applications and track their current application status from the My Applications section.",
    },
    {
      question: "Is HireFlow free for candidates?",
      answer:
        "Yes. Candidates can create an account, browse opportunities, save jobs, and apply for available positions through HireFlow.",
    },
    {
      question: "How do I contact HireFlow?",
      answer:
        "For questions or support, please use the contact information provided by HireFlow when support channels become available.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <div className="faq-page">

      {/* Header */}
      <header className="faq-header">

        <div
          className="faq-logo"
          onClick={() => navigate("/")}
        >
          <div className="faq-logo-icon">
            H
          </div>

          <h1>
            Hire<span>Flow</span>
          </h1>
        </div>

        <button
          className="faq-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </header>


      {/* Main */}
      <main className="faq-content">

        <div className="faq-heading">

          <span>
            HELP CENTER
          </span>

          <h2>
            Frequently Asked Questions
          </h2>

          <p>
            Find answers to the most common questions
            about HireFlow.
          </p>

        </div>


        {/* FAQ List */}
        <div className="faq-list">

          {faqs.map((faq, index) => (

            <div
              className={`faq-item ${
                openIndex === index
                  ? "open"
                  : ""
              }`}
              key={index}
            >

              <button
                type="button"
                className="faq-question"
                onClick={() =>
                  toggleFAQ(index)
                }
                aria-expanded={
                  openIndex === index
                }
              >

                <span>
                  {faq.question}
                </span>

                <span className="faq-icon">
                  {openIndex === index
                    ? "−"
                    : "+"}
                </span>

              </button>


              {openIndex === index && (

                <div className="faq-answer">

                  <p>
                    {faq.answer}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>


        {/* CTA */}
        <section className="faq-cta">

          <h3>
            Still have questions?
          </h3>

          <p>
            Create your HireFlow account and start
            exploring opportunities today.
          </p>

          <button
            onClick={() =>
              navigate("/signup")
            }
          >
            Create Free Account →
          </button>

        </section>

      </main>


      {/* Footer */}
      <footer className="faq-footer">

        <p>
          © 2026 HireFlow. All rights reserved.
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Home
        </button>

      </footer>

    </div>
  );
}

export default FAQ;