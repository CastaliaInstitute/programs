import type { AimaLmsVariantKey } from './site-links'

/** One module or week grouping on the public syllabus. */
export interface SyllabusModule {
  title: string
  topics: string[]
}

/**
 * Public catalog row + course detail page payload (AINS courses, certificates, AIMA5001 variants).
 */
export interface CatalogCourseDetail {
  code: string
  /** Short title without code prefix (e.g. "Foundations of Artificial Intelligence"). */
  title: string
  /** URL segment under /catalog/courses/ */
  routeSlug: string
  /** Shown in catalog tables (availability, pilot, or academic year). */
  dateLabel: string
  description: string
  syllabus: SyllabusModule[]
  /**
   * Primary outbound link for the catalog “LMS” column and course page (Moodle course, program site, etc.).
   * If unset and `aimaLmsVariant` is unset, the site uses the LMS home. Optional env: `PUBLIC_CASTALIA_LMS_<CODE>`.
   */
  lmsUrl?: string
  /** When set, the course page links via `castaliaLmsAimaDemoUrl` for this AIMA5001 product line. */
  aimaLmsVariant?: AimaLmsVariantKey
  /** Course detail page eyebrow (e.g. "Certificate program"). */
  eyebrow?: string
  /** Override default “Castalia LMS” panel title on the course page. */
  linkPanelTitle?: string
  /** Override default “Open Castalia LMS” button label. */
  linkButtonLabel?: string
  /** Override default panel body copy under the link panel title. */
  linkPanelBody?: string
}

export function courseRouteSlugFromCode(code: string): string {
  return code.replace(/\s+/g, '-').replace(/:/g, '').toLowerCase()
}

/** Map "AIMA5001: Simple" → aima5001-simple */
export function aimaProductRouteSlug(courseCode: string): string {
  const m = courseCode.match(/^AIMA5001:\s*(.+)$/i)
  if (!m) return courseRouteSlugFromCode(courseCode)
  const tail = m[1]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `aima5001-${tail}`
}

const REF_CORE = 'Core sequence · catalog 2026–27'
const REF_SPEC = 'Specialization pilot · 2026–27'
const REF_CERT = 'Certificate line · 2026–27'

function m(title: string, topics: string[]): SyllabusModule {
  return { title, topics }
}

/** Moodle URL for the Castalia AIMA certificate (AINS5001). Certificate URL preferred. */
function lmsUrlAimaCertificate(): string | undefined {
  const cert = import.meta.env.PUBLIC_CASTALIA_LMS_AIMA_CERTIFICATE_URL
  const byCode = import.meta.env.PUBLIC_CASTALIA_LMS_AINS5001
  const s = String(cert ?? '').trim() || String(byCode ?? '').trim()
  return s.length > 0 ? s : undefined
}

/** AIMA certificate pathway — Russell & Norvig spine on Castalia LMS (see PUBLIC_CASTALIA_LMS_AIMA_CERTIFICATE_URL). */
export const COURSE_AINS5001: CatalogCourseDetail = {
  code: 'AINS5001',
  title: 'A Modern Approach to AI',
  routeSlug: 'ains5001',
  dateLabel: 'AIMA certificate · 2026–27',
  description:
    'Certificate-style coverage of classical AI aligned with Russell and Norvig’s Artificial Intelligence: A Modern Approach: intelligent agents, search, knowledge, learning, and planning. Offered as the Castalia AIMA certificate track on Moodle so learners earn a recognizable AIMA-aligned credential and institutions can bridge into the graduate AINS core.',
  syllabus: [
    m('Modules 1–2 · Agents & search', [
      'PEAS and problem-solving agents',
      'Uninformed and informed search; A* and heuristics',
      'Games, CSPs, and adversarial search (intro)',
    ]),
    m('Modules 3–4 · Knowledge & learning', [
      'Logic and inference (intro); knowledge graphs touchpoints',
      'Machine learning framing: loss, generalization, evaluation',
      'Neural networks and deep learning (survey)',
    ]),
    m('Modules 5–6 · Planning, language & responsibility', [
      'Classical planning representations',
      'NLP pipeline overview',
      'Fairness, safety, and deployment hygiene',
    ]),
  ],
  lmsUrl: lmsUrlAimaCertificate(),
}

