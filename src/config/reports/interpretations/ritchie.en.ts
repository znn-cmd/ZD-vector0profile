// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin Interpretation Dictionary — English
//
//  12 motivational scales × 5 bands + 4 role-fit groups
//
//  Band thresholds (normalised 0–100):
//    very_high ≥ 80, high 65–79, medium 45–64, low 30–44, very_low < 30
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { RitchieScaleBandBlock, RoleFitInterpretation } from "./types";

// ─── INC: Incentive / Financial Motivation ──────────────────────────

export const INC_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Money-Motivated",
    energizedBy: "Unlimited earning potential, visible pay-for-performance, clear commission accelerators, and competitive compensation benchmarks.",
    demotivatedBy: "Capped commissions, opaque compensation structures, heavy base-weight packages, or environments where top performers earn similarly to average ones.",
    managementImplication: "Design a transparent, uncapped commission structure. Publicly share top-earner stories. This person will self-motivate as long as the earning potential is clear and achievable.",
    retentionImplication: "Will leave for a 15–20% compensation increase without hesitation if the relationship or growth path is not also strong. Ensure total comp is market-leading.",
  },
  {
    band: "high",
    label: "Financially Driven",
    energizedBy: "Strong commission structures, performance bonuses, and clear pathways to higher earnings. Appreciates knowing what top performers earn.",
    demotivatedBy: "Below-market compensation, unclear bonus criteria, or environments where effort does not translate to visible financial reward.",
    managementImplication: "Ensure compensation is competitive and that the link between performance and pay is explicit. Quarterly reviews that include earnings trajectory discussions will keep engagement high.",
  },
  {
    band: "medium",
    label: "Balanced Financial Interest",
    energizedBy: "Fair compensation that reflects effort, with a mix of base and variable. Values total package including benefits and perks.",
    demotivatedBy: "Feeling underpaid relative to peers. Sudden compensation plan changes that reduce predictability.",
    managementImplication: "Standard performance-pay alignment is sufficient. Financial incentives are part of the motivation mix but not the primary driver.",
  },
  {
    band: "low",
    label: "Low Financial Motivation",
    energizedBy: "Purpose, meaning, and team connection matter more than money. Appreciates stability and work–life balance in the total package.",
    demotivatedBy: "Pressure to hit aggressive financial targets. Environments where compensation is the primary discussion topic.",
    managementImplication: "Commission-heavy roles may not sustain this person's motivation long-term. Consider roles with stronger base weighting and purpose-driven positioning.",
    retentionImplication: "Less likely to leave for money alone, but also less likely to push through difficult periods purely for financial reward.",
  },
  {
    band: "very_low",
    label: "Not Financially Motivated",
    energizedBy: "Impact, relationships, and personal fulfilment. Financial compensation is secondary to meaningful work and positive culture.",
    demotivatedBy: "Commission-obsessed cultures, leaderboards based on earnings, and conversations framed primarily around money.",
    managementImplication: "Verify alignment between this person's core motivators and the actual day-to-day reality of sales. Low financial motivation in a high-variable-comp role creates a structural mismatch.",
    retentionImplication: "Low financial motivation combined with a commission-heavy role is a retention risk — not because they will leave for more money, but because the role's reward structure will feel disconnecting.",
  },
];

// ─── REC: Recognition ───────────────────────────────────────────────

