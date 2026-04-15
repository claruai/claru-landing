"""
Gather community signals for physical AI datasets.

Sources:
  1. OpenAlex — citation count + citing papers sample
     - Free, no auth needed, 10 req/sec polite pool (email in User-Agent)
     - Title search with relevance guard; also supports arXiv ID lookup
     - Fetches top 3 most recent citing papers
  2. HuggingFace Discussions — discussion count + sample discussions
     - Directly tied to the specific dataset (zero false positive risk)
  3. Reddit (ML subreddits only) — quoted exact-match, score > 10 filter
     - Restricted to: MachineLearning, robotics, reinforcementlearning,
       learnmachinelearning, computervision
     - Uses exact quoted query to avoid "Domino's Pizza" class false positives
     - NOTE: Uses Reddit JSON search API directly (no PRAW credentials needed)
  4. HF Downloads Rank — percentile within catalog (derived, no API)

Usage:
    python social_signals.py [--input PATH] [--output PATH] [--sources SRC1,SRC2] [--limit N]

    --sources: comma-separated, any of:
               openalex, hf_discussions, reddit, downloads_rank
               (semantic_scholar accepted as alias for openalex for backwards compatibility)
               default: openalex,hf_discussions,reddit,downloads_rank
    --limit:   limit to first N eligible datasets (for testing)
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

import requests


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

INPUT_FILE = Path(__file__).parent / "output" / "enriched_v2.json"
OUTPUT_FILE = Path(__file__).parent / "output" / "enriched_with_social.json"

MIN_DOWNLOADS_FOR_SOCIAL = 100
# OpenAlex polite pool: include mailto in User-Agent for 10 req/sec (vs 1/sec anon)
USER_AGENT = "ClaruDatasetPipeline/2.0 (mailto:contact@claru.ai)"
REQUEST_TIMEOUT = 15

# Rate limits (seconds between requests)
OPENALEX_DELAY = 0.15  # polite pool: 10 req/sec; 0.15s gives ~6/sec with headroom
HF_DELAY = 0.3
REDDIT_DELAY = 2.0    # Reddit JSON API: be polite

# Reddit: only these subreddits, not all of Reddit
REDDIT_ML_SUBREDDITS = [
    "MachineLearning",
    "robotics",
    "reinforcementlearning",
    "learnmachinelearning",
    "computervision",
]
REDDIT_MIN_SCORE = 10  # Filter out low-signal posts

# Download rank thresholds: (fraction from top → label)
DOWNLOAD_RANK_THRESHOLDS = [
    (0.01, "top_1_pct"),
    (0.05, "top_5_pct"),
    (0.10, "top_10_pct"),
    (0.25, "top_25_pct"),
    (0.50, "top_50_pct"),
]


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _get_search_name(dataset: dict) -> str:
    """Best name to use as a search query."""
    ext = dataset.get("extraction") or {}
    name = ext.get("name")
    if name and len(name) > 3:
        return name
    did = dataset["dataset_id"]
    if "/" in did:
        did = did.split("/", 1)[1]
    return did.replace("-", " ").replace("_", " ")


def _extract_arxiv_id(paper_url: str | None) -> str | None:
    """Extract arXiv paper ID from a URL, e.g. '2603.15620'."""
    if not paper_url:
        return None
    m = re.search(r"arxiv\.org/(?:abs|pdf)/(\d+\.\d+)", paper_url)
    return m.group(1) if m else None


def _title_matches_name(paper_title: str, search_name: str) -> bool:
    """
    Weak relevance guard for name-search results.
    True if at least one significant word (>3 chars) from search_name
    appears (case-insensitive) in the paper title.
    """
    title_lower = paper_title.lower()
    for word in search_name.lower().split():
        if len(word) > 3 and word in title_lower:
            return True
    return False


# ---------------------------------------------------------------------------
# Source 1: OpenAlex citations
# ---------------------------------------------------------------------------
# Free, no auth needed. Use polite pool (mailto in User-Agent) for 10 req/sec.
# Citation count field: cited_by_count
# arXiv lookup: filter=doi:10.48550/arxiv.{ID}  (arXiv registers DOIs with this prefix)
# Title search fallback: search={name}&per_page=3
# Citing papers: filter=cites:{openalex_id}&sort=publication_date:desc&per_page=3

OPENALEX_BASE = "https://api.openalex.org"

def get_openalex_citations(dataset: dict) -> dict:
    """
    Return citation_count + citing_papers_sample via OpenAlex.

    Strategy:
      1. If paper_url has arXiv ID → look up by DOI 10.48550/arxiv.{id}
      2. Otherwise → title search with relevance guard
    """
    ext = dataset.get("extraction") or {}
    paper_url = ext.get("paper_url")
    arxiv_id = _extract_arxiv_id(paper_url)
    search_name = _get_search_name(dataset)

    result: dict = {"citation_count": None, "citing_papers_sample": []}
    headers = {"User-Agent": USER_AGENT}

    # Only look up datasets that have an arXiv paper URL.
    # Title-only search risks false positives (e.g. "DOMINO" → chemistry papers).
    if not arxiv_id:
        return result

    work_id: str | None = None
    best_count: int = 0

    doi_found = False  # True if OpenAlex has an indexed record for this arXiv paper

    # Step 1: arXiv DOI lookup — unambiguous identification of the preprint
    try:
        doi = f"10.48550/arxiv.{arxiv_id}"
        resp = requests.get(
            f"{OPENALEX_BASE}/works",
            params={"filter": f"doi:{doi}", "select": "id,cited_by_count,title"},
            headers=headers, timeout=REQUEST_TIMEOUT,
        )
        if resp.status_code == 200:
            results = resp.json().get("results", [])
            if results:
                w = results[0]
                best_count = w.get("cited_by_count") or 0
                result["citation_count"] = best_count
                work_id = w.get("id", "").replace("https://openalex.org/", "")
                doi_found = True
    except requests.exceptions.RequestException as e:
        print(f"      OpenAlex arXiv DOI lookup error: {e}")
    time.sleep(OPENALEX_DELAY)

    # Step 2: title search — only if DOI returned no results (paper not indexed yet).
    # Strict guard: result title must START WITH the search name (case-insensitive)
    # to avoid "DOMINO" → "Domino Reactions in Organic Synthesis" false positives.
    # This correctly handles OmniAction → "OmniActions: Predicting Digital Actions..."
    if not doi_found:
        try:
            resp = requests.get(
                f"{OPENALEX_BASE}/works",
                params={"search": search_name, "per_page": 3,
                        "select": "id,cited_by_count,title"},
                headers=headers, timeout=REQUEST_TIMEOUT,
            )
            if resp.status_code == 200:
                name_lower = search_name.lower()
                for w in resp.json().get("results", []):
                    title_lower = (w.get("title") or "").lower()
                    # Title must start with the search name (strict)
                    if title_lower.startswith(name_lower):
                        cnt = w.get("cited_by_count") or 0
                        result["citation_count"] = cnt
                        work_id = w.get("id", "").replace("https://openalex.org/", "")
                        break
        except requests.exceptions.RequestException as e:
            print(f"      OpenAlex title search error: {e}")
        time.sleep(OPENALEX_DELAY)

    # Fetch citing papers sample
    if work_id and result["citation_count"]:
        try:
            resp = requests.get(
                f"{OPENALEX_BASE}/works",
                params={
                    "filter": f"cites:{work_id}",
                    "sort": "publication_date:desc",
                    "per_page": 3,
                    "select": "title,publication_year,primary_location,open_access",
                },
                headers=headers, timeout=REQUEST_TIMEOUT,
            )
            if resp.status_code == 200:
                for p in resp.json().get("results", []):
                    # Prefer OA arXiv URL; fall back to DOI link
                    oa_url = (p.get("open_access") or {}).get("oa_url") or ""
                    doi_url = ((p.get("primary_location") or {}).get("landing_page_url")) or ""
                    url = oa_url if "arxiv" in oa_url else (doi_url or None)
                    venue = ((p.get("primary_location") or {}).get("source") or {}).get(
                        "display_name", ""
                    )
                    result["citing_papers_sample"].append({
                        "title": p.get("title") or "",
                        "year": p.get("publication_year"),
                        "venue": venue or "",
                        "url": url,
                    })
        except requests.exceptions.RequestException as e:
            print(f"      OpenAlex citing papers error: {e}")
        time.sleep(OPENALEX_DELAY)

    return result


# ---------------------------------------------------------------------------
# Source 2: HuggingFace Discussions
# ---------------------------------------------------------------------------

def get_hf_discussions(dataset: dict) -> dict:
    """
    Fetch HuggingFace discussion count + top 3 discussions.

    Returns:
        hf_discussion_count: int
        hf_discussions_sample: list[{title, upvotes, url}]
    """
    dataset_id = dataset.get("dataset_id")
    if not dataset_id:
        return {"hf_discussion_count": 0, "hf_discussions_sample": []}

    try:
        url = f"https://huggingface.co/api/datasets/{dataset_id}/discussions"
        headers = {"User-Agent": USER_AGENT}
        resp = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)

        if resp.status_code in (401, 403, 404):
            return {"hf_discussion_count": 0, "hf_discussions_sample": []}

        resp.raise_for_status()
        body = resp.json()

        # Response may be {"discussions": [...], "count": N} or just [...]
        if isinstance(body, list):
            discussions = body
        else:
            discussions = body.get("discussions", [])

        count = len(discussions)
        # Top 3 by upvotes
        top = sorted(discussions, key=lambda d: d.get("upvotes", 0), reverse=True)[:3]
        sample = []
        for d in top:
            num = d.get("num")
            disc_url = (
                f"https://huggingface.co/datasets/{dataset_id}/discussions/{num}"
                if num else None
            )
            sample.append({
                "title": d.get("title", ""),
                "upvotes": d.get("upvotes", 0),
                "url": disc_url,
            })

        return {"hf_discussion_count": count, "hf_discussions_sample": sample}

    except requests.exceptions.RequestException as e:
        print(f"      HF discussions error: {e}")
        return {"hf_discussion_count": 0, "hf_discussions_sample": []}
    except (json.JSONDecodeError, KeyError) as e:
        print(f"      HF discussions parse error: {e}")
        return {"hf_discussion_count": 0, "hf_discussions_sample": []}


# ---------------------------------------------------------------------------
# Source 3: Reddit (ML subreddits only, quoted search, score > 10)
# ---------------------------------------------------------------------------

def search_reddit_ml(dataset: dict) -> list[dict]:
    """
    Search Reddit using exact-quoted query restricted to ML subreddits.

    Uses Reddit JSON search API (no PRAW credentials required):
        GET /r/{subreddits}/search.json?q="quoted"&restrict_sr=1&sort=relevance

    Only returns posts with score > REDDIT_MIN_SCORE to filter noise.
    """
    search_name = _get_search_name(dataset)
    subreddit_str = "+".join(REDDIT_ML_SUBREDDITS)

    try:
        url = f"https://www.reddit.com/r/{subreddit_str}/search.json"
        params = {
            "q": f'"{search_name}"',   # exact quoted match — kills "Domino's Pizza" problem
            "restrict_sr": "1",         # restrict to listed subreddits only
            "sort": "relevance",
            "limit": 10,
            "t": "all",
        }
        headers = {"User-Agent": USER_AGENT}
        resp = requests.get(url, params=params, headers=headers, timeout=REQUEST_TIMEOUT)

        if resp.status_code == 429:
            print("      Reddit rate limited — sleeping 60s")
            time.sleep(60)
            return []
        if resp.status_code == 403:
            # Some subreddits may be private/restricted
            return []

        resp.raise_for_status()
        children = resp.json().get("data", {}).get("children", [])

        posts = []
        for child in children:
            post = child.get("data", {})
            score = post.get("score", 0)
            if score < REDDIT_MIN_SCORE:
                continue
            posts.append({
                "title": post.get("title", ""),
                "subreddit": post.get("subreddit", ""),
                "score": score,
                "num_comments": post.get("num_comments", 0),
                "url": f"https://reddit.com{post.get('permalink', '')}",
                "created_utc": post.get("created_utc", 0),
            })

        return posts

    except requests.exceptions.RequestException as e:
        print(f"      Reddit error: {e}")
        return []
    except (json.JSONDecodeError, KeyError) as e:
        print(f"      Reddit parse error: {e}")
        return []


# ---------------------------------------------------------------------------
# Source 4: HF Downloads Rank (derived, no API)
# ---------------------------------------------------------------------------

def compute_downloads_ranks(datasets: list[dict]) -> dict[str, str]:
    """
    Compute each dataset's percentile download rank within the full catalog.

    Returns: {dataset_id: rank_label}
    where rank_label ∈ {"top_1_pct", "top_5_pct", "top_10_pct",
                        "top_25_pct", "top_50_pct", "bottom_50_pct"}
    """
    ordered = sorted(
        [(d["dataset_id"], d.get("downloads") or 0) for d in datasets],
        key=lambda x: x[1],
        reverse=True,
    )
    total = len(ordered)
    if not total:
        return {}

    ranks: dict[str, str] = {}
    for i, (dataset_id, _) in enumerate(ordered):
        # position 0 = best; fraction_from_top starts at 1/total
        fraction = (i + 1) / total
        label = "bottom_50_pct"
        for threshold, rank_label in DOWNLOAD_RANK_THRESHOLDS:
            if fraction <= threshold:
                label = rank_label
                break
        ranks[dataset_id] = label

    return ranks


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Gather community signals for datasets")
    parser.add_argument("--input", type=Path, default=INPUT_FILE)
    parser.add_argument("--output", type=Path, default=OUTPUT_FILE)
    parser.add_argument(
        "--sources",
        default="openalex,hf_discussions,reddit,downloads_rank",
        help="Comma-separated: openalex,hf_discussions,reddit,downloads_rank",
    )
    parser.add_argument(
        "--limit", type=int, default=None,
        help="Limit to first N eligible datasets (for testing)",
    )
    args = parser.parse_args()

    sources = {s.strip() for s in args.sources.split(",") if s.strip()}
    # Backwards compatibility: semantic_scholar → openalex
    if "semantic_scholar" in sources:
        sources.discard("semantic_scholar")
        sources.add("openalex")
    valid = {"openalex", "hf_discussions", "reddit", "downloads_rank"}
    bad = sources - valid
    if bad:
        print(f"ERROR: Unknown sources: {bad}. Valid: {sorted(valid)}")
        sys.exit(1)

    if not args.input.exists():
        print(f"ERROR: Input not found: {args.input}")
        sys.exit(1)

    with open(args.input, encoding="utf-8") as f:
        datasets = json.load(f)

    print(f"Loaded {len(datasets)} datasets from {args.input}")
    print(f"Running sources: {', '.join(sorted(sources))}")

    # Preserve existing signals so partial runs are resumable
    existing: dict[str, dict] = {}
    if args.output.exists():
        try:
            with open(args.output, encoding="utf-8") as f:
                prev = json.load(f)
            for d in prev:
                if "social_signals" in d:
                    existing[d["dataset_id"]] = d["social_signals"]
            print(f"  Resuming — found {len(existing)} existing signal records")
        except Exception:
            pass

    # Downloads rank requires the full list (done before filtering)
    downloads_ranks: dict[str, str] = {}
    if "downloads_rank" in sources:
        downloads_ranks = compute_downloads_ranks(datasets)
        print(f"  Computed download ranks for {len(downloads_ranks)} datasets")

    # Filter to eligible datasets
    eligible = [d for d in datasets if (d.get("downloads") or 0) > MIN_DOWNLOADS_FOR_SOCIAL]
    if args.limit:
        eligible = eligible[: args.limit]
    print(
        f"  {len(eligible)} eligible (> {MIN_DOWNLOADS_FOR_SOCIAL} downloads)"
        f"{f', limited to {args.limit}' if args.limit else ''}"
    )

    api_sources = sources - {"downloads_rank"}

    # Stats counters
    got_citations = 0
    got_citing_papers = 0
    got_hf_discussions = 0
    got_reddit = 0

    for i, dataset in enumerate(eligible, 1):
        did = dataset["dataset_id"]
        name = _get_search_name(dataset)
        print(f"  [{i}/{len(eligible)}] {did}  (query: '{name}')")

        # Seed from existing or blank
        sig = existing.get(did, {
            "citation_count": None,
            "citing_papers_sample": [],
            "hf_discussion_count": 0,
            "hf_discussions_sample": [],
            "reddit_posts": [],
        })

        if "openalex" in sources:
            print(f"    → OpenAlex ... ", end="", flush=True)
            oa = get_openalex_citations(dataset)
            sig["citation_count"] = oa["citation_count"]
            sig["citing_papers_sample"] = oa["citing_papers_sample"]
            cnt = oa["citation_count"] or 0
            papers = len(oa["citing_papers_sample"])
            print(f"{cnt} citations, {papers} citing papers")
            if oa["citation_count"] is not None:
                got_citations += 1
            if oa["citing_papers_sample"]:
                got_citing_papers += 1

        if "hf_discussions" in sources:
            print(f"    → HF Discussions ... ", end="", flush=True)
            hf = get_hf_discussions(dataset)
            sig["hf_discussion_count"] = hf["hf_discussion_count"]
            sig["hf_discussions_sample"] = hf["hf_discussions_sample"]
            print(f"{hf['hf_discussion_count']} discussions")
            if hf["hf_discussion_count"] > 0:
                got_hf_discussions += 1
            time.sleep(HF_DELAY)

        if "reddit" in sources:
            quoted = f'"{name}"'
            print(f"    → Reddit ML subreddits (exact: {quoted}) ... ", end="", flush=True)
            posts = search_reddit_ml(dataset)
            sig["reddit_posts"] = posts
            print(f"{len(posts)} posts (score>{REDDIT_MIN_SCORE})")
            if posts:
                got_reddit += 1
            time.sleep(REDDIT_DELAY)

        existing[did] = sig

    # Merge signals back into full dataset list
    for dataset in datasets:
        did = dataset["dataset_id"]
        sig = existing.get(did, {
            "citation_count": None,
            "citing_papers_sample": [],
            "hf_discussion_count": 0,
            "hf_discussions_sample": [],
            "reddit_posts": [],
        })
        if "downloads_rank" in sources:
            sig["hf_downloads_rank"] = downloads_ranks.get(did, "bottom_50_pct")
        dataset["social_signals"] = sig

    # -------------------------------------------------------------------------
    # Quality report
    # -------------------------------------------------------------------------
    total_eligible = len(eligible)
    print("\n" + "=" * 62)
    print("COMMUNITY SIGNALS — QUALITY REPORT")
    print("=" * 62)
    print(f"  Total datasets:              {len(datasets)}")
    print(f"  Eligible (>{MIN_DOWNLOADS_FOR_SOCIAL} downloads):       {total_eligible}")
    if "openalex" in sources:
        pct = got_citations * 100 // max(total_eligible, 1)
        print(f"  Got citations (OpenAlex):    {got_citations} / {total_eligible}  ({pct}%)")
        print(f"  Got citing papers sample:    {got_citing_papers}")
    if "hf_discussions" in sources:
        pct = got_hf_discussions * 100 // max(total_eligible, 1)
        print(f"  Got HF discussions:          {got_hf_discussions} / {total_eligible}  ({pct}%)")
    if "reddit" in sources:
        print(f"  Got Reddit posts (ML, >{REDDIT_MIN_SCORE}):  {got_reddit} / {total_eligible}")
    if "downloads_rank" in sources:
        by_rank = {}
        for v in downloads_ranks.values():
            by_rank[v] = by_rank.get(v, 0) + 1
        print(f"  Downloads ranks:")
        for label in ["top_1_pct", "top_5_pct", "top_10_pct", "top_25_pct", "top_50_pct", "bottom_50_pct"]:
            n = by_rank.get(label, 0)
            if n:
                print(f"    {label}: {n}")
    print("=" * 62)

    # Save
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(datasets, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(datasets)} datasets → {args.output}")


if __name__ == "__main__":
    main()
