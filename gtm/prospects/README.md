# Prospects: who to contact first

Merged and ranked from the three segment lists. Use this file to pick who to contact; use the segment files for the reasoning behind each row.

## The honest count

- **57 companies** across the three lists, no duplicates. All are real, operating companies with plausible sources.
- **0 have had their evidence opened in a browser.** Every research and fact-check pass ran without working web access, so each PDF-use claim comes from search snippets. The `evidence_opened_in_browser` column is `no` on every row. Change it to `yes` as you check them.
- **The contact-first list below has 36 companies, not 50.** These are the fit 3-5 rows. Padding to 50 would mean adding companies that the research itself scored as poor fits.
- **15 more (fit 2)** are an interview-only reserve: useful for learning what teams pay, unlikely to buy soon.
- **6 (fit 1)** are not sales targets: Harvey, Everlaw, Ironclad, Logikcull, Kami, Tennr. Talk to them only through warm intros, as interviews.

Of the 36, the realistic sales conversations today are **23 sale-track** companies, plus 2 design partners. The rest are interviews (5), holds until measurement exists (3), or need one check before any contact (3).

**This is not enough volume for the 14-day plan.** The outreach plan sends about 80 cold emails in two weeks, one contact per company at a time. Source 40 or more new companies by day 9 (see [Adding companies](#adding-companies)), or the week-2 cold batch runs out.

## Files

| File | What it is |
|---|---|
| [`all-prospects.csv`](all-prospects.csv) | All 57 rows, deduped, ranked. Same columns as the segment CSVs, plus `rank`, `segment_group`, `tracker_segment` (matches the `segment` values in the tracking sheet in `../outreach.md`, section 7), `evidence_opened_in_browser`, and `verify_before_use` on every row. |
| [`legal.md`](legal.md) / [`legal.csv`](legal.csv) | 18 legal-tech companies, with notes and fact-check log |
| [`construction.md`](construction.md) / [`construction.csv`](construction.csv) | 19 construction, AEC, real estate and field-service companies, plus the segment's feature gaps (measurement, sheet compare) |
| [`regulated.md`](regulated.md) / [`regulated.csv`](regulated.csv) | 20 insurance, health tech, fintech, HR and education companies |

**Ranking rule:** fit score (high to low), then confidence (high, medium, low; a row with any "low" component counts as low), then each segment file's own order. From now on, treat `all-prospects.csv` as the master list: edit it, not the segment CSVs, so the two don't drift apart.

## Contact first (36)

Play: **Sale** = run the outreach sequence and the full discovery call. **Design partner** = small budget; offer founding Startup and ask for their files and feedback. **Interview** = learn what they pay and why; no deposit ask unless they raise it. **Hold** = don't contact until measurement is on the roadmap. Check the last column before the first message.

| # | Company | Segment | Fit | Conf. | Known SDK | Play | Check before contacting |
|---|---|---|---|---|---|---|---|
| 1 | [Juro](https://juro.com) | Legal | 5 | medium | Unknown | Sale | Re-open the help article; the hook rests on its "can't assign a comment" line. |
| 2 | [Wisedocs](https://www.wisedocs.ai) | Insurance | 5 | medium | Unknown | Sale | Open the Insurance-Canada article; confirm annotate/tag/comment wording. |
| 3 | [Drawboard](https://www.drawboard.com) | Construction/AEC | 4 | high | Apryse (case study) | Sale (web Projects app) | Check Projects' network tab for WebViewer files; open the Apryse case study. |
| 4 | [e-PlanSoft](https://www.eplansoft.com) | Construction/AEC | 4 | medium | Unknown | Sale | Expect "do you measure?" Margin has no measurement; say so. |
| 5 | [Supio](https://www.supio.com) | Legal | 4 | medium | Unknown | Sale | Confirm the Dec 2025 release note. Benchmark a 1,000+ page PDF before the call. |
| 6 | [DigitalOwl](https://www.digitalowl.com) | Insurance | 4 | medium | Unknown | Sale | Open the press release; size is unverified. |
| 7 | [Part3](https://www.part3.io) | Construction/AEC | 4 | medium | Unknown | Sale (founding Startup, $2,500) | Confirm seed details; budget may be tight. |
| 8 | [TrialView](https://www.trialview.com) | Legal | 4 | medium | Unknown | Sale | UK/EU company: PECR/GDPR rules apply to cold email (outreach.md section 1). |
| 9 | [Inscribe](https://www.inscribe.ai) | Fintech | 4 | medium | Unknown | Sale | Confirm the highlighted-regions feature on their product page. |
| 10 | [Document Crunch](https://www.documentcrunch.com) | Construction/AEC | 4 | medium | Unknown | Sale | Ask early about Nemetschek/Bluebeam influence. |
| 11 | [JobTread](https://www.jobtread.com) | Construction/AEC | 4 | medium | Unknown | Sale | Open the product-update page; if built on raw PDF.js, pitch maintenance cost. |
| 12 | [Page](https://pageai.co) | Legal | 3 | high | Nutrient (case study) | Renewal-timed | They just bought Nutrient. Interview now, pitch near renewal. No form filling in the demo. |
| 13 | [Capmo](https://www.capmo.com) | Construction/AEC | 3 | high | Nutrient (case study) | Interview | Nutrient native mobile buyer; ask about the web app and their renewal. |
| 14 | [Eve](https://www.eve.legal) | Legal | 3 | medium | Unknown | Sale (likely Enterprise) | Large and well funded; lead with no per-document metering. |
| 15 | [Faria Education Group](https://www.faria.org) | Education | 3 | medium | Nutrient (logo, snippet) | Sale | Nutrient logo seen only via snippet; don't imply you know their terms. |
| 16 | [Everchron](https://everchron.com) | Legal | 3 | medium | In-house (per company) | Sale | Says its viewer is proprietary: pitch upkeep cost, not replacement of a vendor. |
| 17 | [Crowdmark](https://www.crowdmark.com) | Education | 3 | medium | Unknown | Design partner | ~16 people, little funding; no stamps or comment library in the demo. |
| 18 | [Opus 2](https://www.opus2.com) | Legal | 3 | medium | Unknown | Sale | ~330 people, PE-backed; longer cycle. Funding/headcount unsourced. |
| 19 | [Perusall](https://www.perusall.com) | Education | 3 | medium | Unknown | Design partner | Bootstrapped, possibly in-house viewer. |
| 20 | [Buildxact](https://www.buildxact.com) | Construction/AEC | 3 | medium | Unknown | Hold | Takeoff needs measurement. Hold until measurement is on the roadmap. |
| 21 | [Steno](https://steno.com) | Legal | 3 | medium | Unknown | Sale | Confirm Transcript Genius page; ~470 people. |
| 22 | [FeedbackFruits](https://feedbackfruits.com) | Education | 3 | medium | Unknown | Sale | Size unverified; confirm the Interactive Document page. |
| 23 | [Kahua](https://www.kahua.com) | Construction/AEC | 3 | medium | Unknown | Sale (Enterprise tier) | Long government-style cycle. |
| 24 | [LinkSquares](https://linksquares.com) | Legal | 3 | medium | Unknown | Sale | Open the help article; funding/headcount unsourced. |
| 25 | [Newforma](https://www.newforma.com) | Construction/AEC | 3 | medium | Unknown | Sale | Older codebase; ask what the web viewer runs on. |
| 26 | [Indico Data](https://indicodata.ai) | Insurance | 3 | medium | Unknown | Sale | Size unverified. |
| 27 | [STACK Construction Technologies](https://www.stackct.com) | Construction/AEC | 3 | medium | Unknown | Hold | Takeoff needs measurement. |
| 28 | [PlanRadar](https://www.planradar.com) | Construction/AEC | 3 | medium | Unknown | Interview | Mobile-first and may be in-house; ask what renders plans on web. |
| 29 | [Fieldwire (Hilti)](https://www.fieldwire.com) | Construction/AEC | 3 | medium | Unknown | Interview | Inside Hilti procurement; sheet compare goes beyond Margin. |
| 30 | [SkySlope (Forms)](https://skyslope.com) | Real estate | 3 | medium | Unknown | Interview | Needs form filling and redaction; demo has neither. |
| 31 | Current | Fintech | 3 | low (identity) | Nutrient (case study) | Identify first | No confirmed website. Not the consumer fintech at current.com. |
| 32 | [Trunk Tools](https://trunktools.com) | Construction/AEC | 3 | low | Unknown | Confirm first | Source shows viewing, not markup. Find markup evidence or skip. |
| 33 | [Togal.AI](https://www.togal.ai) | Construction/AEC | 3 | low | Unknown | Hold | Takeoff needs measurement; evidence is a third-party directory. |
| 34 | [Sixfold](https://www.sixfold.ai) | Insurance | 3 | low | Unknown | Sale | Evidence is citation language only; confirm a PDF viewer exists. |
| 35 | [Carta Healthcare](https://www.carta.healthcare) | Health tech | 3 | low | Unknown | Sale | Ask whether sources are PDFs or EHR HTML. |
| 36 | [Archistar](https://www.archistar.ai) | Construction/AEC | 3 | low | Unknown | Interview | Much of the value is CAD/BIM/3D. |

**Suggested batches** (one contact per company; see `../README.md` for days):

- **Batch 1 (day 4):** ranks 1-11, the fit 4-5 rows. Verify all 11 evidence links on day 3 first, and drop any that fail.
- **Batch 2 (day 8):** the remaining Sale and Design-partner rows (ranks 14-26 except Buildxact, plus 34 and 35), and Page as an interview. That is 15 companies.
- **Batch 3 (day 10):** Interview rows (Capmo, PlanRadar, Fieldwire, SkySlope, Archistar), Current and Trunk Tools if their checks pass, and newly sourced companies.
- **Holds** (Buildxact, STACK, Togal.AI): only after a decision on measurement.

## Interview-only reserve (fit 2, 15)

Use these when a call slot is free or a warm intro appears. Don't put them in the cold sequence ahead of the 36.

| # | Company | Segment | Why only an interview |
|---|---|---|---|
| 37 | IntakeQ | Health tech | Mainly a forms buyer; demo has no fillable fields. |
| 38 | CMiC | Construction/AEC | Enterprise, native mobile, deep Nutrient relationship. |
| 39 | Trinoor | Field service | Native mobile, adjacent vertical (energy). |
| 40 | CaseFleet | Legal | 5-8 people; budget. |
| 41 | Filevine | Legal | Large; needs redaction. |
| 42 | Snapdocs | Fintech | Large; needs signature-field tagging. |
| 43 | Floify | Fintech | Forms and e-sign; possibly inside a parent company. |
| 44 | WorkBright | HR | Forms and e-sign; only HR row. |
| 45 | Ocrolus | Fintech | ~1,000 people; overlay interview. |
| 46 | Texthelp (Everway) | Education | Read-aloud and accessibility beyond the demo. |
| 47 | CaseScribe AI | Legal | In-app viewer unconfirmed. |
| 48 | Superinsight | Legal | Pre-seed; viewer unconfirmed. |
| 49 | Clearbrief | Legal | Evidence is a third-party profile. |
| 50 | Cohere Health | Health tech | Viewer unconfirmed; later stage. |
| 51 | INGENIOUS.BUILD | Construction/AEC | Markup (not just viewing) unconfirmed. |

## Verifying a row (2 minutes each)

1. Open `evidence_url` in a normal browser. Confirm the feature in `pdf_use_case` is described there, in words close to the CSV's.
2. If the hook quotes or paraphrases the source, check that sentence exactly. Cut anything you can't see on the page.
3. If `likely_sdk` names a vendor, open that case study or logo page too. If it's gone, change the SDK to `Unknown`.
4. Optional, 1 minute: open their public web app or demo, open DevTools > Network, and look for `webviewer`, `pspdfkit`, `nutrient` or `pdf.worker` files. That turns an Unknown SDK into a fact.
5. Set `evidence_opened_in_browser` to `yes`, and lower `fit_score` or delete the row if the evidence didn't hold.

## Adding companies

The fastest sources, all named in the segment files as unread because the research sessions had no browser:

- Apryse customer pages: `apryse.com/customers`, `/industries/legal`, `/industries/aec`, `/industries/insurance`, `/industries/healthcare`.
- Nutrient customer stories: `nutrient.io/blog/categories/customer-stories`, plus the healthcare and financial-services solution pages.
- Competitors of your best rows: other plaintiff-side and VA-disability AI tools (EvenUp is in the legal notes as too large), other CLMs, other submittal and plan-review tools. Avolve ProjectDox is flagged in `construction.md` as worth a second look.
- Every call: ask "who else should I talk to?" Referrals from calls beat any list.

Add new rows to `all-prospects.csv` with the same columns, a hook you've checked, and `evidence_opened_in_browser = yes`. Score fit with the same rubric as the segment files: a web viewer with annotations, comments, signatures and search at $5k-$12k a year, and lower if the company is very large, native-mobile-first, or needs measurement, redaction or form filling.

No personal names or contact details are stored in these files. Find the person for each `target_roles` title yourself, and keep their details in the tracking sheet, not here.