export const REC_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Recognition-Driven",
    energizedBy: "Public praise, awards, leaderboards, peer admiration, and being singled out as a top performer. Loves the spotlight.",
    demotivatedBy: "Invisible contributions, private feedback only, and environments where success is unacknowledged or attributed to the team by default.",
    managementImplication: "Build regular, public recognition into your cadence — team meetings, Slack shout-outs, award ceremonies. This is a low-cost, high-impact motivator for this individual.",
    retentionImplication: "If this person feels their contributions are invisible, they will disengage before they leave. Watch for signs of withdrawing from team events.",
  },
  {
    band: "high",
    label: "Responds Well to Recognition",
    energizedBy: "Regular acknowledgment of achievements, both public and private. Appreciates being included in success stories and team highlights.",
    demotivatedBy: "Extended periods without positive feedback. Feeling taken for granted.",
    managementImplication: "Structured 1:1s that include specific praise for recent wins will keep motivation high. Does not need constant attention but benefits from periodic visibility.",
  },
  {
    band: "medium",
    label: "Moderate Recognition Needs",
    energizedBy: "Knowing their work is noticed and appreciated. Comfortable with occasional recognition but does not seek it actively.",
    demotivatedBy: "Sustained neglect. Being bypassed for opportunities that go to louder colleagues.",
    managementImplication: "Standard management practice — regular feedback and fair attribution — is sufficient.",
  },
  {
    band: "low",
    label: "Low Recognition Need",
    energizedBy: "Internal satisfaction from doing good work. Values quiet competence over public praise.",
    demotivatedBy: "Being forced into the spotlight or expected to self-promote. Finds competitive leaderboards more stressful than motivating.",
    managementImplication: "Respect their preference for low-key appreciation. Private acknowledgment is more meaningful than public awards for this person.",
  },
  {
    band: "very_low",
    label: "Recognition-Averse",
    energizedBy: "Results that speak for themselves. Prefers to stay behind the scenes and let the work do the talking.",
    demotivatedBy: "Mandatory participation in public recognition events. Sales cultures built around competition and visibility.",
    managementImplication: "Do not mistake low recognition needs for low engagement. This person may be highly productive without any visible signs of seeking attention. Private feedback channels are essential.",
  },
];

// ─── ACH: Achievement ───────────────────────────────────────────────

export const ACH_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Achievement-Driven",
    energizedBy: "Stretch targets, personal bests, mastery challenges, and the feeling of winning against tough odds. Internal scoreboard that never stops.",
    demotivatedBy: "Easy targets, mediocre standards, and environments where excellence is not expected or rewarded.",
    managementImplication: "Set progressively harder targets. This person will get bored if goals are too easy. Provide high-achiever challenges — President's Club, top-tier account access, or special projects.",
    retentionImplication: "Will leave if they feel they have peaked or if the environment tolerates mediocrity. Keep stretching them.",
  },
  {
    band: "high",
    label: "Strong Achievement Drive",
    energizedBy: "Clear targets, measurable progress, and being able to see how their performance compares to a meaningful standard.",
    demotivatedBy: "Ambiguous goals, shifting targets, or environments where hard work does not lead to visible results.",
    managementImplication: "Ensure OKRs and quota metrics are clear, fair, and regularly reviewed. Achievement-driven individuals thrive on scorecards.",
  },
  {
    band: "medium",
    label: "Moderate Achievement Drive",
    energizedBy: "Meeting expectations and delivering solid results. Values competence but does not obsessively chase perfection.",
    demotivatedBy: "Unrealistic targets that set them up for failure. Pressure without support.",
    managementImplication: "Standard goal-setting and performance management practices work well. Provide support systems for stretch goals.",
  },
  {
    band: "low",
    label: "Low Achievement Drive",
    energizedBy: "Comfortable pace, collaborative wins, and environments where personal contribution is valued without intense competition.",
    demotivatedBy: "High-pressure target cultures, stack ranking, and visible performance comparisons.",
    managementImplication: "Monitor target attainment closely. This person may not naturally push beyond minimum requirements without external structure.",
    retentionImplication: "Less likely to leave due to ambition, but also less likely to drive exceptional results without consistent management input.",
  },
  {
    band: "very_low",
    label: "Very Low Achievement Orientation",
    energizedBy: "Stability, routine, and environments that value effort over outcomes.",
    demotivatedBy: "Any culture centred around aggressive targets, performance ranking, or competitive scorecards.",
    managementImplication: "Significant concern for any target-carrying role. Validate whether this person has demonstrated sustained performance in previous roles — achievement scores this low are unusual in successful sales professionals.",
  },
];

// ─── POW: Power / Influence ─────────────────────────────────────────

