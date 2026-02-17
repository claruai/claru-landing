import type { Metadata } from "next";
import Logo from "../components/ui/Logo";

export const metadata: Metadata = {
  title: "Job Applicant Privacy Policy - Claru",
  description:
    "Job Applicant Privacy Policy for Claru - How we collect, use, and protect personal data of job applicants under UK, Canada, and US data protection laws.",
  openGraph: {
    title: "Job Applicant Privacy Policy - Claru",
    description:
      "Learn how Claru collects, uses, and protects personal data of job applicants under UK, Canada, and US data protection laws.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JobApplicantPrivacy() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)]">
        <div className="container py-6">
          <a href="/">
            <Logo size="sm" className="text-[var(--text-primary)]" />
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            Job Applicant Privacy Policy
          </h1>
          <p className="text-[var(--text-tertiary)] font-mono mb-12">
            Last updated: January 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                As part of any recruitment process, Reka AI Inc., doing
                business as Claru AI, and its affiliated groups (&quot;the
                Company,&quot; &quot;we,&quot; &quot;us&quot;, or
                &quot;our&quot;), collect, store, and process personal data
                relating to job applicants. We are committed to being
                transparent about how we collect and use that data and to
                meeting our data protection obligations under applicable privacy
                laws in the United Kingdom (UK), Canada, and the United States
                (US).
              </p>
            </section>

            {/* When This Notice Applies */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                When This Notice Applies
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                When you apply for a job with us, either directly using our
                online application system or through a job site or similar
                online application partner, this Privacy Notice governs how we
                process your personal information. By applying for a job with us
                or otherwise providing us with your personal information, you
                consent to the collection, use and disclosure of your personal
                information as set out in this Privacy Notice.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                However, please note that if you do use a third-party job site
                or similar online application partner to apply for a position
                with us, we are not responsible for how these third parties
                handle your personal information, and any handling of your
                information by these partners will be governed by their
                respective privacy policies. We encourage you to review the
                privacy policies of any third-party websites you use to apply
                for positions with us prior to submitting an application through
                them.
              </p>
            </section>

            {/* How We Collect and Use Your Personal Information */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                How We Collect and Use Your Personal Information
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We collect and process some or all of the following types of
                information to manage the recruitment process, assess and
                confirm suitability for employment, and decide whom to offer a
                job.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                More specifically, we use information held about you for the
                following purposes:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 mb-6">
                <li>
                  To consider your application in respect of a role for which
                  you have applied.
                </li>
                <li>
                  To consider your application in respect of other roles to fill
                  the Company&apos;s job openings.
                </li>
                <li>
                  To communicate with you in respect of the recruitment process.
                </li>
                <li>To monitor recruitment statistics.</li>
                <li>
                  To carry out our obligations and exercise specific rights in
                  relation to employment.
                </li>
                <li>To respond to and defend against legal claims.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Information We Collect From You
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We collect the following types of personal information directly
                from you:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-3 mb-6">
                <li>
                  Information that you provide when you apply for a role. This
                  includes information provided through an online job site or
                  other third-party application partner, via email, in person at
                  interviews, and/or by any other method.
                </li>
                <li>
                  In particular, we process personal details such as name, email
                  address, address, telephone number, qualifications,
                  experience, information relating to your employment history,
                  and skills you provide to us. If you conduct your interview
                  using the Video Interview feature, this includes video
                  recordings.
                </li>
                <li>
                  Where such information is volunteered directly by the
                  candidate, we may collect special categories of data, such as
                  information about ethnic origin, sexual orientation, or
                  religion or belief. This information is only used to monitor
                  recruitment statistics, and candidates are never required to
                  provide it.
                </li>
                <li>
                  Information regarding whether or not you have a disability for
                  which the Company needs to make reasonable adjustments or
                  provide accommodations during the recruitment process.
                </li>
                <li>
                  If you contact us, we may keep a record of that
                  correspondence.
                </li>
                <li>
                  A record of your progress through any hiring process that we
                  may conduct.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Information We Collect from Other Sources
              </h3>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-3 mb-6">
                <li>
                  Our online application partners provide us with the facility
                  to link any information you or they provide to us with other
                  publicly available information about you that you have
                  published on the Internet, including sources such as LinkedIn
                  and other social media profiles.
                </li>
                <li>
                  We may receive information about you from a third party who
                  recommends you as a candidate for a specific job opening or
                  for our business more generally.
                </li>
                <li>
                  We may also collect information about you from the employment
                  references that you provide to us.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Automated Decision-Making/Profiling
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We may use technology provided by our partners and service
                providers to select appropriate candidates for us to consider
                based on criteria expressly identified by us or typical in
                relation to the role for which you have applied. However, we do
                not rely on fully automated tools to make hiring decisions; any
                final decision as to whom we will engage to fill the job opening
                will be made by our staff.
              </p>
            </section>

            {/* How We Share Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                How We Share Your Information
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                <strong>Service providers.</strong> We use third-party service
                providers to help us manage and administer the recruitment
                process. These service providers process your information only
                on our behalf to provide us with services. This includes the
                service provider that hosts our online application system.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                When we share your information to our third-party service
                providers, we ensure that they only use it in accordance with
                our instructions or as otherwise required by law.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                <strong>Third-party application partners.</strong> If you apply
                for a job with us via a job site or similar online application
                partner, we may share limited personal information with them
                regarding the progress of your application. As set out above, we
                are not responsible for how these third parties handle such
                information after we share it with them.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                <strong>Employment references and background checks.</strong> We
                will not share your data with any other third parties unless
                your application for employment is successful and we make you an
                offer of employment. At that stage, we may share your personal
                information with (a) former employers to obtain references and
                (b) with additional service providers, such as background check
                providers.
              </p>
            </section>

            {/* Our Privacy Practices */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Our Privacy Practices
              </h2>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Security
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We take the security of your data seriously. We have internal
                policies and administrative, technical, and physical controls in
                place to ensure that your data is not lost, accidentally
                destroyed, misused, or disclosed, and is not accessed except by
                our employees in the proper performance of their duties.
                Employees are subject to a duty of confidentiality.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Your information will only be accessed by staff members that
                strictly require access for the purposes of recruitment. This
                includes members of the HR and recruitment team, interviewers
                involved in the recruitment process, managers in the business
                area with a vacancy, and IT staff if access to the data is
                necessary for their role.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                We also have procedures in place to deal with any suspected data
                security breach. We will notify you and any applicable regulator
                of a suspected data security breach where we are legally
                required to do so.
              </p>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Where We Store Your Information
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Your personal information may be transferred to, and stored at,
                a destination outside the UK, European Economic Area (EEA),
                Canada (including outside of your province), or the US. It may
                also be processed by our staff operating in these or other
                countries who work for us or by our suppliers, third-party
                service providers, and Partners for the purposes of fulfilling
                your application, processing of your payment details, or
                providing support services. We use appropriate safeguards to
                ensure that your personal information is protected no matter
                where it is used or stored.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                When your personal information is transferred to a jurisdiction
                outside of your region, it may be subject to the law of that
                foreign jurisdiction, including any law permitting or requiring
                disclosure of the information to the government, government
                agencies, courts and law enforcement in that jurisdiction.
              </p>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                How Long We Keep Your Information
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We only retain your information for as long as necessary to
                fulfill the purposes for which we collected it.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                More specifically, if your application for employment is
                unsuccessful, the Company will hold your data on file for 12
                months after the end of the relevant recruitment process. We may
                hold your data on file for an additional 6 months for future
                employment opportunities, unless you ask us not to do so. At the
                end of that period, or once you withdraw your consent, your data
                is deleted or destroyed. Please see &apos;Your Privacy Rights
                and Choices&apos; below for more information on withdrawing
                consent.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If your application for employment is successful, personal data
                gathered during the recruitment process will be transferred to
                your Human Resources file and retained during your employment in
                accordance with applicable law.
              </p>
            </section>

            {/* Your Privacy Rights and Choices */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Your Privacy Rights and Choices
              </h2>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Accessing and Correcting Your Personal Information
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                If you believe that the personal information we maintain about
                you is not accurate or up-to-date, you can make a request to
                correct it by writing to us using the contact information set
                out below under &apos;Contact Us.&apos; You may also request
                access to and request to obtain a copy of the personal
                information that we maintain about you by writing to us.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                We may need to verify your identity or obtain more information
                before responding to your request. In some cases, our legal
                obligations will prevent us from granting a request for access
                to or correction or personal information. We will inform you in
                writing of the reasons for any such decision.
              </p>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Withdrawing Your Consent
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You are under no legal obligation to provide us with your
                personal information during the recruitment process. However, if
                you do not provide the information, we may not be able to
                process your application properly or at all.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                If you wish to withdraw your consent to the Company maintaining
                your information for longer than 12 months in the event of an
                unsuccessful application, please contact us in writing using the
                contact information set out below under &apos;Contact Us.&apos;
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Depending on where you live, you may withdraw your consent for
                the collection, use, or disclosure of your personal information
                at any time by contacting us directly. However, withdrawing
                consent will affect our ability to process your application or
                consider you for a position.
              </p>
            </section>

            {/* Additional Information for Specific Regions */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Additional Information for Specific Regions
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                Depending on where you live, you may be able to exercise
                additional privacy rights, as set out below. To exercise these
                rights, contact us using the information set out below under
                &apos;Contact Us.&apos;
              </p>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                United States (US)
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                US residents of certain states have specific additional rights
                under applicable laws.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                California residents have the right to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 mb-4">
                <li>
                  Know what personal data we collect, use, share, or sell.
                </li>
                <li>Request the deletion of your personal information.</li>
                <li>Opt-out of the sale or sharing of personal data.</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                Similar rights may apply under state laws in Colorado, Virginia,
                Connecticut, and Utah.
              </p>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                European Economic Area (EEA) and United Kingdom (UK)
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Under the GDPR and UK GDPR, we rely on the following legal bases
                for processing:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 mb-4">
                <li>
                  <strong>Legitimate Interests:</strong> Recruitment and
                  candidate evaluation.
                </li>
                <li>
                  <strong>Consent:</strong> For processing special category data
                  such as diversity monitoring.
                </li>
                <li>
                  <strong>Contractual Necessity:</strong> For pre-employment
                  checks and onboarding.
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                If you are located in the UK or EEA, you have additional rights
                under the General Data Protection Regulation (GDPR) or UK GDPR:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 mb-6">
                <li>
                  <strong>Deletion and restriction:</strong> You may request
                  deletion of, or restrictions on the processing of, your
                  personal information where it is no longer necessary, subject
                  to certain exceptions.
                </li>
                <li>
                  <strong>Objection:</strong> You may object to the processing
                  of your data where we rely on legitimate interests as the
                  legal basis for processing.
                </li>
                <li>
                  <strong>Data portability:</strong> You may request a copy of
                  your personal information in a structured, commonly used, and
                  machine-readable format.
                </li>
                <li>
                  <strong>Data Protection Officer:</strong> While we may not be
                  required to appoint a Data Protection Officer, you can contact
                  us with any data protection inquiries at{" "}
                  <a
                    href="mailto:support@claru.ai"
                    className="text-[var(--accent-primary)] hover:underline"
                  >
                    support@claru.ai
                  </a>
                </li>
                <li>
                  <strong>Complaints:</strong> You have the right to lodge a
                  complaint with your local data protection authority if you
                  believe we have violated applicable data protection laws.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Quebec
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                If you are located in Quebec, you may exercise the following
                additional rights:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
                <li>
                  <strong>Deletion and restriction:</strong> Request deletion
                  of, or restrictions on the processing of, your personal
                  information where it is no longer necessary, subject to
                  certain exceptions.
                </li>
                <li>
                  <strong>Data portability:</strong> You may request a copy of
                  your personal information in a structured, commonly used, and
                  machine-readable format.
                </li>
              </ul>
            </section>

            {/* Updates to this Notice */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Updates to this Notice
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We may update this Privacy Notice from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any significant
                changes by updating the date at the top of this Privacy Policy
                and, if required, through additional notifications (e.g., via
                email).
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Contact Us
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                All questions, comments and requests regarding this Privacy
                Notice should be addressed to{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Please reach out to us directly if you have any concerns
                regarding our handling of your information and we will do our
                best to resolve them. However, if you believe that that we have
                not complied with your data protection rights, you can complain
                to the relevant regulatory authority:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
                <li>
                  <strong>UK:</strong> Information Commissioner&apos;s Office
                  (ICO).
                </li>
                <li>
                  <strong>Canada:</strong> Office of the Privacy Commissioner of
                  Canada or equivalent provincial regulators in Alberta, Quebec,
                  or British Columbia (as applicable).
                </li>
                <li>
                  <strong>US:</strong> Applicable state privacy authority.
                </li>
              </ul>
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
      </main>
    </div>
  );
}
