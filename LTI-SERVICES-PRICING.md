# LTI-based services — pricing framework

Use this note to align **what you sell** (integration + operations + support) with **how you meter and invoice** it. LTI is a *delivery surface*; commercial value is usually priced as a **platform or partnership bundle**, not “per LTI message.”

## 1. Scope the product, not only the protocol

Before numbers, document:

| Layer | What to clarify |
|--------|-----------------|
| **Tooling** | Single LTI 1.3 tool vs suite (content, assessment, analytics); deep linking; AGS (grade passback); NRPS (roster). |
| **Identity** | LTI OIDC login only vs institution SSO bridge; guest vs enrolled-only; role mapping. |
| **Data** | What leaves the LMS; retention; analytics; model training (if any); subprocessors. |
| **Hosting** | Shared multi-tenant vs dedicated stack; region; uptime target. |
| **LMS targets** | Certified against which versions (Canvas, Moodle, Blackboard, D2L); test environments. |

## 2. Cost drivers (internal)

- Engineering: registration endpoints, security review, per-LMS QA, regression when LMS upgrades.
- Operations: monitoring, incident response, key rotation, tenant onboarding.
- Customer success: faculty training, helpdesk tier, launch playbooks.
- Legal/compliance: DPAs, amendments for regulated sectors.

## 3. Common commercial models (pick 1–2 primary)

| Model | Fits when… | Watch-outs |
|--------|------------|------------|
| **Annual institution license** | One tenant, predictable budget; K–12 or single HEI. | Define “institution” (system vs campus); caps on deployments. |
| **Tiered by scale** | FTE, headcount, or “active placements” bands. | Avoid unbounded MAU without a ceiling or overage. |
| **Per deployment / per tool registration** | Many discrete programs or schools buying separately. | Admin overhead; prefer bundles after N deployments. |
| **Pilot → convert** | New category or long sales cycle. | Write conversion price + scope in pilot SOW. |
| **Usage (API calls, assessments, tokens)** | Clear metering and customer trust in telemetry. | Needs transparent dashboards; risk of customer surprise. |
| **Content + LTI** | You ship cartridges *and* runtime tool. | Split license: content SKU vs runtime SKU, or one bundle SKU. |

Stripe (or similar) works well for **fixed SKUs** (pilot fee, annual platform tier). **True usage billing** usually needs metering in your app + Stripe Billing meters or invoices.

## 4. What to capture in every quote

1. **Parties** — who signs; which campuses/sites are in scope.  
2. **Term** — 12 months vs multi-year; renewal uplift cap.  
3. **Included seats / MAU / placements** — definition and overage rule.  
4. **SLA** — response time, not just uptime; exclusion windows.  
5. **Support** — channels, hours, named CSM or pooled.  
6. **Data processing** — DPA reference; subprocessors; region.  
7. **Exit** — export format; deprovision timeline.

## 5. Next steps for Castalia

- [ ] Decide whether LTI is **bundled with course licenses** (recommended for curriculum-heavy offers) or **sold as a platform line item** for BYO content.  
- [ ] Pick **primary meter**: institution tier vs MAU vs cohort count.  
- [ ] Align **pilot pricing** to a defined conversion path (see `salesProcess` on the programs site).  
- [ ] Map **env-based Stripe Payment Links** per SKU only where self-serve makes sense; keep enterprise paths on quote + invoice.

This document is internal planning; public-facing copy lives on the **For institutions** page (`/institutions#lti-pricing`).
