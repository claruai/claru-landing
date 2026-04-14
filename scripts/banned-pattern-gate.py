#!/usr/bin/env python3
"""
Deterministic pre-send filter for outbound emails.
Catches AI slop patterns before LLM-based adversarial scoring.
Runs BEFORE Smartlead load — any violation = rewrite required.

Usage:
  python scripts/banned-pattern-gate.py --test          # run inline test suite
  echo '{"subject":"...", "body":"...", "channel":"demand"}' | python scripts/banned-pattern-gate.py
"""

import json
import re
import sys


def check_email(email: dict) -> dict:
    subject = email.get("subject", "")
    body = email.get("body", "")
    channel = email.get("channel", "demand")

    violations = []

    # --- Hard reject patterns (body) ---

    if "\u2014" in body:
        violations.append("em-dash in body")

    if "\u2014" in subject:
        violations.append("em-dash in subject")

    slop_phrases = [
        r"I'd love to",
        r"I'd be happy to",
        r"I hope this finds you well",
        r"impressive work",
        r"exciting work",
        r"I came across",
        r"In today's (?:landscape|market|environment)",
    ]
    for pattern in slop_phrases:
        if re.search(pattern, body, re.IGNORECASE):
            violations.append(f"banned phrase: {pattern}")

    body_stripped = body.strip()
    if body_stripped and (body_stripped.startswith("I ") or body_stripped.startswith("We ")):
        first_word = body_stripped.split()[0]
        violations.append(f"body opens with '{first_word}'")

    subject_words = subject.strip().split()
    if len(subject_words) > 5:
        violations.append(f"subject too long: {len(subject_words)} words (max 5)")

    body_words = body.strip().split()
    if len(body_words) > 80:
        violations.append(f"body too long: {len(body_words)} words (max 80)")

    question_marks = body.count("?")
    if question_marks > 1:
        violations.append(f"multiple questions: {question_marks} question marks (max 1)")

    if re.search(r"https?://", body):
        violations.append("hyperlink in body")

    banned_words = [
        "delve", "leverage", "comprehensive", "pivotal",
        "synergy", "transformative", "revolutionize", "seamless",
    ]
    for word in banned_words:
        if re.search(rf"\b{word}\b", body, re.IGNORECASE):
            violations.append(f"banned word: {word}")

    # --- Supply-side additional checks ---

    if channel == "supply":
        if re.search(r"claru\.ai", body, re.IGNORECASE):
            violations.append("supply-side: mentions claru.ai")
        if re.search(r"\bClaru\b", body):
            violations.append("supply-side: mentions Claru")
        if re.search(r"claru\.ai", subject, re.IGNORECASE):
            violations.append("supply-side: claru.ai in subject")

    return {
        "pass": len(violations) == 0,
        "violations": violations,
    }


# --- Inline test suite ---

