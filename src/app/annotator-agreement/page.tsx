import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";

export const metadata: Metadata = {
  title: "Annotator Master Services Agreement - Claru",
  description:
    "Annotator Master Services Agreement for annotators and service providers on the Claru AI platform by Reka AI, Inc. (d/b/a Claru AI).",
  alternates: {
    canonical: "/annotator-agreement",
  },
  openGraph: {
    title: "Annotator Master Services Agreement - Claru",
    description:
      "Annotator Master Services Agreement for annotators and service providers on the Claru AI platform.",
    type: "website",
  },
};

export default function MasterServicesAgreement() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      {/* Content */}
      <main className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Annotator Master Services Agreement
          </h1>
          <p className="text-[var(--text-tertiary)] font-mono text-sm mb-2">
            Reka AI, Inc. (d/b/a Claru AI)
          </p>
          <p className="text-[var(--text-tertiary)] font-mono text-sm mb-12">
            Effective upon acceptance
          </p>

          {/* Acceptance Notice */}
          <div className="mb-10 p-4 uppercase font-mono text-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              PLEASE READ THIS MASTER SERVICES AGREEMENT
              (&ldquo;AGREEMENT&rdquo;) CAREFULLY BEFORE ACCEPTING. BY CLICKING
              &ldquo;I ACCEPT&rdquo; OR BY ACCESSING OR USING THE CLARU AI
              PLATFORM, YOU (&ldquo;PROVIDER&rdquo;) AGREE TO BE BOUND BY THE
              TERMS AND CONDITIONS OF THIS AGREEMENT.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-10">
            {/* Preamble */}
            <section>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This Annotator Master Services Agreement (&ldquo;Agreement&rdquo;) is
                entered into as of the date you click &ldquo;I Accept&rdquo; or
                first access any of Customer&apos;s platforms, whichever occurs
                first (&ldquo;Effective Date&rdquo;), by and between Reka AI
                Inc. (doing business as &ldquo;Claru AI&rdquo; and other trade
                names and brands), whose principal office
                is located at 530 Lawrence Expy, PMB 9004, Sunnyvale, CA
                94085 (together with its affiliates, successors, and assigns,
                and including all current and future websites, domains, and
                platforms operated by it, including but not limited to
                claru.ai, and any derivative or related domains, collectively
                referred to as &ldquo;Customer&rdquo;), and you as Provider
                (&ldquo;Provider&rdquo;).
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                In consideration of the agreements of the parties set forth
                below, and for other good and valuable consideration, the
                receipt and sufficiency of which are hereby acknowledged,
                Customer and Provider agree as follows:
              </p>
            </section>

            {/* Section 1: Services */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                1. Services
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                1.1 Statements of Work
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Each project offered through the Claru AI platform, when
                accepted by Provider, shall constitute a &ldquo;Statement of
                Work&rdquo; for purposes of this Agreement. A Statement of Work
                comes into existence at the moment Provider accepts a project
                through the platform and consists of:
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                (a) All project details, requirements, and specifications
                displayed on the platform at the time of acceptance, including
                but not limited to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>Project description and objectives</li>
                <li>Required deliverables</li>
                <li>Quality standards and acceptance criteria</li>
                <li>Timeline and deadlines</li>
                <li>Compensation terms</li>
                <li>Any project-specific requirements or terms</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                (b) Upon Provider&apos;s acceptance of a project through the
                platform:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>
                  The project details become a binding Statement of Work
                </li>
                <li>
                  Such Statement of Work forms a part of this Agreement
                </li>
                <li>
                  Such Statement of Work becomes subject to all terms and
                  conditions hereof
                </li>
                <li>
                  Provider becomes bound to deliver according to the
                  specifications
                </li>
                <li>
                  Customer becomes bound to compensate according to the terms
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                (c) All aspects of Statement of Work execution occur through the
                platform, including:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>Work submission</li>
                <li>Review and acceptance</li>
                <li>Payment processing</li>
                <li>Communications</li>
                <li>Record keeping</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Each Statement of Work incorporates by reference all platform
                terms, policies, and procedures in effect at the time of project
                acceptance.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                1.2 Services and Deliverables
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider shall perform the services specified in each accepted
                project through the platform (the &ldquo;Services&rdquo;) in
                accordance with the terms and conditions of this Agreement and
                in a timely, diligent, and professional manner consistent with
                the highest standards within Provider&apos;s industry. If any
                tasks or responsibilities are reasonably required for proper
                completion of a project, even if not explicitly described, they
                shall be deemed included within the scope of Services. Provider
                shall complete and deliver through the platform all deliverables
                and materials required by each accepted project
                (&ldquo;Deliverables&rdquo;) in accordance with specified
                timelines and formats. Time is of the essence in the performance
                of Services and delivery of Deliverables. Provider agrees to
                provide their own equipment, tools and other materials necessary
                to complete the Services, unless otherwise specified in the
                project details.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                1.3 Provider Personnel
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider represents that they have the education, training, and
                qualifications necessary to perform the Services. If Provider
                engages any personnel or assistants (where permitted by the
                project terms), Provider will ensure all such personnel are
                properly qualified for their assigned tasks. Customer reserves
                the right to reject work performed by Provider or any of
                Provider&apos;s personnel and to restrict or prohibit specific
                personnel from working on future projects, in Customer&apos;s
                sole discretion.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                1.4 Compliance
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Provider shall perform all Services and provide all Deliverables
                in compliance with (a) all applicable laws, rules, and
                regulations; (b) all platform policies, quality standards, and
                guidelines published by Customer; (c) all project-specific
                requirements displayed through the platform; and (d) any
                additional instructions provided through the platform&apos;s
                messaging system.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Provider shall implement and maintain appropriate technical and
                organizational measures to protect Customer&apos;s Confidential
                Information and data, including but not limited to: (i)
                maintaining a secure working environment; (ii) using up-to-date
                antivirus software; (iii) encrypting any local storage of
                Customer data; (iv) not accessing the platform from public or
                unsecured networks; and (v) immediately reporting any data
                breaches or security incidents that may affect Customer&apos;s
                data or platform security.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider is responsible for maintaining awareness of current
                platform policies and guidelines, which Customer may update from
                time to time. Provider shall be solely responsible for any acts
                or omissions in the performance of Services, whether by Provider
                or any permitted assistants.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                1.5 Subcontracting and Account Sharing
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider may not subcontract, delegate, or share account access
                with any other person without Customer&apos;s prior written
                approval. Each platform account is personal to the Provider who
                created it. Sharing account credentials, allowing others to
                perform work under Provider&apos;s account, or submitting work
                performed by others as Provider&apos;s own constitutes a
                material breach of this Agreement, permitting Customer to
                immediately terminate Provider&apos;s platform access without
                opportunity to cure. If Customer authorizes Provider to engage
                assistants for any project, Provider remains fully responsible
                for all work submitted and must ensure all such assistants
                comply with this Agreement&apos;s terms.
              </p>
            </section>

            {/* Section 2: Fees; Audit; Insurance; Taxes */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                2. Fees; Audit; Insurance; Taxes
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                2.1 Fees
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                As compensation for Services performed, Customer shall pay
                Provider the fee(s) displayed and accepted through the Claru AI
                platform for each project. Payment processing begins upon
                Customer&apos;s acceptance of completed Deliverables through the
                platform and occurs according to the platform&apos;s payment
                schedule, not to exceed sixty (60) days from acceptance. The
                platform maintains records of all accepted projects, completed
                work, and payments. Provider shall be responsible for all
                expenses incurred in performing Services unless otherwise
                specified in the project details. Fees are fixed upon project
                acceptance and not subject to increase. All payments are subject
                to successful completion and acceptance of work according to
                project specifications and quality requirements as defined in
                the platform.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                2.2 Records and Audit
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The platform maintains records of all projects, work performed,
                and payments. For a period beginning on the Effective Date
                through one (1) year after Provider&apos;s last completed
                project, Provider shall, upon reasonable notice, provide
                Customer with access to any additional business records
                necessary to verify compliance with this Agreement, particularly
                compliance with Sections 4 (Confidentiality) and 5
                (Intellectual Property). If any audit reveals overpayment,
                Provider shall promptly refund such amount. If overpayment
                exceeds five percent (5%) of the correct amount, Provider shall
                reimburse Customer&apos;s audit costs.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                2.3 Insurance
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                During the Term and for one (1) year thereafter, Provider shall
                maintain appropriate insurance coverage as specified in the
                platform&apos;s provider requirements, which may include
                professional liability, errors and omissions, or other relevant
                coverage based on the types of services Provider offers through
                the platform. Customer may request certificates of insurance as
                part of Provider&apos;s platform qualification process.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                2.4 Taxes
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider acknowledges and agrees that it shall be Provider&apos;s
                obligation to report as income all compensation received by
                Provider pursuant to this Agreement and to pay any withholding
                taxes, self-employment taxes, and social security, unemployment
                or disability insurance or similar items, including interest and
                penalties thereon, in connection with any payments made to
                Provider by Customer pursuant to this Agreement, including any
                Statement of Work. Provider agrees to indemnify, hold harmless
                and, at Provider&apos;s discretion, defend Customer against any
                and all liability related thereto, including, without
                limitation, any taxes, penalties and interest Provider may be
                required to pay as a result of Provider&apos;s failure to report
                such compensation or make such payments.
              </p>
            </section>

            {/* Section 3: Acceptance of Deliverables */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                3. Acceptance of Deliverables
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The following acceptance procedures apply to all Deliverables
                submitted through the platform: Customer shall have thirty (30)
                days from submission to review and evaluate each Deliverable
                against project requirements. If Customer does not accept a
                Deliverable, Customer will provide feedback through the platform
                specifying required improvements (&ldquo;Revision
                Request&rdquo;). Provider shall have five (5) days following a
                Revision Request to submit a corrected Deliverable through the
                platform. If Customer does not accept the corrected Deliverable,
                Customer may either (a) grant Provider additional time for
                corrections through the platform, or (b) reject the Deliverable
                and terminate the project. Repeated quality issues may affect
                Provider&apos;s platform status and project access.
              </p>
            </section>

            {/* Section 4: Confidential Information */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                4. Confidential Information
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                4.1 Confidential Information
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Each party (&ldquo;Recipient&rdquo;) acknowledges that it may
                receive Confidential Information (as defined below) of the other
                party (&ldquo;Discloser&rdquo;) in connection with the
                performance or receipt (as applicable) of Services under this
                Agreement. For purposes of this Agreement, &ldquo;Confidential
                Information&rdquo; means any and all information and materials
                of or related to Discloser that are disclosed during the term of
                this Agreement (whether in writing, or in oral, graphic,
                electronic or any other form) by or on behalf of Discloser to
                Recipient under circumstances that would indicate to a
                reasonable person that such information or materials are
                confidential or proprietary.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Without limiting the foregoing, Customer&apos;s Confidential
                Information includes: (a) any trade secrets, know-how, ideas,
                inventions, processes, techniques, algorithms, software (in
                source code and object code form), hardware, devices, designs,
                schematics, drawings, formulae, data, plans, strategies and
                forecasts of Customer and its employees, consultants, investors,
                licensors, contractors (excluding Provider), customers and
                clients; and (b) any technical, engineering, manufacturing,
                product, marketing, servicing, financial, personnel and other
                information and materials of Customer and its employees,
                consultants, investors, licensors, contractors (excluding
                Provider), customers, and clients.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Provider specifically acknowledges that the nature, quality, and
                characteristics of Customer&apos;s data labeling requirements,
                annotation guidelines, quality metrics, and platform
                functionality constitute valuable trade secrets of Customer.
                Provider shall not use any knowledge gained through the platform
                to: (a) develop similar annotation guidelines or requirements;
                (b) advise others on data labeling best practices; or (c)
                publish or share information about Customer&apos;s annotation
                methodologies or requirements.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider acknowledges that all information accessed through the
                platform constitutes Confidential Information, including but not
                limited to: project details, client information, annotation
                guidelines, training materials, quality standards, other
                providers&apos; work, platform features and functionality, and
                any data or content provided for annotation or processing.
                Provider&apos;s platform login credentials are also Confidential
                Information and must be kept secure.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                4.2 Nondisclosure and Limited Use
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Recipient shall: (a) hold the Confidential Information of
                Discloser in trust and confidence; (b) use the Confidential
                Information of Discloser only for the benefit of Discloser (and
                not for the benefit of Recipient or any third party); (c) not
                use the Confidential Information of Discloser in any manner or
                for any purpose not expressly set forth in this Agreement; (d)
                reproduce the Confidential Information of Discloser only to the
                extent reasonably required to exercise Recipient&apos;s rights
                or fulfill Recipient&apos;s obligations hereunder; and (e) not
                disclose or otherwise make available to any third party,
                directly or indirectly, any Confidential Information of
                Discloser without Discloser&apos;s prior written approval.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Recipient may disclose the Confidential Information of Discloser
                only to those Recipient employees that have a need to know such
                Confidential Information for purposes of exercising
                Recipient&apos;s rights or fulfilling Recipient&apos;s
                obligations hereunder, and that are obligated by a written
                agreement to comply with confidentiality provisions equivalent
                in scope to and no less restrictive than those set forth in this
                Agreement. Recipient shall take at least the same degree of care
                that it uses to protect its own confidential and proprietary
                information of similar nature and importance (but in no event
                less than reasonable care) to protect the confidentiality and
                avoid the unauthorized use or disclosure of the Confidential
                Information of Discloser.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The obligations of this Section 4.2 shall survive any expiration
                or termination of this Agreement for a period of five (5) years
                from the date of such expiration or termination.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                4.3 Scope
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                The obligations set forth in Section 4.2 above shall not apply
                with respect to any Confidential Information of Discloser to the
                extent such Confidential Information: (a) is or has become
                generally publicly known other than by any act or omission of
                Recipient; (b) was rightfully known by Recipient prior to the
                time of first disclosure to Recipient by Discloser; (c) is
                rightfully obtained without restriction from a third party who
                has the right to make such disclosure and without breach of any
                duty of confidentiality to Discloser; or (d) is independently
                developed by Recipient without use of, reliance upon or
                reference to any Confidential Information of Discloser.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Additionally, (i) nothing in this Section 4 will restrict the
                use or disclosure by Customer of any Confidential Information of
                Provider in a manner consistent with the rights and licenses
                granted hereunder, including disclosures to any licensees or
                sublicensee(s); and (ii) Recipient may use or disclose
                Discloser&apos;s Confidential Information (x) to the extent
                approved in writing in advance by Discloser; (y) to the extent
                Recipient is legally compelled to disclose such Confidential
                Information, including by a court or by the rules of a
                nationally-recognized stock exchange, provided that prior to any
                such compelled disclosure, Recipient shall give Discloser
                reasonable advance written notice of such anticipated disclosure
                and shall cooperate with Discloser in protecting against any
                such disclosure and/or obtaining a protective order narrowing
                the scope of such disclosure and/or use of the Confidential
                Information; or (z) in confidence, to legal counsel or to
                accountants, banks, and financing sources and their respective
                advisors, who are bound by duties of confidentiality comparable
                to those set forth in this Agreement.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                4.4 Equitable Relief
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Recipient recognizes that its breach or threatened breach of
                this Section 4 may cause Discloser irreparable harm and
                significant injury, the amount of which may be extremely
                difficult to estimate and ascertain, thus making inadequate any
                remedy at law or in damages. Therefore, Recipient agrees that
                Discloser shall be entitled to seek the issuance of injunctive
                relief by any court of competent jurisdiction enjoining any
                threatened or actual breach of this Section 4 and for any other
                relief such court deems appropriate. This right shall be in
                addition to any other remedy or remedies available at law or in
                equity.
              </p>
            </section>

            {/* Section 5: Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                5. Intellectual Property
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                5.1 Work Product
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                As used in this Agreement, &ldquo;Work Product&rdquo; means,
                collectively, all data collected by Provider under this
                Agreement (&ldquo;Collected Data&rdquo;), discoveries, ideas,
                inventions, concepts, developments, know-how, trade secrets,
                works of authorship, materials, software (in both object code
                and source code forms), HTML, writings, drawings, designs,
                processes, techniques, formulas, data and any annotations
                thereof, specifications, technology, patent applications (and
                contributions thereto), and other creations (and any
                improvements or modifications to the foregoing or to any of
                Customer&apos;s Confidential Information), whether or not
                patentable relating to this Agreement, performance of the
                Services or development of the Deliverables, or that result from
                or are related to such Services, that are conceived, created or
                otherwise developed by or on behalf of Provider under or in
                connection with this Agreement.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Work Product shall include all Deliverables and other materials
                delivered to Customer under or in connection with this
                Agreement. &ldquo;Work Product&rdquo; includes all annotations,
                labels, classifications, analyses, and other output Provider
                creates through the platform, along with any associated notes,
                explanations, or documentation. All Work Product must be
                submitted exclusively through the platform&apos;s designated
                interfaces and tools.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                5.2 Assignment
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Provider agrees to disclose all Work Product to Customer
                promptly and in writing, including in both source code and
                object code format, as applicable. Provider hereby irrevocably
                assigns and agrees to assign to Customer all right, title and
                interest worldwide in and to such Work Product (whether
                currently existing or conceived, created or otherwise developed
                later), including all copyrights, trademarks, trade secrets,
                patents, industrial rights and all other intellectual and
                proprietary rights related thereto (the &ldquo;Proprietary
                Rights&rdquo;), effective immediately upon the inception,
                conception, creation or development thereof.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                The Proprietary Rights include all rights, whether existing now
                or in the future, whether statutory or common law, in any
                jurisdiction in the world, related to the Work Product, together
                with all national, foreign and state registrations, applications
                for registration and all renewals and extensions thereof; and
                all goodwill associated therewith.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Provider irrevocably waives any moral rights or other rights
                with respect to attribution of authorship or integrity of such
                Work Product, which rights Provider may have under any
                applicable law under any legal theory. Provider hereby waives
                and quitclaims to Customer any and all claims that Provider now
                has or may hereafter have for infringement of any Work Product
                or Proprietary Rights assigned and/or licensed hereunder to
                Customer.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Provider will not contest, or assist others in contesting the
                validity of Customer&apos;s ownership of any Work Product or
                Proprietary Rights. Without limiting Section 6.2(b), Provider
                represents and warrants that it has obtained, from any
                employees, independent contractors, or other personnel that it
                has engaged or employed, any assignments, licenses, releases,
                consents, approvals or rights that enable Provider to perform
                the assignment in this Section.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider acknowledges that all Work Product belongs exclusively
                to Customer from the moment of creation, and Provider has no
                right to use, modify, or access such Work Product outside the
                platform or after project completion. Provider waives any rights
                to be named as author or creator of the Work Product and agrees
                that Customer may modify, transform, or adapt the Work Product
                without Provider&apos;s consent or attribution.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                5.3 Background Technology and Third Party Technology
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Work Product shall not be deemed to include, and the assignment
                obligations in Section 5.2 shall not apply to, (a) any
                technology, software, inventions, discoveries, or works of
                authorship owned by Provider and conceived, created or reduced
                to practice by or for Provider (alone or with others), otherwise
                than in connection with the Services and the Deliverables, prior
                to the earlier of the Effective Date or commencement of
                Provider&apos;s contractor arrangement with Customer
                (collectively, &ldquo;Background Technology&rdquo;); or (b) any
                software or materials owned or controlled by a third party
                (&ldquo;Third Party Technology&rdquo;).
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                To the extent any Background Technology and/or Third Party
                Technology is incorporated into or otherwise included in, or is
                necessary or desirable for the use or exploitation of, any
                Deliverable or other Work Product (such Background Technology,
                &ldquo;Incorporated Background Technology&rdquo;), Provider
                hereby grants to Customer and the Customer Affiliates a
                perpetual, irrevocable, nonexclusive, fully paid-up,
                royalty-free, transferable, sublicensable (through multiple
                tiers), worldwide right and license to access, execute,
                reproduce, distribute, display and perform (whether publicly or
                otherwise) such Background Technology and Third Party
                Technology, and make, have made, sell, offer to sell, import and
                otherwise use and exploit all or any portion of such Background
                Technology and Third Party Technology any products or services
                that use, embody, or incorporate such Background Technology and
                Third Party Technology.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Except as otherwise expressly provided herein, Provider shall
                obtain, at its own expense, any third party licenses or other
                consents necessary for the performance of the Services
                (including any licenses with respect to Third Party Technology).
                &ldquo;Customer Affiliates&rdquo; means any entity controlling,
                controlled by, or under common control with Customer.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                5.4 AI Training Data and Model Rights
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Any data annotations, labels, classifications, or other work
                performed by Provider may be used by Customer to train
                artificial intelligence or machine learning models. Provider
                acknowledges and agrees that: (a) Customer owns all rights in
                any such models or systems trained using Provider&apos;s Work
                Product; (b) Provider has no rights or interest in any models,
                systems, or derivative works created using Provider&apos;s
                annotations or other Work Product; (c) Provider shall not
                attempt to reverse engineer or extract training data or model
                information from any materials provided through the platform.
              </p>
            </section>

            {/* Section 6: Representations and Warranties */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                6. Representations and Warranties
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                6.1 Customer Representations and Warranties
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Customer represents, warrants and covenants that Customer has
                full power to enter into this Agreement and to perform its
                obligations hereunder.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                6.2 Provider Representations and Warranties
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider represents, warrants and covenants that (a) Provider
                has the full power to enter into this Agreement and to perform
                its obligations hereunder; (b) Provider has the right to grant
                the rights, assignments, and licenses contemplated by this
                Agreement, without the need for any assignments, licenses,
                releases, consents, approvals or immunities not yet obtained;
                (c) the Services, Work Product and Incorporated Background
                Technology shall be free from material errors, bugs and defects
                and shall substantially conform to any specifications and
                documentation therefor that have been agreed upon by the
                parties; (d) unless otherwise set forth in a Statement of Work,
                the Work Product and Incorporated Background Technology shall be
                the original work of Provider; (e) the Services, Work Product
                and Incorporated Background Technology do not contain or
                incorporate (i) any computer code, programs, procedures,
                mechanisms or programming devices that are designed to, or would
                enable Provider or any third party to, disrupt, modify, delete,
                damage, deactivate, disable, harm or otherwise impede the
                operation of the Work Product and Incorporated Background
                Technology, any Customer or end user system, or any other
                associated software, firmware, hardware, computer system or
                network, including any code typically designated to be a virus,
                Trojan horse, or worm; (ii) except as expressly approved in
                advance and in writing by Customer, any computer code, programs,
                procedures, mechanisms or programming devices typically
                designated as &ldquo;open source software&rdquo; and/or
                distributed under any license approved by the Open Source
                Initiative as set forth in www.opensource.org or similar
                licensing or distribution terms; or (iii) any personal data or
                personally identifiable information; and (f) the Services, Work
                Product, Background Technology and Third Party Technology (and
                the exercise of the rights granted herein with respect thereto)
                do not and shall not infringe, misappropriate or violate any
                patent, copyright, trademark, trade secret, publicity, privacy
                or other rights of any third party, and are not and shall not be
                defamatory or obscene and shall be in compliance with any
                applicable laws.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                6.3 Disclaimer
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed uppercase font-mono text-sm bg-[var(--bg-secondary)] p-4 border border-[var(--border-subtle)]">
                EXCEPT AS OTHERWISE EXPRESSLY PROVIDED HEREIN, NEITHER PARTY
                MAKES, AND EACH PARTY HEREBY DISCLAIMS, ANY AND ALL WARRANTIES,
                WHETHER EXPRESS, IMPLIED, OR STATUTORY, RELATED TO THE SUBJECT
                MATTER OF THIS AGREEMENT, INCLUDING ANY IMPLIED WARRANTY OF
                MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                SPECIFICALLY, AND WITHOUT LIMITATION, CUSTOMER HEREBY DISCLAIMS
                ANY AND ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
                WITH RESPECT TO ANY OF CUSTOMER&apos;S CONFIDENTIAL INFORMATION
                OR OTHER INFORMATION OR MATERIALS SUPPLIED BY CUSTOMER TO
                PROVIDER HEREUNDER, INCLUDING WITH RESPECT TO ANY SPECIFICATIONS
                FOR WORK PRODUCT TO BE PROVIDED HEREUNDER.
              </p>
            </section>

            {/* Section 7: Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                7. Indemnification
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                7.1 Provider Indemnity
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider will defend at its expense, indemnify and hold harmless
                Customer and its affiliates, and their respective directors,
                officers, employees, agents, contractors and representatives
                from any loss, liability, damage, award, settlement, judgment,
                fee, cost or expense (including reasonable attorneys&apos; fees
                and costs of suit) arising out of or relating to any third-party
                claim, allegation, action, demand, proceeding or suit against
                any of them that arises out of or relates to (a) any breach by
                Provider of this Agreement (including any Statement of Work) or
                Provider&apos;s warranties, representations, covenants and
                undertakings hereunder; (b) Provider&apos;s or any Provider
                subcontractor&apos;s provision of the Services or Deliverables;
                (c) the gross negligence, fraud, or willful misconduct of
                Provider or Provider&apos;s subcontractors; (d) any deleterious
                effects (including deleterious effects on the performance of
                users&apos; hardware, software and/or devices) caused by any
                Work Product, Incorporated Background Technology or other
                Deliverable; (e) any unauthorized access to Work Product; or (f)
                Provider&apos;s collection or use of Collected Data in violation
                of this Agreement or written instructions provided by Customer.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                7.2 Notice; Cooperation; Settlement
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The indemnified party will promptly notify the indemnifying
                party in writing of any indemnifiable claim and promptly tender
                its defense to the indemnifying party. Any delay in such notice
                will not relieve the indemnifying party from its obligations to
                the extent it is not prejudiced thereby. The indemnified party
                will cooperate with the indemnifying party at the indemnifying
                party&apos;s expense. The indemnifying party may not settle any
                indemnified claim without the indemnified party&apos;s consent.
                The indemnified party may participate in its defense with
                counsel of its own choice at its own expense.
              </p>
            </section>

            {/* Section 8: Term and Termination */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                8. Term and Termination
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                8.1 Term
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This Agreement commences on the Effective Date and continues
                until terminated in accordance with this Section 8.
                Provider&apos;s ability to accept new projects depends on
                maintaining good standing under platform requirements.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                8.2 Platform Access Termination
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Customer may suspend or terminate Provider&apos;s platform
                access and this Agreement:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  At any time without cause upon thirty (30) days&apos; notice
                </li>
                <li>
                  Immediately for: quality issues, misconduct, breach of this
                  Agreement, or violation of platform policies
                </li>
                <li>
                  Upon Provider&apos;s inactivity for ninety (90) days
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                8.3 Project Termination
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Customer may terminate individual projects:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>For convenience with payment for accepted work</li>
                <li>For quality issues or missed deadlines</li>
                <li>For breach of project requirements</li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                8.4 Termination for Cause
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If Provider materially breaches this Agreement or a Statement of
                Work, Customer, at its option, shall have the right to terminate
                this Agreement and/or the applicable Statement(s) of Work by
                written notice to the defaulting party, unless Provider remedies
                the default within thirty (30) days after receipt of written
                notice of such default. Customer may also terminate this
                Agreement immediately (a) for Provider&apos;s breach of Section
                4 hereof, (b) in accordance with Section 3 above, (c) and in
                the event of an incurable breach of this Agreement or a
                Statement of Work.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                8.5 Effect of Termination
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                The termination of this Agreement shall automatically result in
                the termination of all Statements of Work under this Agreement.
                Following the effective date of any expiration or termination of
                any Services under this Agreement, Provider shall, as requested
                and directed by Customer and at Provider&apos;s expense, assist
                Customer and its designees in smoothly transitioning Customer
                and the affected Services and Deliverables to Customer or one or
                more third parties, products and/or services designated by
                Customer. Additionally, upon any termination or expiration
                hereof or at any time upon Customer&apos;s request, Provider
                shall promptly return to Customer all of Customer&apos;s
                Confidential Information and all Work Product (in both object
                code and source code forms, as applicable, and whether complete
                or incomplete). Provider will make Collected Data available to
                Customer via export, download, or some other mutually acceptable
                means.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Sections 2.2, 2.3, 2.4, 4, 5, 6, 7, 9, 10, 11, 12, and 13
                of this Agreement, and this Section 8.5, shall survive any
                expiration or termination of this Agreement. Termination of this Agreement by
                either party shall not act as a waiver of any breach of this
                Agreement and shall not act as a release of either party from
                any liability for breach of such party&apos;s obligations under
                this Agreement. Neither party shall be liable to the other for
                damages of any kind solely as a result of terminating this
                Agreement in accordance with its terms, and termination of this
                Agreement by a party shall be without prejudice to any other
                right or remedy of such party under this Agreement or applicable
                law.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Notwithstanding anything herein to the contrary, to the extent
                that Customer terminates this Agreement for Provider&apos;s
                material breach or based on Customer&apos;s rejection of the
                Deliverables, Customer shall have no further obligations to
                Provider hereunder (including without limitation any payment
                obligations).
              </p>
            </section>

            {/* Section 9: Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                9. Limitation of Liability
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed uppercase font-mono text-sm bg-[var(--bg-secondary)] p-4 border border-[var(--border-subtle)]">
                IN NO EVENT WILL CUSTOMER BE LIABLE TO PROVIDER FOR LOST PROFITS
                OR LOST REVENUE, OR FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                PUNITIVE, EXEMPLARY OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR
                IN CONNECTION WITH THIS AGREEMENT, EVEN IF CUSTOMER HAS BEEN
                ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT WILL
                CUSTOMER&apos;S AGGREGATE LIABILITY ARISING OUT OF OR RELATING
                TO THIS AGREEMENT (REGARDLESS OF THE FORM OF ACTION GIVING RISE
                TO SUCH LIABILITY, WHETHER IN CONTRACT, TORT, OR OTHERWISE)
                EXCEED THE TOTAL AMOUNT OF FEES ACTUALLY PAID BY CUSTOMER TO
                PROVIDER FOR THE SPECIFIC PROJECT GIVING RISE TO THE LIABILITY.
              </p>
            </section>

            {/* Section 10: Electronic Acceptance and Platform Terms */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                10. Electronic Acceptance and Platform Terms
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                10.1 Electronic Agreement and Authorization
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                By clicking &ldquo;I Accept&rdquo; or accessing or using the
                Claru AI platform, Provider:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Acknowledges having read and understood this entire Agreement
                </li>
                <li>
                  Agrees that clicking &ldquo;I Accept&rdquo; constitutes a
                  legally binding electronic signature
                </li>
                <li>
                  Agrees to be bound by all terms and conditions of this
                  Agreement
                </li>
                <li>
                  Represents and warrants that they have the authority to enter
                  into this Agreement
                </li>
                <li>
                  Consents to receive communications from Claru AI
                  electronically
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                10.2 Legal Effect and Record Keeping
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Provider acknowledges that:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  This Agreement has the same force and effect as a physically
                  signed agreement
                </li>
                <li>
                  Provider can access and retain this Agreement electronically
                </li>
                <li>
                  Provider&apos;s acceptance will be stored and maintained by
                  Claru AI
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                10.3 Agreement Modifications
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Updates and Modifications:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Claru AI may update this Agreement from time to time by
                  posting a revised version on the platform
                </li>
                <li>
                  Provider will be notified of material changes to this
                  Agreement
                </li>
                <li>
                  Continued use of the platform after such changes constitutes
                  acceptance of the modified Agreement
                </li>
                <li>
                  If Provider does not agree to any modifications, Provider must
                  cease using the platform
                </li>
              </ul>
            </section>

            {/* Section 11: General Provisions */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                11. General Provisions
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                11.1 Governing Law; Venue
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                This Agreement will be construed in accordance with the laws of
                the State of California without giving effect to any choice of
                law rule that would cause the application of the laws of any
                jurisdiction other than the internal laws of the State of
                California to the rights and duties of the parties. All
                disputes, suits, actions or proceedings relating to this
                Agreement shall be brought solely in the state or federal courts
                located in Santa Clara County, California. Provider hereby
                consents to the exclusive jurisdiction and venue of the State of
                California in connection with any such dispute, suit, action or
                proceeding, and waives any defense of forum inconveniens in
                connection therewith.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed uppercase font-mono text-sm bg-[var(--bg-secondary)] p-4 border border-[var(--border-subtle)]">
                EACH PARTY HEREBY EXPRESSLY WAIVES ANY RIGHT TO A TRIAL BY JURY
                IN ANY ACTION OR PROCEEDING BROUGHT BY OR AGAINST EITHER PARTY
                IN CONNECTION WITH THIS AGREEMENT.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.2 Independent Contractor
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Nothing herein will be construed as creating a partnership, an
                employment relationship, or an agency relationship between the
                parties, or as authorizing either party to act as agent for the
                other. Each party is at all times acting and performing as an
                independent contractor with respect to the other party.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.3 Severability
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If any term of this Agreement is held to be invalid or
                unenforceable, such holding will not affect the validity or
                enforceability of any other term hereto, and this Agreement will
                be interpreted and construed as if such term, to the extent the
                same will have been held to be invalid or unenforceable, had
                never been contained herein.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.4 Assignment
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider may not assign, confer any right in, assume in
                bankruptcy, pledge, mortgage or otherwise encumber this
                Agreement, in whole or in part, without the prior written
                consent of Customer in its sole discretion. For the avoidance of
                doubt, a merger, change of control, reorganization (in
                bankruptcy or otherwise) or stock sale of Provider shall be
                deemed an &ldquo;assignment&rdquo; requiring such consent,
                regardless of whether Provider is the surviving entity. Customer
                may assign or transfer, without notice to or consent from
                Provider, this Agreement and/or Customer&apos;s rights and/or
                obligations under this Agreement to any Customer Affiliate or
                third party. Provider acknowledges that this Agreement is a
                contract for personal services and that its identity is a
                material condition that induced Customer to enter into this
                Agreement. Any attempted action in violation of the foregoing
                shall be null and void ab initio and of no force or effect.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.5 Notices
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                All project-related communications shall occur through the
                platform. Legal notices required hereunder shall be given
                through both: (a) the platform&apos;s messaging system, and (b)
                email to the address Provider has registered on the platform.
                Provider must maintain current contact information in their
                platform profile. Notices are deemed given when sent through
                both required methods. Customer&apos;s legal notices shall be
                sent to:
              </p>
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm">
                <p className="text-[var(--text-primary)]">
                  Reka AI, Inc. (d/b/a Claru AI)
                </p>
                <p className="text-[var(--text-primary)]">
                  530 Lawrence Expy, PMB 9004, Sunnyvale, CA 94085
                </p>
                <p className="text-[var(--accent-primary)] mt-2">
                  <a
                    href="mailto:support@claru.ai"
                    className="hover:underline"
                  >
                    support@claru.ai
                  </a>
                </p>
              </div>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.6 Waiver; Cumulative Remedies
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The waiver by either party of a breach of or a default under any
                provision of this Agreement shall not be effective unless in
                writing and shall not be construed as a waiver of any subsequent
                breach of or default under the same or any other provision of
                this Agreement, nor shall any delay or omission on the part of
                either party to exercise or to avail itself of any right or
                remedy that it has or may have hereunder operate as a waiver of
                any right or remedy. Except as otherwise expressly provided
                herein, no remedy specified in this Agreement is intended to be
                exclusive of any other remedy, and each and every remedy will be
                cumulative and in addition to every other right or remedy
                provided herein or available at law or in equity.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.7 Construction
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This Agreement has been negotiated by the parties and shall be
                interpreted fairly in accordance with its terms and without any
                construction in favor of or against either party. The captions
                and the section and paragraph headings used in this Agreement
                are inserted for convenience only and shall not affect the
                meaning or interpretation of this Agreement. Unless the context
                requires otherwise, as used herein the term
                &ldquo;including&rdquo; means &ldquo;including, without
                limitation,&rdquo; and the term &ldquo;include(s)&rdquo; means
                &ldquo;include(s), without limitation.&rdquo;
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.8 Counterparts
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This Agreement may be executed (including by facsimile
                signature) in one or more counterparts, with the same effect as
                if the parties had signed the same document. Each counterpart so
                executed shall be deemed to be an original, and all such
                counterparts shall be construed together and shall constitute
                one Agreement.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.9 Nature of Rights
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                All rights and licenses granted under or pursuant to this
                Agreement by Provider to Customer are, and shall otherwise be
                deemed to be, for purposes of Section 365(n) of the United
                States Bankruptcy Code (the &ldquo;Bankruptcy Code&rdquo;),
                licenses to rights to &ldquo;intellectual property&rdquo; as
                defined under the Bankruptcy Code. Provider acknowledges that if
                it, as a debtor-in-possession or a trustee in bankruptcy in a
                case under the Bankruptcy Code, rejects this Agreement, Customer
                may elect to retain its rights under this Agreement as provided
                in Section 365(n) of the Bankruptcy Code. The parties further
                agree that, in the event of the commencement of any bankruptcy
                proceeding by or against Provider under the Bankruptcy Code,
                Customer shall be entitled to retain all of its rights under
                this Agreement. Provider agrees and acknowledges that
                enforcement by Customer of any rights under Section 365(n) of
                the Bankruptcy Code in connection with this Agreement shall not
                violate the automatic stay of Section 362 of the Bankruptcy Code
                and waives any right to object on such basis. Upon rejection of
                this Agreement by Provider or the bankruptcy trustee in a
                bankruptcy case under the Bankruptcy Code and written request of
                Customer to Provider or the bankruptcy trustee pursuant to
                Section 365(n) of the Bankruptcy Code, Provider or such
                bankruptcy trustee (a) shall provide Customer with the Work
                Product and any other materials that are the subject of the
                rights and licenses described in this section, and any
                intellectual property otherwise required to be provided to
                Customer under this Agreement that is held by Provider or such
                bankruptcy trustee; and (b) shall not interfere with the rights
                of Customer provided in this Agreement to the materials that are
                the subject of the rights and licenses described in this
                section, including any right to obtain such materials.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.10 Order of Precedence
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                In the event of an otherwise irreconcilable conflict between the
                terms and conditions set forth in the main body of this
                Agreement and the terms and conditions set forth in any
                Statement of Work, the terms and conditions set forth in the
                main body of this Agreement shall control, except to the extent
                a particular Statement of Work expressly provides that it is
                intended to modify the terms of the main body of this Agreement
                for purposes of such Statement of Work and specifically
                indicates the section(s) that are to be modified, in which
                event, such Statement of Work will control.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.11 Publicity
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider shall not use the name or marks of, refer to, or
                identify Customer (or any related entity) or the subject matter
                of this Agreement in any publicity releases, interviews,
                promotional or marketing materials, public announcements,
                customer listings, testimonials or advertising, without
                Customer&apos;s prior written approval.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.12 No Exclusivity
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This Agreement in no way establishes any exclusive arrangement
                between Customer and Provider. Provider acknowledges and agrees
                that Customer will be under no obligation to use or otherwise
                exploit any Services or Deliverables and will be free to enter
                into agreements and other arrangements with any third parties,
                at any time, regarding any products or services.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.13 Entire Agreement; Amendment
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This Agreement (including all platform policies, guidelines, and
                requirements incorporated by reference, and all Statements of
                Work created through project acceptance) constitutes the
                complete agreement between the parties and supersedes all prior
                agreements regarding its subject matter. Customer may modify
                this Agreement or platform policies by posting updates to the
                platform with notice to Provider. Provider&apos;s continued use
                of the platform after such changes constitutes acceptance of the
                modifications.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                11.14 Non-Solicitation
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                During the term of this Agreement and for twelve (12) months
                thereafter, Provider shall not, directly or indirectly: (a)
                solicit or attempt to solicit any customer or client of Customer
                for whom Provider performed Services; or (b) encourage any other
                Provider to reduce or cease their work with Customer. For the
                avoidance of doubt, nothing in this Section restricts Provider
                from performing annotation, labeling, or data processing
                services for any other party, provided that Provider complies
                with all confidentiality and non-use obligations under Section 4
                of this Agreement.
              </p>
            </section>

            {/* Section 12: Platform Obligations and Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                12. Platform Obligations and Requirements
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                12.1 Account Security
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Provider shall:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Maintain strict password security</li>
                <li>Not share account access</li>
                <li>Log out after each session</li>
                <li>
                  Notify Customer immediately of any unauthorized access
                </li>
                <li>
                  Be responsible for all activity under their account
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                12.2 Platform Usage
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Provider shall:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Only access projects they are qualified for</li>
                <li>Maintain required quality scores</li>
                <li>Meet project deadlines</li>
                <li>Participate in required training</li>
                <li>Respond to platform communications promptly</li>
                <li>
                  Follow platform procedures for support and issue resolution
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                12.3 Quality Standards
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Provider shall:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>
                  Maintain minimum quality scores specified by Customer
                </li>
                <li>
                  Participate in calibration exercises when requested
                </li>
                <li>Review and implement feedback</li>
                <li>
                  Comply with project-specific quality requirements
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Provider acknowledges that Customer may use automated quality
                control systems, statistical analysis, and spot checking to
                evaluate work quality. Provider agrees that:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Customer&apos;s quality metrics and evaluation methods are
                  final and binding
                </li>
                <li>
                  Customer may require Provider to complete additional training
                  or qualification tasks at any time
                </li>
                <li>
                  Repeated quality issues may result in permanent platform
                  removal
                </li>
                <li>
                  Customer may withhold payment for work that does not meet
                  quality standards, as determined by Customer&apos;s quality
                  control systems
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                12.4 Platform Integrity
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Provider shall not:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Use automated tools or scripts</li>
                <li>
                  Attempt to manipulate quality scores or metrics
                </li>
                <li>Intentionally delay or rush work</li>
                <li>Submit placeholder or fake work</li>
                <li>
                  Otherwise attempt to circumvent platform controls or metrics
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                12.5 Platform Monitoring and Audit
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                Customer may monitor, record, and audit Provider&apos;s platform
                usage, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>Keystroke patterns</li>
                <li>Work timing and patterns</li>
                <li>Screen recordings of work sessions</li>
                <li>IP addresses and location data</li>
                <li>System and device information</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider consents to such monitoring and acknowledges it is
                essential for platform security and quality control. Customer
                may terminate Provider&apos;s access based on suspicious
                patterns or anomalies detected through such monitoring.
              </p>
            </section>

            {/* Section 13: Data Rights, Personal Information, and End-Client Protection */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                13. Data Rights, Personal Information, and End-Client Protection
              </h2>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3">
                13.1 Broad License to Provider-Submitted Content
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                In addition to the assignment of Work Product under Section 5,
                Provider hereby grants to Customer a perpetual, irrevocable,
                worldwide, fully paid-up, royalty-free, transferable,
                sublicensable (through multiple tiers) license to use,
                reproduce, modify, adapt, publish, distribute, display, perform,
                create derivative works from, and otherwise exploit in any
                manner and for any purpose whatsoever, all content, data,
                materials, feedback, suggestions, ideas, communications, and
                information of any kind that Provider submits, uploads,
                transmits, or otherwise makes available through the platform or
                in connection with this Agreement
                (&ldquo;Provider-Submitted Content&rdquo;). This license
                survives any expiration or termination of this Agreement.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider acknowledges and agrees that Customer may sublicense
                Provider-Submitted Content to Customer&apos;s clients, partners,
                affiliates, and other third parties without restriction, notice,
                or additional compensation to Provider. Provider waives any
                right to inspect or approve the use of Provider-Submitted
                Content by Customer or any sublicensee. This license is in
                addition to, and does not limit, the assignment of Work Product
                under Section 5. To the extent any Provider-Submitted Content
                constitutes Work Product, the assignment under Section 5 shall
                control.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                13.2 Personal Information Consent and Processing
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                By accepting this Agreement and using the platform, Provider
                expressly consents to the collection, use, storage, processing,
                transfer, and disclosure of Provider&apos;s personal information
                by Customer for any purpose related to the platform, the
                Services, Customer&apos;s business operations, or
                Customer&apos;s obligations to its clients and partners.
                &ldquo;Personal Information&rdquo; includes, without limitation:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>
                  Name, email address, phone number, mailing address, and other
                  contact information
                </li>
                <li>
                  Payment information, tax identification numbers, and banking
                  details
                </li>
                <li>
                  Government-issued identification documents provided during
                  onboarding or verification
                </li>
                <li>
                  Platform activity data, including work patterns, quality
                  scores, response times, and performance metrics
                </li>
                <li>
                  Device information, IP addresses, location data, browser type,
                  and system configuration
                </li>
                <li>
                  Keystroke patterns, screen recordings, and session data
                  collected pursuant to Section 12.5
                </li>
                <li>
                  Profile information, qualifications, certifications, and work
                  history provided by Provider
                </li>
                <li>
                  Communications, feedback, and correspondence through the
                  platform or otherwise
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Customer may use Provider&apos;s Personal Information for
                purposes including, without limitation: (a) platform operation,
                administration, and improvement; (b) identity verification and
                fraud prevention; (c) quality assurance and performance
                evaluation; (d) compliance with legal, tax, and regulatory
                obligations; (e) communications related to the platform and
                Services; (f) aggregate analytics and reporting (including to
                Customer&apos;s clients); (g) enforcement of this Agreement; and
                (h) any other legitimate business purpose.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Customer may transfer, share, or disclose Provider&apos;s
                Personal Information to Customer&apos;s affiliates, clients,
                service providers, payment processors, legal advisors, and
                regulatory authorities as Customer deems necessary or
                appropriate. Provider acknowledges that such recipients may be
                located in jurisdictions with different data protection laws
                than Provider&apos;s jurisdiction of residence. Provider
                consents to such international transfers. Where required by
                applicable law, Customer will implement appropriate transfer
                safeguards, such as standard contractual clauses approved by the
                relevant authority.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                Notwithstanding the foregoing, nothing in this Section 13 is
                intended to limit or waive any rights that Provider may have
                under applicable data protection laws that cannot be waived by
                contract, including without limitation rights under the EU
                General Data Protection Regulation (GDPR), the California
                Consumer Privacy Act (CCPA), the Canadian Personal Information
                Protection and Electronic Documents Act (PIPEDA), or similar
                legislation. To the extent required by applicable law, Customer
                will: (a) process Provider&apos;s Personal Information in
                accordance with a lawful basis recognized under applicable law;
                (b) respond to verifiable data subject requests regarding
                access, correction, or deletion of Personal Information in
                accordance with applicable law; and (c) notify Provider of any
                breach of security affecting Provider&apos;s Personal
                Information to the extent required by applicable law. Requests
                may be submitted to{" "}
                <a
                  href="mailto:support@claru.ai"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  support@claru.ai
                </a>
                . Customer&apos;s privacy policy, available at{" "}
                <a
                  href="/privacy"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  claru.ai/privacy
                </a>
                , provides additional information about data processing
                practices.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                13.3 Data Retention
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Customer may retain Provider&apos;s Personal Information and
                Provider-Submitted Content for as long as necessary to fulfill
                the purposes described in this Agreement, comply with legal
                obligations, resolve disputes, and enforce this Agreement.
                Customer may retain anonymized or aggregated data derived from
                Provider&apos;s information indefinitely. Upon termination of
                this Agreement, Customer is not obligated to delete
                Provider&apos;s Personal Information or Provider-Submitted
                Content except as required by applicable law.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                13.4 End-Client Data Protection
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Provider acknowledges that materials provided through the
                platform may originate from or relate to Customer&apos;s
                clients, partners, and licensees (&ldquo;End
                Clients&rdquo;). Provider agrees that:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>
                  All obligations of confidentiality, non-disclosure, and
                  restricted use under Section 4 apply with equal force to End
                  Client data, materials, and information
                </li>
                <li>
                  Provider shall not attempt to identify, contact, or solicit
                  any End Client, whether directly or indirectly
                </li>
                <li>
                  Provider shall not reverse engineer, de-anonymize, or attempt
                  to determine the source, origin, or ownership of any data or
                  materials provided through the platform
                </li>
                <li>
                  Provider shall not retain, copy, download, or extract any End
                  Client data or materials outside the platform except as
                  expressly required to perform Services through the
                  platform&apos;s designated tools
                </li>
                <li>
                  Provider shall immediately notify Customer of any suspected or
                  actual unauthorized access to, or disclosure of, End Client
                  data or materials
                </li>
                <li>
                  Any breach of this Section 13.4 constitutes a material breach
                  of this Agreement permitting immediate termination without
                  opportunity to cure
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Provider acknowledges that Customer&apos;s End Clients are
                intended third-party beneficiaries of this Section 13.4 and may
                enforce its terms directly against Provider.
              </p>

              <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-3 mt-8">
                13.5 Waiver of Claims
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To the maximum extent permitted by applicable law, Provider
                waives any claims, rights, or causes of action against
                Customer, its affiliates, clients, or sublicensees arising from
                or related to Customer&apos;s use, sublicensing, or disclosure
                of Provider-Submitted Content in accordance with this Agreement.
                This waiver does not apply to claims arising from
                Customer&apos;s processing of Provider&apos;s Personal
                Information in violation of applicable data protection laws.
                Provider acknowledges that the compensation received under this
                Agreement constitutes full and complete consideration for all
                rights, licenses, consents, and waivers granted herein.
              </p>
            </section>

            {/* Final Acknowledgment */}
            <section className="border-t border-[var(--border-subtle)] pt-8">
              <div className="p-4 border border-[var(--accent-primary)] rounded-lg bg-[var(--accent-glow)]">
                <p className="text-[var(--text-primary)] font-semibold">
                  By clicking &ldquo;I Accept&rdquo; or using the Claru AI
                  platform, you acknowledge that you have read, understand, and
                  agree to be bound by all terms and conditions of this
                  Agreement.
                </p>
              </div>
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
