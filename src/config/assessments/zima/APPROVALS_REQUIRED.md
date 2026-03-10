# ZIMA Block — Final Approvals Required

This list tracks content and logic that still requires formal product/content owner approval before the ZIMA block can be considered fully approved. **Do not treat placeholder or inferred content as approved.**

---

## 1. Question bank (50 items)

| Section | Status | Approval required |
|--------|--------|-------------------|
| **Structure** (10 dimensions × 5 items, 6-point Likert, reverse items) | Approved | None. |
| **Item wording** (all 50 questions) | Inferred from approved product logic | Copy-approve final question text per dimension (or confirm current wording as final). |

**File:** `src/config/assessments/zima/questions.ts`

---

## 2. Role weight matrix

| Section | Status | Approval required |
|--------|--------|-------------------|
| **Four frontline roles** (hunter, full_cycle, consultative, team_lead) | Inferred | Confirm dimension weights per role sum to ~1.0 and reflect approved role definitions. |
| **Fifth role: support_only** (low-frontline-fit) | Placeholder | Approve concept and weight row for "support only when relevant"; approve threshold for when to show this recommendation. |

**File:** `src/config/assessments/zima/scoring.ts`, `src/config/assessments/zima/placeholders.ts`

---

## 3. Red flag rules

| Section | Status | Approval required |
|--------|--------|-------------------|
| **All 7 rules** (conditions + message + severity) | Inferred | Confirm thresholds, operator logic, and message wording; confirm severity (warning vs critical). |

**File:** `src/config/assessments/zima/scoring.ts`

---

## 4. Environment notes (low/high per dimension)

| Section | Status | Approval required |
|--------|--------|-------------------|
| **10 dimensions × 2 notes** | Inferred | Approve final copy for low and high notes per dimension. |
| **Thresholds** (35 low, 70 high) | Inferred | Confirm numeric thresholds for when to show low vs high note. |

**File:** `src/config/assessments/zima/scoring.ts`

---

## 5. Training & management recommendations

| Section | Status | Approval required |
|--------|--------|-------------------|
| **Training rules** (dimension + threshold + text) | Inferred | Approve thresholds and recommendation text. |
| **Management rules** (dimension + operator + threshold + text) | Inferred | Approve thresholds and recommendation text. |

**File:** `src/config/assessments/zima/interpretations.ts`

---

## 6. Interpretation layer (strengths, risks, interview, retention)

| Section | Status | Approval required |
|--------|--------|-------------------|
| **Dimension descriptions** (label, lowNote, highNote) | Inferred | Approve short labels and notes. |
| **Strength / risk / interview / retention rules** | Inferred | Approve trigger conditions and copy. |

**File:** `src/config/assessments/zima/interpretations.ts`

---

## 7. Low-frontline-fit (support only) recommendation

| Section | Status | Approval required |
|--------|--------|-------------------|
| **When to show** (threshold: max frontline score < 40) | Placeholder | Approve threshold and eligibility logic. |
| **EN/RU message** for "consider support only" | Placeholder | Approve final wording in both languages. |

**File:** `src/config/assessments/zima/placeholders.ts`, `ZIMA_LOW_FRONTLINE_FIT_THRESHOLD` in `schema.ts`

---

## 8. Optional / future content

| Item | Approval required |
|------|--------------------|
| **New dimensions or items** | If product adds dimensions or questions, add to `placeholders.ts` as TODO first; then move to `questions.ts` and scoring once approved. |
| **Additional red flags or rules** | Same: add as placeholder, then promote after approval. |

---

## Summary checklist

- [ ] All 50 question texts copy-approved (or confirmed as final).
- [ ] Role weight matrix for 4 frontline roles approved.
- [ ] support_only role and low-frontline-fit logic and copy approved.
- [ ] Red flag rules (7) thresholds and messages approved.
- [ ] Environment notes (10 × 2) and thresholds approved.
- [ ] Training and management recommendation rules approved.
- [ ] Dimension descriptions and strength/risk/interview/retention rules approved.
- [ ] Low-frontline-fit EN/RU messages and threshold approved.