export const POW_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Power-Oriented",
    energizedBy: "Decision-making authority, strategic influence, mentoring others, and being the person people come to for direction.",
    demotivatedBy: "Being a cog in the machine. Lack of autonomy or decision-making authority. Having ideas dismissed.",
    managementImplication: "Channel this into positive influence — give them mentoring responsibilities, strategic input opportunities, or leadership of key initiatives. Unchecked, high power motivation can create political dynamics.",
    retentionImplication: "Without a promotion path or expanding influence, this person will seek leadership opportunities elsewhere within 12–18 months.",
  },
  {
    band: "high",
    label: "Leadership-Oriented",
    energizedBy: "Being trusted with responsibility, leading initiatives, and having visible influence on team direction.",
    demotivatedBy: "Feeling sidelined from decisions. Being managed too tightly.",
    managementImplication: "Include in strategic conversations and give ownership of projects. Natural candidate for team lead progression.",
  },
  {
    band: "medium",
    label: "Balanced Influence Orientation",
    energizedBy: "Having input into decisions that affect their work. Values influence without needing to control.",
    demotivatedBy: "Being completely excluded from decision-making or strategy discussions.",
    managementImplication: "Standard inclusion in team planning and decision-making is sufficient. No special management approach needed.",
  },
  {
    band: "low",
    label: "Low Power Need",
    energizedBy: "Focusing on their own work without political dynamics. Prefers clear direction from leadership.",
    demotivatedBy: "Being pushed into leadership roles they did not ask for. Political environments.",
    managementImplication: "Do not assume this person wants to manage others. Respect their preference for individual contribution.",
  },
  {
    band: "very_low",
    label: "Influence-Averse",
    energizedBy: "Working within clear boundaries set by someone else. Minimal responsibility for others' outcomes.",
    demotivatedBy: "Any expectation to lead, mentor, or influence beyond their immediate scope.",
    managementImplication: "Not suited for team lead or management track. In sales, this person will avoid internal advocacy for resources, which may limit deal progression in enterprise environments.",
  },
];

// ─── VAR: Variety / Change ──────────────────────────────────────────

export const VAR_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Extreme Variety-Seeker",
    energizedBy: "Constant novelty, new challenges, changing environments, diverse client types, and roles that evolve rapidly.",
    demotivatedBy: "Routine, repetition, and predictable workflows. Same product, same pitch, same cycle.",
    managementImplication: "Rotate responsibilities regularly. Assign diverse client segments or special projects. Without variety, boredom will lead to disengagement.",
    retentionImplication: "High flight risk if the role becomes routine. Expect 18–24 month tenure unless the role continuously evolves.",
  },
  {
    band: "high",
    label: "Enjoys Change",
    energizedBy: "Fresh challenges, evolving market conditions, and opportunities to try new approaches.",
    demotivatedBy: "Rigid processes and unchanging routines that persist for long periods.",
    managementImplication: "Mix routine pipeline work with special initiatives to maintain engagement.",
  },
  {
    band: "medium",
    label: "Moderate Variety Tolerance",
    energizedBy: "A mix of familiar routines with periodic new challenges. Values predictability with some excitement.",
    demotivatedBy: "Either extreme — pure chaos or pure monotony.",
    managementImplication: "Standard role design with periodic stretch assignments works well.",
  },
  {
    band: "low",
    label: "Prefers Stability",
    energizedBy: "Predictable routines, consistent processes, and roles where they can build deep expertise in a stable domain.",
    demotivatedBy: "Frequent reorganisations, changing territories, or product pivots.",
    managementImplication: "Provide stability in territory, product focus, and reporting structure. This person invests in mastery and rewards loyalty in return.",
  },
  {
    band: "very_low",
    label: "Strong Routine Preference",
    energizedBy: "Complete predictability, clearly defined processes, and minimal change. Builds deep expertise through repetition.",
    demotivatedBy: "Any significant change to their routine, territory, tools, or processes.",
    managementImplication: "Excellent for stable, process-driven roles. Change management will need to be gradual and well-communicated. Not suited for startup or high-change environments.",
  },
];