TEST_CASES = [
    # --- Should PASS ---
    {
        "name": "clean demand email",
        "input": {
            "subject": "egocentric video data",
            "body": "Hey Akshat,\n\nNoticed the Isaac 0.2 launch last month. We've got 386K egocentric clips, 2M licensed cinematic, and 10K+ hours of gaming footage, all built at Moonvalley (GC, Khosla, YC). Claru (claru.ai) is the data spinout.\n\nHappy to pull a few clips if any of this is relevant to what you're training on?\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": True,
    },
    {
        "name": "clean supply email from moonvalley",
        "input": {
            "subject": "field collection surplus",
            "body": "Hey Jai,\n\nThe $100M raise for scalable data services caught my eye. We built up 386K egocentric clips and have 2,000+ collectors across 100 cities at Moonvalley. Sitting on surplus capacity.\n\nCurious if there's a fit here worth exploring.\n\nJohn",
            "channel": "supply",
        },
        "expect_pass": True,
    },
    {
        "name": "short subject with question",
        "input": {
            "subject": "robot training data",
            "body": "Hey Peter,\n\nSaw the ANYmal X deployment video from last week. Built up a corpus of egocentric activity clips at Moonvalley that might map to what you're training on.\n\nWant me to pull a few relevant clips?\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": True,
    },
    {
        "name": "touch 3 breakup email",
        "input": {
            "subject": "last note",
            "body": "Last one from me. If Sanctuary AI ever needs real-world manipulation footage for Phoenix training, claru.ai has 386K egocentric clips with dense annotations.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": True,
    },
    {
        "name": "minimal passing email",
        "input": {
            "subject": "video corpus",
            "body": "Hey Alex,\n\nGrabbed a bunch of egocentric video at Moonvalley. Figured it might be relevant.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": True,
    },
    # --- Should FAIL ---
    {
        "name": "em-dash in body",
        "input": {
            "subject": "training data",
            "body": "Hey Jim,\n\nNoticed the warehouse demo \u2014 looked sharp. We have egocentric clips that might help.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "em-dash",
    },
    {
        "name": "opens with I",
        "input": {
            "subject": "video data",
            "body": "I noticed your recent funding round. We've got egocentric clips that might be relevant.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "opens with 'I'",
    },
    {
        "name": "subject too long",
        "input": {
            "subject": "egocentric video data for robot training pipelines",
            "body": "Hey Raquel,\n\nSaw the Waabi World Model paper. Built up a corpus at Moonvalley that maps to this.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "subject too long",
    },
    {
        "name": "body too long (81 words)",
        "input": {
            "subject": "robot data",
            "body": "Hey Tony,\n\n" + " ".join(["word"] * 75) + " and that is the end of the message with a few more words to push it over eighty words total.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "body too long",
    },
    {
        "name": "supply-side mentions Claru",
        "input": {
            "subject": "field collection",
            "body": "Hey William,\n\nBuilt Claru for exactly this kind of work. We have 386K egocentric clips and 2K collectors.\n\nCurious if there's a fit.\n\nJohn",
            "channel": "supply",
        },
        "expect_pass": False,
        "expect_violation": "supply-side: mentions Claru",
    },
    {
        "name": "multiple questions",
        "input": {
            "subject": "video corpus",
            "body": "Hey Deepak,\n\nSaw the Skild paper. What modalities are you training on? What environments are hardest to source?\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "multiple questions",
    },
    {
        "name": "banned word: leverage",
        "input": {
            "subject": "training data",
            "body": "Hey Leo,\n\nSaw the RoboForce demo. You could leverage our egocentric corpus for pre-training.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "banned word: leverage",
    },
    {
        "name": "hyperlink in body",
        "input": {
            "subject": "video data",
            "body": "Hey Brett,\n\nSaw the Figure 02 launch. Check out our catalog at https://claru.ai/data-catalog for samples.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "hyperlink",
    },
    {
        "name": "I came across pattern",
        "input": {
            "subject": "robot data",
            "body": "Hey Bernt,\n\nI came across your work on humanoid locomotion. Built up a corpus at Moonvalley.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "I came across",
    },
    {
        "name": "impressive work pattern",
        "input": {
            "subject": "training data",
            "body": "Hey Karol,\n\nImpressive work on the pi0 model. We have egocentric data that might help.\n\nJohn",
            "channel": "demand",
        },
        "expect_pass": False,
        "expect_violation": "impressive work",
    },
]


def run_tests():
    passed = 0
    failed = 0

    for tc in TEST_CASES:
        result = check_email(tc["input"])
        ok = result["pass"] == tc["expect_pass"]

        if not ok:
            failed += 1
            print(f"FAIL: {tc['name']}")
            print(f"  Expected pass={tc['expect_pass']}, got pass={result['pass']}")
            print(f"  Violations: {result['violations']}")
        elif "expect_violation" in tc and not tc["expect_pass"]:
            found = any(tc["expect_violation"] in v for v in result["violations"])
            if not found:
                failed += 1
                print(f"FAIL: {tc['name']} (wrong violation)")
                print(f"  Expected violation containing '{tc['expect_violation']}'")
                print(f"  Got: {result['violations']}")
            else:
                passed += 1
                print(f"PASS: {tc['name']}")
        else:
            passed += 1
            print(f"PASS: {tc['name']}")

    print(f"\n{passed}/{passed + failed} tests passed")
    return failed == 0


if __name__ == "__main__":
    if "--test" in sys.argv:
        success = run_tests()
        sys.exit(0 if success else 1)
    else:
        raw = sys.stdin.read()
        email = json.loads(raw)
        result = check_email(email)
        print(json.dumps(result, indent=2))
