import { describe, expect, it, vi } from "vitest";
import { sanitizeError } from "../tools/sample-packs";

describe("sanitizeError", () => {
  it("collapses unique-violation by SQLSTATE 23505", () => {
    const err = Object.assign(new Error("duplicate key value violates unique constraint datasets_slug_key"), {
      code: "23505",
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(sanitizeError(err)).toBe("Database constraint violation. Check your inputs and try again.");
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("collapses NOT NULL violation by SQLSTATE 23502 (no leak)", () => {
    const err = Object.assign(new Error("null value in column \"email\" of relation \"leads\""), {
      code: "23502",
    });
    const out = sanitizeError(err);
    expect(out).not.toContain("email");
    expect(out).not.toContain("leads");
  });

  it("collapses FK violation by SQLSTATE 23503", () => {
    const err = Object.assign(new Error("insert or update on table foo violates foreign key constraint bar"), {
      code: "23503",
    });
    expect(sanitizeError(err)).toBe("Database constraint violation. Check your inputs and try again.");
  });

  it("collapses authorization errors (SQLSTATE 42501)", () => {
    const err = Object.assign(new Error("permission denied for table datasets"), { code: "42501" });
    expect(sanitizeError(err)).toBe("Permission denied. Contact an admin.");
  });

  it("collapses schema-leaks (SQLSTATE 42703 — undefined column)", () => {
    const err = Object.assign(new Error("column foo.bar does not exist"), { code: "42703" });
    const out = sanitizeError(err);
    expect(out).not.toContain("foo");
    expect(out).toMatch(/Database error|constraint/);
  });

  it("matches by text pattern even without a code", () => {
    const err = new Error("duplicate key value violates unique constraint x");
    expect(sanitizeError(err)).toBe("Database constraint violation. Check your inputs and try again.");
  });

  it("collapses data exceptions (SQLSTATE 22001 — string too long)", () => {
    const err = Object.assign(new Error("value too long for type character varying(50)"), {
      code: "22001",
    });
    const out = sanitizeError(err);
    expect(out).toBe("Database constraint violation. Check your inputs and try again.");
    expect(out).not.toContain("character varying");
  });

  it("collapses invalid-text-representation (SQLSTATE 22P02)", () => {
    const err = Object.assign(new Error("invalid input syntax for type uuid: \"foo\""), {
      code: "22P02",
    });
    expect(sanitizeError(err)).toBe("Database constraint violation. Check your inputs and try again.");
  });

  it("maps transient transaction errors (SQLSTATE 40001) to a retry-friendly message", () => {
    const err = Object.assign(new Error("could not serialize access due to concurrent update"), {
      code: "40001",
    });
    expect(sanitizeError(err)).toBe("Transient database error. Retry the request.");
  });

  it("maps deadlocks (SQLSTATE 40P01) to retry-friendly message", () => {
    const err = Object.assign(new Error("deadlock detected"), { code: "40P01" });
    expect(sanitizeError(err)).toBe("Transient database error. Retry the request.");
  });

  it("collapses function-not-found via text pattern (no code)", () => {
    const err = new Error("function public.match_clips(vector, integer) does not exist");
    const out = sanitizeError(err);
    expect(out).not.toContain("match_clips");
    expect(out).not.toContain("public.");
  });

  it("passes through friendly application errors unchanged", () => {
    const err = new Error("No showcase clips found across source datasets.");
    expect(sanitizeError(err)).toBe("No showcase clips found across source datasets.");
  });

  it("passes through non-Error throwables as strings", () => {
    expect(sanitizeError("plain string error")).toBe("plain string error");
    expect(sanitizeError(42)).toBe("42");
  });

  it("logs the full message before sanitising", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const err = Object.assign(new Error("duplicate key value violates unique constraint datasets_slug_key"), {
      code: "23505",
    });
    sanitizeError(err);
    expect(spy.mock.calls[0]?.[0]).toContain("23505");
    expect(spy.mock.calls[0]?.[0]).toContain("datasets_slug_key");
    spy.mockRestore();
  });
});
