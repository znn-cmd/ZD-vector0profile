/**
 * English assessment content — built from config (single source of truth).
 * Used for resolve("content.disc.likert.disc_d_01") etc.
 */

import { DISC_ALL_ITEMS } from "@/config/assessments/disc/questions";
import { DISC_SJT_CASES } from "@/config/assessments/disc/sjt";
import { ZIMA_ALL_ITEMS } from "@/config/assessments/zima/questions";
import { RITCHIE_ALL_ITEMS } from "@/config/assessments/ritchieMartin/questions";
import { RITCHIE_FORCED_CHOICE_BLOCKS } from "@/config/assessments/ritchieMartin/forcedChoice";
import { RITCHIE_MINI_CASES } from "@/config/assessments/ritchieMartin/cases";
import { RITCHIE_VALIDITY_ITEMS } from "@/config/assessments/ritchieMartin/scoring";

function discLikert(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const it of DISC_ALL_ITEMS) out[it.id] = it.text;
  return out;
}

function discSjt(): Record<string, { scenario: string; opt0: string; opt1: string; opt2: string; opt3: string }> {
  const out: Record<string, { scenario: string; opt0: string; opt1: string; opt2: string; opt3: string }> = {};
  for (const c of DISC_SJT_CASES) {
    out[c.id] = {
      scenario: c.scenario,
      opt0: c.options[0] ?? "",
      opt1: c.options[1] ?? "",
      opt2: c.options[2] ?? "",
      opt3: c.options[3] ?? "",
    };
  }
  return out;
}

function zimaItems(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const it of ZIMA_ALL_ITEMS) out[it.id] = it.text;
  return out;
}

function ritchieLikert(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const it of RITCHIE_ALL_ITEMS) out[it.id] = it.text;
  return out;
}

function ritchieValidity(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const vi of RITCHIE_VALIDITY_ITEMS) out[vi.id] = vi.text;
  return out;
}

function ritchieFc(): Record<string, { prompt: string; a: string; b: string }> {
  const out: Record<string, { prompt: string; a: string; b: string }> = {};
  for (const fc of RITCHIE_FORCED_CHOICE_BLOCKS) {
    out[fc.id] = { prompt: fc.prompt, a: fc.optionA.text, b: fc.optionB.text };
  }
  return out;
}

function ritchieMc(): Record<string, { scenario: string; a: string; b: string; c: string; d: string }> {
  const out: Record<string, { scenario: string; a: string; b: string; c: string; d: string }> = {};
  for (const mc of RITCHIE_MINI_CASES) {
    const opts = mc.options.reduce((acc, o) => ({ ...acc, [o.id]: o.text }), {} as Record<string, string>);
    out[mc.id] = {
      scenario: mc.scenario,
      a: opts.a ?? "",
      b: opts.b ?? "",
      c: opts.c ?? "",
      d: opts.d ?? "",
    };
  }
  return out;
}

export const contentEN = {
  disc: {
    likert: discLikert(),
    sjt: discSjt(),
  },
  zima: zimaItems(),
  ritchie: {
    likert: ritchieLikert(),
    validity: ritchieValidity(),
    fc: ritchieFc(),
    mc: ritchieMc(),
  },
};
