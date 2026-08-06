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
    m('Weeks 1–2 · Framing & search', [
      'AI paradigms and system boundaries',
      'Search, planning, and problem formulation',
    ]),
    m('Weeks 3–4 · Knowledge & learning', [
      'Knowledge representation and reasoning',
      'Machine learning as empirical inference',
    ]),
    m('Weeks 5–6 · Evaluation & interaction', [
      'Evaluation, uncertainty, and error analysis',
      'Human-AI interaction and workflow design',
    ]),
    m('Weeks 7–8 · Responsibility & synthesis', [
      'Responsible AI and governance basics',
      'Integrated AI system proposal',
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
    m('Weeks 1–2 · Framing & data', [
      'Prediction tasks and data framing',
      'Data preparation and feature pipelines',
    ]),
    m('Weeks 3–4 · Models & validation', [
      'Linear and tree-based baselines',
      'Model selection and validation',
    ]),
    m('Weeks 5–6 · Structure & drift', [
      'Unsupervised learning and structure discovery',
      'Time, drift, and monitoring',
    ]),
    m('Weeks 7–8 · Explanation & portfolio', [
      'Interpretability and stakeholder explanation',
      'Predictive modeling portfolio',
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
    m('Weeks 1–2 · Networks & training', [
      'From neurons to multilayer networks',
      'Backpropagation and automatic differentiation',
    ]),
    m('Weeks 3–4 · Optimization & vision', [
      'Optimization, loss, and regularization',
      'Convolutional neural networks for vision',
    ]),
    m('Weeks 5–6 · Sequences & transformers', [
      'Sequence models: RNNs and LSTMs',
      'Attention and transformers',
    ]),
    m('Weeks 7–8 · Generative & scale', [
      'Generative models and applications',
      'GPU workflows, scale, and deployment',
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
    m('Weeks 1–2 · Text & embeddings', [
      'Text preprocessing and linguistic signals',
      'Embeddings and semantic similarity',
    ]),
    m('Weeks 3–4 · Language models', [
      'Language modeling foundations',
      'Transformers for NLP tasks',
    ]),
    m('Weeks 5–6 · RAG & tool use', [
      'Retrieval-augmented generation',
      'Conversation design and tool use',
    ]),
    m('Weeks 7–8 · Evaluation & deployment', [
      'Evaluation for NLP systems',
      'NLP system deployment review',
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
    m('Weeks 1–2 · Foundations', [
      'Ethical theories for AI decisions',
      'Bias, fairness, and representational harm',
    ]),
    m('Weeks 3–4 · Rights & accountability', [
      'Privacy, consent, and data rights',
      'Transparency, explainability, and accountability',
    ]),
    m('Weeks 5–6 · Law & governance', [
      'AI law and emerging regulation',
      'Governance programs and controls',
    ]),
    m('Weeks 7–8 · Practice', [
      'Incident response and redress',
      'Responsible AI policy portfolio',
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
    m('Weeks 1–2 · Architectures & pipelines', [
      'Data architectures for AI',
      'Pipelines, orchestration, and quality',
    ]),
    m('Weeks 3–4 · Storage & scale', [
      'Storage, indexing, and retrieval',
      'Distributed processing and scale',
    ]),
    m('Weeks 5–6 · Lineage & cloud', [
      'Metadata, lineage, and provenance',
      'Cloud integration and cost control',
    ]),
    m('Weeks 7–8 · Governance & readiness', [
      'Security and access governance',
      'AI data platform readiness review',
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
    m('Weeks 1–2 · Structure & data', [
      'Python project structure for AI',
      'Data handling with Python libraries',
    ]),
    m('Weeks 3–4 · Interfaces & testing', [
      'Model APIs and reusable components',
      'Testing and continuous integration',
    ]),
    m('Weeks 5–6 · Services & interfaces', [
      'Application backends and model services',
      'User interfaces and workflow integration',
    ]),
    m('Weeks 7–8 · Deployment', [
      'Packaging, environments, and deployment',
      'End-to-end AI application',
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
    m('Weeks 1–2 · Discovery', [
      'AI product discovery and scoping',
      'Stakeholders, requirements, and risk',
    ]),
    m('Weeks 3–4 · Delivery', [
      'Agile delivery for AI uncertainty',
      'Evaluation plans and acceptance criteria',
    ]),
    m('Weeks 5–6 · Release & adoption', [
      'MLOps and release management',
      'Change management and adoption',
    ]),
    m('Weeks 7–8 · Operations', [
      'Operations, monitoring, and governance',
      'Deployment business case',
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
    m('Weeks 1–2 · Charter & review', [
      'Problem definition and project charter',
      'Literature, market, and domain review',
    ]),
    m('Weeks 3–4 · Design & build', [
      'Architecture and data plan',
      'Prototype implementation',
    ]),
    m('Weeks 5–6 · Evaluate & harden', [
      'Evaluation and iteration',
      'Deployment and operational readiness',
    ]),
    m('Weeks 7–8 · Defend & deliver', [
      'Thesis, documentation, and defense',
      'Final demonstration and handoff',
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
    m('Weeks 1–2 · Imaging & data', ['Clinical imaging workflows', 'Image data, labels, and annotation']),
    m('Weeks 3–4 · Models', ['Preprocessing and augmentation', 'Classification and detection']),
    m('Weeks 5–6 · Measurement & safety', ['Segmentation and measurement', 'Validation, bias, and safety']),
    m('Weeks 7–8 · Translation', ['Regulatory and operational integration', 'Medical imaging AI case review']),
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
    m('Weeks 1–2 · Data & risk', ['Population health data ecosystems', 'Risk stratification and prediction']),
    m('Weeks 3–4 · Inference & forecasting', ['Causal inference and confounding', 'Forecasting and surveillance']),
    m('Weeks 5–6 · Equity & intervention', ['Equity and social determinants', 'Intervention targeting and evaluation']),
    m('Weeks 7–8 · Governance', ['Privacy and public-health governance', 'Population analytics portfolio']),
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
    m('Weeks 1–2 · Foundations', ['Clinical decision support foundations', 'Clinical knowledge and guideline modeling']),
    m('Weeks 3–4 · Assistance', ['Diagnostic assistance and triage', 'Treatment planning and personalization']),
    m('Weeks 5–6 · Human factors & safety', ['Human factors and alert fatigue', 'Validation and clinical safety cases']),
    m('Weeks 7–8 · Oversight', ['Regulation, liability, and monitoring', 'Clinical decision support review']),
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
    m('Weeks 1–2 · Customers & models', ['Customer data and segmentation', 'Recommendation systems']),
    m('Weeks 3–4 · Campaigns & journeys', ['Campaign optimization', 'Customer journey analytics']),
    m('Weeks 5–6 · Generative & measurement', ['Generative AI for marketing operations', 'Measurement, attribution, and incrementality']),
    m('Weeks 7–8 · Trust & portfolio', ['Privacy, consent, and trust', 'AI customer insights portfolio']),
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
    m('Weeks 1–2 · Discovery', ['Process discovery and workflow mapping', 'Robotic process automation basics']),
    m('Weeks 3–4 · Extraction & optimization', ['Document and data extraction', 'Optimization and scheduling']),
    m('Weeks 5–6 · Orchestration & controls', ['Agentic workflow orchestration', 'Controls, auditability, and failure handling']),
    m('Weeks 7–8 · Value', ['Change management and workforce impact', 'Automation business case']),
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
    m('Weeks 1–2 · Positioning & investment', ['AI strategy and competitive positioning', 'Investment thesis and portfolio design']),
    m('Weeks 3–4 · Operating model', ['Capability maturity and operating model', 'Build, buy, partner, or wait']),
    m('Weeks 5–6 · Risk & value', ['Risk appetite and governance', 'Metrics, value realization, and accountability']),
    m('Weeks 7–8 · Talent & synthesis', ['Talent, culture, and change', 'Executive AI strategy brief']),
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
    m('Weeks 1–2 · Telemetry & anomalies', ['Security telemetry and threat models', 'Anomaly detection foundations']),
    m('Weeks 3–4 · Analysis & intel', ['Malware and network behavior analysis', 'Threat intelligence and enrichment']),
    m('Weeks 5–6 · Detection & evasion', ['Detection engineering and evaluation', 'Adversarial behavior and evasion']),
    m('Weeks 7–8 · Operations', ['Security operations integration', 'Threat detection portfolio']),
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
    m('Weeks 1–2 · Lifecycle & playbooks', ['Incident response lifecycle', 'Playbooks and decision trees']),
    m('Weeks 3–4 · Orchestration', ['SOAR and tool orchestration', 'Containment and remediation automation']),
    m('Weeks 5–6 · Oversight & testing', ['Human approval and escalation', 'Testing response automation']),
    m('Weeks 7–8 · Learning', ['Post-incident learning', 'Automated response readiness review']),
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
    m('Weeks 1–2 · Concepts & modeling', ['Cyber risk concepts and assets', 'Threat likelihood and impact modeling']),
    m('Weeks 3–4 · Prioritization & scenarios', ['Vulnerability prioritization', 'Scenario analysis and stress testing']),
    m('Weeks 5–6 · Controls & reporting', ['Controls and residual risk', 'Executive reporting and risk communication']),
    m('Weeks 7–8 · Governance', ['Governance, compliance, and audit', 'Cyber risk assessment portfolio']),
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
