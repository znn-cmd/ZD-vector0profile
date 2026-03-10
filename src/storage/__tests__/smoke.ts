// Storage layer smoke test — run with: npx tsx src/storage/__tests__/smoke.ts

import { getDataStore } from "../index";

async function test() {
  const store = getDataStore();

  console.log("=== DataStore smoke test ===\n");

  // Test HR users
  const hrs = await store.hrUsers.findAll();
  console.log("HR Users:", hrs.length);

  // Test candidates
  const candidates = await store.candidates.findAll();
  console.log("Candidates:", candidates.length);
  for (const c of candidates) {
    console.log("  -", c.id, c.full_name, "(" + c.status + ")");
  }

  // Test search (Russian name)
  const searchRu = await store.candidates.searchByName("\u0418\u0432\u0430\u043D\u043E\u0432");
  console.log("\nSearch (Ivanov RU):", searchRu.length, "results");
  for (const c of searchRu) console.log("  -", c.full_name);

  // Test search (transliterated)
  const searchLat = await store.candidates.searchByName("ivanov");
  console.log("Search (ivanov LAT):", searchLat.length, "results");
  for (const c of searchLat) console.log("  -", c.full_name);

  // Test search (partial Russian)
  const searchPartial = await store.candidates.searchByName("\u041C\u0430\u0440\u0438\u044F");
  console.log("Search (Maria RU):", searchPartial.length, "results");
  for (const c of searchPartial) console.log("  -", c.full_name);

  // Test search (English)
  const searchEn = await store.candidates.searchByName("Sarah");
  console.log("Search (Sarah EN):", searchEn.length, "results");
  for (const c of searchEn) console.log("  -", c.full_name);

  // Test sessions
  const sessions = await store.sessions.findAll();
  console.log("\nSessions:", sessions.length);

  // Test active session lookup
  const active = await store.sessions.findActiveSession("cand_demo_001");
  console.log("Active session for cand_demo_001:", active?.id, active?.status);

  // Test create
  const newCandidate = await store.candidates.create({
    full_name: "\u041F\u0435\u0442\u0440\u043E\u0432 \u0421\u0435\u0440\u0433\u0435\u0439 \u0418\u0432\u0430\u043D\u043E\u0432\u0438\u0447",
    full_name_normalized: "",
    email: "petrov@example.com",
    phone: "+971501111111",
    position: "BDM",
    department: "Sales",
    invited_by: "hr_demo_admin",
    invite_token: "",
    status: "invited",
    language: "ru",
    notes: "",
    updated_at: "",
    archived_at: null,
  });
  console.log("\nCreated:", newCandidate.id, newCandidate.full_name);
  console.log("  normalized:", newCandidate.full_name_normalized);
  console.log("  token:", newCandidate.invite_token ? "generated" : "MISSING");

  // Test search finds the new one
  const searchNew = await store.candidates.searchByName("petrov");
  console.log("Search (petrov):", searchNew.length, "results");

  // Test update
  const updated = await store.candidates.update(newCandidate.id, {
    status: "in_progress",
  });
  console.log("Updated status:", updated.status);

  // Test archive
  const archived = await store.candidates.archive(newCandidate.id);
  console.log("Archived:", archived.archived_at ? "set" : "MISSING");

  // Test notifications
  const notifs = await store.notifications.findRecent(5);
  console.log("\nRecent notifications:", notifs.length);

  // Test audit log
  const auditEntry = await store.audit.log({
    actor_id: "hr_demo_admin",
    actor_type: "admin",
    action: "candidate.create",
    entity_type: "candidates",
    entity_id: newCandidate.id,
    details_json: JSON.stringify({ full_name: newCandidate.full_name }),
    ip_address: "127.0.0.1",
    user_agent: "test",
  });
  console.log("Audit:", auditEntry.id, auditEntry.action);

  // Test count
  const totalCandidates = await store.candidates.count();
  console.log("\nTotal candidates:", totalCandidates);

  const invitedCount = await store.candidates.count({ status: "invited" } as Record<string, unknown>);
  console.log("Invited:", invitedCount);

  console.log("\n=== All tests passed ===");
}

test().catch(console.error);
