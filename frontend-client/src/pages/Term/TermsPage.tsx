import React from 'react';
import { Container } from '@mui/material';
import './TermsPage.css';

const TermsPage: React.FC = () => {
  return (
    <Container maxWidth="md" className="terms-container">
      <h1>Terms of Service</h1>

      <p>Welcome to our website. Please read these terms of service ("Terms", "Terms of Service") carefully before using our site.</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using the website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

      <h2>2. Accounts</h2>
      <p>When you create an account, you must provide accurate and complete information. You are responsible for safeguarding the password you use to access the site.</p>

      <h2>3. Use of the Website</h2>
      <p>You agree not to misuse our services. You may use the services only as permitted by law.</p>

      <h2>4. Termination</h2>
      <p>We may terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever, including if you breach the Terms.</p>

      <h2>5. Changes</h2>
      <p>We reserve the right to update or change our Terms at any time. We will try to provide at least 7 days' notice prior to any new terms taking effect.</p>

      <p>By continuing to access or use our website after those changes become effective, you agree to be bound by the revised terms.</p>

      <h2>6. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at halasalamin7@gmail.com.</p>
    </Container>
  );
};

export default TermsPage;
