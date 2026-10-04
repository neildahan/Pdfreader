# Competitive Landscape: Commercial Embeddable PDF Viewer/Annotation SDKs (Pricing, Licensing, Features)

Research date: 2026-10-04. Method note: Most vendor and procurement sites (apryse.com, nutrient.io, compdf.com, pdfjs.express, vendr.com, spendhound.com, componentsource.com, verdocs.com, simplepdf.com, news.ycombinator.com) were blocked by the research environment's egress proxy. Figures below come from search-engine summaries/snippets of those pages, not full-page reads. Treat individual numbers as "reported" and verify before quoting externally. Several sources are SEO comparison pages written by competitors (SimplePDF, Verdocs, Nutrient, ComPDF, CloudPDF). They have an incentive to make incumbents look expensive.

## Q1: Apryse (PDFTron) WebViewer / Apryse SDK — actual cost, licensing, add-ons, features

### Takeaway
Apryse has no public price list. Procurement data puts the median buyer at about $24k/yr and the SMB average at about $27k/yr, so the reported ~$30k/yr quote is typical for a small or mid-size web deployment. Enterprise deals run to six figures. Pricing is modular: a base WebViewer package plus à la carte add-ons such as Office conversion and server components, scoped by features, document volume/"document events" and deployment type.

### Cited Findings
- Apryse uses a custom-quote model with no self-serve pricing. Entry packages are reported "from $1,500 per year", but web-only licenses are "typically starting at $10,000+/year" — [Search summary of Vendr / SimplePDF / Verdocs pages](https://www.vendr.com/marketplace/apryse); [SimplePDF Apryse alternative page](https://simplepdf.com/alternatives/apryse)
- Vendr (2026 page): the median buyer pays **$24,351/yr** — [Vendr Apryse marketplace](https://www.vendr.com/marketplace/apryse)
- SpendHound (2026): average SMB pricing **$26,872/yr**, average enterprise pricing **$164,100/yr** — [SpendHound Actual Apryse Pricing 2026](https://www.spendhound.com/marketplace/apryse-pricing)
- An older Vendr buyer guide for "PDFTron" (2025) reports an average annual cost of about **$95,500**, with a maximum of **$320,000**. This average is skewed by enterprise deals and is in tension with the $24k median above — [Vendr PDFTron buyer guide](https://www.vendr.com/buyer-guides/pdftron)
- An older developer comparison estimated a PDFTron baseline of about $4,000/yr (undated, likely ca. 2020–2021) — [DEV Community: PDF Web Viewers Compared](https://dev.to/jamibaraki/pdf-web-viewers-compared-foxit-pdftron-and-pspdfkit-2gi6)
- Pricing is described as consumption-based, tied to "document events" and usage volume, and depends on selected features, document volume and server-side vs. client-side deployment. Apryse also publishes an "SDK Pricing Guide" page — [Verdocs Apryse Pricing Guide 2026](https://verdocs.com/blog/apryse-pricing); [Apryse SDK Pricing Guide](https://apryse.com/pricing/guide)
- WebViewer ships "a base package of out-of-the-box functionality" plus à la carte modules — [G2 Apryse pricing (search summary)](https://www.g2.com/products/apryse-pdf-sdk/pricing)
- Office formats (DOC/DOCX/XLS/XLSX/PPT/PPTX, etc.) require the **Office Conversion Add-on**. Some features require the **Basic Conversion Add-on** and/or WebViewer Server — [Apryse docs: File formats supported](https://docs.apryse.com/web/guides/file-format-support); [Apryse docs: Deployment options](https://docs.apryse.com/web/guides/deployment-options)
- Feature set: client-side viewing, annotation, conversion and editing across 30+ formats (PDF, Office, CAD, images) with no server dependency, 35+ annotation types, and true redaction of text and images, including full-page redaction — [Apryse WebViewer product page](https://apryse.com/products/webviewer); [Apryse redaction setup docs](https://docs.apryse.com/web/guides/redaction-setup)
- No permanent free plan. A free trial key unlocks all features (with watermark) — [G2 / Verdocs search summary](https://www.g2.com/products/apryse-pdf-sdk/pricing)
- User complaints on review sites: "Pricing transparency is a big con… everything is an add-on, requiring specific licensing terms and contracts". The cost "was definitely a hurdle when comparing it to other PDF web solutions" — [Capterra Apryse PDF SDK reviews](https://www.capterra.com/p/237151/PDFTron-SDK/); [Software Advice](https://www.softwareadvice.com/pdf-editor/pdftron-sdk-profile/)
- Market consolidation: Apryse has done about 13 acquisitions, including iText (April 2022), Qoppa (August 2023), Xodo, LEAD Technologies, Scanbot, Accusoft and Eversign. It also owns PDF.js Express. It claims 20,000+ customer organizations and 85 of the Fortune 100 — [Apryse: PDFTron acquires iText](https://apryse.com/blog/news/pdftron-acquires-itext); [Wikipedia: PDF Studio (Qoppa)](https://en.wikipedia.org/wiki/PDF_Studio); [Thoma Bravo press release on LEAD](https://www.thomabravo.com/press-releases/apryse-announces-acquisition-of-ai-powered-document-toolkit-provider-lead-technologies); [Business history summary](https://businessmodelcanvastemplate.com/blogs/brief-history/apryse-brief-history)
- Qoppa no longer sells new jPDFViewer licenses. Its functionality moved into Apryse's Java PDF offering — [Qoppa pricing request page (search summary)](https://www.qoppa.com/pricing-request/?product=jPDFViewer)

### Inferences
- A quote of about $30k/yr sits around the 55th–60th percentile of reported Apryse deals (median about $24k, SMB average about $27k). A $12k/yr product would undercut a typical SMB Apryse deal by roughly 50–60%. It would still sit above Apryse's reported entry level ($1.5k–$10k), so Apryse could match it on a stripped-down quote.
- Apryse's moat is breadth: Office/CAD conversion, server components and redaction. A $12k product that is "PDF-only" should frame itself against the base WebViewer plus annotation package, not against a full Apryse bundle with Office conversion.
- Apryse is an acquirer. A low-priced competitor that gains traction could be bought out or face aggressive discounting, as happened with Qoppa and PDF.js Express.

### Gaps
- No list prices for individual Apryse add-ons (Office conversion, redaction, collaboration/WebViewer Server, digital signatures) were found.
- No first-hand, dated Reddit or Hacker News quotes for Apryse were retrieved. HN and Reddit could not be fetched, and searches did not surface specific threads with dollar figures.
- Apryse's pricing basis (per app, per domain, per end-user or per document) could not be confirmed from a primary source. Secondary sources say "document events/volume" plus features plus deployment.

## Q2: Nutrient (formerly PSPDFKit) Web/iOS/Android SDK — pricing, licensing, features

### Takeaway
Nutrient is also quote-only, and its reported spend is at or slightly above Apryse's: the Vendr median is about $31k/yr. Licensing is component-based (Viewer base plus annotations, forms, signatures, OCR, redaction, comparison), sold as annual subscriptions, with reported pressure toward multi-year (3-year) commitments.

### Cited Findings
- Vendr: the median buyer pays **$31,000/yr** for Nutrient/PSPDFKit, based on anonymized deals across company sizes — [Vendr PSPDFKit buyer guide](https://www.vendr.com/buyer-guides/pspdfkit); [Vendr PSPDFKit marketplace](https://www.vendr.com/marketplace/pspdfkit)
- Reported bands: cloud deployments start around $500–$1,200/month for small scale; mid-market contracts are $15k–$45k/yr; enterprise is $60k–$150k+/yr; self-hosted ranges from $25k to $200k+. These figures come from search summaries of Vendr and alternative-vendor pages — [Vendr PSPDFKit](https://www.vendr.com/marketplace/pspdfkit); [Docuqueue Nutrient comparison](https://docuqueue.com/compare/nutrient)
- Capterra lists a starting price of "€5,000 per user per year". The unit is unclear and may reflect a listing artifact — [Capterra Nutrient SDKs](https://www.capterra.com/p/171174/PSPDFKit-SDK/)
- User reviews call it "extremely expensive" and say "they lock you in to a 3 year contract" — [Capterra Nutrient SDKs reviews (search summary)](https://www.capterra.com/p/171174/PSPDFKit-SDK/); [SimplePDF PSPDFKit alternative](https://simplepdf.com/alternatives/pspdfkit)
- Nutrient's own explanation: component-based pricing where "Viewer is the foundation for client-side SDKs" and customers license components on top (annotations, forms, digital signatures, OCR, redaction, document comparison). Licenses are annual subscriptions including updates and support, with "multiyear terms available at the best yearly rate". Pricing reflects components plus deployment model (client-side Web SDK, self-hosted Document Engine, managed cloud, or usage-based API) — [Nutrient: PDF SDK pricing and licensing explained (2026)](https://www.nutrient.io/blog/pdf-sdk-pricing-and-licensing-explained/)
- The usage-based API is credit-priced (for example, a digital signature costs 10 credits and OCR costs 2 credits) — [Nutrient DWS Processor pricing](https://www.nutrient.io/guides/dws-processor/pricing/)
- PSPDFKit raised $116M in 2021, its first outside money, and claimed nearly 1B people use apps powered by it — [TechCrunch, Oct 2021](https://techcrunch.com/2021/10/01/pspdfkit-raises-116m-its-first-outside-money-now-nearly-1b-people-use-apps-powered-by-its-collaboration-signing-and-markup-tools)
- Nutrient actively markets itself as an Apryse alternative, with benchmarks — [Nutrient vs Apryse 2026](https://www.nutrient.io/sdk/vs/apryse/)

### Inferences
- Apryse and Nutrient form a $25k–$35k/yr "incumbent band" for SMB/mid-market web viewer plus annotation deals. A $12k/yr product is about 60% below both.
- The component model means the first-year quote often grows at renewal as customers add signatures, redaction and similar components. A flat, all-inclusive $12k price is a credible differentiator.

### Gaps
- No published per-platform list prices (Web vs. iOS vs. Android) were found. Nutrient's pricing page could not be read directly.
- Whether Nutrient still offers a startup or small-business program in 2026 was not confirmed.

## Q3: Other vendors — Foxit, ComPDFKit, Syncfusion, Adobe Embed, PDF.js Express, Telerik/Kendo, DevExpress, Gnostice, Qoppa, PDFium-based, PDF.js, EmbedPDF, react-pdf-viewer, startups

### Takeaway
The market splits into three tiers:
1. Quote-based incumbents: Apryse, Nutrient, Foxit (web).
2. Transparent mid/low-price SDKs: ComPDF (about $1.5k per platform per year), PDF.js Express (about $6–7k/yr), UI-suite viewers bundled per developer (Syncfusion, Telerik, DevExpress at $600–$2,300 per developer per year, Syncfusion free for small companies).
3. Free/open source: PDF.js, Adobe PDF Embed API, EmbedPDF (MIT, PDFium/WASM, includes annotations and true redaction), react-pdf.

The open-source tier is improving fast and puts a ceiling on what basic viewing plus annotation can command.

### Cited Findings

**Foxit PDF SDK**
- Reported $3,000 per platform per year for on-premise licensing (TrustRadius listing) — [TrustRadius Foxit PDF SDK pricing](https://www.trustradius.com/products/foxit-pdf-sdk/pricing)
- A reseller (SHI) lists a "Foxit PDF SDK Technology Access Fee for PDF SDK for Web" at **$12,727** (undated SKU) — [SHI product listing](https://www.shi.com/product/44587433/FOXIT-PDF-SDK-TECHNOLOGY-ACCESS-FEE-FOR-PDF-SDK-FOR-WEB)
- Grouped with Apryse and PSPDFKit as quote-based, "typically $10K+/year for web-only" — [SimplePDF alternatives](https://simplepdf.com/alternatives)

**ComPDF (ComPDFKit)**
- ComponentSource reseller SKU: "ComPDF SDK 1 User Annual" costs **$1,470 per platform per year**. It covers 1 project with unlimited files, developers and locations — [ComponentSource ComPDF prices](https://www.componentsource.com/product/compdf/prices)
- ComPDF for Web pricing is "flexible", based on features, number of root domains, end users and time period. Contact sales for web — [ComPDF blog: Build a Web PDF Viewer](https://www.compdf.com/blog/build-a-web-pdf-viewer-or-editor-in-javascript)
- Function-based licensing (buy only the features you need), unlimited file processing, developers and locations. A Community License is available for individual developers, teams of 5 or fewer, startups and non-profits — [ComPDF blog: Apryse vs ComPDFKit](https://www.compdf.com/blog/apryse-pdftron-vs-compdfkit); [ComPDF community license for startups](https://www.compdf.com/blog/compdfkit-community-license-for-startups)
- Explicitly markets itself as the "Best Apryse (PDFTron) Alternative" — [ComPDF blog](https://www.compdf.com/blog/apryse-pdftron-vs-compdfkit)
- A competitor-authored comparison describes it as affordable but with "quality concerns", suited to basic features (viewing, annotation, forms, signing, OCR) — [search summary of comparison pages, e.g. Nutrient enterprise PDF SDKs](https://www.nutrient.io/blog/enterprise-pdf-sdks/)

**Syncfusion PDF Viewer**
- The Community License is free for organizations with under $1M annual revenue, 5 or fewer developers and 10 or fewer employees, that have never received more than $3M in outside capital — [Syncfusion Community License](https://www.syncfusion.com/products/communitylicense)
- The PDF Viewer SDK is reported at $599 per developer per year, or $2,995 per year for 5 developers. G2 shows Essential Studio from $2,995 to $5,995 — [G2 Essential Studio pricing](https://www.g2.com/products/syncfusion-essential-studio/pricing); [Syncfusion pricing](https://www.syncfusion.com/sales/pricing)

**Adobe PDF Embed API**
- Free, including commercial use with annotations, no enterprise license required. An annotation API is available (enableAnnotationAPIs) — [Adobe PDF Embed API](https://developer.adobe.com/document-services/apis/pdf-embed/); [Adobe How Tos](https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos)
- Limits: requires a client ID bound to a domain (one base domain plus subdomains per client ID). It cannot be used without domain binding. It is an Adobe-hosted viewer, so customization and self-hosting are limited — [Adobe Community: client ID domain](https://community.adobe.com/t5/acrobat-services-api-discussions/adobe-pdf-embed-api-client-id-domain/m-p/12378845); [Adobe Community: client ID without domain](https://community.adobe.com/questions-21/pdf-embed-api-client-id-without-binding-to-a-domain-310235)

**PDF.js Express (Apryse-owned)**
- The Professional/annotation plan is reported at **$595/month**, with annual billing at a 15% discount (about $6,070/yr by our calculation) — [PDF.js Express pricing](https://pdfjs.express/pricing)
- A community forum user reported a 1-year recurring renewal of **$7,130/yr** and complained the "yearly renewal cost increased with no major updates provided" — [PDF.js Express community forum](https://pdfjs.community/t/yearly-renewal-cost-increased-with-no-major-updates-provided/3619)

**Telerik / KendoReact**
- KendoReact (which includes the PDF Viewer in its premium tier) costs $649–$1,199 per developer per year — [KendoReact PDF Viewer](https://www.telerik.com/kendo-react-ui/pdfviewer); [Telerik purchase](https://www.telerik.com/purchase.aspx)

**DevExpress**
- DevExpress Universal (includes PDF Viewer and DevExtreme) costs $2,253.99 new (MSRP $2,299.99) and $1,126.99 to renew, per developer per year, via ComponentSource — [ComponentSource DevExpress Universal prices](https://www.componentsource.com/product/devexpress-universal/prices); [DevExpress Universal](https://www.devexpress.com/subscriptions/universal.xml)

**Gnostice / Qoppa**
- Gnostice XtremeDocumentStudio (.NET/Java, multi-format viewing, printing and conversion) uses perpetual licenses with 12 months of support. No price was found — [Gnostice XtremeDocumentStudio Java](https://www.gnostice.com/XtremeDocumentStudio_Java.asp)
- Qoppa was acquired by Apryse (August 2023). jPDFViewer is no longer sold — [Wikipedia: PDF Studio](https://en.wikipedia.org/wiki/PDF_Studio); [Qoppa pricing request](https://www.qoppa.com/pricing-request/?product=jPDFViewer)

**Open source: EmbedPDF, PDF.js, react-pdf**
- EmbedPDF is an MIT-licensed PDF SDK built on PDFium (Chrome's engine) compiled to WebAssembly, not PDF.js. It supports annotations (highlight, sticky notes, free text, ink), true redaction, search and text selection, runs fully in the browser, and has React/Vue/Svelte bindings. The core and standard plugins are free for commercial use — [EmbedPDF GitHub](https://github.com/embedpdf/embed-pdf-viewer); [EmbedPDF React viewer](https://www.embedpdf.com/react-pdf-viewer); [Show HN thread](https://news.ycombinator.com/item?id=44126177) (HN item id suggests mid-2025)
- EmbedPDF is a PDF Association member — [PDF Association member page](https://pdfa.org/member/embedpdf/)
- react-pdf is MIT-licensed and free — [Syncfusion blog: best React PDF viewers 2026](https://www.syncfusion.com/blogs/post/best-react-pdf-viewers)
- PDFium is open source, originally from Foxit and released by Google — [CloudPDF: Nutrient alternatives](https://cloudpdf.io/blog/pspdfkit-alternatives)
- CloudPDF's server component is Fair Source licensed (FCL-1.0-ALv2) and needs a paid license to self-host — [search summary, CloudPDF](https://cloudpdf.io/blog/pspdfkit-alternatives)

**Startups / iframe SaaS**
- SimplePDF costs $99/month flat with no annual commitment. It is an iframe embed with client-side processing, marketed as an "Apryse alternative without enterprise contracts" — [SimplePDF Apryse alternative](https://simplepdf.com/alternatives/apryse)

### Inferences
- Pricing tiers at a glance:
  - $0: PDF.js, react-pdf, EmbedPDF, Adobe Embed, Syncfusion Community
  - $0.6k–$2.3k per developer per year: UI suites
  - About $1.5k per platform per year: ComPDF native
  - About $1.2k/yr: SimplePDF ($99/mo)
  - About $6–7k/yr: PDF.js Express
  - $10k+ (quote): Foxit web, ComPDF web
  - $24–31k median (quote): Apryse, Nutrient
- $12k/yr sits in a thin middle band. It is roughly 2x PDF.js Express and well above ComPDF's published prices, but less than half the Apryse/Nutrient medians. To justify $12k over free EmbedPDF or $6–7k PDF.js Express, the product needs clear capabilities beyond viewing plus basic annotation. Candidates: real-time collaboration, signatures, forms, Office conversion, enterprise support/SLA, and compliance features.

### Gaps
- No ComPDF web SDK list price was found (it is "contact sales"). The Community License price was not found.
- No current DevExpress or Gnostice standalone PDF component prices were found.
- No 2023–2026 VC-backed "PSPDFKit-like" startups with published SDK pricing were found beyond EmbedPDF (open source), SimplePDF and CloudPDF. Joyfill pricing was not found.
- Feature-weakness data for Telerik/DevExpress/Syncfusion viewers (for example, annotation depth or rendering fidelity) was not gathered in depth.

## Q4: Transparent pricing vs. "contact sales"; typical quotes; who positions as "cheaper than Apryse"

### Takeaway
Every enterprise-grade, PDF-specialist SDK (Apryse, Nutrient, Foxit web, ComPDF web) is "contact sales". Only UI-suite vendors, PDF.js Express, ComPDF (native, via reseller) and SaaS embeds publish prices. Several vendors explicitly position against Apryse: ComPDF, Nutrient, SimplePDF, EmbedPDF and CloudPDF. The low-cost challengers price at roughly $1–7k/yr or free, not around $12k.

### Cited Findings
- **Transparent:** Syncfusion ($0 community / $599 per developer) — [Syncfusion](https://www.syncfusion.com/products/communitylicense); KendoReact ($649–$1,199 per developer) — [Telerik](https://www.telerik.com/purchase.aspx); DevExpress ($2,299.99 MSRP) — [DevExpress](https://www.devexpress.com/subscriptions/universal.xml); PDF.js Express ($595/mo) — [PDF.js Express](https://pdfjs.express/pricing); SimplePDF ($99/mo) — [SimplePDF](https://simplepdf.com/alternatives/apryse); Adobe Embed (free) — [Adobe](https://developer.adobe.com/document-services/apis/pdf-embed/)
- **Partially transparent:** ComPDF native SDK at $1,470 per platform per year via reseller, with web on quote — [ComponentSource](https://www.componentsource.com/product/compdf/prices); Foxit via TrustRadius/SHI listings — [TrustRadius](https://www.trustradius.com/products/foxit-pdf-sdk/pricing)
- **Contact sales:** Apryse — [Apryse pricing](https://apryse.com/pricing); Nutrient — [Nutrient pricing](https://www.nutrient.io/sdk/pricing/); Foxit web, Gnostice, ComPDF web — sources above
- **Typical quotes (procurement data):** Apryse median $24,351, SMB average $26,872, enterprise average $164,100 — [Vendr](https://www.vendr.com/marketplace/apryse), [SpendHound](https://www.spendhound.com/marketplace/apryse-pricing). Nutrient median $31,000 — [Vendr](https://www.vendr.com/buyer-guides/pspdfkit). These are 2026-dated pages; the underlying deal dates are not disclosed.
- **Explicit "Apryse alternative" positioning:**
  - ComPDF ("Best Apryse (PDFTron) Alternative") — [ComPDF](https://www.compdf.com/blog/apryse-pdftron-vs-compdfkit)
  - Nutrient (benchmarks vs Apryse) — [Nutrient](https://www.nutrient.io/sdk/vs/apryse/)
  - SimplePDF ("Apryse alternative without enterprise contracts — $99/mo") — [SimplePDF](https://simplepdf.com/alternatives/apryse)
  - EmbedPDF/CloudPDF (open-source alternative to "closed-source and expensive" Apryse/Nutrient) — [CloudPDF](https://cloudpdf.io/blog/pspdfkit-alternatives)
- **Recurring buyer complaints about incumbents:** opaque pricing, add-on creep and multi-year lock-in — [Capterra Apryse](https://www.capterra.com/p/237151/PDFTron-SDK/); [Capterra Nutrient](https://www.capterra.com/p/171174/PSPDFKit-SDK/). Renewal price hikes at PDF.js Express — [PDF.js community](https://pdfjs.community/t/yearly-renewal-cost-increased-with-no-major-updates-provided/3619)

### Competitor Matrix (summary)

| Vendor | Reported price | Licensing model | Platforms | Key features | Notable weaknesses |
|---|---|---|---|---|---|
| Apryse WebViewer/SDK | Quote. Median ~$24k/yr; SMB avg ~$27k; enterprise avg ~$164k; entry "from $1.5k", web typically $10k+ | Base package + à la carte add-ons; features × doc volume/"document events" × deployment | Web, iOS, Android, Windows, macOS, Linux, server | 30+ formats incl. Office/CAD (add-on), 35+ annotation types, redaction, signatures, forms, client-only or server | Opaque pricing, add-on creep, high cost |
| Nutrient (PSPDFKit) | Quote. Median ~$31k/yr; mid-market $15–45k; enterprise $60–150k+ | Component-based (Viewer + components); annual, multi-year discounts; usage-credit API | Web, iOS, Android, Windows, server, cloud | Annotations, forms, signatures, OCR, redaction, comparison, Document Engine | Expensive; reported 3-yr lock-in |
| Foxit PDF SDK | ~$3k per platform per year (on-prem); web "technology access fee" $12,727 SKU; web quote $10k+ | Per platform; quote for web | Web, native desktop/mobile, server | PDFium heritage, full PDF stack | Opaque web pricing |
| ComPDF (ComPDFKit) | $1,470 per platform per year (native, reseller); web on quote; Community License | Function-based; per project; unlimited devs/files | Web, iOS, Android, Windows, Mac, server, Flutter/RN | View, annotate, forms, sign, OCR | Perceived quality/maturity concerns |
| PDF.js Express (Apryse) | $595/mo; ~$6–7k/yr reported | Subscription per app/domain | Web | PDF.js-based viewer + annotation, form fill, signing | Renewal increases; limited vs WebViewer |
| Syncfusion PDF Viewer | Free (community); $599 per developer per year; $2,995 for 5 devs | Per developer; suite | Web (JS/React/Angular/Blazor), .NET, Flutter, MAUI | Viewer, annotation, forms, signatures | Suite lock-in; community eligibility caps |
| Telerik KendoReact PDF Viewer | $649–$1,199 per developer per year | Per developer; suite | Web (React/Angular/Vue/jQuery), .NET | Basic viewing | Limited annotation depth (not verified) |
| DevExpress | $2,299.99 per developer per year (Universal) | Per developer; suite | .NET, Web | Viewer included in suite | Viewer is not a specialist PDF product |
| Adobe PDF Embed API | Free | Domain-bound client ID | Web (hosted) | Adobe rendering, annotations API | Domain binding, limited customization/self-hosting |
| EmbedPDF | Free (MIT) | Open source | Web (React/Vue/Svelte) | PDFium/WASM, annotations, true redaction, search | Young project; no SLA/commercial support found |
| PDF.js / react-pdf | Free | Apache/MIT | Web | Rendering | No built-in annotation editing suite |
| SimplePDF | $99/mo | SaaS iframe | Web | Edit/fill/sign in iframe | Not a deep SDK |
| Gnostice XtremeDocumentStudio | Not found | Perpetual + 12-month support | .NET, Java, Delphi | Multi-format viewing/conversion | Niche; price unknown |
| Qoppa | n/a | Acquired by Apryse 2023; jPDFViewer discontinued | Java | — | No longer sold |

### Inferences
- No one else publicly occupies "full-featured, transparent, about $10–15k/yr flat" positioning. Challengers either go much cheaper (ComPDF, PDF.js Express, SimplePDF) or free (EmbedPDF), while incumbents stay quote-only at $24–31k medians. A transparent $12k price with no add-on creep and no multi-year lock-in directly targets the most frequent complaints about the incumbents.
- The risk is being squeezed from below by ComPDF at about $1.5k per platform and by free EmbedPDF, which already does annotations and redaction. The $12k offer must include capabilities that the cheap and free options lack, such as an Office/CAD conversion path, collaboration, signature workflows, an SLA and a compliance posture.

### Gaps
- No dated individual quotes from Reddit, HN or G2 reviewers were retrievable (HN and Reddit were blocked, and searches surfaced aggregators instead).
- The underlying deal dates and sample sizes behind the Vendr and SpendHound medians are not disclosed in the snippets.
