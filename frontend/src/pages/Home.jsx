import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // =====================================================
  // MOBILE NAV MENU (tablet/mobile only - desktop nav is
  // unchanged; this only provides access to the same nav
  // links when the inline nav is hidden by CSS below 900px)
  // =====================================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem("hireflow_cookie_consent");

    if (!cookieConsent) {
      setShowCookieBanner(true);
    }
  }, []);

  // Lock page scrolling while Cookie Settings is open.
  useEffect(() => {
    if (!isCookieSettingsOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCookieSettingsOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleCookiePreferenceChange = (key) => {
    setCookiePreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const saveCookieConsent = (preferences) => {
    localStorage.setItem(
      "hireflow_cookie_consent",
      JSON.stringify({
        essential: true,
        analytics: preferences.analytics,
        preferences: preferences.preferences,
        savedAt: new Date().toISOString(),
      })
    );

    setShowCookieBanner(false);
    setIsCookieSettingsOpen(false);
  };

  const handleAcceptAllCookies = () => {
    const preferences = {
      analytics: true,
      preferences: true,
    };

    setCookiePreferences(preferences);
    saveCookieConsent(preferences);
  };

  const handleRejectNonEssential = () => {
    const preferences = {
      analytics: false,
      preferences: false,
    };

    setCookiePreferences(preferences);
    saveCookieConsent(preferences);
  };

  const handleOpenCookieSettings = () => {
    setShowCookieBanner(false);
    setIsCookieSettingsOpen(true);
  };

  const handleMobileNav = (action) => {
    action();
    closeMobileMenu();
  };

  // =====================================================
  // ANIMATED STATS
  // =====================================================
  const [stats, setStats] = useState({
    candidates: 0,
    companies: 0,
    positions: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const targetStats = {
      candidates: 10000,
      companies: 500,
      positions: 1500,
      satisfaction: 95,
    };

    const duration = 1800;
    const startTime = performance.now();

    const animateStats = (currentTime) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      // Smooth ease-out animation
      const easeOut =
        1 - Math.pow(1 - progress, 3);

      setStats({
        candidates: Math.floor(
          targetStats.candidates * easeOut
        ),

        companies: Math.floor(
          targetStats.companies * easeOut
        ),

        positions: Math.floor(
          targetStats.positions * easeOut
        ),

        satisfaction: Math.floor(
          targetStats.satisfaction * easeOut
        ),
      });

      if (progress < 1) {
        requestAnimationFrame(animateStats);
      }
    };

    requestAnimationFrame(animateStats);

    return () => {
      // Animation automatically stops when completed.
    };
  }, []);

  // =====================================================
  // NAVIGATION / SCROLL
  // =====================================================
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =====================================================
  // FORMAT STATS
  // =====================================================
  const formatCandidates = () => {
    if (stats.candidates >= 10000) {
      return "10K+";
    }

    if (stats.candidates < 1000) {
      return `${stats.candidates}+`;
    }

    return `${(stats.candidates / 1000).toFixed(1)}K+`;
  };

  const formatCompanies = () => {
    if (stats.companies >= 500) {
      return "500+";
    }

    return `${stats.companies}+`;
  };

  const formatPositions = () => {
    if (stats.positions >= 1500) {
      return "1.5K+";
    }

    if (stats.positions < 1000) {
      return `${stats.positions}+`;
    }

    return `${(stats.positions / 1000).toFixed(1)}K+`;
  };

  const formatSatisfaction = () => {
    return `${stats.satisfaction}%`;
  };

  return (
    <div className="home-page">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="home-header">

        {/* Logo */}
        <div
          className="home-logo"
          onClick={() => navigate("/")}
        >
          <div className="home-logo-icon">
            H
          </div>

          <h1>
            Hire<span>Flow</span>
          </h1>
        </div>

        {/* Mobile Menu Toggle (visible only on tablet/mobile via CSS,
            placed right next to the logo) */}
        <button
          type="button"
          className={`home-mobile-toggle${isMobileMenuOpen ? " is-open" : ""}`}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="home-mobile-menu"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className="home-nav">

          <button
            className="active"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <button
            onClick={() => scrollToSection("testimonials")}
          >
            Reviews
          </button>

        </nav>

        {/* Header Actions */}
        <div className="home-header-actions">

          <button
            className="home-login-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="home-signup-button"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>

        </div>

      </header>

      {/* Mobile Menu Panel (tablet/mobile only) */}
      <div
        id="home-mobile-menu"
        className={`home-mobile-menu${isMobileMenuOpen ? " is-open" : ""}`}
      >
        <nav aria-label="Mobile">

          <button onClick={() => handleMobileNav(() => navigate("/"))}>
            Home
          </button>

          <button onClick={() => handleMobileNav(() => scrollToSection("features"))}>
            Features
          </button>

          <button onClick={() => handleMobileNav(() => scrollToSection("how-it-works"))}>
            How It Works
          </button>

          <button onClick={() => handleMobileNav(() => scrollToSection("about"))}>
            About
          </button>

          <button onClick={() => handleMobileNav(() => scrollToSection("testimonials"))}>
            Reviews
          </button>

          <div className="home-mobile-menu-actions">
            <button
              className="home-login-button"
              onClick={() => handleMobileNav(() => navigate("/login"))}
            >
              Login
            </button>

            <button
              className="home-signup-button"
              onClick={() => handleMobileNav(() => navigate("/signup"))}
            >
              Sign Up
            </button>
          </div>

        </nav>
      </div>


      {/* =====================================================
          MAIN
      ===================================================== */}
      <main>

        {/* ===================================================
            HERO SECTION
        =================================================== */}
        <section className="home-hero">

          <div className="home-hero-content">

            <div className="home-badge">
              🚀 Your Career Starts Here
            </div>

            <h2>
              Find Your Dream Job.
              <br />
              <span>Build Your Future.</span>
            </h2>

            <p>
              HireFlow connects talented candidates with
              great companies. Discover opportunities,
              showcase your skills, and take the next step
              in your career.
            </p>

            {/* Hero Buttons */}
            <div className="home-hero-actions">

              <button
                className="home-primary-button"
                onClick={() => navigate("/signup")}
              >
                Find Your Next Job
                <span>→</span>
              </button>

              <button
                className="home-secondary-button"
                onClick={() => navigate("/login")}
              >
                Explore HireFlow
              </button>

            </div>

            {/* Trust Stats */}
            <div className="home-trust">

              <div>
                <strong>1,500+</strong>
                <span>Jobs Available</span>
              </div>

              <div>
                <strong>500+</strong>
                <span>Companies</span>
              </div>

              <div>
                <strong>10K+</strong>
                <span>Job Seekers</span>
              </div>

            </div>

          </div>


          {/* Hero Visual */}
          <div className="home-hero-visual">

            <div className="hero-image-wrapper">

              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85"
                alt="Professionals working together"
                className="hero-main-image"
                width="1200"
                height="500"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />

              <div className="hero-image-overlay"></div>


              {/* Search Card */}
              <div className="hero-search-card">

                <div className="hero-search-header">

                  <div>

                    <span className="hero-small-label">
                      FIND YOUR OPPORTUNITY
                    </span>

                    <h3>
                      Search thousands of jobs
                    </h3>

                  </div>

                  <div className="hero-search-icon">
                    🔎
                  </div>

                </div>


                <div className="hero-search-fields">

                  <div className="hero-search-field">

                    <span>💼</span>

                    <div>
                      <small>Job title</small>

                      <strong>
                        Full Stack Developer
                      </strong>
                    </div>

                  </div>


                  <div className="hero-search-field">

                    <span>📍</span>

                    <div>
                      <small>Location</small>

                      <strong>
                        India
                      </strong>
                    </div>

                  </div>

                </div>


                <button
                  className="hero-search-button"
                  onClick={() => navigate("/signup")}
                >
                  Search Jobs
                  <span>→</span>
                </button>

              </div>

            </div>


            {/* Floating Candidate Card */}
            <div className="hero-floating-card hero-floating-one">

              <div className="floating-icon">
                ✓
              </div>

              <div>
                <strong>
                  Profile Viewed
                </strong>

                <span>
                  A recruiter viewed your profile
                </span>
              </div>

            </div>


            {/* Floating Job Card */}
            <div className="hero-floating-card hero-floating-two">

              <div className="floating-icon">
                ★
              </div>

              <div>
                <strong>
                  98% Match
                </strong>

                <span>
                  Perfect job for your skills
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            BRAND / ANIMATED STATS SECTION
        =================================================== */}
        <section className="home-stats-section">

          <div className="home-stats-container">

            <div className="home-stat-item">

              <strong>
                {formatCandidates()}
              </strong>

              <span>
                Active Candidates
              </span>

            </div>


            <div className="home-stat-item">

              <strong>
                {formatCompanies()}
              </strong>

              <span>
                Trusted Companies
              </span>

            </div>


            <div className="home-stat-item">

              <strong>
                {formatPositions()}
              </strong>

              <span>
                Open Positions
              </span>

            </div>


            <div className="home-stat-item">

              <strong>
                {formatSatisfaction()}
              </strong>

              <span>
                Candidate Satisfaction
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            FEATURES
        =================================================== */}
        <section
          id="features"
          className="home-features"
        >

          <div className="home-section-heading">

            <span>
              WHY HIRE FLOW
            </span>

            <h2>
              Everything you need to
              <br />
              <span>move forward.</span>
            </h2>

            <p>
              A simple and powerful platform designed to
              make job searching and hiring easier.
            </p>

          </div>


          <div className="home-feature-grid">

            <div className="home-feature-card">

              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              <h3>
                Find the Right Jobs
              </h3>

              <p>
                Discover opportunities that match your
                skills, experience, interests, and career
                goals.
              </p>

            </div>


            <div className="home-feature-card">

              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <h3>
                Build Your Profile
              </h3>

              <p>
                Create a professional candidate profile
                and showcase your skills and experience.
              </p>

            </div>


            <div className="home-feature-card">

              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>

              <h3>
                Easy Applications
              </h3>

              <p>
                Apply for jobs quickly and keep track of
                your applications from one place.
              </p>

            </div>


            <div className="home-feature-card">

              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              <h3>
                Connect With Recruiters
              </h3>

              <p>
                Get discovered by recruiters looking for
                talented professionals like you.
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            HOW IT WORKS
        =================================================== */}
        <section
          id="how-it-works"
          className="home-how-section"
        >

          <div className="home-section-heading">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              Your next opportunity is
              <br />
              <span>just a few steps away.</span>
            </h2>

            <p>
              HireFlow makes the entire job search journey
              simple, transparent, and efficient.
            </p>

          </div>


          <div className="home-steps">

            <div className="home-step">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <h3>
                Create Your Profile
              </h3>

              <p>
                Sign up and create a professional profile
                that highlights your skills and experience.
              </p>

            </div>


            <div className="home-step">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              <h3>
                Discover Opportunities
              </h3>

              <p>
                Browse jobs and find positions that match
                your career goals.
              </p>

            </div>


            <div className="home-step">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>

              <h3>
                Apply With Confidence
              </h3>

              <p>
                Submit your resume and cover letter directly
                through HireFlow.
              </p>

            </div>


            <div className="home-step">

              <div className="step-number">
                04
              </div>

              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>

              <h3>
                Get Hired
              </h3>

              <p>
                Track your application and connect with
                recruiters throughout the hiring process.
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            VIDEO / VISUAL SECTION
        =================================================== */}
        <section className="home-video-section">

          <div className="home-video-content">

            <div className="home-video-text">

              <span>
                EXPERIENCE HIRE FLOW
              </span>

              <h2>
                One platform.
                <br />
                <strong>
                  Endless possibilities.
                </strong>
              </h2>

              <p>
                Whether you're searching for your first
                opportunity or looking for your next great
                hire, HireFlow brings everything together
                in one simple platform.
              </p>

              <button
                className="home-primary-button"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <span>→</span>
              </button>

            </div>


            <div className="home-video-wrapper">

              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85"
                alt="Team collaborating in an office"
                className="home-video-image"
                width="1400"
                height="400"
                loading="lazy"
                decoding="async"
              />

              <div className="home-video-overlay"></div>

              <div className="home-play-button">
                ▶
              </div>

              <div className="home-video-label">

                <span>
                  HireFlow
                </span>

                <strong>
                  Built for careers and teams
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            CANDIDATE + RECRUITER
        =================================================== */}
        <section className="home-roles-section">

          <div className="home-section-heading">

            <span>
              BUILT FOR EVERYONE
            </span>

            <h2>
              One platform.
              <br />
              <span>
                Two powerful experiences.
              </span>
            </h2>

          </div>


          <div className="home-role-grid">

            {/* Candidate */}
            <div className="home-role-card">

              <div className="role-image-wrapper">

                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85"
                  alt="Professional candidate"
                  width="900"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />

                <div className="role-badge">
                  👨‍💻 For Candidates
                </div>

              </div>


              <div className="role-content">

                <h3>
                  Take control of your career.
                </h3>

                <p>
                  Create your profile, discover relevant
                  jobs, apply with ease, and manage your
                  applications in one place.
                </p>

                <button
                  onClick={() => navigate("/signup")}
                >
                  Join as Candidate
                  <span>→</span>
                </button>

              </div>

            </div>


            {/* Recruiter */}
            <div className="home-role-card">

              <div className="role-image-wrapper">

                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=85"
                  alt="Recruiters working together"
                  width="900"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />

                <div className="role-badge">
                  🏢 For Recruiters
                </div>

              </div>


              <div className="role-content">

                <h3>
                  Find talent that fits.
                </h3>

                <p>
                  Publish jobs, review applications, discover
                  candidates, and manage your hiring process
                  efficiently.
                </p>

                <button
                  onClick={() => navigate("/login")}
                >
                  Recruit Talent
                  <span>→</span>
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            ABOUT
        =================================================== */}
        <section
          id="about"
          className="home-about"
        >

          <div className="home-about-content">

            <span>
              ABOUT HIREFLOW
            </span>

            <h2>
              Making hiring and
              <span>
                {" "}job searching simpler.
              </span>
            </h2>

            <p>
              HireFlow is designed to bring candidates and
              recruiters together through a clean,
              transparent, and easy-to-use platform.
            </p>

            <p>
              From discovering opportunities to managing
              applications, HireFlow helps you focus on what
              matters most — finding the right opportunity
              or the right talent.
            </p>

            <button
              className="home-about-button"
              onClick={() => navigate("/signup")}
            >
              Start Your Journey
              <span>→</span>
            </button>

          </div>


          <div className="home-about-visual">

            <div className="about-main-image">

              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
                alt="People collaborating"
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
              />

            </div>


            <div className="about-experience-card">

              <strong>
                2026
              </strong>

              <span>
                Building the future
                of recruitment
              </span>

            </div>


            <div className="about-check-card">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  Simple
                </strong>

                <small>
                  Easy to use
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            TESTIMONIALS
        =================================================== */}
        <section
          id="testimonials"
          className="home-testimonials"
        >

          <div className="home-section-heading">

            <span>
              WHAT PEOPLE SAY
            </span>

            <h2>
              Loved by candidates
              <br />
              <span>
                and recruiters.
              </span>
            </h2>

            <p>
              A better hiring experience starts with a
              better platform.
            </p>

          </div>


          <div className="testimonial-grid">

            <div className="testimonial-card">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p>
                "HireFlow made my job search much easier.
                I could keep all my applications organized
                and quickly apply to relevant positions."
              </p>

              <div className="testimonial-person">

                <div className="testimonial-avatar">
                  AK
                </div>

                <div>

                  <strong>
                    Ankit Kumar
                  </strong>

                  <span>
                    Software Developer
                  </span>

                </div>

              </div>

            </div>


            <div className="testimonial-card">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p>
                "The application management experience is
                simple and clear. It helps us spend more time
                talking to great candidates."
              </p>

              <div className="testimonial-person">

                <div className="testimonial-avatar">
                  RS
                </div>

                <div>

                  <strong>
                    Riya Sharma
                  </strong>

                  <span>
                    Talent Recruiter
                  </span>

                </div>

              </div>

            </div>


            <div className="testimonial-card">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p>
                "A clean platform that makes the hiring
                process feel much more organized and
                professional."
              </p>

              <div className="testimonial-person">

                <div className="testimonial-avatar">
                  VP
                </div>

                <div>

                  <strong>
                    Vikash Patel
                  </strong>

                  <span>
                    Hiring Manager
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