/** Public program + certificate hub: https://mhth.castalia.institute */
function mhthCertificateSiteUrl(): string {
  const o =
    import.meta.env.PUBLIC_MHTH_URL ??
    import.meta.env.PUBLIC_MHH_URL ??
    import.meta.env.PUBLIC_MHTH_CERTIFICATE_URL
  const s = String(o ?? '').trim()
  return s.length > 0 ? s.replace(/\/$/, '') : 'https://mhth.castalia.institute'
}

/** More Human Than Human — interdisciplinary certificate (program site at mhth.castalia.institute). */
export const COURSE_MHH5001: CatalogCourseDetail = {
  code: 'MHH5001',
  title: 'More Human Than Human',
  routeSlug: 'mhh5001',
  dateLabel: 'Certificate · 2026–27',
  description:
    'A Castalia certificate for learners and cohorts exploring what “human” means alongside increasingly capable systems: narrative, embodiment, ethics, creativity, and civic consequence. Anchored to the public More Human Than Human program at mhth.castalia.institute with optional LMS delivery on lms.castalia.institute per institution.',
  syllabus: [
    m('Modules 1–2 · Frames', [
      'Histories of the human and the posthuman (survey)',
      'Agency, identity, and narrative',
      'Introduction to critical lenses on AI hype',
    ]),
    m('Modules 3–4 · Practices', [
      'Embodiment, perception, and mediated experience',
      'Creativity, labor, and machine assistance',
      'Community norms and consent',
    ]),
    m('Modules 5–6 · Futures', [
      'Governance, dignity, and solidarity',
      'Capstone: essay, artifact, or facilitation project',
      'Paths to stackable credentials with AINS graduate courses',
    ]),
  ],
  lmsUrl: mhthCertificateSiteUrl(),
  eyebrow: 'Certificate program',
  linkPanelTitle: 'More Human Than Human',
  linkButtonLabel: 'Open mhth.castalia.institute',
  linkPanelBody:
    'Certificate details, cohort announcements, and enrollment pathways live on the program site. Partner institutions run cohorts on Castalia LMS when licensed.',
}

/** Shared AINS6010 row (graduate stack + certificate program) — Sovereign AI certificate. */
export const COURSE_AINS6010: CatalogCourseDetail = {
  code: 'AINS6010',
  title: 'Sovereign AI',
  routeSlug: 'ains6010',
  dateLabel: REF_CERT,
  description:
    'Stackable certificate on running capable AI under institutional control: data sovereignty and residency, on-premises and edge deployment, air-gapped or region-bound operation, and secure lifecycle practices—so teams can deliver AI without surrendering custody of models, telemetry, or policy to external clouds by default.',
  syllabus: [
    m('Modules 1–2 · Sovereignty & strategy', [
      'What “sovereign AI” means for data, models, and infrastructure',
      'Cloud vs on-prem vs edge tradeoffs; residency and compliance hooks',
      'Risk framing: supply chain, vendor lock-in, and exit plans',
    ]),
    m('Modules 3–4 · Engineering stack', [
      'Hardware classes: CPU, GPU, NPU, embedded; power and latency budgets',
      'Packaging: containers, reproducible runtimes, quantization where needed',
      'Serving, rollback, and observability for controlled environments',
    ]),
    m('Modules 5–6 · Governance & operations', [
      'Threat modeling for on-prem models and sensitive data',
      'Updates, patching, and incident response without public-cloud assumptions',
      'Hands-on labs with representative sovereign/local stacks',
    ]),
  ],
}

