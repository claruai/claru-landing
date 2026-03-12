import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Claru",
  description:
    "Privacy Policy for Claru (Reka AI Inc., d/b/a Claru AI) - Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy - Claru",
    description:
      "Privacy Policy for Claru (Reka AI Inc., d/b/a Claru AI) - Learn how we collect, use, and protect your personal information.",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      {/* Content */}
      <main className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[var(--text-tertiary)] font-mono text-sm mb-2">
            Reka AI Inc. (d/b/a Claru AI)
          </p>
          <p className="text-[var(--text-tertiary)] font-mono mb-12">
            Effective Date: January 16, 2026
          </p>

          <div className="prose prose-invert max-w-none space-y-10">
            {/* Section 1: Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                1. Introduction
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Reka AI Inc. (d/b/a Claru AI)
                (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is
                committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you visit our website, use our services, or
                otherwise interact with us. Please read this policy carefully to
                understand our practices regarding your personal data and how we
                will treat it.
              </p>
            </section>

            {/* Section 2: Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                2. Information We Collect
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We may collect the following types of information:
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                Personal Information
              </h3>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 mb-6 ml-4">
                <li>
                  Name and contact information (email address, phone number,
                  mailing address)
                </li>
                <li>Company name and job title</li>
                <li>Payment and billing information</li>
                <li>Account credentials</li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                Usage Data
              </h3>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 mb-6 ml-4">
                <li>IP address and device identifiers</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Interactions with our services</li>
                <li>Referring website or source</li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                Cookies and Tracking Technologies
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We use cookies, web beacons, and similar tracking technologies
                to collect information about your browsing activities. See
                Section 8 for more details on cookies.
              </p>
            </section>

            {/* Section 3: How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                3. How We Use Your Information
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  <span className="text-[var(--text-primary)]">
                    Providing and improving our services:
                  </span>{" "}
                  To deliver the services you request and enhance your
                  experience
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Processing transactions:
                  </span>{" "}
                  To process payments, fulfill orders, and manage your account
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Communication:
                  </span>{" "}
                  To respond to inquiries, send service updates, and provide
                  customer support
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Personalization:
                  </span>{" "}
                  To tailor content and recommendations to your preferences
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Legal compliance:
                  </span>{" "}
                  To comply with applicable laws, regulations, and legal
                  processes
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Fraud prevention:
                  </span>{" "}
                  To detect, prevent, and address fraud, security issues, and
                  technical problems
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">Analytics:</span>{" "}
                  To analyze usage patterns and improve our website and services
                </li>
              </ul>
            </section>

            {/* Section 4: How We Share Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                4. How We Share Your Information
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-3 ml-4">
                <li>
                  <span className="text-[var(--text-primary)]">
                    Service Providers:
                  </span>{" "}
                  We may share information with third-party vendors who perform
                  services on our behalf, such as payment processing, data
                  analysis, email delivery, hosting, and customer service
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Business Transfers:
                  </span>{" "}
                  In connection with a merger, acquisition, reorganization, or
                  sale of assets, your information may be transferred as part of
                  that transaction
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Legal Requirements:
                  </span>{" "}
                  We may disclose information if required to do so by law or in
                  response to valid requests by public authorities
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    With Your Consent:
                  </span>{" "}
                  We may share your information with third parties when you have
                  given us your consent to do so
                </li>
              </ul>
              <div className="mt-6 p-4 border border-[var(--accent-primary)] rounded-lg bg-[var(--accent-glow)]">
                <p className="text-[var(--text-primary)] font-semibold">
                  We do NOT sell your personal information.
                </p>
              </div>
            </section>

            {/* Section 5: Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                5. Data Security
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We implement appropriate administrative, technical, and physical
                safeguards designed to protect your personal information from
                unauthorized access, use, alteration, and disclosure. These
                measures include:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication measures</li>
                <li>Regular security assessments and audits</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to use
                commercially reasonable measures to protect your personal
                information, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Section 6: Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                6. Data Retention
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We retain your personal information for as long as necessary to
                fulfill the purposes for which it was collected, including to
                satisfy any legal, accounting, or reporting requirements. When
                determining retention periods, we consider the amount, nature,
                and sensitivity of the data, the potential risk of harm from
                unauthorized use or disclosure, and applicable legal
                requirements. We may retain anonymized or aggregated data for
                longer periods for analytics and improvement purposes.
              </p>
            </section>

            {/* Section 7: Your Privacy Rights */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                7. Your Privacy Rights
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  <span className="text-[var(--text-primary)]">Access:</span>{" "}
                  Request access to the personal information we hold about you
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Correction:
                  </span>{" "}
                  Request correction of inaccurate or incomplete data
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">Deletion:</span>{" "}
                  Request deletion of your personal information, subject to
                  certain exceptions
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">Opt-out:</span>{" "}
                  Opt out of marketing communications at any time
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>
                . We will respond to your request within the timeframe required
                by applicable law.
              </p>
            </section>

            {/* Section 8: Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                8. Cookies and Tracking Technologies
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your
                experience on our website. Types of cookies we use include:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-3 ml-4">
                <li>
                  <span className="text-[var(--text-primary)]">
                    Essential Cookies:
                  </span>{" "}
                  Necessary for the website to function properly and cannot be
                  disabled
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Analytics Cookies:
                  </span>{" "}
                  Help us understand how visitors interact with our website by
                  collecting anonymous information
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Functional Cookies:
                  </span>{" "}
                  Enable enhanced functionality and personalization, such as
                  remembering your preferences
                </li>
                <li>
                  <span className="text-[var(--text-primary)]">
                    Advertising Cookies:
                  </span>{" "}
                  Used to deliver relevant advertisements and track campaign
                  performance
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                <span className="text-[var(--text-primary)]">
                  Managing Preferences:
                </span>{" "}
                You can manage your cookie preferences through your browser
                settings. Most browsers allow you to refuse cookies or alert you
                when cookies are being sent. Please note that disabling certain
                cookies may affect the functionality of our website.
              </p>
            </section>

            {/* Section 9: International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                9. International Data Transfers
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Your information may be transferred to, stored, and processed in
                countries other than your country of residence. These countries
                may have data protection laws that differ from the laws of your
                country. When we transfer your information internationally, we
                take appropriate safeguards to ensure that your personal
                information remains protected in accordance with this Privacy
                Policy and applicable law. These safeguards may include
                implementing standard contractual clauses, relying on adequacy
                decisions, or obtaining your consent.
              </p>
            </section>

            {/* Section 10: Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children under 18. If you are a parent or guardian and believe
                your child has provided us with personal information, please
                contact us at{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>
                , and we will take steps to delete such information.
              </p>
            </section>

            {/* Section 11: Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                11. Third-Party Links
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Our website may contain links to third-party websites,
                applications, or services that are not operated by us. We have
                no control over and assume no responsibility for the content,
                privacy policies, or practices of any third-party sites or
                services. We encourage you to review the privacy policies of any
                third-party sites you visit.
              </p>
            </section>

            {/* Section 12: Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                12. Changes to This Privacy Policy
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, legal requirements, or
                other factors. When we make material changes, we will notify you
                by updating the &ldquo;Effective Date&rdquo; at the top of this
                policy and, where appropriate, provide additional notice (such
                as via email or a prominent notice on our website). Your
                continued use of our services after any changes indicates your
                acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Section 13: Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                13. Contact Us
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm">
                <p className="text-[var(--text-primary)]">
                  Reka AI Inc. (d/b/a Claru AI)
                </p>
                <p className="text-[var(--accent-primary)] mt-2">
                  <a href="mailto:support@claru.ai" className="hover:underline">
                    support@claru.ai
                  </a>
                </p>
              </div>
            </section>

            {/* Regional Information Divider */}
            <div className="border-t border-[var(--border-medium)] pt-10 mt-10">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 font-mono">
                Regional Privacy Information
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                The following sections provide additional information for
                residents of specific jurisdictions:
              </p>

              {/* US (California) - CCPA */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[var(--accent-primary)] mb-4 font-mono">
                  United States (California) - CCPA Rights
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  If you are a California resident, the California Consumer
                  Privacy Act (CCPA) provides you with additional rights
                  regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Know:
                    </span>{" "}
                    Request information about the categories and specific pieces
                    of personal information we have collected about you
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Delete:
                    </span>{" "}
                    Request deletion of your personal information, subject to
                    certain exceptions
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Opt-Out:
                    </span>{" "}
                    Opt out of the sale of your personal information (note: we
                    do not sell personal information)
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Non-Discrimination:
                    </span>{" "}
                    You will not be discriminated against for exercising your
                    CCPA rights
                  </li>
                </ul>
              </div>

              {/* EEA/UK - GDPR */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[var(--accent-primary)] mb-4 font-mono">
                  European Economic Area &amp; United Kingdom - GDPR Rights
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  If you are located in the EEA or UK, the General Data
                  Protection Regulation (GDPR) provides you with the following
                  rights:
                </p>
                <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right of Access:
                    </span>{" "}
                    Obtain confirmation of whether we process your data and
                    request a copy
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Rectification:
                    </span>{" "}
                    Request correction of inaccurate or incomplete personal data
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Erasure:
                    </span>{" "}
                    Request deletion of your personal data (&ldquo;right to be
                    forgotten&rdquo;)
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Restriction:
                    </span>{" "}
                    Request restriction of processing in certain circumstances
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Data Portability:
                    </span>{" "}
                    Receive your data in a structured, commonly used format
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Object:
                    </span>{" "}
                    Object to processing based on legitimate interests or for
                    direct marketing
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Rights Related to Automated Decision-Making:
                    </span>{" "}
                    Not be subject to decisions based solely on automated
                    processing that significantly affect you
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Lodge a Complaint:
                    </span>{" "}
                    Lodge a complaint with a supervisory authority in your
                    country of residence
                  </li>
                </ul>
              </div>

              {/* Canada - PIPEDA */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--accent-primary)] mb-4 font-mono">
                  Canada - PIPEDA Rights
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  If you are a Canadian resident, the Personal Information
                  Protection and Electronic Documents Act (PIPEDA) provides you
                  with the following rights:
                </p>
                <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Access:
                    </span>{" "}
                    Request access to your personal information held by us
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Correct:
                    </span>{" "}
                    Request correction of your personal information
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">
                      Right to Withdraw Consent:
                    </span>{" "}
                    Withdraw consent to the collection, use, or disclosure of
                    your personal information, subject to legal or contractual
                    restrictions
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
            <a
              href="/"
              className="font-mono text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              &larr; Back to Home
            </a>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
