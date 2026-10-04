# Margin validation: the 14-day playbook

This is the operating plan for testing whether teams will pay for Margin, an embeddable web PDF viewer and annotation SDK with public pricing. It says what to do each day and links to the file that tells you how.

- **Day 1 is Monday 5 October 2026. Day 14 is Sunday 18 October.**
- The 14 days are the first half of the four-week test the market report calls for: 30 calls and 10 paid commitments. Day 14 is a checkpoint. The real go/no-go is at the end of week 4 (Friday 30 October), inside the report's 90-day window.
- What exists: a working demo and a founding-customer offer. No package, no customers, no SOC 2. Every message and post is written to that standard. Keep it there.

---

## Start here

Do these before Day 2. Each is short and each one blocks something.

- [ ] **Legal checks (30 min).** Was the Apryse quote under NDA? If you're unsure, say "a large PDF SDK vendor". Read the outside-work and IP clauses in your employment agreement. → [outreach.md §1](outreach.md#fix-before-the-first-send)
- [ ] **Deploy the site (15 min).** Make `margin-demo` the default branch, then pick GitHub Pages, Netlify or Vercel. → [DEPLOY.md](DEPLOY.md) steps 0 and A/B/C
- [ ] **Connect the form (10 min).** Formspree endpoint plus `VITE_CONTACT_EMAIL`. Without the email variable the site shows the placeholder `founders@example.com`. Send yourself a real test sign-up. → [DEPLOY.md](DEPLOY.md) step D
- [ ] **Read the live landing page once.** The false claims were fixed on 4 October: no Vue/Angular/npm claims, unbuilt plan features marked "planned". Confirm the deployed build shows that. → [DEPLOY.md, "Before you send the link"](DEPLOY.md#before-you-send-the-link-to-anyone)
- [ ] **Test the demo** on your phone, in Safari, and with a 200+ page PDF. Know where it breaks before strangers do.
- [ ] **Fill the placeholders** below once, in a notes file you paste from.
- [ ] **Deposit link and one-page founding agreement.** Don't ask for money you can't take. → [discovery-calls.md, "Decide these before call 1"](discovery-calls.md)
- [ ] **Decide four more things:** your honest timeline, source escrow (yes or no), a one-page security note, and a postal address for the email footer. → [discovery-calls.md](discovery-calls.md), [outreach.md §1](outreach.md#1-before-you-send)
- [ ] **Tracking sheet** with the columns in [outreach.md §7](outreach.md#7-tracking-sheet-and-targets). One row per person.
- [ ] **Name check.** "Margin" is a working name. Do a quick trademark search before Show HN (Day 3), or use the HN title that leaves the name out. → [launch-posts.md §0](launch-posts.md#0-before-you-post-anything)
- [ ] **Clear your calendar** for the first hours after each post (Days 2, 3, 5, 6, 8, 9, 11), and open call slots from Day 4.

---

## Files

| File | Use it for |
|---|---|
| [DEPLOY.md](DEPLOY.md) | Putting the demo on a public URL, the sign-up form, a custom domain |
| [outreach.md](outreach.md) | Warm messages, cold email sequences (product and engineering tracks), LinkedIn, reply handling, tracking-sheet columns, reply-rate benchmarks |
| [discovery-calls.md](discovery-calls.md) | The 20-minute call script, the deposit ask, objections, the scorecard and the decision rule, the note template |
| [launch-posts.md](launch-posts.md) | Show HN, Reddit, LinkedIn, X and Indie Hackers drafts, the posting schedule, handling public replies |
| [prospects/README.md](prospects/README.md) | Who to contact first: 36 ranked companies, what to check before each, how to add more |
| [prospects/all-prospects.csv](prospects/all-prospects.csv) | The merged list of all 57 researched companies. This is the master list now. |
| [prospects/legal.md](prospects/legal.md), [legal.csv](prospects/legal.csv) | Legal tech: 18 companies, notes, fact-check log |
| [prospects/construction.md](prospects/construction.md), [construction.csv](prospects/construction.csv) | Construction, AEC, real estate: 19 companies, plus the segment's feature gaps |
| [prospects/regulated.md](prospects/regulated.md), [regulated.csv](prospects/regulated.csv) | Insurance, health tech, fintech, HR, education: 20 companies |

Background: the market report (`../reports/PDF SDK market opportunity.md`) and the demo's README (`../app/README.md`).

### Placeholders (same names in every file)

| Placeholder | Value |
|---|---|
| `{{demo_url}}` | Your live demo, e.g. `https://neildahan.github.io/Pdfreader/#/demo` on GitHub Pages |
| `{{site_url}}` | The landing page with pricing, e.g. `https://neildahan.github.io/Pdfreader/` |
| `{{sender_name}}` | Your name |
| `{{first_name}}`, `{{company}}`, `{{hook}}` | Per prospect. Write the hook yourself from a source you opened ([outreach.md §1](outreach.md#how-to-write-hook)). |
| `{{N}}` | A real count on the day (calls held, not booked) |
| `[bracketed notes]` | Edit or delete before sending. Never send a bracket. |

### The offer, stated the same way everywhere

Developer $0 (development only) · Startup $5,000/yr (1 production app) · Business $12,000/yr (up to 3 apps) · Enterprise from $25k/yr. Unlimited users and documents, annotations, comments and signatures included, annual terms, renewals capped at 5%.

Founding customers: 50% off for life on Startup and Business ($2,500 and $6,000 a year), a $500 deposit that is refundable until go-live (and if Margin isn't built), the plan starts only at go-live, 20 spots. Enterprise is priced per deal.

---

## Targets for the 14 days

| By Day 14 | Target | Source |
|---|---|---|
| Contacts | About 30 warm, 55-80 cold, plus intros and LinkedIn | outreach.md §7 |
| Calls held | 12-15 | discovery-calls.md pacing table |
| Qualified commitments (deposit received or valid LOI) | 3-4 | discovery-calls.md pacing table |
| Calls from launch posts | 8-10 of the total | launch-posts.md §6 |

**Two constraints to plan around:**

1. **The prospect list is short.** The research produced 36 contact-first companies, not the 80 or so the cold plan needs, and none has had its evidence opened in a browser yet. You verify as you go (2 minutes a row) and source about 40 more companies by Day 9. → [prospects/README.md](prospects/README.md)
2. **Cold email from a new domain lands in spam** for the first two to three weeks. If you don't already own a domain with sending history, keep cold email to 10-15 a day and lean on warm intros, LinkedIn and the posts.

---

## Day by day

Times are US Eastern. "Calls" means discovery calls run from [discovery-calls.md §2](discovery-calls.md#2-the-20-minute-script), each followed within two hours by the recap email in §3.

| Day | Date | Do | Done when |
|---|---|---|---|
| **1** | Mon 5 Oct | **Set up.** Finish the "Start here" list: legal checks, deploy, form, live-page read, phone/Safari/large-file test. Draft your replies to the HN comment table ([launch-posts.md §1](launch-posts.md#prepared-answers-to-the-comments-you-will-get)). | A stranger could open the link and sign up, and you received the test sign-up. |
| **2** | Tue 6 Oct | **Your network first.** LinkedIn post at 8-9am, link in the first comment ([launch-posts.md §3](launch-posts.md#3-linkedin-founder-post)). Send 30 warm messages and ask each for one intro ([outreach.md §2](outreach.md#2-warm-message-to-your-network)). Set up the tracking sheet. Deposit link and founding agreement ready. | 30 warm messages sent and logged. Deposit link tested. |
| **3** | Wed 7 Oct | **Show HN** at 8-10am, first comment posted right after ([launch-posts.md §1](launch-posts.md#1-show-hn)). X thread in the afternoon. In the gaps: verify the evidence for prospects ranked 1-11 and find a named person for each target role. Write the one-page security note. | HN answered for 4+ hours. 11 prospects verified, each with a name. |
| **4** | Thu 8 Oct | **Fix day, cold batch 1.** Fix what HN found. Send cold email 1 to batch 1 (ranks 1-11; product or engineering track by title, [outreach.md §3](outreach.md#3-cold-email-sequences)). First calls from warm and inbound. | Batch 1 sent. Every inbound reply answered within 4 business hours. |
| **5** | Fri 9 Oct | **r/reactjs** at 9-11am. Calls. **Friday review #1** (30 min, [outreach.md §7](outreach.md#weekly-review-30-minutes-every-friday)). Change one thing in the copy based on the first replies. | Metrics table filled for week 1 so far. |
| **6** | Sat 10 Oct | **r/webdev** (Showoff Saturday only) at 9-11am. One hour sourcing new companies. | 15+ new companies found. |
| **7** | Sun 11 Oct | **Rest.** Short week-1 write-up: the numbers, the top five objections, the best quotes. | Week-1 numbers written down. |
| **8** | Mon 12 Oct | **Indie Hackers** post with the week-1 numbers. Cold email 2 to batch 1. **Cold batch 2**: 15 companies ([prospects/README.md](prospects/README.md#contact-first-36)). LinkedIn connection notes to fit 4-5 people who haven't replied ([outreach.md §4](outreach.md#4-linkedin)). Calls. | Batch 2 sent. |
| **9** | Tue 13 Oct | **r/SaaS** at 9-11am, with one or two real things learned in week 1. Calls. **Sourcing deadline:** 40 new companies, evidence opened, added to `all-prospects.csv`. | 40 new rows, each with `evidence_opened_in_browser = yes`. |
| **10** | Wed 14 Oct | **Cold batch 3**: the interview rows plus 20-30 new companies (10-15 a day if the domain is new). DM every warm "interesting" from week 1 and ask for a call. Calls. | Batch 3 started. No warm lead without a next step. |
| **11** | Thu 15 Oct | **LinkedIn follow-up post**: "What {{N}} conversations about PDF SDK pricing taught me." Cold email 2 to batch 2. Calls. | Post up. Every call has a scorecard. |
| **12** | Fri 16 Oct | Cold email 3 to batch 1. Calls. **Friday review #2**, plus the launch read ([launch-posts.md, "How to tell if the launch worked"](launch-posts.md#how-to-tell-if-the-launch-worked)): which channel produced calls, not upvotes. | Metrics table filled for week 2. |
| **13** | Sat 17 Oct | **Catch up.** Finish scorecards and recap emails, clean the sheet, chase every unsent deposit link. | Sheet matches reality. |
| **14** | Sun 18 Oct | **Checkpoint.** Run the read below and write one page: numbers, kill signals, decision, what changes in weeks 3-4. | Decision written down. |

The sequences don't stop at Day 14. Batch 2's email 3 goes out Tuesday 20 October, and batch 3 finishes around 19-22 October.

**Every day from Day 2:** answer replies within four business hours, log everything in the sheet the same day, and send the recap email within two hours of every call. After every fifth call, update the call script ([discovery-calls.md §6](discovery-calls.md#6-note-taking-template)).

**If Show HN takes off:** push the Reddit posts back a few days and spend the time on calls. Calls matter more than the schedule.

---

## Day-14 checkpoint

Count only what [discovery-calls.md §5](discovery-calls.md#decision-rule-end-of-week-4) counts. A **qualified commitment** is a deposit received or a signed LOI (from a signer, naming plan, price and go-live within 12 months), from a company scoring 30+ on the scorecard with no disqualifier, and not a favor from a friend.

Read the rows in order. The first one that matches is the result.

| If at Day 14 | Read | Do |
|---|---|---|
| More than half of the calls that answered the question say a 10-25% discount from their current vendor would solve it, **or** that a free tool plus in-house work is acceptable (judge this once 8 or more calls have answered) | The report's kill criteria. The gap is a negotiating tactic, not a product. | **Stop.** Write up what you learned. If your own company is an Apryse customer, use the findings at your next renewal. |
| 12+ calls held and **3 or more** qualified commitments | On pace for 10 by week 4 | **Go on to weeks 3-4 as planned.** Put more volume into the segment that converted best. |
| 12+ calls held and **1-2** qualified commitments | Behind but alive | **Narrow.** Put weeks 3-4 into the one segment and persona that produced the commitments and the best calls. Fix the most common "no" reason. |
| 12+ calls held and **0** qualified commitments | The offer or the segment is wrong, not the volume | **Pause new cold outreach for two days.** Re-read every "no" reason, change one thing (segment, persona or offer), then restart. If nothing changes, plan to stop at week 4. |
| Fewer than 12 calls held | Too early to read the market. This is a top-of-funnel problem. | Check reply rates against [outreach.md §7](outreach.md#what-the-reply-rates-mean) (under 3% cold means delivery or list, not message). Add companies, rework hooks, push warm intros. Read again on Day 21. |

**The real gate, end of week 4 (Friday 30 October):** 10 or more qualified commitments means build. 5-9 means narrow to one segment and run four more weeks (still inside 90 days). Under 5 means stop. A "build" also needs at least 5 of the 10 on Business or Enterprise, and at least 15 of the 30 calls to have produced a dollar figure.

One weakness to keep in view: the report's bar was commitments at $8-12k a year. Founding Business is $6,000 and founding Startup is $2,500, so even a clean pass is weaker evidence than the report asked for. Say so when you present the result.

---

## Weekly metrics

Fill this in at each Friday review. Columns come from the tracking sheet ([outreach.md §7](outreach.md#column-spec)) and the call tally ([discovery-calls.md §5](discovery-calls.md#tally-sheet-fill-in-at-the-friday-review)).

| Metric | Week 1 target | Week 2 target (cumulative) | Warning sign |
|---|---|---|---|
| Contacts sent: warm / cold / LinkedIn | 30 / 11+ / a few | 30+ / 55-80 / 15+ | Cold falls behind because the list ran out |
| Cold reply rate (any reply, after 50+ sends) | n/a (too few sends) | 8-15% | Under 3% means delivery or list; 3-8% means rework hooks |
| Warm and intro reply rate | 40%+ | 40%+ | Under 40% means the ask reads like a pitch |
| Positive replies as a share of all replies | Over a third | Over a third | Mostly "no": read the reasons for a pattern |
| Calls held | 5-8 | 12-15 | |
| Calls with a dollar figure (`annual_spend`) | Half or more | Half or more | Most won't say, or pay under $5k |
| Scorecard: average, and count in A and B bands | | | Most calls in C or Not ICP: wrong targeting |
| Deposits received / signed LOIs | 1-2 combined | 3-4 combined | Zero by end of week 2 |
| Share of commitments on Business or Enterprise | | 50%+ | Mostly Startup deposits |
| `discount_would_solve = yes` share | | Under 50% | Over 50% is a kill criterion |
| `free_tool_acceptable = yes` share | | Under 50% | Over 50% is a kill criterion |
| Top three `must_have_missing` | | | One item on a third of calls is the build priority (often redaction, forms, measurement) |
| Form sign-ups and calls sourced from posts | | 8-10 calls from posts | Upvotes with no calls: wrong audience |

Count deposits only when the money arrives, and LOIs only when signed.