{/* =========================================================
    TRUSTED COMPANIES SECTION
========================================================= */}

<section className="trusted-companies-section">

  {/* Heading */}
  <div className="trusted-companies-header">

    <span className="trusted-eyebrow">
      ✦ TRUSTED BY INDUSTRY LEADERS ✦
    </span>

    <h2>
      Trusted by <span>50+ companies</span>
    </h2>

    <p>
      Leading technology companies trust HireFlow to connect
      great talent with exciting opportunities.
    </p>

    <div className="trusted-badge">
      <div className="trusted-badge-icon">
        🏢
      </div>

      <div className="trusted-badge-number">
        50+
      </div>

      <div className="trusted-badge-content">
        <strong>Technology Companies</strong>
        <small>Growing with HireFlow</small>
      </div>
    </div>

  </div>


  {/* =====================================================
      COMPANY MARQUEE
  ====================================================== */}

  <div className="companies-marquee-wrapper">

    {/* ROW 1 */}
    <div className="companies-marquee">
      <div className="companies-track companies-track-left">

        {[
          "Promatics Technologies",
          "Mobikasa",
          "TechnoYuga",
          "Quokka Labs",
          "Rannlab Technologies",
          "Binarysoft Technologies",
          "TechAhead",
          "Aks Websoft Consulting",
          "Taksh IT Solutions",
          "SDLC Corp",
          "Dotsquares",
          "The NineHertz",
          "SemiDot Infotech",
          "Octal IT Solution",
          "Konstant Infosolutions",
          "BR Softech",
          "Synarion IT Solutions",
          "Arka Softwares",
        ].map((company, index) => (
          <div
            className="company-pill"
            key={`row1-${index}`}
          >
            <span className="company-dot"></span>
            <span>{company}</span>
          </div>
        ))}

        {/* Duplicate for seamless animation */}
        {[
          "Promatics Technologies",
          "Mobikasa",
          "TechnoYuga",
          "Quokka Labs",
          "Rannlab Technologies",
          "Binarysoft Technologies",
          "TechAhead",
          "Aks Websoft Consulting",
          "Taksh IT Solutions",
          "SDLC Corp",
          "Dotsquares",
          "The NineHertz",
          "SemiDot Infotech",
          "Octal IT Solution",
          "Konstant Infosolutions",
          "BR Softech",
          "Synarion IT Solutions",
          "Arka Softwares",
        ].map((company, index) => (
          <div
            className="company-pill"
            key={`row1-duplicate-${index}`}
          >
            <span className="company-dot"></span>
            <span>{company}</span>
          </div>
        ))}

      </div>
    </div>


    {/* ROW 2 */}
    <div className="companies-marquee">
      <div className="companies-track companies-track-right">

        {[
          "TatvaSoft",
          "Space-O Technologies",
          "Radixweb",
          "Hidden Brains",
          "Hyperlink InfoSystem",
          "Elsner Technologies",
          "ZealousWeb",
          "Mindinventory",
          "Cyber Infrastructure (CIS)",
          "Impetus Technologies",
          "Yugasa Software Labs",
          "Walkover Technologies",
          "ITCode Infotech",
          "Deqode",
          "DigiValet",
          "Webdew",
          "Seasia Infotech",
          "Net Solutions",
        ].map((company, index) => (
          <div
            className="company-pill"
            key={`row2-${index}`}
          >
            <span className="company-dot"></span>
            <span>{company}</span>
          </div>
        ))}

        {/* Duplicate */}
        {[
          "TatvaSoft",
          "Space-O Technologies",
          "Radixweb",
          "Hidden Brains",
          "Hyperlink InfoSystem",
          "Elsner Technologies",
          "ZealousWeb",
          "Mindinventory",
          "Cyber Infrastructure (CIS)",
          "Impetus Technologies",
          "Yugasa Software Labs",
          "Walkover Technologies",
          "ITCode Infotech",
          "Deqode",
          "DigiValet",
          "Webdew",
          "Seasia Infotech",
          "Net Solutions",
        ].map((company, index) => (
          <div
            className="company-pill"
            key={`row2-duplicate-${index}`}
          >
            <span className="company-dot"></span>
            <span>{company}</span>
          </div>
        ))}

      </div>
    </div>


    {/* ROW 3 */}
    <div className="companies-marquee">
      <div className="companies-track companies-track-left-slow">

        {[
          "Fatbit Technologies",
          "Code Brew Labs",
          "IDS Infotech",
          "Apptunix",
          "Mobisoft Infotech",
          "Brainvire Infotech",
          "Prolitus Technologies",
          "Synerzip",
          "Techugo",
          "Mindbowser",
          "Fingent",
          "Cabot Technology Solutions",
          "Nuventure Connect",
          "WebCastle Technologies",
          "Pixabit Solutions",
          "Calpine Group",
          "Contus Tech",
          "Hakuna Matata Solutions",
          "Macappstudio",
          "Skcript",
          "Pepgra Healthcare/Tech",
        ].map((company, index) => (
          <div
            className="company-pill"
            key={`row3-${index}`}
          >
            <span className="company-dot"></span>
            <span>{company}</span>
          </div>
        ))}

        {/* Duplicate */}
        {[
          "Fatbit Technologies",
          "Code Brew Labs",
          "IDS Infotech",
          "Apptunix",
          "Mobisoft Infotech",
          "Brainvire Infotech",
          "Prolitus Technologies",
          "Synerzip",
          "Techugo",
          "Mindbowser",
          "Fingent",
          "Cabot Technology Solutions",
          "Nuventure Connect",
          "WebCastle Technologies",
          "Pixabit Solutions",
          "Calpine Group",
          "Contus Tech",
          "Hakuna Matata Solutions",
          "Macappstudio",
          "Skcript",
          "Pepgra Healthcare/Tech",
        ].map((company, index) => (
          <div
            className="company-pill"
            key={`row3-duplicate-${index}`}
          >
            <span className="company-dot"></span>
            <span>{company}</span>
          </div>
        ))}

      </div>
    </div>

  </div>


  {/* Bottom information */}
  <div className="trusted-bottom">

    <div className="trusted-security">
      <span className="security-icon">
        ✓
      </span>

      <span>
        Connecting talented professionals with growing companies
      </span>
    </div>


    <div className="trusted-dots">

      <span></span>
      <span className="active"></span>
      <span></span>

    </div>


    <div className="trusted-partner-note">

      <span className="partner-dot"></span>

      <span>
        Blinking blue points indicate our trusted partners
      </span>

    </div>

  </div>