// ─── AUT: Autonomy ──────────────────────────────────────────────────

export const AUT_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Fiercely Autonomous",
    energizedBy: "Complete freedom to set their own schedule, approach, and methods. Outcome-based management with minimal process control.",
    demotivatedBy: "Micromanagement, mandatory processes, frequent check-ins, and prescriptive sales methodologies.",
    managementImplication: "Set outcomes and get out of the way. Mandatory CRM updates and process compliance will be a constant friction point — design minimum viable process requirements.",
    retentionImplication: "May leave for entrepreneurial opportunities if they feel overly constrained. Consider whether the role genuinely allows the autonomy they need.",
  },
  {
    band: "high",
    label: "Values Independence",
    energizedBy: "Having ownership of their approach, territory, and schedule. Trusts themselves to find the best path.",
    demotivatedBy: "Excessive process requirements and frequent management check-ins.",
    managementImplication: "Light-touch management with clear outcome accountability. Reserve process interventions for genuine performance issues.",
  },
  {
    band: "medium",
    label: "Balanced Autonomy Need",
    energizedBy: "Reasonable freedom within a clear framework. Appreciates guidance without feeling controlled.",
    demotivatedBy: "Either extreme — total freedom without support or rigid micromanagement.",
    managementImplication: "Standard management cadence with a mix of direction and delegation.",
  },
  {
    band: "low",
    label: "Prefers Guidance",
    energizedBy: "Clear direction, regular manager input, and structured processes that remove ambiguity about what to do next.",
    demotivatedBy: "Being left to figure things out alone. Ambiguous expectations.",
    managementImplication: "Provide detailed playbooks, regular 1:1s, and structured deal reviews. This person thrives with a supportive, present manager.",
  },
  {
    band: "very_low",
    label: "Dependent on Structure",
    energizedBy: "Step-by-step guidance, close manager involvement, and knowing exactly what is expected at every stage.",
    demotivatedBy: "Unstructured environments, self-directed work, and situations requiring independent judgment.",
    managementImplication: "This person will struggle in any role that requires autonomous decision-making. Consider whether the position can provide the level of structure they need, or whether a different role would be a better fit.",
  },
];

// ─── STR: Structure ─────────────────────────────────────────────────

export const STR_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Extremely Process-Oriented",
    energizedBy: "Clear methodologies, detailed playbooks, documented processes, and predictable workflows.",
    demotivatedBy: "Ambiguity, improvisation, and 'figure it out' cultures.",
    managementImplication: "Provide comprehensive onboarding documentation, clear sales stages, and detailed playbooks. This person will execute a defined process excellently but may struggle to adapt when the playbook does not fit.",
  },
  {
    band: "high",
    label: "Values Structure",
    energizedBy: "Well-defined processes, clear KPIs, and structured cadences. Appreciates knowing the rules of the game.",
    demotivatedBy: "Constantly changing processes and unclear expectations.",
    managementImplication: "Maintain consistent process frameworks. Changes should be communicated clearly with rationale.",
  },
  {
    band: "medium",
    label: "Balanced Process Orientation",
    energizedBy: "A sensible level of structure with room for personal judgment. Neither rigid nor chaotic.",
    demotivatedBy: "Extremes in either direction — bureaucratic process or total disorder.",
    managementImplication: "Standard process management is sufficient. Flexible enough to adapt without resistance.",
  },
  {
    band: "low",
    label: "Low Structure Preference",
    energizedBy: "Freedom to improvise, create their own systems, and adapt on the fly.",
    demotivatedBy: "Heavy process requirements, mandatory forms, and rigid sales stage gates.",
    managementImplication: "CRM compliance and process adherence will need active reinforcement. Focus on outcomes rather than process steps.",
  },
  {
    band: "very_low",
    label: "Process-Averse",
    energizedBy: "Complete flexibility and the ability to wing it. Finds any structured process constraining and unnecessary.",
    demotivatedBy: "Mandatory processes, structured reporting, and any form of administrative compliance.",
    managementImplication: "This will create friction in any structured sales organisation. Consider whether the culture can absorb this level of process resistance or whether it will create team-wide issues.",
  },
];