const C6001: CatalogCourseDetail = {
  code: 'AINS6001',
  title: 'Foundations of Artificial Intelligence',
  routeSlug: 'ains6001',
  dateLabel: REF_CORE,
  description:
    'Graduate introduction to AI as rigorous problem solving: search, knowledge, learning, and agents—aligned with modern practice and responsible use.',
  syllabus: [
    m('Modules 1–2 · Problems & agents', [
      'Problem formulations and evaluation functions',
      'Uninformed and informed search',
      'Constraint satisfaction patterns',
    ]),
    m('Modules 3–4 · Knowledge & reasoning', [
      'Logic, inference, and knowledge graphs (intro)',
      'Planning representations',
      'Uncertainty basics bridging to ML',
    ]),
    m('Modules 5–6 · Learning & ethics', [
      'Supervised learning framing',
      'Generalization and evaluation hygiene',
      'Fairness, safety, and policy hooks',
    ]),
  ],
}

const C6002: CatalogCourseDetail = {
  code: 'AINS6002',
  title: 'Machine Learning & Predictive Modeling',
  routeSlug: 'ains6002',
  dateLabel: REF_CORE,
  description:
    'Core graduate ML: supervised and unsupervised methods, validation design, and responsible deployment patterns for prediction tasks.',
  syllabus: [
    m('Modules 1–2 · Foundations', [
      'Losses, optimization, regularization',
      'Cross-validation and leakage',
      'Baselines and error analysis',
    ]),
    m('Modules 3–4 · Methods', [
      'Tree ensembles and calibration',
      'Clustering and dimensionality reduction',
      'Feature engineering discipline',
    ]),
    m('Modules 5–6 · Practice', [
      'Imbalanced data and cost-sensitive learning',
      'Monitoring drift and maintenance',
      'Case studies from partner domains',
    ]),
  ],
}

const C6003: CatalogCourseDetail = {
  code: 'AINS6003',
  title: 'Deep Learning & Neural Networks',
  routeSlug: 'ains6003',
  dateLabel: REF_CORE,
  description:
    'Neural architectures from CNNs through transformers, pretraining and fine-tuning at scale, and practical debugging for vision, sequence, and generative modeling tasks.',
  syllabus: [
    m('Modules 1–2 · Networks & training', [
      'Backpropagation and autodiff mental models',
      'Optimization and learning-rate strategies',
      'Initialization and normalization',
    ]),
    m('Modules 3–4 · Architectures', [
      'CNNs and spatial inductive bias',
      'Attention and transformer architectures in depth',
      'Pretraining, transfer learning, and parameter-efficient fine-tuning',
    ]),
    m('Modules 5–6 · Scale & engineering', [
      'Scaling behavior, compute budgets, and mixed precision',
      'Experiment tracking and reproducibility',
      'Failure modes, robustness checks, and evaluating generative models',
    ]),
  ],
}

const C6004: CatalogCourseDetail = {
  code: 'AINS6004',
  title: 'Natural Language Processing',
  routeSlug: 'ains6004',
  dateLabel: REF_CORE,
  description:
    'Text as data: tokenization through large language models, retrieval-augmented generation, evaluation, and guardrails for NLP systems in production.',
  syllabus: [
    m('Modules 1–2 · Representations', [
      'Tokenization and embeddings',
      'Classification and sequence labeling',
      'Retrieval, lexical resources, and vector search',
    ]),
    m('Modules 3–4 · Large language models', [
      'LLM architectures, pretraining, and instruction tuning',
      'Prompting, retrieval-augmented generation, and tool use',
      'Agentic workflows and orchestration patterns',
    ]),
    m('Modules 5–6 · Deployment', [
      'Evaluating generative systems: task evals, hallucination, and bias',
      'Safety guardrails and content policies',
      'Latency/cost tradeoffs and domain adaptation',
    ]),
  ],
}

