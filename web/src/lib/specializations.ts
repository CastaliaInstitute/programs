import type { CatalogCourseDetail } from './catalog-courses'
import {
  ainsBusinessCourses,
  ainsCyberCourses,
  ainsHealthcareCourses,
  ainsRoboticsCourses,
} from './catalog-courses'

/** One licensable AINS specialization cluster (three courses). */
export interface SpecializationDetail {
  slug: string
  /** Display title with “specialization” wording */
  title: string
  /** Meta description / OG */
  description: string
  /** Body paragraphs for the landing page */
  paragraphs: string[]
  /** Typical buyer outcomes */
  outcomes: string[]
  courses: CatalogCourseDetail[]
}

export const specializationDetails: SpecializationDetail[] = [
  {
    slug: 'healthcare-ai',
    title: 'Healthcare AI specialization',
    description:
      'Three-course graduate cluster for AI in medical imaging, population health analytics, and clinical decision support—licensable for institutional catalogs.',
    paragraphs: [
      'The Healthcare AI track prepares cohorts to apply machine learning and NLP in regulated clinical-adjacent contexts: imaging pipelines, cohort analytics, and human–AI collaboration in decision support. Courses emphasize measurement discipline, fairness awareness, and realistic deployment constraints—not practicing medicine.',
      'Partners license all three courses as a concentration students complete after core AI foundations, or pilot a subset aligned with local accreditors and clinical partners.',
      'In the reference graduate layout, this cluster occupies nine specialization credits toward a ~36-credit degree; your registrar defines official titles, prerequisites, and stack rules.',
    ],
    outcomes: [
      'Evaluate imaging and population-health models with clinically plausible protocols (education / simulation).',
      'Communicate limitations, bias risks, and governance hooks for CDS-style tools.',
      'Package artifacts institutions can map to graduate certificates or degree concentrations.',
    ],
    courses: ainsHealthcareCourses,
  },
  {
    slug: 'business-ai',
    title: 'Business AI specialization',
    description:
      'Three-course cluster covering marketing intelligence, intelligent automation, and executive AI strategy—licensable for MBA-style and professional graduate programs.',
    paragraphs: [
      'Business AI focuses on measurable outcomes: customer analytics, process automation with oversight, and portfolio-level AI strategy. Cases emphasize experimentation design, ROI framing, and responsible personalization.',
      'Institutions use this cluster for concentrations in analytics, operations, or innovation leadership; credits and prerequisites are defined locally.',
      'Designed to stack after shared AI foundations and alongside the capstone in the reference MSAI-style sequence.',
    ],
    outcomes: [
      'Design experiments and automation workflows with clear KPIs and governance.',
      'Lead AI initiatives with credible vendor and talent narratives for executives.',
      'Produce licensing-ready syllabi and assessments aligned to professional graduate rigor.',
    ],
    courses: ainsBusinessCourses,
  },
  {
    slug: 'cybersecurity-ai',
    title: 'Cybersecurity AI specialization',
    description:
      'Three-course cluster for AI-assisted threat detection, automated response, and quantitative cyber risk—aligned with modern SOC and GRC practice.',
    paragraphs: [
      'Cybersecurity AI connects statistical learning and orchestration to defender workflows: telemetry and anomaly detection, SOAR-style response policies with human checkpoints, and FAIR-style risk modeling with transparent assumptions.',
      'Hands-on materials can pair with Castalia lab environments (for example ANUBIS—the Android NetHunter Unified Breach Intelligence System at anubis.castalia.institute); institution-managed ranges work equally where policy requires.',
      'Suited for technical graduate concentrations that already include core AI, ML, and ethics.',
    ],
    outcomes: [
      'Prioritize detections and automate responses without sacrificing auditability.',
      'Quantify risk scenarios for leadership using defendable assumptions.',
      'Critique adversarial and operational limits of AI in security contexts.',
    ],
    courses: ainsCyberCourses,
  },
  {
    slug: 'robotics-ai',
    title: 'Robotics AI specialization',
    description:
      'Three-course cluster spanning perception, planning and learning-based control, and multi-robot / human–robot interaction for graduate robotics curricula.',
    paragraphs: [
      'Robotics AI blends geometric and learned representations for embodied systems: sensing and mapping, motion planning under dynamics, and coordination with humans or fleets.',
      'Labs assume simulator-first workflows with optional hardware tie-ins; institutions map prerequisites from robotics or mechanical engineering programs.',
      'Complements core deep learning and ML courses with embodied systems emphasis.',
    ],
    outcomes: [
      'Reason about sensing uncertainty, safety envelopes, and sim-to-real gaps.',
      'Integrate classical planning with learned policies where appropriate.',
      'Evaluate multi-robot and HRI scenarios with clear evaluation protocols.',
    ],
    courses: ainsRoboticsCourses,
  },
]

export function getSpecializationBySlug(slug: string): SpecializationDetail | undefined {
  return specializationDetails.find((s) => s.slug === slug)
}

export function allSpecializations(): SpecializationDetail[] {
  return specializationDetails
}