// ─── REL: Relationships ─────────────────────────────────────────────

export const REL_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Deeply Relationship-Oriented",
    energizedBy: "Strong personal connections with colleagues and clients. Values trust, loyalty, and emotional bonds in professional relationships.",
    demotivatedBy: "Transactional environments, rotating teams, and cultures that prioritise efficiency over human connection.",
    managementImplication: "Invest in the personal relationship with this team member. They will be extraordinarily loyal to a manager who genuinely cares about them as a person.",
    retentionImplication: "Will follow a trusted manager to a new company. If the manager changes or the team culture shifts, expect disengagement and departure risk.",
  },
  {
    band: "high",
    label: "Relationship Builder",
    energizedBy: "Genuine client relationships, team camaraderie, and feeling part of a close-knit group.",
    demotivatedBy: "Purely transactional interactions and impersonal management styles.",
    managementImplication: "Build team connection through shared experiences and genuine personal interest. This person builds strong client loyalty.",
  },
  {
    band: "medium",
    label: "Balanced Relationship Orientation",
    energizedBy: "Professional relationships that are warm but boundaried. Values collegiality without excessive emotional investment.",
    demotivatedBy: "Neither isolation nor forced intimacy.",
    managementImplication: "Standard professional relationship management is appropriate.",
  },
  {
    band: "low",
    label: "Low Relationship Need",
    energizedBy: "Results, efficiency, and competence. Views professional relationships as functional rather than emotional.",
    demotivatedBy: "Forced team bonding activities, emotionally demanding clients, and cultures that prioritise connection over results.",
    managementImplication: "Keep interactions focused and results-oriented. This person values respect and competence over personal warmth.",
  },
  {
    band: "very_low",
    label: "Transactional Orientation",
    energizedBy: "Pure results focus. Prefers minimal emotional involvement in professional relationships.",
    demotivatedBy: "Relationship-heavy cultures, mandatory social events, and expectations to maintain emotional bonds with clients or colleagues.",
    managementImplication: "Well-suited for transactional sales roles. Not a good fit for consultative or key account roles where deep client relationships are the primary value proposition.",
  },
];

// ─── VAL: Values Alignment ──────────────────────────────────────────

export const VAL_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Values-Driven",
    energizedBy: "Working for an organisation whose mission they believe in. Selling products they genuinely think help clients. Ethical leadership and transparent culture.",
    demotivatedBy: "Selling products they do not believe in. Observing ethical shortcuts. Corporate hypocrisy.",
    managementImplication: "Ensure product-market fit messaging is authentic. This person will be your strongest advocate if they believe in the mission — and your loudest critic if they detect inauthenticity.",
    retentionImplication: "Will leave over ethical concerns, even if compensation and growth are excellent. Cultural alignment is non-negotiable for this individual.",
  },
  {
    band: "high",
    label: "Values-Conscious",
    energizedBy: "Feeling good about what they sell and who they work for. Appreciates ethical standards and purpose-driven culture.",
    demotivatedBy: "Feeling pressured to oversell or misrepresent. Cultures that tolerate ethical grey areas.",
    managementImplication: "Position the product's genuine value clearly. Avoid pressure to oversell or misrepresent capabilities.",
  },
  {
    band: "medium",
    label: "Moderate Values Sensitivity",
    energizedBy: "Reasonable ethical standards and a product they can stand behind. Not idealistic but appreciates integrity.",
    demotivatedBy: "Blatant ethical violations, but tolerates minor imperfections.",
    managementImplication: "Standard ethical culture is sufficient. No special management approach needed.",
  },
  {
    band: "low",
    label: "Pragmatic Values Orientation",
    energizedBy: "Results and compensation, regardless of the product's broader mission. Views values alignment as a nice-to-have.",
    demotivatedBy: "Very little motivational impact from values considerations.",
    managementImplication: "Do not rely on mission-driven messaging to motivate this person. Focus on tangible outcomes and compensation.",
  },
  {
    band: "very_low",
    label: "Values-Indifferent",
    energizedBy: "Pure performance metrics and personal outcomes. Product mission and organisational culture are irrelevant to their motivation.",
    demotivatedBy: "Being expected to demonstrate passion for the company mission. Values-centric team activities.",
    managementImplication: "Not inherently problematic, but be aware that this person will not self-regulate around ethical boundaries the way values-driven individuals do. Clear ethical guidelines and oversight are important.",
  },
];

