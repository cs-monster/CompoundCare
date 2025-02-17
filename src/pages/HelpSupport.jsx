import React from 'react';
import Navbar from '/src/Navbar'; // Import the Navbar component
import './Help.css';  // Import the CSS file for styling

const HelpAndSupport = () => {
  return (
    <div className="help-and-support-page">
      {/* Navbar at the top */}
      <Navbar />

      {/* Page Header */}
      <header className="help-header">
        <h1>Help & Support</h1>
        <p>We're here to help! Find answers to common questions or contact us directly.</p>
      </header>

      {/* Main Content */}
      <div className="help-content">
        {/* Troubleshooting Section */}
        <section className="troubleshooting-section">
          <h2>Troubleshooting</h2>
          <div className="troubleshooting-cards">
            <div className="card">
              <h3>Wallet Connection Issues</h3>
              <p>Learn how to set up MetaMask and troubleshoot connection problems.</p>
              <a href="https://support.metamask.io/configure/troubleshooting/user-guide-troubleshooting/">Learn More</a>
            </div>
            <div className="card">
              <h3>Transaction Errors</h3>
              <p>Resolve pending, failed, or stuck transactions.</p>
              <a href="https://support.metamask.io/manage-crypto/tokens/user-guide-transactions-and-failed-transactions/#:~:text=Fixing%20the%20problem%E2%80%8B&text=If%20it%20is%20just%20in,solution%20could%20be%20more%20complicated.">Learn More</a>
            </div>
            <div className="card">
              <h3>Investment Issues</h3>
              <p>Fix deposit/withdrawal failures or incorrect balance issues.</p>
              <a href="https://help.coinbase.com/en/coinbase/trading-and-funding/advanced-trade/error-messages">Learn More</a>
            </div>
          </div>
        </section>

        {/* User Guides Section */}
        <section className="user-guides-section">
          <h2>User Guides</h2>
          <div className="guide-cards">
            <div className="card">
              <h3>How to Get Started</h3>
              <p>Step-by-step guide to connecting your wallet, investing, and tracking earnings.</p>
              <a href="https://roqqupay.medium.com/crypto-wallets-made-easy-a-step-by-step-guide-for-newbies-f35421efed19">Read Guide</a>
            </div>
            <div className="card">
              <h3>Understanding Compound Interest</h3>
              <p>Simple explanation with examples to help you maximize your earnings.</p>
              <a href="https://www.equifax.co.uk/resources/loans-and-credit/explaining-compound-interest.html#:~:text=What%20is%20compound%20interest%3F,on%20each%20previous%20year's%20interest.">Read Guide</a>
            </div>
            <div className="card">
              <h3>Security Best Practices</h3>
              <p>Tips for managing private keys and avoiding scams.</p>
              <a href="https://cryptorobotics.ai/news/protecting-crypto-investments-best-practices-against-scams-hacks/">Read Guide</a>
            </div>
          </div>
        </section>

        {/* Investment Help Section */}
        <section className="investment-help-section">
          <h2>Investment Help</h2>
          <div className="investment-cards">
            <div className="card">
              <h3>How Micro-Investment Works</h3>
              <p>Learn about micro-investing and how it can grow your wealth.</p>
              <a href="https://www.financemagnates.com/thought-leadership/micro-investing-how-to-build-wealth-with-small-consistent-investments/">Learn More</a>
            </div>
            <div className="card">
              <h3>Supported Assets & Minimum Investments</h3>
              <p>Discover the assets you can invest in and the minimum amounts required.</p>
              <a href="https://www.nerdwallet.com/uk/investing/how-to-invest-in-cryptocurrency/">Learn More</a>
            </div>
            <div className="card">
              <h3>How to Withdraw Funds</h3>
              <p>Step-by-step instructions for withdrawing your investments.</p>
              <a href="#withdraw-funds">Learn More</a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>What is Compound Care?</h3>
              <p>Compound Care is a decentralized platform that allows you to earn interest on your crypto assets through lending and borrowing.</p>
            </div>
            <div className="faq-item">
              <h3>How does decentralized lending work?</h3>
              <p>Decentralized lending enables users to lend and borrow crypto assets directly through smart contracts, without intermediaries.</p>
            </div>
            <div className="faq-item">
              <h3>Are my funds safe?</h3>
              <p>Yes, your funds are secured by blockchain technology and smart contracts. However, always follow security best practices.</p>
            </div>
            <div className="faq-item">
              <h3>How do I withdraw my investment?</h3>
              <p>You can withdraw your investment at any time by following the steps in the "How to Withdraw Funds" guide.</p>
            </div>
            <div className="faq-item">
              <h3>What happens if the Ethereum network is congested?</h3>
              <p>During network congestion, transactions may take longer to process or require higher gas fees. We recommend checking gas prices before initiating transactions.</p>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="contact-us-section">
          <h2>Contact Us</h2>
          <div className="contact-options">
            <div className="contact-card">
              <h3>Email Support</h3>
              <p>Reach out to us at <a href="mailto:support@compoundcare.com">support@compoundcare.com</a>.</p>
            </div>
            <div className="contact-card">
              <h3>In-App Support Chat</h3>
              <p>Chat with our support team directly within the app.</p>
            </div>
            <div className="contact-card">
              <h3>Community Forum</h3>
              <p>Join our community forum to connect with other users and get help.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpAndSupport;