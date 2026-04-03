import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "The Sim-to-Real Gap Explained: Why It Happens and How to Close It (2026) | Claru",
  description:
    "Four specific causes of the sim-to-real gap — visual domain gap, physics approximation error, sensor noise mismatch, and long-tail scenario absence — and what real-world data addresses each.",
  keywords: [
    "sim to real gap explained",
    "sim to real gap robotics",
    "how to close sim to real gap",
    "why do robots fail when deployed from simulation",
    "domain randomization sim to real",
    "sim to real transfer robotics",
    "simulation to real world gap",
    "reality gap robotics",
    "Isaac Gym sim to real",
    "simulation training robotics failure",
    "domain randomization limitations",
    "real world data for sim to real",
    "sim to real gap 2026",
  ],
  openGraph: {
    title: "The Sim-to-Real Gap Explained: Why It Happens and How to Close It (2026)",
    description:
      "Four causes of sim-to-real failure — visual domain gap, physics approximation, sensor noise, and long-tail scenarios — and exactly what real-world data is needed to address each.",
    type: "article",
    url: "https://claru.ai/blog/sim-to-real-gap",
    siteName: "Claru",
    images: [
      {
        url: "https://claru.ai/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "The Sim-to-Real Gap Explained (2026) — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sim-to-Real Gap Explained: Why It Happens and How to Close It (2026) | Claru",
    description:
      "Four specific causes of sim-to-real failure and the data needed to address each. Domain randomization alone is not enough.",
  },
  alternates: {
    canonical: "https://claru.ai/blog/sim-to-real-gap",
  },
};

// =============================================================================
// JSON-LD: BlogPosting
// =============================================================================

const blogPostingJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "The Sim-to-Real Gap Explained: Why It Happens and How to Close It (2026)",
  description:
    "Four specific causes of the sim-to-real gap — visual domain gap, physics approximation error, sensor noise mismatch, and long-tail scenario absence — and what real-world data addresses each.",
  author: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
    logo: {
      "@type": "ImageObject",
      url: "https://claru.ai/images/og-v2.webp",
    },
  },
  datePublished: "2026-04-02",
  dateModified: "2026-04-02",
  mainEntityOfPage: "https://claru.ai/blog/sim-to-real-gap",
  image: "https://claru.ai/images/og-v2.webp",
  isPartOf: {
    "@type": "Blog",
    "@id": "https://claru.ai/blog",
    name: "Claru Blog",
  },
  mentions: [
    {
      "@type": "SoftwareApplication",
      name: "Isaac Gym",
      url: "https://developer.nvidia.com/isaac-gym",
    },
    {
      "@type": "SoftwareApplication",
      name: "MuJoCo",
      url: "https://mujoco.org/",
    },
    {
      "@type": "SoftwareApplication",
      name: "Isaac Lab",
      url: "https://developer.nvidia.com/isaac-lab",
    },
    {
      "@type": "Thing",
      name: "Domain Randomization",
      url: "https://arxiv.org/abs/1703.06907",
    },
    {
      "@type": "Organization",
      name: "OpenAI Robotics",
      url: "https://openai.com",
    },
  ],
};

// =============================================================================
// JSON-LD: BreadcrumbList
// =============================================================================

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://claru.ai",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://claru.ai/blog",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "The Sim-to-Real Gap Explained",
      item: "https://claru.ai/blog/sim-to-real-gap",
    },
  ],
};

// =============================================================================
// JSON-LD: FAQPage
// =============================================================================