const C6005: CatalogCourseDetail = {
  code: 'AINS6005',
  title: 'AI Ethics, Law & Policy',
  routeSlug: 'ains6005',
  dateLabel: REF_CORE,
  description:
    'Normative frameworks, emerging regulation, and operational governance for AI systems in educational and enterprise contexts.',
  syllabus: [
    m('Modules 1–2 · Frameworks', [
      'Harm, justice, and accountability',
      'Professional codes and institutional review',
      'Risk tiers and documentation',
    ]),
    m('Modules 3–4 · Law & standards', [
      'Privacy and IP touchpoints',
      'Sector-specific obligations (survey)',
      'Procurement and vendor diligence',
    ]),
    m('Modules 5–6 · Practice', [
      'Incident response for model failures',
      'Stakeholder communication',
      'Capstone ethics case study',
    ]),
  ],
}

const C6006: CatalogCourseDetail = {
  code: 'AINS6006',
  title: 'Big Data Management for AI Applications',
  routeSlug: 'ains6006',
  dateLabel: REF_CORE,
  description:
    'Data platforms, governance, and pipelines that feed reliable training and evaluation datasets for AI workloads.',
  syllabus: [
    m('Modules 1–2 · Platforms', [
      'Lakehouse concepts and query engines',
      'Batch vs streaming (intro)',
      'Schema evolution and contracts',
    ]),
    m('Modules 3–4 · Quality', [
      'Data validation and anomaly detection',
      'Labeling operations and inter-rater reliability',
      'Lineage and reproducibility',
    ]),
    m('Modules 5–6 · Scale', [
      'Partitioning and cost controls',
      'Access control patterns',
      'Lab: end-to-end pipeline slice',
    ]),
  ],
}

const C6007: CatalogCourseDetail = {
  code: 'AINS6007',
  title: 'Applied AI Programming with Python',
  routeSlug: 'ains6007',
  dateLabel: REF_CORE,
  description:
    'Hands-on Python for data wrangling, modeling, and packaging AI components suitable for team engineering standards.',
  syllabus: [
    m('Modules 1–2 · Stack', [
      'Environment and dependency hygiene',
      'Vectorized numerics and profiling',
      'Testing ML-adjacent code',
    ]),
    m('Modules 3–4 · Modeling in code', [
      'Frameworks for training loops',
      'Experiment configs and seeds',
      'Serialization and model artifacts',
    ]),
    m('Modules 5–6 · Integration', [
      'APIs and batch jobs',
      'Containers (intro)',
      'Peer review capstone',
    ]),
  ],
}

const C6008: CatalogCourseDetail = {
  code: 'AINS6008',
  title: 'AI Project Management & Deployment',
  routeSlug: 'ains6008',
  dateLabel: REF_CORE,
  description:
    'Delivery practices for AI initiatives: scoping, milestones, MLOps handoffs, and operating models across academic and industry partners.',
  syllabus: [
    m('Modules 1–2 · Scoping', [
      'Problem framing and success metrics',
      'Data readiness assessments',
      'Stakeholder maps',
    ]),
    m('Modules 3–4 · Delivery', [
      'Roadmaps and milestone gates',
      'Model risk tiers',
      'Documentation packages',
    ]),
    m('Modules 5–6 · Operations', [
      'Release and rollback',
      'Monitoring and SLAs',
      'Team rituals and retrospectives',
    ]),
  ],
}

const C6009: CatalogCourseDetail = {
  code: 'AINS6009',
  title: 'Capstone Project',
  routeSlug: 'ains6009',
  dateLabel: 'Capstone · rolling admissions 2026–27',
  description:
    'Integrative project with faculty mentor: students ship an end-to-end artifact with evaluation, ethics review, and presentation.',
  syllabus: [
    m('Phase 1 · Proposal', [
      'Team formation and advisor alignment',
      'Problem statement and dataset plan',
      'Ethics checklist',
    ]),
    m('Phase 2 · Execution', [
      'Milestones and weekly demos',
      'Risk tracking',
      'Reproducibility artifacts',
    ]),
    m('Phase 3 · Delivery', [
      'Final evaluation report',
      'Stakeholder presentation',
      'Handoff documentation',
    ]),
  ],
}

const C6100: CatalogCourseDetail = {
  code: 'AINS6100',
  title: 'AI in Medical Imaging',
  routeSlug: 'ains6100',
  dateLabel: REF_SPEC,
  description:
    'Imaging modalities, annotation quality, and model evaluation under clinical constraints—without offering medical advice.',
  syllabus: [
    m('Modules 1–2 · Imaging stack', ['DICOM basics', 'Preprocessing and augmentation', 'Reader studies']),
    m('Modules 3–4 · Models', ['Segmentation/detection framing', 'Uncertainty and calibration', 'External validation']),
    m('Modules 5–6 · Translation', ['Workflow fit', 'Regulatory touchpoints (survey)', 'Deployment guardrails']),
  ],
}

const C6101: CatalogCourseDetail = {
  code: 'AINS6101',
  title: 'Predictive Analytics in Population Health',
  routeSlug: 'ains6101',
  dateLabel: REF_SPEC,
  description:
    'Cohort analytics, survival and risk models, and fairness considerations for population-level decision support contexts.',
  syllabus: [
    m('Modules 1–2 · Data', ['Claims and EHR feature stores (intro)', 'Temporal splits', 'Missingness strategies']),
    m('Modules 3–4 · Methods', ['Risk scoring', 'Calibration in the wild', 'Clustering cohorts']),
    m('Modules 5–6 · Ethics', ['Bias auditing', 'Transparency to clinicians', 'Evaluation ethics']),
  ],
}

const C6102: CatalogCourseDetail = {
  code: 'AINS6102',
  title: 'AI for Clinical Decision Support',
  routeSlug: 'ains6102',
  dateLabel: REF_SPEC,
  description:
    'Human–AI collaboration patterns, alert fatigue, and evaluation protocols for CDS tools in educational simulations.',
  syllabus: [
    m('Modules 1–2 · UX of AI', ['Cognitive load', 'Explainability tradeoffs', 'Simulation scenarios']),
    m('Modules 3–4 · Evaluation', ['Task-based metrics', 'Human-in-the-loop studies', 'Safety monitoring']),
    m('Modules 5–6 · Governance', ['Change management', 'Policy alignment', 'Case debriefs']),
  ],
}

const C6200: CatalogCourseDetail = {
  code: 'AINS6200',
  title: 'AI for Marketing & Customer Insights',
  routeSlug: 'ains6200',
  dateLabel: REF_SPEC,
  description:
    'Measurement, experimentation, and responsible personalization for customer analytics in digital channels.',
  syllabus: [
    m('Modules 1–2 · Measurement', ['Attribution basics', 'Lift testing', 'Cohort KPIs']),
    m('Modules 3–4 · Modeling', ['Recommendation patterns', 'Content ranking (survey)', 'Privacy-preserving techniques (intro)']),
    m('Modules 5–6 · Practice', ['Campaign simulation', 'Ethical targeting', 'Executive readouts']),
  ],
}

const C6201: CatalogCourseDetail = {
  code: 'AINS6201',
  title: 'Automation & Process Optimization',
  routeSlug: 'ains6201',
  dateLabel: REF_SPEC,
  description:
    'Process mining, RPA + ML hybrids, and ROI framing for operations teams adopting intelligent automation.',
  syllabus: [
    m('Modules 1–2 · Discovery', ['Process maps', 'Bottleneck analysis', 'Data capture for processes']),
    m('Modules 3–4 · Automation', ['Rules vs learned policies', 'Exception handling', 'Human oversight']),
    m('Modules 5–6 · Value', ['Cost models', 'Change management', 'Controls and audit']),
  ],
}