</section>


        {/* ===================================================
    CTA - VIDEO
=================================================== */}

<section className="home-cta">

  <video
    className="home-cta-video"
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
  >
    <source src="/hireflow-cta.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>


  {/* 
    Transparent clickable layer.
    The visible button comes from the MP4.
  */}
  <button
    className="home-cta-button"
    onClick={() => navigate("/signup")}
    aria-label="Create Free Account"
  >
    <span>Create Free Account</span>
    <span className="cta-arrow">→</span>
  </button>

</section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="home-footer">

        <div className="home-footer-main">

          {/* Brand */}
          <div className="home-footer-brand">

            <div className="home-logo">

              <div className="home-logo-icon">
                H
              </div>

              <h2>
                Hire<span>Flow</span>
              </h2>

            </div>

            <p>
              Find Jobs. Hire Talent.
              <br />
              Grow Together.
            </p>

          </div>


          {/* Platform */}
          <div className="home-footer-column">

            <h3>
              Platform
            </h3>

            <button
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
            >
              How It Works
            </button>

            <button
              onClick={() => scrollToSection("about")}
            >
              About
            </button>

          </div>


          {/* Candidates */}
          <div className="home-footer-column">

            <h3>
              Candidates
            </h3>

            <button
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>

            <button
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
            >
              Find Jobs
            </button>

          </div>


                    {/* Recruiters */}
          <div className="home-footer-column">

            <h3>
              Recruiters
            </h3>

            <button
              onClick={() => navigate("/login")}
            >
              Recruiter Login
            </button>

            <button
              onClick={() => navigate("/login")}
            >
              Manage Jobs
            </button>

            <button
              onClick={() => navigate("/login")}
            >
              View Applications
            </button>

          </div>


          {/* Support */}
          <div className="home-footer-column">

            <h3>
              Support
            </h3>

            <button
              onClick={() => navigate("/faq")}
            >
              FAQ
            </button>

            <button
              onClick={() => navigate("/terms")}
            >
              Terms
            </button>

            <button
              onClick={() => navigate("/privacy")}
            >
              Privacy
            </button>

          </div>


          {/* Legal */}
          <div className="home-footer-column">

            <h3>
              Legal
            </h3>

            <button
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </button>

            <button
              onClick={() => navigate("/cookie-policy")}
            >
              Cookie Policy
            </button>

            <button
              onClick={() => navigate("/data-security")}
            >
              Data Security
            </button>

            <button
              onClick={() => navigate("/information-security")}
            >
              Information Security
            </button>

            <button
              onClick={() => navigate("/terms")}
            >
              Terms & Conditions
            </button>

            <button
              type="button"
              onClick={handleOpenCookieSettings}
            >
              Cookie Settings
            </button>

          </div>


        </div>


        {/* Footer Bottom */}
        <div className="home-footer-bottom">

          <p>
            © 2026 HireFlow. All rights reserved.
          </p>

          <p>
            Built for better careers and better hiring.
          </p>

        </div>

      </footer>


          <style>{`
            .home-cookie-banner {
              position: fixed;
              top: 12px;
              left: 17px;
              right: 37px;
              z-index: 9999;
              display: grid;
              grid-template-columns: minmax(0, 1fr) auto;
              align-items: center;
              gap: 30px;
              padding: 38px 48px 30px;
              background: #07152a;
              border: 1px solid #344052;
              box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
              box-sizing: border-box;
            }

            .home-cookie-banner-content h2 {
              margin: 0 0 18px;
              color: #ffffff;
              font-family: Georgia, "Times New Roman", serif;
              font-size: 28px;
              line-height: 1.15;
            }

            .home-cookie-banner-content p {
              max-width: 880px;
              margin: 0;
              color: #aeb8c8;
              font-size: 20px;
              font-weight: 600;
              line-height: 1.7;
            }

            .home-cookie-banner-content a {
              color: #c59b58;
              text-decoration: underline;
              text-underline-offset: 2px;
            }

            .home-cookie-banner-actions {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              gap: 18px;
              white-space: nowrap;
            }

            .home-cookie-banner-button {
              min-width: 270px;
              height: 62px;
              padding: 0 24px;
              border: 1px solid #344052;
              background: transparent;
              color: #f8fafc;
              font-size: 18px;
              font-weight: 700;
              cursor: pointer;
              transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
            }

            .home-cookie-banner-button:hover {
              background: #101f35;
              border-color: #617087;
              transform: translateY(-1px);
            }

            .home-cookie-banner-button.accept {
              min-width: 164px;
              border-color: #b89255;
              background: #b89255;
              color: #081528;
            }

            .home-cookie-banner-button.accept:hover {
              background: #c5a064;
              border-color: #c5a064;
            }

            .home-cookie-banner-close {
              position: absolute;
              top: 24px;
              right: 27px;
              width: 30px;
              height: 30px;
              padding: 0;
              border: none;
              background: transparent;
              color: #7f8b9c;
              font-size: 32px;
              font-weight: 300;
              line-height: 30px;
              cursor: pointer;
            }

            .home-cookie-banner-close:hover {
              color: #ffffff;
            }

            .home-cookie-modal-backdrop {
              position: fixed;
              inset: 0;
              z-index: 10000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              background: rgba(7, 21, 42, 0.72);
              backdrop-filter: blur(4px);
              box-sizing: border-box;
            }

            .home-cookie-modal {
              position: relative;
              width: 100%;
              max-width: 520px;
              padding: 30px;
              background: #ffffff;
              border-radius: 18px;
              box-shadow: 0 25px 70px rgba(15, 23, 42, 0.3);
              box-sizing: border-box;
            }

            .home-cookie-modal h2 {
              margin: 7px 0 10px;
              color: #102a43;
              font-size: 26px;
            }

            .home-cookie-modal > p {
              margin: 0 0 20px;
              color: #627d98;
              font-size: 14px;
              line-height: 1.7;
            }

            .home-cookie-modal-label {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 15px;
              padding: 13px 0;
              border-top: 1px solid #e5edf5;
            }

            .home-cookie-modal-label strong {
              color: #102a43;
              font-size: 14px;
            }

            .home-cookie-modal-label small {
              display: block;
              margin-top: 4px;
              color: #829ab1;
              font-size: 12px;
            }

            .home-cookie-switch {
              position: relative;
              flex-shrink: 0;
              width: 48px;
              height: 26px;
              padding: 0;
              border: none;
              border-radius: 20px;
              cursor: pointer;
              transition: background 0.2s ease;
            }

            .home-cookie-switch span {
              position: absolute;
              top: 3px;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #ffffff;
              box-shadow: 0 2px 5px rgba(15, 23, 42, 0.18);
              transition: left 0.2s ease;
            }

            .home-cookie-modal-actions {
              display: flex;
              gap: 10px;
              margin-top: 20px;
            }

            .home-cookie-modal-actions button {
              flex: 1;
              padding: 13px 15px;
              border: none;
              border-radius: 9px;
              background: #2864e8;
              color: #ffffff;
              font-size: 14px;
              font-weight: 700;
              cursor: pointer;
            }

            .home-cookie-modal-actions button:first-child {
              background: #eef5ff;
              color: #2864e8;
            }

            @media (max-width: 1150px) {
              .home-cookie-banner {
                grid-template-columns: 1fr;
                gap: 22px;
                padding: 32px 38px 28px;
              }

              .home-cookie-banner-actions {
                justify-content: flex-start;
              }
            }

            @media (max-width: 700px) {
              .home-cookie-banner {
                top: 10px;
                left: 10px;
                right: 10px;
                gap: 18px;
                padding: 30px 22px 22px;
              }

              .home-cookie-banner-content h2 {
                margin-bottom: 12px;
                font-size: 23px;
              }

              .home-cookie-banner-content p {
                font-size: 14px;
                line-height: 1.6;
              }

              .home-cookie-banner-actions {
                flex-direction: column;
                align-items: stretch;
                width: 100%;
                gap: 10px;
                white-space: normal;
              }

              .home-cookie-banner-button,
              .home-cookie-banner-button.accept {
                width: 100%;
                min-width: 0;
                height: 48px;
                font-size: 14px;
              }

              .home-cookie-banner-close {
                top: 12px;
                right: 13px;
                font-size: 27px;
              }
            }

            @media (max-width: 420px) {
              .home-cookie-banner {
                padding: 28px 17px 17px;
              }

              .home-cookie-banner-content h2 {
                font-size: 21px;
              }

              .home-cookie-banner-content p {
                font-size: 13px;
              }
            }
          `}</style>

      {showCookieBanner && (
        <>


          <div className="home-cookie-banner" role="dialog" aria-modal="true" aria-labelledby="home-cookie-title">
            <button
              type="button"
              className="home-cookie-banner-close"
              aria-label="Close cookie notice"
              onClick={handleRejectNonEssential}
            >
              ×
            </button>

            <div className="home-cookie-banner-content">
              <h2 id="home-cookie-title">Your Privacy Matters</h2>
              <p>
                We use cookies and similar technologies to improve website functionality, understand website usage, and provide a better experience. You can accept all cookies, reject non-essential cookies, or manage your preferences. {" "}
                <button
                  type="button"
                  onClick={() => navigate("/cookie-policy")}
                  style={{
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    color: "#c59b58",
                    font: "inherit",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Cookie Policy
                </button>
                <span> · </span>
                <button
                  type="button"
                  onClick={() => navigate("/privacy")}
                  style={{
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    color: "#c59b58",
                    font: "inherit",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Privacy Policy
                </button>
              </p>
            </div>

            <div className="home-cookie-banner-actions">
              <button
                type="button"
                className="home-cookie-banner-button"
                onClick={handleOpenCookieSettings}
              >
                Manage Preferences
              </button>

              <button
                type="button"
                className="home-cookie-banner-button"
                onClick={handleRejectNonEssential}
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                className="home-cookie-banner-button accept"
                onClick={handleAcceptAllCookies}
              >
                Accept All
              </button>
            </div>
          </div>
        </>
      )}


      {/* =====================================================
          COOKIE SETTINGS
      ===================================================== */}
      {isCookieSettingsOpen && (
        <div
          className="home-cookie-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          onClick={() => setIsCookieSettingsOpen(false)}
        >
          <div
            className="home-cookie-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close Cookie Settings"
              onClick={() => setIsCookieSettingsOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "15px",
                width: "32px",
                height: "32px",
                border: "none",
                borderRadius: "50%",
                background: "#f1f5f9",
                color: "#475569",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <span style={{ color: "#2864e8", fontSize: "12px", fontWeight: 800, letterSpacing: "1.2px" }}>
              HIREFLOW
            </span>

            <h2 id="cookie-settings-title">Cookie Settings</h2>

            <p>
              Manage your cookie preferences. Essential cookies are required for HireFlow to function properly.
            </p>

            <div className="home-cookie-modal-label">
              <div>
                <strong>Essential Cookies</strong>
                <small>Required for login and core platform features.</small>
              </div>
              <span style={{ color: "#2864e8", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                Always Active
              </span>
            </div>

            {[
              ["analytics", "Analytics Cookies", "Help us understand platform usage."],
              ["preferences", "Preference Cookies", "Remember selected preferences."],
            ].map(([key, title, description]) => (
              <div className="home-cookie-modal-label" key={key}>
                <div>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>

                <button
                  type="button"
                  className="home-cookie-switch"
                  role="switch"
                  aria-checked={cookiePreferences[key]}
                  onClick={() => handleCookiePreferenceChange(key)}
                  style={{ background: cookiePreferences[key] ? "#2864e8" : "#cbd5e1" }}
                >
                  <span style={{ left: cookiePreferences[key] ? "25px" : "3px" }} />
                </button>
              </div>
            ))}

            <div className="home-cookie-modal-actions">
              <button type="button" onClick={handleRejectNonEssential}>
                Reject All Optional
              </button>
              <button type="button" onClick={() => saveCookieConsent(cookiePreferences)}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;