const faqItems = [
  {
    question: "What causes the sim-to-real gap?",
    answer:
      "The sim-to-real gap arises from four distinct sources of mismatch between simulation and the physical world: (1) Visual domain gap — simulated rendering differs from real camera images in lighting, texture, reflection, and depth cues; (2) Physics approximation error — simulators like MuJoCo and Isaac Gym use simplified contact models and friction approximations that diverge from real material interactions, especially for deformable objects and soft contacts; (3) Sensor noise mismatch — real sensors have specific noise profiles (depth sensor speckle, camera motion blur, proprioceptive drift) that are absent or poorly modeled in simulation; (4) Long-tail scenario absence — rare events, unexpected object configurations, and edge-case environments that appear in real deployment are not represented in simulation because they are difficult to enumerate and procedurally generate.",
  },
  {
    question: "Can domain randomization eliminate the sim-to-real gap?",
    answer:
      "Domain randomization (DR) substantially reduces the visual domain gap by training policies on randomized textures, lighting, and camera parameters. OpenAI's Dactyl demonstrated that DR could transfer dexterous manipulation policies from MuJoCo to physical Shadow Dexterous Hand systems. However, DR has three well-documented limitations: it cannot address physics approximation error for contact-rich tasks (because randomizing friction and mass parameters doesn't capture the systematic errors in contact models), it does not generate long-tail real-world scenarios that aren't in the randomization distribution, and aggressive DR can degrade policy performance on the nominal task by forcing the model to handle physically unrealistic variations. Real-world data remains necessary to supplement DR for production deployment.",
  },
  {
    question: "What data do I need to close the sim-to-real gap?",
    answer:
      "Each cause of the sim-to-real gap requires different data to address: For the visual domain gap, real-world images or video from the deployment environment with diverse lighting, time-of-day variation, and realistic object appearances. For physics approximation error, real robot interaction data — teleoperation or demonstrations — that captures actual contact dynamics, including failures and recoveries that reveal the real physics. For sensor noise, data collected with the exact sensor hardware (depth camera model, proprioception sensors) that will be used in deployment, not a simulated approximation. For long-tail scenarios, diverse real-world footage from many environments and object configurations — this is where egocentric video at scale is useful, as it captures the visual diversity of real-world environments across many locations, times, and conditions.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// =============================================================================
// Causes table data
// =============================================================================

const causesRows = [
  {
    cause: "Visual domain gap",
    description: "Rendered images differ from real camera images in texture, lighting, reflections, and depth cues",
    drHelps: "Yes — texture/lighting randomization reduces this",
    realDataNeeded: "Real-world images or video from target deployment environment",
    example: "Isaac Gym renders look plasticky; real cameras see specular highlights, motion blur, lens flare",
  },
  {
    cause: "Physics approximation error",
    description: "Simulators simplify contact models; real friction, deformation, and collision behavior diverges",
    drHelps: "Partially — mass/friction randomization helps but can't fix systematic contact model errors",
    realDataNeeded: "Real robot interaction data showing actual contact dynamics and recovery behaviors",
    example: "MuJoCo rigid-body contact model fails on deformable objects (cloth, compliant grippers)",
  },
  {
    cause: "Sensor noise mismatch",
    description: "Real sensors have specific noise profiles absent or oversimplified in simulation",
    drHelps: "Partially — additive Gaussian noise is poor model for depth speckle or IMU drift",
    realDataNeeded: "Data collected with exact deployment sensor hardware, not simulated equivalents",
    example: "Intel RealSense depth noise pattern differs from structured-light simulation models",
  },
  {
    cause: "Long-tail scenario absence",
    description: "Rare but real events (dropped objects, moving humans, occlusion) are not generated in sim",
    drHelps: "No — procedural generation cannot enumerate unknown unknowns",
    realDataNeeded: "Diverse real-world footage across many environments and unexpected configurations",
    example: "Robot fails when a human walks past during manipulation — this interaction is rarely simulated",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function SimToRealGapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <GeoPageShell>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="w-full pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-4xl px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Sim-to-Real Gap
                </li>
              </ol>
            </nav>

            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#92B090" }}
            >
              Last updated: April 2026
            </p>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              The Sim-to-Real Gap Explained: Why It Happens and How to Close
              It (2026)
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              A policy that achieves 95% task success in Isaac Gym can fail
              completely when deployed on real hardware. This post explains
              exactly why — and what specific data is needed to address each
              cause.
            </p>
          </div>
        </section>

        {/* ── TL;DR Box ─────────────────────────────────────────────── */}
        <section className="w-full pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div
              className="rounded-lg border p-6"
              style={{
                borderColor: "rgba(146,176,144,0.3)",
                backgroundColor: "rgba(146,176,144,0.05)",
              }}
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "#92B090" }}
              >
                TL;DR
              </p>
              <ul className="space-y-3">
                {[
                  "The sim-to-real gap has four distinct causes: visual domain gap, physics approximation error, sensor noise mismatch, and long-tail scenario absence — each requires a different mitigation strategy.",
                  "Domain randomization (DR) addresses the visual domain gap but cannot fix physics approximation error for contact-rich tasks or generate the long-tail real-world scenarios robots encounter in deployment.",
                  "Each cause maps to a specific data requirement: real deployment-environment images (visual gap), real robot interaction logs (physics gap), deployment-hardware sensor data (noise gap), and diverse real-world footage (long-tail gap).",
                  "Claru's 500K+ real-world egocentric clips across 100+ cities and diverse environments directly address the long-tail visual scenario gap that simulation cannot generate.",
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
                    <span
                      className="mt-1 flex-none w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#92B090" }}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Table of Contents ─────────────────────────────────────── */}
        <section className="w-full pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                In This Post
              </h2>
              <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
                <li>
                  <a href="#what-is-sim-to-real" className="hover:text-white transition-colors">
                    What Is the Sim-to-Real Gap?
                  </a>
                </li>
                <li>
                  <a href="#cause-1-visual" className="hover:text-white transition-colors">
                    Cause 1: Visual Domain Gap
                  </a>
                </li>
                <li>
                  <a href="#cause-2-physics" className="hover:text-white transition-colors">
                    Cause 2: Physics Approximation Error
                  </a>
                </li>
                <li>
                  <a href="#cause-3-sensor" className="hover:text-white transition-colors">
                    Cause 3: Sensor Noise Mismatch
                  </a>
                </li>
                <li>
                  <a href="#cause-4-longtail" className="hover:text-white transition-colors">
                    Cause 4: Long-Tail Scenario Absence
                  </a>
                </li>
                <li>
                  <a href="#comparison-table" className="hover:text-white transition-colors">
                    Causes and Mitigations: Summary Table
                  </a>
                </li>
                <li>
                  <a href="#domain-randomization-limits" className="hover:text-white transition-colors">
                    Why Domain Randomization Is Not Enough
                  </a>
                </li>
                <li>
                  <a href="#real-world-data-role" className="hover:text-white transition-colors">
                    The Role of Real-World Data
                  </a>
                </li>
                <li>
                  <a href="#key-takeaways" className="hover:text-white transition-colors">
                    Key Takeaways
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── What Is the Sim-to-Real Gap? ──────────────────────────── */}
        <section id="what-is-sim-to-real" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Is the Sim-to-Real Gap?
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The <strong className="text-white">sim-to-real gap</strong> is the
                performance degradation that occurs when a robot policy trained entirely
                (or primarily) in simulation is deployed on physical hardware. It is one
                of the central unsolved problems in robotics research, and it gets more
                severe as tasks become more complex.
              </p>
              <p>
                Simulation offers compelling advantages for robot training: infinite
                data, no hardware wear, parallelizable compute, safe exploration of
                failure modes, and the ability to reset environments instantly. Isaac
                Gym and its successor Isaac Lab from NVIDIA can run thousands of
                parallel simulation environments simultaneously, enabling reinforcement
                learning training that would take years in the real world to complete
                in hours. MuJoCo, PyBullet, and Webots are similarly used across
                manipulation research.
              </p>
              <p>
                The problem is that simulation is a model, and every model has
                approximation errors. When a policy trained in simulation encounters
                the real world, it faces inputs it was never trained on — real physics,
                real lighting, real sensor noise, and real situations that the
                simulation did not generate. The policy was trained to be optimal
                for the simulated world, not for the real one.
              </p>
              <p>
                The gap is not one thing. It is four distinct phenomena with different
                causes and different mitigations. Treating it as a single problem is
                why many sim-to-real transfer attempts fail: a team applies domain
                randomization to address the visual gap, sees no improvement, and
                concludes that sim-to-real doesn&apos;t work — when in reality they
                were ignoring the physics approximation or sensor noise gaps that were
                the actual failure modes.
              </p>
            </div>
          </div>
        </section>

        {/* ── Cause 1: Visual Domain Gap ────────────────────────────── */}
        <section id="cause-1-visual" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Cause 1: Visual Domain Gap
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The visual domain gap is the most frequently cited and best-studied
                cause of sim-to-real failure. Simulated rendering engines — including
                Unreal Engine, Unity, and the physics-coupled renderers in Isaac
                Lab — produce images that are visually distinguishable from real
                camera output by even casual inspection.
              </p>
              <p>
                The specific differences include:
              </p>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Lighting models:</strong> Simulation uses idealized global illumination; real environments have complex indirect lighting, ambient occlusion, and time-varying natural light.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Texture and material properties:</strong> Simulated textures are static maps; real surfaces have scratches, stains, wear patterns, and view-dependent reflectance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Depth cues:</strong> Real depth cameras have characteristic noise patterns (structured light speckle, time-of-flight multi-path interference) absent from simulated depth maps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Camera artifacts:</strong> Lens distortion, chromatic aberration, and motion blur are absent from most simulation renderers.</span>
                </li>
              </ul>
              <p>
                <strong className="text-white">Domain randomization</strong> is the
                primary technique for addressing the visual gap. Introduced by OpenAI
                in 2017 and refined substantially since, DR trains policies across
                randomized textures, lighting parameters, camera positions, and object
                colors — forcing the model to learn features that are invariant to these
                variations. OpenAI&apos;s Dactyl results showed DR enabling sim-to-real
                transfer for dexterous in-hand manipulation without any real-world
                training data.
              </p>
              <p>
                However, DR adds a different type of noise: the policy must be invariant
                to variations that are physically unrealistic. A table in Dactyl&apos;s
                training had randomized textures including checker-boards and gradients
                that no real table would exhibit. This unrealistic variation can hurt
                performance on the actual deployment environment. The practical approach
                in 2026 is to combine domain randomization with real-world image data
                from the deployment environment — using DR to avoid overfitting to
                simulation while using real images to anchor the distribution.
              </p>
            </div>
          </div>
        </section>

        {/* ── Cause 2: Physics Approximation ───────────────────────── */}
        <section id="cause-2-physics" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Cause 2: Physics Approximation Error
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Physics simulation approximates reality at the level of contact
                mechanics, friction, and deformable body dynamics. For rigid-body
                manipulation in constrained environments (e.g., pick-and-place with
                simple geometry), the approximations are reasonable. For contact-rich
                manipulation — assembly, folding, pouring, cutting — they diverge
                significantly.
              </p>
              <p>
                MuJoCo (Multi-Joint dynamics with Contact) uses a convex optimization
                approach to contact forces that produces stable simulation but does
                not match real contact dynamics for soft materials. Isaac Gym&apos;s
                PhysX engine handles rigid bodies well but has well-documented
                limitations for deformable objects and slip-contact interactions.
                Neither simulator accurately models the behavior of a compliant
                parallel gripper grasping a soft object like a foam cup or a piece
                of fruit.
              </p>
              <p>
                Domain randomization over physics parameters (mass, friction coefficients,
                joint damping) partially compensates for this by forcing policies to
                handle a range of dynamics rather than a single simulated point estimate.
                But there is a systematic limit: if the real contact physics falls
                outside the randomization range — which it often does for novel object
                geometries or materials — the policy trained with randomized physics will
                still fail.
              </p>
              <p>
                The only reliable fix for physics approximation error is real interaction
                data: robot demonstrations or teleoperation logs that capture actual
                contact dynamics, including failure cases and recovery behaviors. This
                is why even simulation-heavy pipelines like GR00T N1&apos;s training
                include real robot demonstration data — the simulation provides breadth
                and scale, while the real data provides physics accuracy.
              </p>
            </div>
          </div>
        </section>

        {/* ── Cause 3: Sensor Noise Mismatch ────────────────────────── */}
        <section id="cause-3-sensor" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Cause 3: Sensor Noise Mismatch
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Real sensors have characteristic noise profiles that are distinct
                from the Gaussian or uniform noise models commonly used in simulation.
                When a policy is trained on simulated sensor data with simplistic noise
                models and then deployed with real hardware, it encounters systematic
                signal patterns it was not trained to handle.
              </p>
              <p>
                Specific examples:
              </p>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Structured-light depth cameras (Intel RealSense):</strong> The speckle noise pattern of structured-light projection creates characteristic depth estimation errors at edges and on reflective surfaces that simple additive Gaussian noise does not model.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Proprioceptive sensors:</strong> Real joint encoders have backlash, quantization noise, and drift that accumulate over manipulation sequences. Simulated proprioception is typically noiseless or idealized.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Tactile sensors:</strong> Force-torque sensors and tactile arrays (like the ones on Shadow Hand or DIGIT fingertips) have complex noise characteristics that are not meaningfully capturable in simulation without hardware-specific data.</span>
                </li>
              </ul>
              <p>
                The mitigation is direct: collect data with the exact hardware that
                will be used in deployment. A policy trained on data from a Franka
                FT300-S force-torque sensor does not automatically transfer to a
                Robotiq FT 300 sensor, even though both measure end-effector forces
                and torques. Hardware-specific sensor calibration data is the only
                reliable way to close this gap.
              </p>
            </div>
          </div>
        </section>

        {/* ── Cause 4: Long-Tail Scenarios ──────────────────────────── */}
        <section id="cause-4-longtail" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Cause 4: Long-Tail Scenario Absence
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Simulation generates scenarios from a designed distribution.
                Real environments contain everything that distribution did not
                anticipate: a cup on a tilted surface, a person walking past during
                manipulation, an object that looks like a training object but is
                made of a different material, a workspace that is partially
                occluded by something that was not there during collection.
              </p>
              <p>
                This long-tail failure mode is arguably the hardest to address through
                simulation alone, because it requires anticipating the unanticipated.
                Procedural generation can add surface clutter and varied object
                positions, but it cannot generate the genuinely unexpected. The more
                diverse the deployment environment — kitchen versus lab versus warehouse
                versus outdoor construction site — the larger this gap becomes.
              </p>
              <p>
                The implication for data: long-tail coverage requires real-world
                data collected at scale across diverse environments and conditions.
                Large-scale egocentric video datasets provide exactly this — they
                capture the visual diversity of real human manipulation across hundreds
                of location types, lighting conditions, object configurations, and
                task contexts that simulation cannot enumerate.
              </p>
              <p>
                Claru&apos;s 500K+ egocentric clips, captured by 10,000+ contributors
                across 100+ cities on 6 continents, cover the visual long-tail of
                real manipulation environments. Each clip captures a genuine human
                in a genuine environment performing genuine tasks — the kind of
                distributional diversity that simulation cannot procedurally generate.
                For{" "}
                <Link
                  href="/training-data-for-robotics"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  robotics teams
                </Link>{" "}
                training models that will deploy into unstructured real-world environments,
                this egocentric data directly addresses the long-tail scenario gap
                that domain randomization and simulation cannot.
              </p>
            </div>
          </div>
        </section>

        {/* ── Summary Table ─────────────────────────────────────────── */}
        <section id="comparison-table" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Causes and Mitigations: Summary Table
            </h2>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs">
                      Cause
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs">
                      DR Helps?
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs">
                      Real Data Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {causesRows.map((row, i) => (
                    <tr
                      key={row.cause}
                      className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                    >
                      <td className="p-4 text-white/90 font-medium leading-snug">{row.cause}</td>
                      <td className="p-4 text-white/60 text-xs leading-snug">{row.drHelps}</td>
                      <td className="p-4 text-white/70 text-xs leading-snug">{row.realDataNeeded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Domain Randomization Limits ───────────────────────────── */}
        <section id="domain-randomization-limits" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why Domain Randomization Is Not Enough
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Domain randomization achieved a real milestone with Dactyl — successfully
                transferring a dexterous in-hand manipulation policy from MuJoCo simulation
                to a physical Shadow Dexterous Hand with no real-world training data. This
                result is frequently cited as proof that simulation is sufficient for complex
                manipulation.
              </p>
              <p>
                It is important to understand what Dactyl actually demonstrated. The task
                (rotating a Rubik&apos;s cube to a target face configuration) is a
                continuous control problem over a rigid object with relatively predictable
                contact mechanics. It does not involve deformable objects, novel materials,
                environmental clutter, or human interaction. Domain randomization can close
                the sim-to-real gap for tasks with bounded visual and physical variation —
                and Dactyl is that type of task.
              </p>
              <p>
                For tasks that do involve deformable objects, diverse environments, or
                real-world clutter, DR alone is insufficient. The 2023 results from Physical
                Intelligence and others on deformable object manipulation (laundry, food
                packaging, cable management) all required real robot demonstration data
                precisely because DR could not handle the contact physics divergence for
                these materials.
              </p>
              <p>
                The emerging consensus in 2026 is a hybrid approach: use simulation + DR
                for maximum data volume and safe exploration of failure modes, then
                supplement with real-world data to close the residual gaps. The ratio
                depends on task complexity — for rigid pick-and-place, sim-to-real with
                DR can work with minimal real data; for dexterous manipulation of
                deformable objects in diverse environments, the real data component is
                substantial.
              </p>
            </div>
          </div>
        </section>

        {/* ── Real-World Data Role ───────────────────────────────────── */}
        <section id="real-world-data-role" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              The Role of Real-World Data
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Different causes of the sim-to-real gap require different types of
                real-world data. Understanding this mapping helps teams prioritize
                collection efforts rather than collecting large amounts of data that
                address the wrong gap.
              </p>
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Visual gap → Real-world images and video from deployment environments
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Capturing images and video from the actual deployment spaces (specific
                    kitchen, warehouse, laboratory) with the same cameras used on the robot.
                    Even a few hundred frames of the real environment can significantly
                    improve visual transfer.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Physics gap → Real robot interaction demonstrations
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Teleoperation demonstrations or kinesthetic teaching of the target
                    task with the deployment robot hardware. These captures encode actual
                    contact dynamics and are not substitutable with simulation data for
                    contact-rich tasks.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Sensor noise gap → Hardware-calibrated sensor data
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Recordings from the exact sensor hardware used in deployment, across
                    the range of conditions the robot will encounter. This is the most
                    hardware-specific data requirement and cannot be generalized across
                    sensor models.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Long-tail gap → Diverse real-world egocentric video at scale
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Large-scale first-person video from many environments, lighting
                    conditions, object configurations, and task contexts. This is
                    precisely what Claru&apos;s 500K+ egocentric clips across 100+ cities
                    and 6 continents address — the visual diversity of real manipulation
                    environments that simulation cannot enumerate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Takeaways ─────────────────────────────────────────── */}
        <section id="key-takeaways" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              {[
                "The sim-to-real gap is not a single phenomenon — it has four distinct causes (visual, physics, sensor noise, long-tail), each requiring a different mitigation.",
                "Domain randomization effectively addresses the visual domain gap but cannot fix physics approximation errors for contact-rich manipulation or generate long-tail real-world scenarios.",
                "For rigid-body pick-and-place tasks, sim + DR can achieve reliable real-world transfer with minimal real data. For dexterous manipulation of deformable objects, real interaction data is required.",
                "Physics approximation errors are most severe for soft materials, compliant grippers, and contact-rich assembly — tasks that are increasingly important for humanoid robots.",
                "The long-tail gap requires diverse real-world data at scale, not more simulation. This is the specific gap that large-scale egocentric video collections address.",
                "Practical 2026 approach: simulation + DR for data volume, real robot demonstrations for contact physics accuracy, real environment imagery for visual grounding, and large-scale egocentric video for long-tail distributional coverage.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80 text-base leading-relaxed">
                  <span
                    className="mt-2 flex-none w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#92B090" }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section id="faq" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.question}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Resources ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  href: "/solutions/sim-to-real-data",
                  label: "Sim-to-Real Data — Claru",
                  desc: "How Claru's real-world egocentric data addresses the visual domain gap and long-tail scenario absence.",
                },
                {
                  href: "/training-data-for-robotics",
                  label: "Training Data for Robotics",
                  desc: "Overview of physical AI training data requirements across perception, policy, and world model layers.",
                },
                {
                  href: "/glossary#sim-to-real-gap",
                  label: "Glossary: Sim-to-Real Gap",
                  desc: "Formal definition with references to key papers on domain randomization and transfer learning.",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition-colors"
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#92B090" }}
                  >
                    {link.label}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </GeoPageShell>
    </>
  );
}