const C6202: CatalogCourseDetail = {
  code: 'AINS6202',
  title: 'AI Strategy for Executives',
  routeSlug: 'ains6202',
  dateLabel: REF_SPEC,
  description:
    'Portfolio framing, vendor selection, and talent models for leaders sponsoring AI initiatives.',
  syllabus: [
    m('Modules 1–2 · Strategy', ['Use-case portfolios', 'Build vs buy', 'Risk appetite']),
    m('Modules 3–4 · Execution', ['Operating cadence', 'Data foundations investment', 'Partnerships']),
    m('Modules 5–6 · Governance', ['Board reporting', 'Crisis scenarios', 'Roadmap synthesis']),
  ],
}

const C6300: CatalogCourseDetail = {
  code: 'AINS6300',
  title: 'AI in Threat Detection',
  routeSlug: 'ains6300',
  dateLabel: REF_SPEC,
  description:
    'Supervised and unsupervised patterns for security telemetry, with emphasis on false positives and analyst workflows.',
  syllabus: [
    m('Modules 1–2 · Data', ['Log sources and featureization', 'Label challenges', 'Adversarial blind spots']),
    m('Modules 3–4 · Detection', ['Anomaly frameworks', 'Graph signals (intro)', 'Alert prioritization']),
    m('Modules 5–6 · Ops', ['Playbooks', 'Purple-team exercises', 'Privacy/compliance constraints']),
  ],
}

const C6301: CatalogCourseDetail = {
  code: 'AINS6301',
  title: 'Automated Response Systems',
  routeSlug: 'ains6301',
  dateLabel: REF_SPEC,
  description:
    'Policy-driven automation, human approvals, and safe rollback for orchestrated response actions.',
  syllabus: [
    m('Modules 1–2 · Orchestration', ['SOAR concepts', 'Policy languages', 'Simulation sandboxes']),
    m('Modules 3–4 · ML hooks', ['Ranking actions', 'Confidence thresholds', 'Feedback loops']),
    m('Modules 5–6 · Safety', ['Kill switches', 'Audit trails', 'Tabletop exercises']),
  ],
}

const C6302: CatalogCourseDetail = {
  code: 'AINS6302',
  title: 'AI for Risk Assessment',
  routeSlug: 'ains6302',
  dateLabel: REF_SPEC,
  description:
    'Quantitative risk scoring, scenario analysis, and governance metrics for cyber and operational risk programs.',
  syllabus: [
    m('Modules 1–2 · Fundamentals', ['Risk matrices', 'Bayesian touches for priors', 'Data limitations']),
    m('Modules 3–4 · Models', ['Scoring architectures', 'Calibration for decision thresholds', 'Stress tests']),
    m('Modules 5–6 · Reporting', ['Board-ready narratives', 'Controls mapping', 'Continuous improvement']),
  ],
}

const C6400: CatalogCourseDetail = {
  code: 'AINS6400',
  title: 'Robot Perception & Spatial AI',
  routeSlug: 'ains6400',
  dateLabel: REF_SPEC,
  description:
    'Sensing, state estimation, and spatial representations for mobile robots and manipulators in education lab settings.',
  syllabus: [
    m('Modules 1–2 · Sensing', ['Camera/LiDAR models', 'Noise and calibration', 'Sensor fusion intro']),
    m('Modules 3–4 · Perception', ['Detection/segmentation for robotics', 'Depth and mapping', 'Tracking']),
    m('Modules 5–6 · Labs', ['Simulators', 'Hardware safety', 'Mini-projects']),
  ],
}

const C6401: CatalogCourseDetail = {
  code: 'AINS6401',
  title: 'Motion Planning, Control & Learning for Autonomous Systems',
  routeSlug: 'ains6401',
  dateLabel: REF_SPEC,
  description:
    'Planning under dynamics, classic and learning-based control, and safe exploration for autonomous platforms.',
  syllabus: [
    m('Modules 1–2 · Kinematics & dynamics', ['State spaces', 'Controllers', 'Stability intuition']),
    m('Modules 3–4 · Planning', ['Search in continuous spaces', 'Sampling-based planners', 'Trajectory optimization intro']),
    m('Modules 5–6 · Learning', ['Policy learning (survey)', 'Sim-to-real', 'Safety filters']),
  ],
}