// ─── DEV: Development / Growth ──────────────────────────────────────

export const DEV_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Growth-Oriented",
    energizedBy: "Continuous learning, skill development, mentorship, career progression, and mastering new domains.",
    demotivatedBy: "Stagnation, no learning budget, no clear career path, and roles that become repetitive.",
    managementImplication: "Provide a clear development roadmap, learning budget, mentorship pairing, and visible progression milestones. This person needs to feel they are advancing, not just performing.",
    retentionImplication: "Will leave within 12–18 months if they feel they have stopped growing. Promotion or skill expansion is essential for retention.",
  },
  {
    band: "high",
    label: "Growth-Oriented",
    energizedBy: "Learning opportunities, skill development programmes, and visible career progression.",
    demotivatedBy: "Dead-end roles with no growth path. Lack of learning resources.",
    managementImplication: "Include learning and career development in regular 1:1 discussions. Provide stretch opportunities.",
  },
  {
    band: "medium",
    label: "Moderate Growth Interest",
    energizedBy: "Some learning and development opportunities alongside stable, competent performance in current role.",
    demotivatedBy: "Complete stagnation, but does not need constant novelty.",
    managementImplication: "Standard career development conversations and periodic training are sufficient.",
  },
  {
    band: "low",
    label: "Low Growth Drive",
    energizedBy: "Doing their current job well. Content with their skill level and not seeking rapid advancement.",
    demotivatedBy: "Pressure to learn new skills or take on unfamiliar responsibilities.",
    managementImplication: "Respect their pace. Development discussions should focus on deepening current competencies rather than expanding scope.",
  },
  {
    band: "very_low",
    label: "Comfort-Oriented",
    energizedBy: "Stability and mastery of the current domain. No desire to change or expand their skill set.",
    demotivatedBy: "Mandatory training, role changes, or expectations to grow beyond their current capability.",
    managementImplication: "If the role requirements will evolve significantly, this person may not adapt. Ensure role stability matches their expectations.",
  },
];

// ─── SEC: Security ──────────────────────────────────────────────────

export const SEC_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Security-Focused",
    energizedBy: "Stable employment, predictable income, strong benefits, and a financially secure company.",
    demotivatedBy: "Uncertainty, layoff rumours, startups, and roles with unpredictable income.",
    managementImplication: "Provide reassurance about company stability and role security. Heavy commission weighting will create anxiety. Consider a stronger base-to-variable ratio.",
    retentionImplication: "Extremely unlikely to leave a stable position for a risky opportunity, even for significantly more money. Stability is the primary retention lever.",
  },
  {
    band: "high",
    label: "Values Stability",
    energizedBy: "Reliable income, clear expectations, and organisational stability.",
    demotivatedBy: "Ambiguity about the company's future. Frequent management changes.",
    managementImplication: "Communicate openly about company direction and role stability. Avoid unnecessary uncertainty.",
  },
  {
    band: "medium",
    label: "Balanced Security Need",
    energizedBy: "Reasonable stability with some opportunity for upside. Comfortable with moderate risk if the potential reward is clear.",
    demotivatedBy: "Extreme risk exposure without adequate safety net.",
    managementImplication: "Standard compensation design with a reasonable base works well.",
  },
  {
    band: "low",
    label: "Comfortable with Risk",
    energizedBy: "High-risk, high-reward opportunities. Startup energy. Equity and upside potential.",
    demotivatedBy: "Bureaucratic stability that feels constraining. Heavy emphasis on security over opportunity.",
    managementImplication: "Frame the role's risk elements as exciting opportunities rather than threats.",
  },
  {
    band: "very_low",
    label: "Risk-Seeking",
    energizedBy: "Extreme upside, entrepreneurial environments, and the thrill of building something from zero.",
    demotivatedBy: "Corporate stability, predictable career paths, and guaranteed outcomes.",
    managementImplication: "This person may not stay in a corporate environment long-term. If the role has genuine entrepreneurial elements, lean into them. Otherwise, expect eventual departure for their own venture.",
    retentionImplication: "Likely to pursue entrepreneurial opportunities within 1–2 years. Plan for succession.",
  },
];

