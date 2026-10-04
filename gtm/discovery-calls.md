# Margin discovery calls

The playbook for the 30 validation calls. Each call has two jobs: learn what this team really pays and what really hurts, and, if they fit, ask for a $500 refundable founding deposit. The call is 20 minutes. The demo gets 3 of them.

This file picks up where `gtm/outreach.md` leaves off. The tracking-sheet columns referenced below (`annual_spend`, `discount_would_solve`, `commitment` and so on) are defined in section 7 of that file. The go/no-go gate comes from `reports/PDF SDK market opportunity.md`.

**Decide these before call 1.** The script refers to each one. Item 1 is done; the rest don't exist yet:

1. **Landing page claims.** Done on 4 Oct 2026: the page no longer claims Vue, Angular, plain JS, TypeScript types or `npm install`, and unbuilt plan features are marked "planned". Prospects read that page before the call, so re-read the live version once.
2. **Deposit mechanics.** A $500 payment link or invoice, who approves a refund, and how fast (promise five business days and meet it).
3. **A one-page founding agreement.** It states the 50% discount for life, the refund terms, what happens to the $500 at go-live (credited to the first invoice is the obvious answer), that the plan starts at go-live, the 5% renewal cap, and that the deposit comes back if Margin doesn't get built.
4. **A one-page security note.** See the security objection in section 4.
5. **Source-code escrow and licensing.** Whether founding contracts get escrow, and whether you can commit in writing to no license server or phone-home check. Don't mention either on a call until you've decided.
6. **Your honest timeline,** for "When will it ship?"

Contents:

1. [Before the call](#1-before-the-call)
2. [The 20-minute script](#2-the-20-minute-script)
3. [The close](#3-the-close)
4. [Objection handling](#4-objection-handling)
5. [Qualification scorecard and decision rule](#5-qualification-scorecard-and-decision-rule)
6. [Note-taking template](#6-note-taking-template)

---

## 1. Before the call

### The rules (The Mom Test, applied to PDF SDKs)

People will lie to you to be nice. Not on purpose: they just answer the question you asked, and "would you use this?" invites a kind guess. The fix is to ask about things that already happened, which they can't flatter you about.

1. **Talk about their past, not your idea.** "When did you last renew?" beats "Would you switch?"
2. **Specifics, not generalities.** "What did the quote say?" beats "Is PDF SDK pricing a problem for you?"
3. **Money and time spent are the only real data.** If they never paid, never searched for an alternative and never built a workaround, the pain is not real enough to sell into, however loudly they describe it.
4. **Compliments are not data.** "This is really cool" goes in the notes as zero. Steer back to the facts.
5. **Listen more than you talk.** Target 70/30, them/you, before the demo.
6. **Every call ends in a commitment or a clear no.** "Let's keep in touch" is a no that hasn't been said out loud yet.

| Don't ask (invites opinions) | Ask instead (pulls facts) |
|---|---|
| Would you pay $12k a year for this? | What do you pay today, and what was the first number you were quoted? |
| Do you think PDF SDK pricing is too high? | Walk me through the last renewal. What happened between the first quote and the signature? |
| Would you switch if we were cheaper? | Have you ever looked at an alternative? What did you look at, and why did you stay? |
| Would annotation export be useful? | What happens today when a customer opens your exported file in Acrobat? |
| Do you need mobile? | What share of your users opened a document on a phone last month? How do you know? |
| Is security a concern? | What did your last vendor security review ask for, and how long did it take? |

### Prep checklist (10 minutes before)

- [ ] Read their row in the tracking sheet and in `gtm/prospects/*.md`: segment, fit score, suspected SDK, hook source.
- [ ] Open their product (help center, screenshots, public demo). Know where their PDF feature lives before they tell you.
- [ ] (At booking, not now.) In the confirmation email, ask them to have one heavy or ugly PDF ready that contains nothing confidential. Legal, insurance and health teams usually can't send client files, and you shouldn't ask. The better test: they drag their own file into the demo link during the call, on their machine, and it never reaches you.
- [ ] Demo loaded in a fresh browser window at `#/demo`. Clear the site's local storage (the demo saves annotations and the author name there) so the last prospect's work isn't showing.
- [ ] Acrobat Reader or macOS Preview open and ready, to show the exported file.
- [ ] A PDF someone marked up in Acrobat, ready to drag in (for the import moment).
- [ ] Deposit link and founding agreement ready to paste (decisions 2 and 3 above).
- [ ] Note template (section 6) open in a new doc, with their name already filled in.
- [ ] Decide what you will and won't promise. Re-read "Claims you can and can't make" in `outreach.md`. The short version: no GA, no customers, no SOC 2, no npm package, no Vue/Angular, no redaction or forms in the demo, no dates you don't believe.

---

## 2. The 20-minute script

| Time | Section | Your goal | Talk ratio (them/you) |
|---|---|---|---|
| 0:00-1:30 | Opener | Set the frame: learning, not selling. Get permission to ask about money. | 30/70 |
| 1:30-4:30 | Their current setup | What they run, what it does, who maintains it | 80/20 |
| 4:30-8:00 | The last purchase or renewal | The story of the deal, in order | 85/15 |
| 8:00-10:30 | What it cost and how the deal went | Real numbers and terms | 85/15 |
| 10:30-14:00 | What's painful | Ranked pains, with evidence of action taken | 80/20 |
| 14:00-17:00 | Demo moment | Show only what maps to their pain. 3 minutes, hard stop. | 30/70 |
| 17:00-20:00 | The ask | Deposit, LOI, or a specific next step. Referral either way. | 50/50 |

If they're talkative and the facts are good, let sections 2-4 run long and cut the demo to 90 seconds. The facts are worth more than the demo. Never cut the ask.

### 2.1 Opener (0:00-1:30)

> "Thanks for making the time. Quick context so you know what this is. I'm a product VP. When we were choosing a PDF viewer for our own product, we were quoted about $30k a year, and I kept hearing similar stories from other teams. So I'm checking whether this is a real, common problem before I commit to building a company around it.
>
> I'll mostly ask about how you handle PDFs today and what you've paid, and I'll show you a short demo near the end. If it's not a fit, I'd rather hear that than a polite maybe. Sound OK?
>
> One thing up front: some of my questions are about money, what you pay and what you were quoted. Ballpark is fine, and nothing you tell me gets shared with anyone with your name on it."

[If your employer's quote was under NDA, say "a large PDF SDK vendor" instead of "about $30k". See `outreach.md`, section 1.]

Why the money line matters: if you don't get permission early, you will flinch when it's time to ask for numbers, and they will dodge. Asking permission makes the later question normal.

### 2.2 Their current setup (1:30-4:30)

Core questions, in order. Don't ask all of them if the first answer covers several.

1. "Where do PDFs show up in your product? Walk me through what a user actually does with one."
2. "What's rendering them today? Something you bought, open source, or built in-house?"
3. "What do users do to the document: read it, highlight, comment, sign, redact, fill forms?"
4. "Where do the annotations live afterward? In the PDF, in your database, both?"
5. "Who on your team owns the viewer? Roughly how much of their time does it take in a normal month?"

Listen for:
- **Feature footprint.** If they use only viewing plus highlights and comments, Margin covers it. If they name Office conversion, native mobile SDKs, server-side processing or XFA forms as core, flag it now (see the objections in section 4) and spend the rest of the call learning, not selling.
- **Engineering time.** "Half an engineer, permanently" on a home-grown PDF.js stack is a dollar figure. Write down the number of people and weeks.

Branch: **if they built it themselves on PDF.js or similar**, skip 2.3 and most of 2.4. Still ask the free-tool test at the end of 2.4 (they are living it), and log `discount_would_solve` as `unclear`. Ask instead:
> "When you decided to build it yourselves, what else did you look at? Did you get a quote from anyone? What made you decide to build?"
> "How many engineer-weeks has it taken so far, roughly? What's still on the backlog for it?"
> "What's the last PDF bug that cost you a sprint?"

Branch: **if PDFs aren't in their product yet** (planned feature):
> "What's driving it? Is there a date or a customer attached?"
> "Have you priced options yet? Who did you talk to, and what did they quote?"
A planned feature with a named customer and a date is a strong lead. A planned feature with neither is a "someday", so score timing low.

### 2.3 The last time they bought or renewed (4:30-8:00)

This is the heart of the call. Get the story in order, like a timeline. Ask "and then what happened?" more than any other question.

1. "Tell me about the last time you bought or renewed your PDF SDK. When was that?"
2. "What kicked it off? A new feature, a renewal notice, a customer request?"
3. "Who was involved? Who found the vendor, who evaluated it, who signed?"
4. "What else did you look at? How far did you get with each one?"
5. "How long from first contact to signature? Where did it stall?"
6. "Was there anything in the process that surprised you or annoyed you?"

Listen for:
- **Who signs.** This is your authority score. Write down the title of the person who signed, not the person you're talking to.
- **The trigger.** Renewals are your best timing signal. Get the renewal month for the sheet (`renewal_month`).
- **Alternatives considered.** If they evaluated ComPDF, PDF.js Express or EmbedPDF and still paid Apryse or Nutrient, ask why. That answer tells you what actually wins deals here. The research suspects rendering fidelity and vendor trust beat price; this is where you find out.

If they say "I wasn't involved in that": "Who was? Would they give me 15 minutes?" Then get the intro before the end of the call.

### 2.4 What it cost and how the deal went (8:00-10:30)

> "Can you share roughly what you pay per year? Ballpark is fine."

Then, depending on the answer:

- "What was the first number they quoted, before negotiation?"
- "How is it priced: per app, per user, per document, on your revenue?"
- "Were any features priced as add-ons? Which ones did you end up buying?"
- "How long is the term? What happens at renewal: does it go up, and by how much?"
- "Did they ask about your revenue, user counts or financials as part of pricing?"
- "Has the price moved since you first signed?"

If they won't share a number:
> "Totally fine. Would you say it's under $10k, $10-25k, or over $25k a year?"
A range is still data. A refusal to give even a range usually means they don't know, which means they're not the buyer. Ask who is.

Two questions that feed the kill criteria. Ask both on every call, word for word, near the end of this section:

> **Discount test:** "If your current vendor knocked 20% off at the next renewal, would that settle it for you, or would you still want something different?"

> **Free-tool test:** "If a free open-source viewer like PDF.js or EmbedPDF got you 80% of the way and your team built the rest, would that be acceptable?"

Log the honest answer as `yes` / `no` / `unclear` in `discount_would_solve` and `free_tool_acceptable`. Don't argue with a yes. A yes is the most useful thing you can learn, because if more than half the calls say yes, the market report says stop.

### 2.5 What's painful (10:30-14:00)

Open-ended first, then probe.

1. "What's the most frustrating part of your PDF setup today, the price, the contract, or the technology?"
2. "Tell me about the last time it caused a real problem. What happened?"
3. "What did you do about it?" (This is the most important question in the call.)
4. "What has it cost you? Time, money, a deal, a customer complaint?"
5. "If you could fix one thing about it tomorrow, what would it be?"

How to read the answers:

| They say | It means | Score it |
|---|---|---|
| "It's annoying, but it works" | Pain is real but tolerated | Pain 2-3 |
| "We complained to the vendor / pushed back on the renewal" | Some action taken | Pain 4-5 |
| "We built our own workaround" (with engineer-weeks named) | Paying with time already | Pain 5-6 |
| "We looked at alternatives last quarter" / "I have a spreadsheet comparing them" | Active search | Pain 6-8 |
| "We're mid-negotiation and hate the terms" / "We budgeted to replace it this year" | Budgeted, live problem | Pain 8-10 |

If they list pains but have never acted on any of them, that's a pain score of 3 or less, however strongly they say it.

Prompts that unlock specifics:
- "Can you show me?" (screen share their product or the quote PDF if they're willing)
- "Roughly how many hours or dollars was that?"
- "Who else on your team feels this?"
- "What happened next?"

### 2.6 Demo moment (14:00-17:00, 3 minutes max)

Start a visible timer. Show only what maps to what they just told you. Say "I'll keep this to three minutes" out loud; it makes them relax and it holds you to it.

**Default order** (use their file if they have one ready; otherwise the demo's sample):

| # | Seconds | Show | Say |
|---|---|---|---|
| 1 | 0:00-0:30 | Have them open the demo link and drag their file in, or drag in yours. For an engineer, open DevTools' network tab first. | "Nothing gets uploaded. The file renders in the browser. The only requests you'll see are the page's own scripts, pdf.js font data from the same site, and a Google Fonts stylesheet for the page itself. None of them carry the document." |
| 2 | 0:30-1:15 | Select a sentence, highlight it, add a comment, reply to the comment, resolve the thread. | "Every annotation can carry a thread with replies and resolve. This is the review workflow most teams build themselves." |
| 3 | 1:15-1:45 | Pick one tool that matches their use case. Construction: pen, arrow or rectangle on a drawing. Legal or insurance: sticky note and strikeout. Health or HR: drawn signature. | Name their workflow: "This is the markup your reviewers do on [drawings / contracts / claims]." |
| 4 | 1:45-2:30 | Export as PDF with annotations. Open the file in Acrobat or Preview and click an annotation to show it's editable. | "These are real PDF annotations, not pixels. Your customers can open them in Acrobat and keep editing. Or you store the JSON in your database." |
| 5 | 2:30-3:00 | Drag in a PDF that was marked up in Acrobat. The existing annotations load as editable objects. | "And it goes the other way: files your customers marked up elsewhere come in editable." |

Then stop and ask: **"What would you need to see that I didn't show?"** Write down the answer word for word. It's your `must_have_missing` column and it's the best roadmap input you'll get.

**Swap rules:**
- Engineering lead, and bundle weight or load time came up: swap step 3 for "the demo's JavaScript is about 0.8MB gzipped, pdf.js worker included, measured on the current build with no optimization." Stop there. Don't set it next to Apryse's 265MB: that number is an extracted folder on disk, not a download, and anyone who runs WebViewer will call it out. If they raise WebViewer's size themselves, ask what their users actually download.
- Mobile came up: open the demo on your phone (or ask them to open the link on theirs) instead of step 5.
- Their pain is purely commercial (price, terms) and they're not technical: cut to steps 1, 2 and 4, then open the landing page pricing section. "These are the actual prices. They're on the website. The founding agreement puts the 5% renewal cap in writing."

**Don't show:** dark mode, keyboard shortcuts, undo/redo, JSON export details, or anything else that isn't tied to a pain they named. Every extra feature costs a minute you need for the ask.

**If the demo breaks on their file:** say so plainly. "That's a real bug, and it's exactly why I wanted a real file." Ask what kind of file it is (scanned, CAD export, 400 pages) and log that. Ask for a copy only if the file is non-confidential and they offer it. A demo that breaks on a real file, handled honestly, builds more trust than a polished sample.

### 2.7 The ask (17:00-20:00)

Summarize first, in their words. This shows you listened and sets up the ask.

> "Let me check I've got it right. You're paying about [$X] a year for [vendor], on a [term] contract that renews in [month]. The part that bothers you most is [their top pain, their words]. And what you'd actually use is [features they named]. Did I miss anything?"

Then go to section 3 and ask for the commitment that matches their score. Always end with the referral question, whatever the answer was:

> "Who else should I talk to? Someone who's bought or built PDF annotation, and who'd be blunt with me."

---

## 3. The close

### What you're asking for

The founding offer, stated the same way every time:

- **50% off for life.** Business is $6,000 a year instead of $12,000. Startup is $2,500 instead of $5,000.
- **$500 deposit, fully refundable** until you go to production, no questions asked. If Margin doesn't get built, it comes back automatically.
- **The plan starts at go-live,** not at signing. Nothing else is billed before then.
- **Renewals capped at 5%,** written into the founding agreement.
- **20 spots.**
- **Applies to Startup and Business,** as the landing page's founding banner says. Enterprise is priced per deal; don't promise it 50% off.

Why a deposit and not just a "yes": a verbal yes costs the buyer nothing, so it tells you nothing. Moving $500 needs a card or an invoice, a reason, and often a second person's OK. That friction is the signal. At this size it often fits on a corporate card, and the refund removes the risk on their side.

Don't take money until the payment link and the one-page founding agreement exist (decisions 2 and 3 at the top).

### Exact wording

**Main ask** (for prospects scoring 30 or more on the scorecard, or clearly heading there):

> "Here's where I am. I'm taking 20 founding customers. They get 50% off for life, so [Business would be $6,000 a year instead of $12,000 / Startup would be $2,500 instead of $5,000], and renewals are capped at 5% in writing. It takes a $500 deposit. It's fully refundable until you go live, it comes back if I don't build this, and your plan doesn't start until you ship to production.
>
> Based on what you've told me, I think you're a fit. Would you put down the deposit to hold a spot?"

Then stop talking and let them answer.

**If they say yes:**
> "Great. I'll send the payment link and a one-page agreement today. It says what I just told you: the discount, the refund, the start date, the renewal cap. The other thing I'd like is a set of hard test files, non-confidential ones or ones you can redact, so I can test against your kind of document before you write any code. Who should I send the agreement to?"

Then: send it within two hours. Log `commitment = deposit` only when the money arrives, not when they say yes.

**If they hesitate ("Let me think about it"):**
> "Of course. Can I ask what you'd be thinking through? If it's the product, the price or the timing, I'd rather hear it now, and I won't be offended."

Their answer is usually one of the objections in section 4. Handle it once, then re-ask once. Don't push a third time.

**If they need someone else's OK:**
> "Makes sense. Who would that be? Would it help if I joined a 15-minute call with them, or is it easier if I send you a short summary to forward?"

Get a name, a date and a format before the call ends. "I'll run it by my CTO" with no date is polite interest. "I'll put it in front of Sam at Thursday's staff meeting and come back to you Friday" is a real next step. Put the follow-up in your calendar and in `next_action_date`.

**If they can't pay a deposit without procurement:** offer an LOI instead.
> "If a deposit means a procurement process, a one-page letter of intent works too. It's non-binding. It names the plan, the founding price, and roughly when you'd want to go live. Could you sign something like that this week?"

LOI wording to send (fill the brackets, keep it one page):

```text
Letter of intent: Margin founding customer

[Company] intends to license Margin, a web PDF viewer and annotation SDK, on the
[Startup / Business] plan at the founding price of [$X] per year
(50% off the published list price of [$Y]), for use in [product name].

Target production go-live: [quarter/year].

Conditions we need met before go-live: [e.g. passes our test set of 20 PDFs;
React package with docs; security questionnaire answered].

This letter is non-binding and creates no payment obligation. It records our
intent to buy if the conditions above are met.

Signed: [name], [title], [company], [date]
```

An LOI counts toward the gate only if it's signed by someone who can sign the eventual contract, and it names a plan, a price and a go-live window within 12 months.

**If the answer is no:**
> "Thanks for being straight with me. Can I ask what would have to be true for it to be a yes? And is there anyone else you think I should talk to?"

Write down the reason exactly. A pattern in the no's is as useful as the yeses.

**If they ask "Why should I pay anything for a product that isn't built?":**
> "Fair question. The honest answer is that I'm deciding whether to build it, and a refundable deposit is the only way I can tell real demand from polite interest. Your money isn't at risk: it's refundable, and nothing else is billed until you're in production. The real cost to you is the time on calls like this one. In return you get half price for life and a say in what gets built first."

### Real commitment vs. polite interest

| Level | Examples | Counts toward the 10? | Sheet value |
|---|---|---|---|
| **Real commitment** | $500 deposit received. Signed LOI from a contract signer, naming plan, price and a go-live window within 12 months. | **Yes** | `deposit` / `loi` |
| **Advancement** (real, but not a commitment yet) | A meeting with the budget owner booked on the calendar. Test files sent, or results from running their own hard files through the demo. Their actual quote or contract shared with you. An intro to their security or procurement contact. A named engineer assigned to test the demo on their files. | No, but it means the call worked. Follow up within 48 hours. | `verbal` plus a `next_action_date` |
| **Polite interest** (zero) | "Sounds great, keep me posted." "Send me a deck." "Add me to the list." "We'd definitely use this." "Let's reconnect next quarter" (with no date or reason). Compliments on the demo. Any future-tense promise. | No | `none` |

The test for advancement: did they give up something real (time on their calendar, their documents, their reputation with a colleague, their money)? If not, it's polite interest, however warm it felt.

### Same-day follow-up email

Send within two hours of every call, whatever the outcome. Short, in their words, with the next step stated.

```text
Subject: Margin: notes from today

Hi {{first_name}},

Thanks for the time today. What I took away:

- You use [vendor/tool] for [use case], about [$X] a year, renewing in [month].
- The biggest problem is [their words].
- On day one you'd need [features], and [missing feature] isn't in the demo yet.

[If they committed:] Here's the deposit link: [link]. The one-page agreement is
attached. It covers the 50% founding discount, the full refund until go-live (or
if Margin isn't built), the go-live start date and the 5% renewal cap.

[If there's a next step:] As agreed, [next step] on [date].

[If it's a no:] Thanks for being straight with me. If you think of anyone who's
fought with a PDF SDK contract, I'd be grateful for an intro.

{{sender_name}}
```

---

## 4. Objection handling

Each objection gets the same treatment: what's true, what to say, what to log. Rules for all of them:

- **Concede what's true first.** The brand is honesty. If they're right, say so before anything else.
- **Answer with a test, not a claim.** "Send me your files and I'll show you" beats "our rendering is great".
- **Handle it once, then ask a question.** Don't stack three arguments.
- **Some objections are disqualifiers.** If Margin truly can't do what they need, say so and switch to learning mode. A clean no is a good outcome.

### "You're too small / too new"

**What's true:** Completely. There is a demo and a founding program, no customers, no team of hundreds, no SOC 2. If Margin disappears, they're left with an SDK nobody maintains.

**Say:**
> "You're right, and that's a real risk. I'd worry about it too. Here's how the offer is set up around it: the deposit is refundable, and you pay nothing else until you're live in production. So your money isn't at risk before go-live, though your engineers' time would be. After go-live, the viewer runs inside your own app and your documents never touch a server of ours, so we're not in your data path.
>
> Can I ask what specifically worries you: that we'll disappear, that support will be slow, or that the product won't mature?"

Then answer the specific worry:
- **Disappearing:** "Rendering and annotation run client-side in your app, with no Margin server in the path." [Only if decided (decision 5): "Founding contracts include source-code escrow, and there's no license server, so if we disappear your viewer keeps working."]
- **Support:** "As a founding customer you'd have my direct line. That's an advantage of small, for now."
- **Maturity:** "That's why I asked for your hardest files. Let's find out on your documents, not on my word."

The research lists source escrow on Enterprise. Don't offer it on a call unless you've decided to honor it.

**Log:** Which specific worry it was. If "too new" is the main reason for most no's, the founding program needs a stronger risk reversal, or the segment is too risk-averse.

### "What about rendering quality?"

**What's true:** The demo renders with pdf.js, the engine inside Firefox. It's mature and handles most documents well, but it isn't PDFium (Chrome's engine, which Nutrient builds on) or Apryse's engine. Edge cases in fonts, complex vector drawings and very large files are where engines differ. The market report says fidelity, not price, is what usually wins these deals. Nobody has run a fidelity benchmark on Margin yet.

**Say:**
> "Fair question, and the honest answer is that it depends on your files. The demo uses pdf.js, the same engine Firefox uses to show PDFs. For contracts and typical business documents it's very good. Where engines differ is heavy drawings, unusual fonts and huge files.
>
> So here's what I'd propose: open the demo and drag in your 10 hardest files, side by side with what you use today. It all runs on your machine, so nothing confidential leaves your hands. If it's not close enough on your documents, I'd rather know now."

If they can share non-confidential files, offer to run the comparison yourself and send back the results.

**Log:** Whether they ran the test, and what broke (file type, page count, what looked wrong). Files they're allowed to share go into the test corpus for the fidelity proof of concept the research calls for (1,000+ real PDFs).

### "We need mobile"

**What's true:** The demo is responsive and works in mobile browsers, down to phone width. There are no native iOS or Android SDKs, and none are planned soon. React Native and Flutter wrappers are a plan, not a product. Heavy documents on iPhone Safari can hit canvas memory limits, and Margin hasn't been tested at that edge.

**Say:**
> "Let's be precise about what 'mobile' means for you. Is it your web app opened in a phone browser, or a native iOS or Android app?"

If **mobile web:**
> "Then open this on your phone right now: [demo link]. Try your heaviest file. That's the honest test, and I'd like to know what happens."

If **native app:**
> "Then today we're not a fit for that part. There's no native SDK, and I'm not going to pretend there will be one next quarter. React Native and Flutter wrappers are on the plan for founding customers, but they're a plan. If native is a day-one requirement, keep your current vendor for mobile. If your web app is where most of the PDF work happens, we could cover that part. Whether that lowers what you pay your current vendor is a question for them."

Follow-up question either way: "What share of PDF sessions happen on a phone today? How do you know?" Many teams say "mobile" but can't name a number.

**Log:** Mobile web vs native, and the share they named. If native mobile is a day-one requirement on a third or more of calls, React Native/Flutter moves up the roadmap, or this segment isn't reachable yet.

### "We need Office conversion"

**What's true:** Margin doesn't convert Word, Excel or PowerPoint to PDF and won't any time soon. The research ranks Office conversion as the hardest problem in the category and part of the incumbents' moat. Headless LibreOffice, the usual shortcut, is unreliable.

**Say:**
> "We don't do that, and I won't pretend we will soon. Office conversion is genuinely hard, and it's a big part of what you pay Apryse or Nutrient for.
>
> Can I ask how it's used? Is conversion a core part of the product, or a step before the document reaches the viewer? Some teams run conversion as a separate server-side step, through a dedicated conversion service, and only need a viewer for the PDFs that come out. If that's you, we could cover the viewer side. If conversion is core and has to live in the same SDK, we're not the right fit, and I'd rather tell you now."

**Log:** Core vs. pre-processing step. If core, mark it as a disqualifier on the scorecard. If more than a third of calls say Office conversion is core, the target segment is wrong: these are platform buyers, not annotation buyers.

### "Security review"

**What's true:** Margin has no SOC 2, ISO 27001 or DPA template today. The pricing cards list a "security review package" (Business) and a SOC 2 report (Enterprise), both marked "planned"; neither exists yet. The strong point is architectural: rendering, annotation and export happen in the browser. The viewer code makes one network call of its own: it fetches the PDF URL the host app gives it. The pdf.js worker ships in the bundle, and pdf.js font and character-map files are served from the same site. The demo page also loads a Google Fonts stylesheet; that's the marketing site's styling, not the viewer, and an embedded SDK wouldn't need it.

**Say:**
> "Here's where we are, plainly. No SOC 2 report today. What we do have is an architecture that makes most of the review questions easy: documents never leave the browser. The SDK renders and annotates on the user's device, there's no Margin server in the data path, and you host the files yourselves. Annotations go wherever you put them: in the PDF or in your own database.
>
> What does your review usually ask for? If it's a questionnaire, I'll fill it out honestly. If it's an architecture walkthrough, I can show your security lead the network tab with a document open: no request carries the document or the annotations."

If they need SOC 2 before signing anything:
> "Understood. Then the deposit probably isn't for you yet, and that's fine. Would a refundable deposit or an LOI be possible with SOC 2 as a condition before go-live? If not, can I come back to you when the report exists?"

[Before the calls, prepare a one-page security note: the architecture (client-side only), dependencies and licenses (pdf.js Apache-2.0, pdf-lib MIT, React MIT, lucide-react ISC), no telemetry, where annotations are stored, and what doesn't exist yet (SOC 2, DPA, pen test). Don't send a questionnaire answer you haven't checked against the code.]

**Log:** What their review requires and when. "SOC 2 required before any deposit" is a disqualifier for now. "SOC 2 required before go-live" is not.

### "Apryse will just discount"

**What's true:** They probably will. Buyers reportedly get 10-25% off at renewal just by showing they have alternatives. The market report says that if most buyers find a discount solves their problem, the gap is a negotiating tactic, not a product.

**Say:**
> "They probably will, and if a discount solves it for you, you should take it. Honestly. Even a public price like ours is useful leverage in that conversation.
>
> The question I'd ask is whether the discount fixes the thing that bothered you. You mentioned [their pain: the add-ons / the three-year term / the revenue questions / the renewal increase]. Does 20% off change that, or does it come back at the next renewal?"

Don't argue past that. If they say a discount fixes it, thank them and log it.

**Log:** `discount_would_solve`. This is a kill criterion. Count it honestly, including the times it stings.

### "We'll use PDF.js for free"

**What's true:** For viewing only, PDF.js is the right answer, and the demo renders with it. The gaps show up with annotations: PDF.js still has open issues on editing existing annotations and on some annotation tools, and threads, round-trip export and signatures have to be built. EmbedPDF is free, built on PDFium, and already does annotations and redaction. That's the toughest free competitor and they may know it.

**Say:**
> "If you only need viewing, you should use PDF.js. The demo is built on it.
>
> Where teams usually get stuck is everything on top: annotations that round-trip with Acrobat, comment threads, signatures, editing annotations that are already in the file. How much of that do you need? And have you estimated the build? If it's two engineers for a quarter, that's a lot more than $6,000 a year, and you'd maintain it forever. If it's two weeks, use PDF.js and I'll tell you so."

If they mention EmbedPDF:
> "It's good, and it's free. Have you tried it on your files? I'd like to know how it did."

**Log:** `free_tool_acceptable`, plus any engineer-week estimate they give. Also a kill criterion. If more than half of calls say a free tool plus in-house work is acceptable, stop.

### Other objections you'll hear

| They say | Short answer | Log |
|---|---|---|
| "When will it ship?" | "I'll give you a date once I trust it, not before. That's why nothing is billed until you go live." [Replace with your honest timeline once you have one.] | What date they'd need. A real date from them is a timing signal. |
| "Do you have Vue / Angular?" | "Not yet. The demo is React. Wrappers are planned; which do you need, and by when?" | `must_have_missing` |
| "Do you do redaction / forms?" | "They're on the Business plan but not in the demo yet. Is that day one for you, or later?" | `must_have_missing`. Repeats on a third of calls = build priority. |
| "Can you just send a deck?" | "There's no deck, just the demo and the pricing page. What would you want to see that the demo doesn't show?" | If that's all they want: polite interest. |
| "$12k is still a lot" | "The founding price is $6,000. But tell me what it would need to cost, and what the current setup costs you, including engineering time." | Their number. Several answers under $5k means the segment is wrong. |
| "Who else is using it?" | "Nobody in production yet. You'd be one of the first 20, which is why the price is half." | Nothing to log. Never invent an answer. |

---

## 5. Qualification scorecard and decision rule

Fill this in within an hour of the call, before you read your notes back to anyone. Score from evidence, not vibes: every score above 5 needs a fact from the call written next to it.

### Scorecard (one per call)

| Dimension | 0 | 3 | 5 | 7 | 10 | Score | Evidence (one line) |
|---|---|---|---|---|---|---|---|
| **Pain** | No complaint. Happy with current setup. | Complains, never acted. | Pushed back on vendor, or built a workaround. | Actively evaluated alternatives in the last 12 months. | Budgeted to replace it, or mid-negotiation and unhappy. | | |
| **Budget** | Won't or can't pay for an SDK. Free only. | Pays or was quoted under $5k. | Pays or was quoted $5-15k, or spends 1+ engineer-quarter a year on a home-grown viewer. | Pays or was quoted $15-25k. | Pays or was quoted $25k+, and can name the line item. | | |
| **Timing** | No PDF project or renewal in sight. | Someday, no date. | Renewal or launch 6-12 months out. | Renewal or launch 3-6 months out. | Renewal or launch under 3 months, or a named customer is waiting. | | |
| **Authority** | Doesn't know who decides. | Influencer only, no access to the signer. | Recommender with a direct line to the signer. | Signer, but needs one other approval. | Signs the contract and can move $500 today. | | |
| **Fit** | Needs things Margin won't do (Office conversion, native SDKs, server processing) as core. | Needs several big missing features on day one. | Web-first. Needs one missing feature (e.g. redaction, forms, Vue). | Web-first. Needs only what the demo does, plus minor gaps. | Web-first, in a target segment (legal, construction, insurance, health), uses viewing plus annotation plus comments, and the demo worked on their file. | | |
| | | | | | **Total** | **/50** | |

**Disqualifiers** (any one means no deposit ask this round; switch to learning mode. For the first three, score Fit 0-3):

- [ ] Office conversion is core and must be in the same SDK
- [ ] Native iOS/Android SDK required on day one
- [ ] SOC 2 required before any deposit or LOI
- [ ] Says a 10-25% discount from current vendor would solve it (`discount_would_solve = yes`)
- [ ] Says free tool plus in-house work is acceptable (`free_tool_acceptable = yes`)

The last two don't disqualify the person forever, but they count against the market (see the decision rule).

**Bands and what to do:**

| Total | Band | Action |
|---|---|---|
| 40-50 | A | Ask for the deposit on the call. Follow up personally within 24 hours. If they stall, ask for a call with the signer this week. |
| 30-39 | B | Ask for the deposit or an LOI. If not today, get one advancement step with a date. |
| 20-29 | C | Don't push a deposit. Ask for a referral and their PDFs. Revisit at renewal (`nurture` with a date). |
| 0-19 | Not ICP | Thank them, ask for one referral, close the row. Look for the pattern: why did they get a call? |

### Decision rule (end of week 4)

The market report sets the gate: 10 or more paid commitments means go, fewer than 5 means stop. `outreach.md` uses the same numbers. This section defines what counts, so the read at the end is honest.

**A commitment counts toward the gate only if all of these are true:**

1. It's a deposit received or a signed LOI that meets the bar in section 3 (signer, plan, price, go-live within 12 months).
2. The company scored 30 or more on the scorecard, with no disqualifier checked.
3. It isn't a favor. A deposit from a friend's company who would never actually ship it doesn't count. Be strict with yourself here; warm-network deposits are the easiest to over-count.

**The rule:**

| Qualified commitments after 4 weeks (with about 30 calls) | Decision |
|---|---|
| **10 or more** | **Build.** Move to the next step in the report: a fidelity proof of concept on your committed customers' real PDFs, and engineering hiring. Also check the two quality conditions below. |
| **5-9** | **Don't build yet.** Narrow to the one segment that produced the most commitments and run four more weeks there (still inside the report's 90-day window). If you don't reach 10 by day 90, stop. |
| **Under 5** | **Stop.** The report's reading: the gap is a negotiating tactic, not a product. Write up what you learned. |

**Stop regardless of the count if:**

- More than half of calls say a discount from their current vendor would solve it (`discount_would_solve = yes`).
- More than half of calls say a free tool plus in-house work is acceptable (`free_tool_acceptable = yes`).

Count "more than half" over the calls where the question applied and got a `yes` or `no`; leave out `unclear`. These are the report's kill criteria. A pile of deposits from a market that mostly says "a discount fixes it" means you got lucky with a few accounts, not that the market is there.

**Two quality conditions on a "build" result:**

1. **At least 5 of the 10 are Business or Enterprise.** The report's bar was LOIs or pilots at $8-12k. No founding deal clears it: founding Startup is $2,500 a year and founding Business is $6,000. So this gate is weaker evidence than the report asked for, and a gate made mostly of Startup deposits is weaker still. If fewer than 5 are Business or Enterprise, treat the result as 5-9 and extend.
2. **At least 15 of the 30 calls produced a dollar figure** (`annual_spend`; a range counts at its midpoint). If most people won't say what they pay, you don't yet know where the money is.

**Weekly pacing check** (read in the Friday review in `outreach.md`):

| End of week | Calls held (cumulative) | Qualified commitments (cumulative) | If you're behind |
|---|---|---|---|
| 1 | 5-8 | 1-2 | Normal. Fix the script from the first calls. |
| 2 | 12-15 | 3-4 | If zero: the offer or the segment is wrong, not the volume. Re-read the no reasons before booking more calls. |
| 3 | 20-24 | 6-7 | Push for follow-ups with every B-band account. |
| 4 | 28-32 | 10+ | Make the read. Don't extend just because it's close; use the 5-9 rule. |

### Tally sheet (fill in at the Friday review)

| Week | Calls | Avg score | A | B | C | Not ICP | Deposits | LOIs | Qualified commitments | Business+ commitments | `discount_would_solve` yes | `free_tool_acceptable` yes | Calls with $ figure | Top `must_have_missing` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | | | | | | |
| 2 | | | | | | | | | | | | | | |
| 3 | | | | | | | | | | | | | | |
| 4 | | | | | | | | | | | | | | |
| **Total** | | | | | | | | | | | | | | |

---

## 6. Note-taking template

Copy this for every call. Fill the header before the call, the body during, and the scorecard and "after" sections within an hour. Write their words in quotation marks when they say something sharp; paraphrase loses the signal. Lowercase field names with underscores (`annual_spend`, `commitment`) are the tracking-sheet columns in `outreach.md`, section 7, with the same allowed values. Copy them across as-is.

```text
=====================================================================
MARGIN DISCOVERY CALL
=====================================================================
call_date:            Interviewer:
first_name / last_name:                    title:
persona:      product / engineering / founder
company:                                   size_stage:
segment:      legal / construction / insurance / health / other
source:       warm / intro / cold_email / linkedin / inbound
referred_by:                               fit_score (1-5):
hook (as sent):
Suspected SDK before call:

---------------------------------------------------------------------
1. CURRENT SETUP
---------------------------------------------------------------------
Where PDFs appear in their product:
What users do (view / highlight / comment / sign / redact / forms / other):
current_sdk:            (apryse / nutrient / pdfjs / pdfjs_express / embedpdf / in_house / other / unknown)
sdk_confidence:         (confirmed / likely / unknown)
Where annotations are stored:
Who owns the viewer, and time spent on it (people x weeks per month):
Platforms: web / mobile web / native iOS / native Android / desktop
Office conversion used?  no / pre-processing step / core

---------------------------------------------------------------------
2. LAST PURCHASE OR RENEWAL
---------------------------------------------------------------------
When:
Trigger (new feature / renewal / customer request / other):
Who found it:            Who evaluated:            Who signed (title):
Alternatives considered, and why they lost:
Time from first contact to signature:
Where it stalled:
What surprised or annoyed them (their words):
renewal_month:

---------------------------------------------------------------------
3. COST AND TERMS
---------------------------------------------------------------------
annual_spend (USD):              First quote (USD):
Range if no number:  <10k / 10-25k / >25k / refused
Pricing basis:  per app / per user / per document / revenue-based / other
Add-ons bought:
Term length:              Auto-renew?            Renewal increases:
Asked for revenue or financials?  yes / no
discount_would_solve:     yes / no / unclear     Exact words:
free_tool_acceptable:     yes / no / unclear     Exact words:

---------------------------------------------------------------------
4. PAIN
---------------------------------------------------------------------
Top pain in their words:
pricing_model_pain:  quote_opacity / add_ons / revenue_based / lock_in / renewal_hike / none
technical_pain:      bundle_size / round_trip / large_files / mobile / customization / none
Last time it caused a real problem (what happened):
What they did about it (the key answer):
What it cost them (hours, dollars, a deal):
Engineer-weeks spent on workarounds or a home-grown viewer:

---------------------------------------------------------------------
5. DEMO
---------------------------------------------------------------------
Their file used?  yes, on their machine / yes, on mine / no (sample)       File type:
Steps shown:  1 load  2 highlight+thread  3 [tool: ____]  4 export to Acrobat  5 import
What they reacted to (facts, not compliments):
What broke or looked wrong:
"What would you need to see that I didn't show?" (exact words):
must_have_missing:

---------------------------------------------------------------------
6. THE ASK
---------------------------------------------------------------------
Asked for:  deposit / LOI / next step / referral only
Their answer (exact words):
plan_interest:   startup / business / enterprise / none
commitment:      none / verbal / loi / deposit   (deposit only once the money arrives)
deposit_date:                     deposit_amount:
If advancement, what they gave up:  signer meeting / PDFs sent / quote shared / intro / none
Next step:                          next_action_date:
Referrals given (names, companies):

Objections raised (tick and note the specific worry):
[ ] too small/new: ____     [ ] rendering: ____     [ ] mobile: ____
[ ] Office conversion: ____ [ ] security: ____      [ ] Apryse discount: ____
[ ] PDF.js/free: ____       [ ] other: ____

---------------------------------------------------------------------
7. SCORECARD  (score from evidence; anything above 5 needs a fact)
---------------------------------------------------------------------
Pain       __/10   evidence:
Budget     __/10   evidence:
Timing     __/10   evidence:
Authority  __/10   evidence:
Fit        __/10   evidence:
TOTAL      __/50   Band:  A / B / C / Not ICP

Disqualifiers:
[ ] Office conversion core   [ ] native mobile day one   [ ] SOC 2 before deposit
[ ] discount solves it       [ ] free tool acceptable
Counts toward the gate?  yes / no   (deposit or valid LOI + score 30+ + no disqualifier + not a favor)

---------------------------------------------------------------------
8. AFTER THE CALL
---------------------------------------------------------------------
Best quote of the call (verbatim):
The one thing I learned that I didn't know before:
What surprised me:
Where I talked too much or pitched too early:
One change to the script for next time:
Follow-up email sent (time):         Sheet updated (time):
=====================================================================
```

After every fifth call, re-read the last five "one change to the script" lines and update this file. The script should look noticeably different by call 15 than it did on call 1. That's a sign it's working, not that it was wrong.