const C6402: CatalogCourseDetail = {
  code: 'AINS6402',
  title: 'Multi-Robot Systems & Human-Robot Interaction',
  routeSlug: 'ains6402',
  dateLabel: REF_SPEC,
  description:
    'Coordination, communication, and human factors for multi-agent robotics and collaborative automation.',
  syllabus: [
    m('Modules 1–2 · Multi-robot', ['Task allocation', 'Swarm basics', 'Communication graphs']),
    m('Modules 3–4 · HRI', ['Interfaces', 'Trust and transparency', 'Ethical deployment']),
    m('Modules 5–6 · Projects', ['Team simulations', 'Evaluation protocols', 'Demo day']),
  ],
}

/** Core sequence (9) — graduate AI courses offering. */
export const ainsGraduateCoreCourses: CatalogCourseDetail[] = [
  C6001,
  C6002,
  C6003,
  C6004,
  C6005,
  C6006,
  C6007,
  C6008,
  C6009,
]

/** Castalia AIMA certificate (undergraduate-style / certificate pathway). */
export const ainsAimaCertificateCourses: CatalogCourseDetail[] = [COURSE_AINS5001]

/** More Human Than Human certificate (program hub mhth.castalia.institute). */
export const mhthCertificateCourses: CatalogCourseDetail[] = [COURSE_MHH5001]

export const ainsStackableCertificateCourses: CatalogCourseDetail[] = [COURSE_AINS6010]

export const ainsHealthcareCourses: CatalogCourseDetail[] = [C6100, C6101, C6102]

export const ainsBusinessCourses: CatalogCourseDetail[] = [C6200, C6201, C6202]

export const ainsCyberCourses: CatalogCourseDetail[] = [C6300, C6301, C6302]

export const ainsRoboticsCourses: CatalogCourseDetail[] = [C6400, C6401, C6402]

const BY_CODE: Record<string, CatalogCourseDetail> = {}
for (const c of [
  COURSE_AINS5001,
  COURSE_MHH5001,
  ...ainsGraduateCoreCourses,
  COURSE_AINS6010,
  ...ainsHealthcareCourses,
  ...ainsBusinessCourses,
  ...ainsCyberCourses,
  ...ainsRoboticsCourses,
]) {
  BY_CODE[c.code] = c
}

export function getAinsCatalogCourseByCode(code: string): CatalogCourseDetail | undefined {
  return BY_CODE[code]
}

export function allAinsCatalogCourses(): CatalogCourseDetail[] {
  return Object.values(BY_CODE)
}

const AIMA_SYLLABUS_SPINE: SyllabusModule[] = [
  m('Weeks 1–4 · Problem solving & search', [
    'Problem formulations and search strategies',
    'Heuristics and optimality',
    'Games and adversarial search (intro)',
  ]),
  m('Weeks 5–8 · Knowledge, learning, agents', [
    'Logical representations and inference (intro)',
    'Machine learning framing and evaluation',
    'Agents, planning touchpoints, and responsible deployment',
  ]),
]

/** Build a catalog row for an AIMA5001 deliverable demo (links LMS variant on the course page). */
export function aimaDemoToCatalogCourse(d: {
  courseCode: string
  summary: string
  statusExpected: string
  lmsVariant: AimaLmsVariantKey
}): CatalogCourseDetail {
  const tail = d.courseCode.replace(/^AIMA5001:\s*/i, '').trim()
  return {
    code: d.courseCode,
    title: tail,
    routeSlug: aimaProductRouteSlug(d.courseCode),
    dateLabel: d.statusExpected,
    description: d.summary,
    syllabus: AIMA_SYLLABUS_SPINE,
    aimaLmsVariant: d.lmsVariant,
  }
}