// ─── DRI: Drive / Energy ────────────────────────────────────────────

export const DRI_INTERPRETATIONS: readonly RitchieScaleBandBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Driven",
    energizedBy: "Intensity, urgency, high-output environments, and the feeling of operating at maximum capacity. Lives to compete and win.",
    demotivatedBy: "Slow-moving organisations, lack of urgency, and colleagues who do not match their intensity.",
    managementImplication: "Channel this energy productively. Give them the hardest accounts, tightest deadlines, and biggest challenges. Beware of burnout — high drive without recovery leads to flameout.",
    retentionImplication: "Will stay as long as the environment matches their intensity. If the pace drops, they will seek a more demanding role elsewhere.",
  },
  {
    band: "high",
    label: "High Energy and Drive",
    energizedBy: "Challenging work, ambitious targets, and a fast-paced environment. Consistently gives discretionary effort.",
    demotivatedBy: "Low expectations, slow pace, and lack of challenge.",
    managementImplication: "Keep them challenged and stretched. Standard management works well as long as targets are ambitious.",
  },
  {
    band: "medium",
    label: "Moderate Drive",
    energizedBy: "Reasonable expectations with periodic intensity. Sustainable work pace with bursts of effort when needed.",
    demotivatedBy: "Relentless intensity without recovery. Unsustainable pace expectations.",
    managementImplication: "Standard performance expectations. Can rise to challenges but needs recovery time. Sustainable rather than peak performer.",
  },
  {
    band: "low",
    label: "Low Drive",
    energizedBy: "Manageable workload, comfortable pace, and environments that do not demand constant high output.",
    demotivatedBy: "Intense competition, aggressive targets, and relentless pace.",
    managementImplication: "Monitor activity levels and pipeline generation closely. This person may need structured accountability to maintain consistent output.",
    retentionImplication: "Low drive does not necessarily mean low competence, but in sales it typically correlates with below-median performance without strong management scaffolding.",
  },
  {
    band: "very_low",
    label: "Very Low Drive",
    energizedBy: "Relaxed environments with minimal pressure. Comfortable doing the minimum required.",
    demotivatedBy: "Any sustained pressure, urgency, or competitive environment.",
    managementImplication: "Significant concern for any role with targets, quotas, or performance-based compensation. Validate with behavioural interview data — this score level is unusual in candidates who have been successful in sales.",
  },
];

// ─── Role-Fit Interpretation Groups ─────────────────────────────────

