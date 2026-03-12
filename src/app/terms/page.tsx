import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";

export const metadata: Metadata = {
  title: "Terms of Service - Claru",
  description:
    "Terms of Service for Claru by Reka AI Inc. (d/b/a Claru AI) - Expert Human Intelligence for AI Labs. Read our terms governing the use of our websites, mobile applications, and services.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service - Claru",
    description:
      "Terms of Service for Claru by Reka AI Inc. (d/b/a Claru AI) - Expert Human Intelligence for AI Labs.",
    type: "website",
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      {/* Content */}
      <main className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-[var(--text-tertiary)] font-mono text-sm mb-2">
            Effective Date: January 2025
          </p>
          <p className="text-[var(--text-tertiary)] font-mono text-sm mb-12">
            Last Updated: January 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-10">
            {/* Section 1: Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                1. Introduction
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Welcome to Claru. These Terms of Service (&ldquo;Terms&rdquo;)
                constitute a legally binding agreement between you
                (&ldquo;you&rdquo; or &ldquo;User&rdquo;) and Reka AI Inc.,
                doing business as Claru AI (&ldquo;Claru&rdquo;,
                &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
                &ldquo;our&rdquo;).
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                These Terms govern your access to and use of our websites,
                mobile applications, and services (collectively, the
                &ldquo;Services&rdquo;), including but not limited to data
                annotation platforms, expert evaluation services, and any
                related tools or features we provide.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                By accessing or using our Services, you acknowledge that you
                have read, understood, and agree to be bound by these Terms. If
                you do not agree to these Terms, you must not access or use our
                Services.
              </p>
            </section>

            {/* Section 2: Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                2. Eligibility
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                To use our Services, you must:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Be at least 18 years of age or the age of majority in your
                  jurisdiction, whichever is greater
                </li>
                <li>
                  Have the legal capacity to enter into a binding contract with
                  Claru
                </li>
                <li>
                  Not be prohibited from using the Services under applicable
                  laws or regulations
                </li>
                <li>
                  Not have been previously suspended or removed from our
                  Services
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                If you are using the Services on behalf of a business,
                organization, or other entity, you represent and warrant that
                you have the authority to bind that entity to these Terms.
              </p>
            </section>

            {/* Section 3: Account Creation */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                3. Account Creation
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                To access certain features of our Services, you may be required
                to create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Provide accurate, current, and complete information during
                  registration
                </li>
                <li>
                  Maintain and promptly update your account information to keep
                  it accurate and complete
                </li>
                <li>
                  Maintain the security and confidentiality of your login
                  credentials
                </li>
                <li>
                  Accept responsibility for all activities that occur under your
                  account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                You may only maintain one account per person unless otherwise
                authorized by Claru in writing. We reserve the right to suspend
                or terminate duplicate accounts.
              </p>
            </section>

            {/* Section 4: Your Content */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                4. Your Content
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You retain ownership of any content, data, materials, or
                information you submit, upload, or transmit through our Services
                (&ldquo;Your Content&rdquo;). By providing Your Content, you
                grant Claru a worldwide, non-exclusive, royalty-free license to
                use, reproduce, modify, adapt, publish, and display Your Content
                solely for the purpose of providing and improving our Services.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  You own or have the necessary rights to Your Content and to
                  grant the license above
                </li>
                <li>
                  Your Content does not infringe upon the intellectual property
                  rights, privacy rights, or any other rights of any third party
                </li>
                <li>
                  Your Content complies with all applicable laws and regulations
                </li>
                <li>
                  Your Content does not contain any viruses, malware, or other
                  harmful code
                </li>
              </ul>
            </section>

            {/* Section 5: Our Content and IP */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                5. Our Content and Intellectual Property
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                The Services and all content, features, and functionality
                thereof, including but not limited to all information, software,
                text, displays, images, video, audio, design, selection, and
                arrangement (&ldquo;Our Content&rdquo;), are owned by Claru, our
                licensors, or other providers and are protected by copyright,
                trademark, patent, trade secret, and other intellectual property
                laws.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                The Claru name, logo, and all related names, logos, product and
                service names, designs, and slogans are trademarks of Claru or
                its affiliates. You may not use such marks without our prior
                written permission.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                No right, title, or interest in or to the Services or Our
                Content is transferred to you, and all rights not expressly
                granted are reserved by Claru. Any use of the Services not
                expressly permitted by these Terms is a breach of these Terms
                and may violate intellectual property laws.
              </p>
            </section>

            {/* Section 6: Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                6. Prohibited Activities
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Using the Services for any illegal purpose or in violation of
                  any applicable laws or regulations
                </li>
                <li>
                  Harassing, threatening, defaming, or otherwise violating the
                  legal rights of others
                </li>
                <li>
                  Sending unsolicited communications, spam, or promotional
                  materials
                </li>
                <li>
                  Attempting to gain unauthorized access to the Services, other
                  accounts, computer systems, or networks connected to the
                  Services
                </li>
                <li>
                  Interfering with or disrupting the integrity or performance of
                  the Services or related systems
                </li>
                <li>
                  Circumventing, disabling, or otherwise interfering with
                  security-related features of the Services
                </li>
                <li>
                  Using any automated system, including robots, spiders, or
                  scrapers, to access the Services without our express written
                  consent
                </li>
                <li>
                  Reverse engineering, decompiling, or disassembling any aspect
                  of the Services
                </li>
                <li>
                  Impersonating any person or entity or misrepresenting your
                  affiliation with any person or entity
                </li>
              </ul>
            </section>

            {/* Section 7: AI and Machine Learning */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                7. AI and Machine Learning
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Our Services may incorporate artificial intelligence and machine
                learning technologies. By using our Services, you acknowledge
                and agree that:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Data you provide may be used to train, improve, and develop
                  our AI and machine learning models
                </li>
                <li>
                  We may use anonymized and aggregated data derived from your
                  use of the Services for research, analytics, and improvement
                  of our Services
                </li>
                <li>
                  AI-generated outputs may not always be accurate, complete, or
                  suitable for your specific purposes
                </li>
                <li>
                  You are responsible for reviewing and validating any
                  AI-generated content before relying on it
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                We implement appropriate safeguards to protect the
                confidentiality and security of your data in accordance with our
                Privacy Policy.
              </p>
            </section>

            {/* Section 8: Fees and Payment */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                8. Fees and Payment
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Certain features of our Services may require payment of fees.
                You agree to pay all fees and charges associated with your
                account at the prices in effect when such charges are incurred.
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  <strong className="text-[var(--text-primary)]">
                    Subscription Fees:
                  </strong>{" "}
                  If you subscribe to a paid plan, you will be billed in advance
                  on a recurring basis (monthly or annually, as applicable)
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">
                    Automatic Renewal:
                  </strong>{" "}
                  Subscriptions automatically renew unless you cancel before the
                  renewal date
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Taxes:</strong>{" "}
                  You are responsible for all applicable taxes, and we may
                  charge tax in addition to the listed fees where required by
                  law
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">
                    Price Changes:
                  </strong>{" "}
                  We reserve the right to change our fees upon reasonable notice
                  posted on the Services or sent to you via email
                </li>
              </ul>
            </section>

            {/* Section 9: Cancellation and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                9. Cancellation and Refunds
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You may cancel your subscription at any time through your
                account settings or by contacting us at{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>
                .
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Upon cancellation, you will retain access to paid features
                  until the end of your current billing period
                </li>
                <li>
                  Refunds are provided in accordance with our refund policy and
                  may be granted at our sole discretion
                </li>
                <li>
                  No refunds will be provided for partial subscription periods
                  or unused features
                </li>
                <li>
                  If we terminate your account for a breach of these Terms, you
                  will not be entitled to any refund
                </li>
              </ul>
            </section>

            {/* Section 10: Termination */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                10. Termination
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We may suspend or terminate your access to the Services at any
                time, with or without cause, and with or without notice,
                including for any of the following reasons:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Violation of these Terms or any applicable policies</li>
                <li>
                  Conduct that we believe is harmful to other users or Claru
                </li>
                <li>Extended periods of inactivity</li>
                <li>Request by law enforcement or other government agencies</li>
                <li>Discontinuation or modification of the Services</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                Upon termination, your right to use the Services will
                immediately cease, and we may delete your account and any
                associated data. Provisions of these Terms that by their nature
                should survive termination will survive, including ownership
                provisions, warranty disclaimers, indemnification, and
                limitations of liability.
              </p>
            </section>

            {/* Section 11: Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                11. Third-Party Services
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Our Services may contain links to third-party websites,
                applications, or services that are not owned or controlled by
                Claru. These links are provided for your convenience only.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We have no control over, and assume no responsibility for, the
                content, privacy policies, or practices of any third-party
                websites or services. The inclusion of any link does not imply
                endorsement, approval, or recommendation by Claru.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You acknowledge and agree that Claru shall not be responsible or
                liable, directly or indirectly, for any damage or loss caused or
                alleged to be caused by or in connection with the use of or
                reliance on any third-party content, goods, or services
                available on or through any such websites or services.
              </p>
            </section>

            {/* Section 12: Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                12. Disclaimer of Warranties
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4 uppercase font-mono text-sm bg-[var(--bg-secondary)] p-4 border border-[var(--border-subtle)]">
                THE SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND
                &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT ANY WARRANTIES OF ANY
                KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                To the fullest extent permitted by applicable law, Claru
                disclaims all warranties, express or implied, including but not
                limited to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Implied warranties of merchantability and fitness for a
                  particular purpose
                </li>
                <li>Warranties of non-infringement or title</li>
                <li>
                  Warranties that the Services will be uninterrupted, secure,
                  error-free, or free of viruses or other harmful components
                </li>
                <li>
                  Warranties regarding the accuracy, reliability, or
                  completeness of any information provided through the Services
                </li>
              </ul>
            </section>

            {/* Section 13: Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                13. Limitation of Liability
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4 uppercase font-mono text-sm bg-[var(--bg-secondary)] p-4 border border-[var(--border-subtle)]">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLARU SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                PUNITIVE, OR EXEMPLARY DAMAGES ARISING OUT OF OR RELATING TO
                YOUR USE OF THE SERVICES.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                This includes, but is not limited to, damages for loss of
                profits, goodwill, use, data, or other intangible losses, even
                if Claru has been advised of the possibility of such damages.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                In no event shall Claru&apos;s total liability to you for all
                claims arising out of or relating to the Services exceed the
                greater of (a) the amounts paid by you to Claru in the twelve
                (12) months preceding the claim, or (b) one hundred U.S. dollars
                ($100).
              </p>
            </section>

            {/* Section 14: Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                14. Indemnification
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You agree to defend, indemnify, and hold harmless Claru and its
                officers, directors, employees, agents, licensors, and service
                providers from and against any claims, liabilities, damages,
                judgments, awards, losses, costs, expenses, or fees (including
                reasonable attorneys&apos; fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Your violation of these Terms</li>
                <li>
                  Your violation of any third-party rights, including
                  intellectual property or privacy rights
                </li>
                <li>Your Content or any data you provide to the Services</li>
                <li>
                  Any activity conducted through your account, whether or not
                  authorized by you
                </li>
                <li>Your use or misuse of the Services</li>
              </ul>
            </section>

            {/* Section 15: Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                15. Governing Law
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                These Terms and any dispute or claim arising out of or in
                connection with them or their subject matter or formation
                (including non-contractual disputes or claims) shall be governed
                by and construed in accordance with the laws of the State of
                Delaware, United States, without regard to its conflict of law
                provisions.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You agree to submit to the exclusive jurisdiction of the state
                and federal courts located in Delaware for the resolution of any
                disputes arising out of or relating to these Terms or the
                Services, subject to the arbitration provisions below.
              </p>
            </section>

            {/* Section 16: Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                16. Dispute Resolution
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                <strong className="text-[var(--text-primary)]">
                  Informal Resolution:
                </strong>{" "}
                Before filing a claim, you agree to first contact us at{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>{" "}
                and attempt to resolve the dispute informally for at least
                thirty (30) days before initiating any arbitration or court
                proceeding.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                <strong className="text-[var(--text-primary)]">
                  Binding Arbitration:
                </strong>{" "}
                If we are unable to resolve the dispute informally, any dispute,
                controversy, or claim arising out of or relating to these Terms
                shall be resolved by binding arbitration administered in
                accordance with the rules of the American Arbitration
                Association. The arbitration shall be conducted in Delaware, and
                judgment on the arbitration award may be entered in any court
                having jurisdiction thereof.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Notwithstanding the foregoing, either party may seek injunctive
                or other equitable relief in any court of competent jurisdiction
                to protect its intellectual property rights.
              </p>
            </section>

            {/* Section 17: Class Action Waiver */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                17. Class Action Waiver
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4 uppercase font-mono text-sm bg-[var(--bg-secondary)] p-4 border border-[var(--border-subtle)]">
                YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE
                CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS,
                CONSOLIDATED, OR REPRESENTATIVE ACTION.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You waive any right to bring claims as a plaintiff or class
                member in any class action, collective action, or representative
                proceeding. The arbitrator may not consolidate more than one
                person&apos;s claims and may not preside over any form of class
                or representative proceeding.
              </p>
            </section>

            {/* Section 18: Force Majeure */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                18. Force Majeure
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Claru shall not be liable for any failure or delay in performing
                its obligations under these Terms where such failure or delay
                results from circumstances beyond our reasonable control,
                including but not limited to acts of God, natural disasters,
                war, terrorism, riots, embargoes, acts of civil or military
                authorities, fire, floods, accidents, pandemics, strikes, labor
                disputes, equipment failures, internet or telecommunications
                failures, or shortages of transportation, facilities, fuel,
                energy, labor, or materials.
              </p>
            </section>

            {/* Section 19: Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                19. Changes to Terms
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time at our
                sole discretion. If we make material changes to these Terms, we
                will notify you by posting the updated Terms on the Services and
                updating the &ldquo;Last Updated&rdquo; date at the top of this
                page.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We may also provide additional notice, such as sending you an
                email notification. Your continued use of the Services after the
                effective date of any changes constitutes your acceptance of the
                revised Terms.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If you do not agree to the modified Terms, you must stop using
                the Services and, if applicable, cancel your account.
              </p>
            </section>

            {/* Section 20: Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                20. Contact Us
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                If you have any questions, concerns, or feedback about these
                Terms of Service, please contact us:
              </p>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 font-mono text-sm">
                <p className="text-[var(--text-primary)] mb-2">
                  <span className="text-[var(--accent-primary)]">$</span> Email:{" "}
                  <a
                    href="mailto:support@claru.ai"
                    className="text-[var(--accent-primary)] hover:underline"
                  >
                    support@claru.ai
                  </a>
                </p>
                <p className="text-[var(--text-primary)] mb-2">
                  <span className="text-[var(--accent-primary)]">$</span>{" "}
                  Company: Reka AI Inc.
                </p>
                <p className="text-[var(--text-primary)]">
                  <span className="text-[var(--accent-primary)]">$</span> DBA:
                  Claru AI
                </p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="border-t border-[var(--border-subtle)] pt-8">
              <p className="text-[var(--text-tertiary)] leading-relaxed text-sm italic">
                By using our Services, you acknowledge that you have read these
                Terms of Service, understand them, and agree to be bound by
                them. If you are using the Services on behalf of an
                organization, you are agreeing to these Terms for that
                organization and representing that you have the authority to
                bind that organization to these Terms.
              </p>
            </section>
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
