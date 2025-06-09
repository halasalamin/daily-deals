import React from "react";

const CompanyInfo = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Our Seller Program</h1>
      <p style={styles.intro}>
        Thank you for your interest in joining our platform as a company seller. 
        Currently, companies cannot register directly through the website.
      </p>

      <section style={styles.section}>
        <h2 style={styles.heading}>How to Join Us as a Seller?</h2>
        <ol style={styles.list}>
          <li>
            <strong>Contact Our Support Team:</strong> Reach out to us via email at{" "}
            <a href="admin@dailydeals.com" style={styles.link}>
              admin@dailydeals.com
            </a>{" "}
            with your company details.
          </li>
          <li>
            <strong>Verification & Approval:</strong> We will verify your company credentials and discuss partnership terms.
          </li>
          <li>
            <strong>Onboarding Process:</strong> Once approved, we will guide you through the onboarding process, including product listing and dashboard access.
          </li>
          <li>
            <strong>Start Selling:</strong> After onboarding, you can start listing your products and managing your sales through our seller dashboard.
          </li>
        </ol>
      </section>

      <section style={styles.section}>
        <h2 style={styles.heading}>Why Sell With Us?</h2>
        <ul style={styles.list}>
          <li>Access to a large and diverse customer base.</li>
          <li>Easy-to-use seller dashboard for managing products and orders.</li>
          <li>Marketing support to boost your sales.</li>
          <li>Secure payment and reliable delivery logistics.</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.heading}>Have Questions?</h2>
        <p>
          If you want to learn more about our seller program or need assistance, please contact us at{" "}
          <a href="admin@dailydeals.com" style={styles.link}>
            admin@dailydeals.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 728,
    margin: "34px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign:"left"
  },
  title: {
    textAlign: "left",
    color: "#167f81",
    marginBottom: 30,
  },
  intro: {
    fontSize: 18,
    lineHeight: 1.6,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  heading: {
    color: "#0d5c5f",
    marginBottom: 12,
  },
  list: {
    paddingLeft: 20,
    lineHeight: 1.6,
  },
  link: {
    color: "#167f81",
    textDecoration: "none",
  },
};

export default CompanyInfo;
