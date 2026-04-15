import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Image Submission, Likeness Release, and Indemnity Terms - Claru",
  description:
    "Terms governing image uploads, likeness rights, consent requirements, and indemnification for submitted content on the Claru AI platform.",
  alternates: {
    canonical: "/image-submission-terms",
  },
  openGraph: {
    title: "Image Submission, Likeness Release, and Indemnity Terms - Claru",
    description:
      "Terms governing image uploads, likeness rights, consent requirements, and indemnification for submitted content on the Claru AI platform.",
    type: "website",
  },
};

export default function ImageSubmissionTerms() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      {/* Content */}
      <main className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Image Submission, Likeness Release, and Indemnity Terms
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
              I CERTIFY THAT FOR EVERY IMAGE I UPLOAD, I HAVE OBTAINED AND WILL
              MAINTAIN ALL RIGHTS, PERMISSIONS, AND LEGALLY REQUIRED CONSENTS
              FOR THE IMAGE ITSELF AND FROM EVERY IDENTIFIABLE PERSON APPEARING
              IN IT, INCLUDING PARENT/GUARDIAN CONSENT FOR MINORS, SUFFICIENT TO
              AUTHORIZE REKA AI INC. D/B/A CLARU AI, ITS AFFILIATES, CUSTOMERS,
              PARTNERS, LICENSEES, SUBLICENSEES, AND OTHER DATA RECIPIENTS TO
              USE THE IMAGE AND EACH PERSON&apos;S LIKENESS FOR AI TRAINING,
              EVALUATION, DEVELOPMENT, LICENSING, COMMERCIALIZATION, AND OTHER
              LAWFUL PURPOSES, AND I AGREE TO THE IMAGE SUBMISSION, LIKENESS
              RELEASE, AND INDEMNITY TERMS.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-10">
            {/* Section 1: Definitions */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                1. Definitions
              </h2>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-4 ml-4">
                <li>
                  <strong>&ldquo;Claru&rdquo;</strong> means Reka AI Inc. d/b/a
                  Claru AI.
                </li>
                <li>
                  <strong>&ldquo;Covered Parties&rdquo;</strong> means Claru and
                  its current and future parents, subsidiaries, affiliates,
                  customers, clients, vendors, contractors, service providers,
                  licensees, sublicensees, strategic partners, acquirers,
                  successors, assigns, distributors, resellers, data recipients,
                  model recipients, and other downstream recipients or users of
                  any submitted image, derivative data, dataset, model, output,
                  or related product or service.
                </li>
                <li>
                  <strong>&ldquo;Submitted Content&rdquo;</strong> means any
                  image, photo, video frame, metadata, caption, tag, label,
                  annotation, submission data, or related material you upload or
                  provide.
                </li>
                <li>
                  <strong>&ldquo;Identifiable Individual&rdquo;</strong> means
                  any person who is identifiable or reasonably capable of being
                  identified, directly or indirectly, from Submitted Content
                  alone or in combination with other data, context, metadata, or
                  tools.
                </li>
              </ul>
            </section>

            {/* Section 2: Absolute Responsibility for Rights and Consents */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                2. Absolute Responsibility for Rights and Consents
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You represent, warrant, and covenant that, before uploading any
                Submitted Content, you obtained, and will continue to maintain,
                all rights, licenses, permissions, notices, waivers, and
                consents necessary for the full exercise of the rights
                contemplated by these terms by all Covered Parties.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                This includes:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  all rights in and to the Submitted Content itself, including
                  from the photographer, copyright owner, or other rights
                  holder;
                </li>
                <li>
                  valid, enforceable, legally sufficient consent from every
                  Identifiable Individual appearing in the Submitted Content;
                </li>
                <li>
                  where applicable, valid consent from a parent or legal
                  guardian for every minor;
                </li>
                <li>
                  any permissions required under applicable privacy, publicity,
                  portrait, employment, labor, data protection, biometric, or
                  other applicable laws.
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                You may not upload any Submitted Content containing even one
                Identifiable Individual unless you have secured all such rights
                and consents for that individual.
              </p>
            </section>

            {/* Section 3: Scope of Consent You Confirm Has Been Obtained */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                3. Scope of Consent You Confirm Has Been Obtained
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You represent, warrant, and covenant that each required consent
                you obtained authorizes Claru and all Covered Parties, on a
                perpetual, irrevocable, worldwide, transferable, sublicensable,
                royalty-free basis, to use the Submitted Content and the name,
                image, likeness, appearance, face, body, voice, movements,
                persona, biographical details, and other identifying
                characteristics of each Identifiable Individual for any lawful
                purpose, including:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  ingestion, storage, hosting, copying, review, and processing;
                </li>
                <li>
                  annotation, labeling, classification, moderation, filtering,
                  evaluation, and quality assurance;
                </li>
                <li>
                  creation, curation, enrichment, combination, modification,
                  transformation, and distribution of datasets and derivative
                  datasets;
                </li>
                <li>
                  research, development, testing, validation, benchmarking,
                  training, retraining, fine-tuning, evaluation, and improvement
                  of artificial intelligence, machine learning, multimodal,
                  computer vision, generative, recognition, and related systems;
                </li>
                <li>
                  internal business operations, analytics, safety, trust and
                  safety, fraud prevention, auditing, and security;
                </li>
                <li>
                  commercialization, licensing, sublicensing, sale, transfer,
                  sharing, provision, and other exploitation of Submitted
                  Content, derived data, datasets, labels, annotations,
                  embeddings, model inputs, model weights, model outputs, and
                  related products and services;
                </li>
                <li>
                  advertising, promotion, marketing, demonstrations, case
                  studies, investor materials, and public-facing or non-public-facing
                  business use.
                </li>
              </ul>
            </section>

            {/* Section 4: Group Images and Third Parties */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                4. Group Images and Third Parties
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                For any Submitted Content containing multiple persons, you
                expressly represent, warrant, and covenant that you obtained the
                required rights and consents from each and every Identifiable
                Individual appearing in the Submitted Content, not merely from
                the primary subject, the person who supplied the photo, or the
                account holder.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You acknowledge that group images, background persons, partially
                visible persons, and other third parties may still qualify as
                Identifiable Individuals, and you assume full responsibility for
                determining whether consent is required and obtaining it.
              </p>
            </section>

            {/* Section 5: Evidence and Record Retention */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                5. Evidence and Record Retention
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You will maintain complete, accurate, and auditable records
                sufficient to prove the rights and consents required by these
                terms for at least seven (7) years after your last upload of
                Submitted Content, or longer if required by law or requested by
                Claru in writing in connection with a dispute, audit, claim, or
                investigation.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Upon request, you will immediately provide Claru with copies of
                releases, consent forms, guardian approvals, chain-of-title
                documentation, and any other evidence Claru requests. Failure to
                provide satisfactory evidence upon request will constitute a
                material breach.
              </p>
            </section>

            {/* Section 6: No Reliance by You; Full Reliance by Claru */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                6. No Reliance by You; Full Reliance by Claru
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                You acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Claru is entitled to rely fully on your representations,
                  warranties, and covenants without independently verifying
                  them;
                </li>
                <li>
                  Claru has no obligation to review, investigate, authenticate,
                  or validate your rights or consents;
                </li>
                <li>
                  all risk arising from any failure to obtain sufficient rights
                  or consents rests solely with you.
                </li>
              </ul>
            </section>

            {/* Section 7: Rights Granted */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                7. Rights Granted
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You hereby grant, and represent that the required rights and
                consents you obtained authorize, Claru and all Covered Parties
                to host, copy, store, reproduce, display, perform, distribute,
                transmit, publish, modify, crop, edit, adapt, translate,
                annotate, label, combine, extract information from, create
                derivative works from, commercialize, license, sublicense,
                transfer, assign, sell, resell, disclose, share, and otherwise
                use the Submitted Content and the likeness and identifying
                characteristics of each Identifiable Individual for any lawful
                purpose, in any media, channel, or format now known or later
                developed.
              </p>
            </section>

            {/* Section 8: Waiver of Claims; No Approval or Compensation Rights */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                8. Waiver of Claims; No Approval or Compensation Rights
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You represent that the permissions you obtained are sufficient,
                to the maximum extent permitted by law, to waive and release any
                claim by any Identifiable Individual against any Covered Party
                arising out of or relating to the authorized use of Submitted
                Content or likeness rights, including claims based on:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>
                  rights of publicity, privacy, likeness, portrait, personality,
                  or image;
                </li>
                <li>biometric privacy or similar theories;</li>
                <li>
                  defamation, false light, emotional distress, reputational
                  harm, or false endorsement;
                </li>
                <li>
                  copyright, neighboring rights, moral rights, attribution,
                  approval, inspection, or withdrawal rights;
                </li>
                <li>
                  royalties, fees, residuals, profit participation, or
                  additional compensation.
                </li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You further represent that no Identifiable Individual has any
                approval, inspection, deletion, revocation, or compensation
                right inconsistent with the rights granted under these terms,
                except to the extent such rights cannot legally be waived.
              </p>
            </section>

            {/* Section 9: No Obligation to Delete or Recall */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                9. No Obligation to Delete or Recall
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You acknowledge and agree that Submitted Content may be
                incorporated into datasets, derivative datasets, labels,
                annotations, model inputs, trained systems, outputs, commercial
                products, and downstream licensed materials, and may be shared
                with Covered Parties on a global basis. As a result, once
                Submitted Content has been uploaded or used, it may be
                technically or commercially impracticable or impossible to
                retrieve, delete, reverse, segregate, or cease all downstream
                uses.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To the maximum extent permitted by law, neither Claru nor any
                Covered Party will have any obligation to delete, recall, unwind,
                or discontinue use of Submitted Content or derived materials
                except as expressly required by applicable law and only to the
                extent legally required.
              </p>
            </section>

            {/* Section 10: Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                10. Indemnification
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You will defend, indemnify, and hold harmless the Covered
                Parties from and against any and all claims, complaints,
                demands, actions, suits, arbitrations, investigations,
                proceedings, liabilities, damages, losses, judgments,
                settlements, penalties, fines, costs, and expenses, including
                attorneys&apos; fees and expert fees, arising out of or relating
                to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4 mb-4">
                <li>
                  any actual or alleged failure by you to obtain rights,
                  permissions, releases, notices, waivers, or consents required
                  by these terms;
                </li>
                <li>
                  any actual or alleged claim by any person appearing in
                  Submitted Content, or by any parent, guardian, photographer,
                  copyright owner, employer, agency, or representative of such
                  person;
                </li>
                <li>
                  any claim involving privacy, publicity, likeness, portrait,
                  biometric privacy, copyright, moral rights, unfair
                  competition, false endorsement, negligence, consumer
                  protection, or similar legal theories;
                </li>
                <li>
                  any claim arising from the storage, processing, annotation,
                  labeling, training, evaluation, use, licensing, sublicensing,
                  transfer, commercialization, or other exploitation of
                  Submitted Content or derivative materials by any Covered
                  Party;
                </li>
                <li>your breach of these terms.</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This indemnity is intended to protect not only Claru but also
                all Covered Parties as express third-party beneficiaries, each
                of whom may enforce this provision directly.
              </p>
            </section>

            {/* Section 11: Survival; Irrevocability */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                11. Survival; Irrevocability
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Your representations, warranties, covenants, releases, and
                indemnification obligations are continuing, irrevocable, and
                survive indefinitely, including after account termination,
                cessation of services, content removal, or expiration of any
                other agreement with Claru.
              </p>
            </section>

            {/* Section 12: Priority and Incorporation */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-mono">
                12. Priority and Incorporation
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                These terms are incorporated into the platform terms, contributor
                terms, annotator agreement, services agreement, and any
                statement of work or submission requirements applicable to you.
                In the event of any inconsistency, the interpretation most
                favorable to Claru and the Covered Parties shall apply to the
                maximum extent permitted by law.
              </p>
            </section>

            {/* Final Acknowledgment */}
            <section className="border-t border-[var(--border-subtle)] pt-8">
              <div className="p-4 border border-[var(--accent-primary)] rounded-lg bg-[var(--accent-glow)]">
                <p className="text-[var(--text-primary)] font-semibold">
                  By checking the certification box or uploading any image, you
                  acknowledge that you have read, understand, and agree to be
                  bound by all terms and conditions of these Image Submission,
                  Likeness Release, and Indemnity Terms.
                </p>
              </div>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
            <Link
              href="/"
              className="font-mono text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