export const RITCHIE_ROLE_INTERPRETATIONS: readonly RoleFitInterpretation[] = [
  {
    roleId: "full_cycle",
    roleLabel: "Full-Cycle Account Executive",
    strongFit: "Profile shows a balanced motivational mix — strong enough financial drive to chase targets, sufficient relationship orientation to build lasting client partnerships, and adequate structure tolerance to maintain CRM and pipeline discipline. This person can own the full prospect-to-close-to-expand cycle independently.",
    moderateFit: "Profile shows alignment on some core motivational axes but gaps on others. The candidate can likely manage the role with targeted coaching on the weaker dimensions, particularly if paired with a supportive manager during the first 6 months.",
    weakFit: "Motivational profile does not align with the demands of full-cycle account management. Key gaps — typically in drive, achievement, or relationship orientation — will create persistent performance challenges that coaching alone is unlikely to resolve.",
    keyStrengthsNeeded: "Balanced INC + REL + ACH + STR. Moderate AUT. Adequate DRI.",
    commonGaps: "Low ACH (won't push), low STR (won't maintain pipeline), or low REL (won't nurture accounts).",
  },
  {
    roleId: "hunter",
    roleLabel: "New Business Hunter",
    strongFit: "Profile shows the classic hunter motivational signature — strong financial drive, high achievement motivation, high energy, significant autonomy preference, and comfort with risk. This person will generate pipeline aggressively and push deals to close.",
    moderateFit: "Profile shows some hunter traits but with moderating factors — perhaps higher security needs, stronger structure preference, or lower drive than the ideal profile. Can succeed in a hunter role with targeted support and a structured prospecting framework.",
    weakFit: "The candidate's motivational profile is fundamentally misaligned with the hunter role. Key signals — low drive, low financial motivation, or high security/structure needs — indicate this person will struggle with the rejection, uncertainty, and intensity that define new business development.",
    keyStrengthsNeeded: "High INC + DRI + ACH + AUT. Moderate VAR. Low SEC need.",
    commonGaps: "High SEC (paralysed by uncertainty), low DRI (insufficient energy), or low INC (no commission hunger).",
  },
  {
    roleId: "consultative",
    roleLabel: "Consultative / Solution Seller",
    strongFit: "Profile shows the consultative seller pattern — strong values alignment, relationship orientation, and analytical tendencies balanced with enough drive and achievement motivation to push for outcomes. This person will build trust, understand complex client needs, and position solutions thoughtfully.",
    moderateFit: "Profile shows consultative tendencies with some gaps — perhaps lower patience (S), insufficient process orientation, or weaker values alignment than ideal. Can develop into the role with mentorship and structured deal review cadences.",
    weakFit: "Motivational profile favours transactional, fast-paced selling over the patient, relationship-centred approach required for consultative sales. This person will likely push for premature closes, underinvest in discovery, and struggle to maintain long nurture cycles.",
    keyStrengthsNeeded: "High VAL + REL + DEV. Moderate ACH + STR. Patience (high S from DISC).",
    commonGaps: "Low REL (superficial relationships), low VAL (inauthentic positioning), or low STR (inconsistent methodology).",
  },
  {
    roleId: "team_lead",
    roleLabel: "Senior Broker / Team Lead",
    strongFit: "Profile shows natural leadership motivation — strong power drive, high achievement, growth orientation, and sufficient relationship skills to build team loyalty. This person will set high standards, develop others, and drive collective performance.",
    moderateFit: "Profile shows leadership potential with development areas — perhaps lower power motivation, insufficient relationship skills for team management, or a preference for individual contribution over team outcomes. Can grow into the role with structured leadership development.",
    weakFit: "Motivational profile strongly favours individual contribution over team leadership. Key gaps — low power motivation, very low relationship orientation, or very high autonomy — suggest this person will resist the collaboration, mentoring, and people management that define the team lead role.",
    keyStrengthsNeeded: "High POW + ACH + DEV + REL. Moderate STR. Sufficient DRI.",
    commonGaps: "Low POW (won't assert authority), very high AUT (resists collaboration), or low REL (cannot build team bonds).",
  },
];

// ─── Barrel Export ──────────────────────────────────────────────────

export const RITCHIE_SCALE_DICT = {
  INC: INC_INTERPRETATIONS,
  REC: REC_INTERPRETATIONS,
  ACH: ACH_INTERPRETATIONS,
  POW: POW_INTERPRETATIONS,
  VAR: VAR_INTERPRETATIONS,
  AUT: AUT_INTERPRETATIONS,
  STR: STR_INTERPRETATIONS,
  REL: REL_INTERPRETATIONS,
  VAL: VAL_INTERPRETATIONS,
  DEV: DEV_INTERPRETATIONS,
  SEC: SEC_INTERPRETATIONS,
  DRI: DRI_INTERPRETATIONS,
} as const;
