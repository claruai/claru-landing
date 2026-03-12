import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import ProblemAgitation from "./components/sections/ProblemAgitation";
import Origin from "./components/sections/Origin";
import TwoPaths from "./components/sections/TwoPaths";
import ProofOfWork from "./components/sections/ProofOfWork";
import Testimonials from "./components/sections/Testimonials";
import FinalCTA from "./components/sections/FinalCTA";
import Footer from "./components/sections/Footer";
import SectionBridge from "./components/sections/SectionBridge";
import ClientProviders from "./components/providers/ClientProviders";
import AnimatedLogoWrapper from "./components/sections/AnimatedLogoWrapper";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of AI training data does Claru provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru provides purpose-built training data across text, vision, video, and robotics modalities. Our services span the full data lifecycle: acquisition (egocentric video capture, synthetic data generation, data licensing), enrichment (expert annotation, RLHF, video annotation), preparation (deduplication, multimodal alignment, quality scoring), and validation (benchmark curation, bias detection, red teaming). We have delivered over 3 million completed human annotations across 15 datasets.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru ensure annotation quality for RLHF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru uses expert human annotators — not crowdsourced labor — embedded directly with AI research teams. This gives annotators full context on model behavior and labeling requirements, resulting in higher inter-annotator agreement and fewer downstream errors. Every project includes structured protocols, real-time validation during annotation, multi-stage quality assurance, and automated consistency checks before delivery.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Claru different from general data annotation vendors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru works exclusively with frontier AI labs building next-generation models — not the general market. Our annotators are domain experts embedded with research teams, not anonymous gig workers on a task marketplace. This specialization means deeper context on each project, tighter feedback loops with researchers, and training data purpose-built for cutting-edge video, vision, robotics, and language models.",
      },
    },
    {
      "@type": "Question",
      name: "What AI modalities does Claru support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru supports four core AI modalities: text (language model alignment, RLHF, red teaming), vision (image classification, object detection, visual reasoning), video (temporal annotation, action recognition, video generation training), and robotics (manipulation trajectories, egocentric capture, spatial reasoning). Our data catalog includes datasets spanning 20+ activity domains captured across 14+ countries.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru handle data privacy and security?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru maintains strict data privacy and security protocols for all projects. Every dataset is fully licensed and rights-cleared for commercial model training. We handle participant consent, data anonymization, and secure storage throughout the pipeline. Our processes comply with applicable data protection regulations, and we work closely with each lab partner to meet their specific security and compliance requirements.",
      },
    },
    {
      "@type": "Question",
      name: "What is human-in-the-loop AI training data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Human-in-the-loop AI training data is data that has been labeled, evaluated, or curated by human experts to train and improve AI models. Unlike purely automated pipelines, human-in-the-loop approaches use expert judgment to handle ambiguous cases, evaluate model outputs, and provide the nuanced feedback that alignment techniques like RLHF require. Claru specializes in this approach, providing expert annotators who work alongside AI researchers.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru work with frontier AI labs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru partners with frontier AI labs through embedded teams of expert annotators who integrate directly into the lab's research workflow. Rather than operating as a detached vendor, our annotators gain full context on the models being trained, participate in calibration sessions, and maintain direct communication with researchers. This embedded model enables faster iteration cycles and higher-quality training data tailored to each lab's specific needs.",
      },
    },
  ],
};

export default function Home() {
  return (
    <ClientProviders>
      {/* FAQ structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <ProblemAgitation />
        <SectionBridge text="So we built something different." />
        <Origin />
        <TwoPaths />
        <ProofOfWork />
        <Testimonials />
        <FinalCTA />
        <AnimatedLogoWrapper />
      </main>

      {/* Footer */}
      <Footer />
    </ClientProviders>
  );
}
