/* Pure content module: types + default copy.
   Shared by the frontend (store.tsx) and the Node server (server/*.ts). */

export type IconKey = "reticle" | "nodes" | "flag" | "trend";

export type Service = {
  id: string;
  icon: IconKey;
  title: string;
  copy: string;
  detail: string;
};

export type Stat = {
  id: string;
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
  label: string;
};

export type Partner = { id: string; name: string; style: number };

export type Step = { id: string; title: string; copy: string };

export type Audience = { id: string; title: string; copy: string; badge: string };

export type Model = { id: string; title: string; copy: string };

export type Principle = { id: string; n: string; title: string; copy: string };

export type Insight = {
  id: string;
  title: string;
  category: string;
  date: string;
  read: string;
  img: string;
  excerpt: string;
  body: string;
  featured: boolean;
  highlight: boolean;
};

export type Metric = { value: string; label: string };

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  metrics: Metric[];
  active: boolean;
};

export type Office = { id: string; city: string; line: string };

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  offering: string;
  message: string;
  read: boolean;
  createdAt: number; // epoch ms
};

export type InquiryInput = {
  name: string;
  email: string;
  company: string;
  offering: string;
  message: string;
};

export type SiteData = {
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    cities: string;
    img: string;
  };
  contacts: {
    email: string;
    phone: string;
    title: string;
    sub: string;
    button: string;
    offices: Office[];
  };
  services: Service[];
  partners: Partner[];
  stats: Stat[];
  steps: Step[];
  audience: Audience[];
  models: { a: Model; b: Model; note: string };
  about: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
    img: string;
    statValue: string;
    statText: string;
    principles: Principle[];
  };
  insights: Insight[];
  testimonials: Testimonial[];
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const INSIGHT_CATEGORIES = [
  "Growth Playbooks",
  "Partnership Strategy",
  "Execution",
  "Market Notes",
];

export const PARTNER_STYLES = [
  { label: "Wide tracked caps", cls: "font-display font-extrabold tracking-[0.22em]" },
  { label: "Italic serif-like", cls: "font-display font-semibold italic" },
  { label: "Small wide caps", cls: "font-display font-bold tracking-[0.3em] text-[15px]" },
  { label: "Lowercase tight", cls: "font-display font-extrabold lowercase tracking-tight" },
  { label: "Bold normal", cls: "font-display font-bold" },
];

export const ICON_OPTIONS: { key: IconKey; label: string }[] = [
  { key: "reticle", label: "Reticle (acquisition)" },
  { key: "nodes", label: "Connected nodes" },
  { key: "flag", label: "Flag (execution)" },
  { key: "trend", label: "Trend line" },
];

/* ------------------------------- default copy ------------------------------ */

export const DEFAULT_DATA: SiteData = {
  hero: {
    eyebrow: "GROWTH & STRATEGIC PARTNERSHIPS",
    line1: "Autonomy: the operating",
    line2: "system of business.",
    sub: "We find your clients, build your partnerships, and turn your plans into results.",
    ctaPrimary: "Book a growth conversation",
    ctaSecondary: "See how it works",
    cities: "LAGOS, LONDON, REMOTE",
    img: "https://images.pexels.com/photos/305833/pexels-photo-305833.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1900",
  },
  contacts: {
    email: "info@autonomy.com.ng",
    phone: "+234 902 469 8673",
    title: "Book a growth conversation.",
    sub: "Tell us where you want to be in twelve months. We take on a limited number of engagements each quarter and respond within two business days.",
    button: "Book a growth conversation",
    offices: [
      { id: "o1", city: "Lagos", line: "14B Adeola Odeku Street, Victoria Island" },
      { id: "o2", city: "London", line: "14 St James's Square" },
      { id: "o3", city: "Remote", line: "Working across time zones" },
    ],
  },
  services: [
    {
      id: "s1",
      icon: "reticle",
      title: "Client Acquisition",
      copy: "We find the corporate and institutional buyers for your next cohort or product.",
      detail: "Corporate buyers · Institutions · Pipelines",
    },
    {
      id: "s2",
      icon: "nodes",
      title: "Partnerships",
      copy: "We open and manage the relationships that grow your numbers.",
      detail: "Corporate · Distributors · Referral engines",
    },
    {
      id: "s3",
      icon: "flag",
      title: "Plan to Execution",
      copy: "If you have a plan that feels hard to carry out, we run it with you until it is live.",
      detail: "Roadmaps · Delivery · Go-lives",
    },
    {
      id: "s4",
      icon: "trend",
      title: "Growth Tracking",
      copy: "Clear numbers on what is working.",
      detail: "Cohort metrics · Funnels · Reporting",
    },
  ],
  partners: [
    { id: "p1", name: "Tech Portal", style: 3 },
    { id: "p2", name: "CodeCraft Lagos", style: 0 },
    { id: "p3", name: "DataHive Academy", style: 4 },
    { id: "p4", name: "STACKED", style: 2 },
    { id: "p5", name: "Brightpath", style: 1 },
    { id: "p6", name: "KERNEL SCHOOL", style: 2 },
    { id: "p7", name: "ShipIt Labs", style: 4 },
    { id: "p8", name: "Algo & Co", style: 1 },
    { id: "p9", name: "CampusLoop", style: 0 },
    { id: "p10", name: "nigeriastack", style: 3 },
  ],
  stats: [
    { id: "t1", prefix: "", value: 4, suffix: "", decimals: 0, label: "Disciplines in one system" },
    { id: "t2", prefix: "", value: 90, suffix: "", decimals: 0, label: "Days in a Cohort Sprint" },
    { id: "t3", prefix: "", value: 2, suffix: "", decimals: 0, label: "Engagement models" },
    { id: "t4", prefix: "", value: 100, suffix: "%", decimals: 0, label: "Outcome-aligned economics" },
  ],
  steps: [
    { id: "st1", title: "Diagnose", copy: "We map your buyers, your pipeline, and the plan that isn't moving yet." },
    { id: "st2", title: "Build", copy: "We open the doors — buyers, partners, channels — and structure what gets built." },
    { id: "st3", title: "Launch", copy: "We run the go-live with you until the cohort, product or partnership is actually operating." },
    { id: "st4", title: "Scale", copy: "We watch the numbers, cut what isn't working, and double down on what is." },
  ],
  audience: [
    {
      id: "a1",
      title: "Tech training houses",
      copy: "Cohort-based schools and academies selling seats, corporate seats and outcomes — in Nigeria and beyond.",
      badge: "Where we started",
    },
    {
      id: "a2",
      title: "SMEs",
      copy: "Small and mid-sized companies that need buyers, channels, or a capability they don't have in-house.",
      badge: "",
    },
    {
      id: "a3",
      title: "Growth-stage businesses",
      copy: "Teams past their first product who need partnerships and execution velocity to compound.",
      badge: "",
    },
  ],
  models: {
    a: {
      id: "m1",
      title: "Cohort Sprint",
      copy: "A fixed-horizon sprint around one outcome — a cohort sold, a channel live, a plan executed. Sharp start, sharp end, numbers in between.",
    },
    b: {
      id: "m2",
      title: "The staged approach",
      copy: "A small first stage to prove the shape of the work. If it holds, a main stage carries it. You commit to proving, not predicting.",
    },
    note: "We earn when you earn. No fixed fee schedules published — the right price depends on the outcome, and ours moves with yours.",
  },
  about: {
    eyebrow: "ABOUT AUTONOMY",
    heading: "Built for the space between a plan and its results.",
    p1: "Autonomy exists for businesses that have the plan but not the doors. We work with tech training houses first — the teams selling cohorts, skills and outcomes in a fast-moving market — and increasingly with SMEs and growth-stage businesses that need buyers, partners and execution velocity.",
    p2: "No deck theatre, no introductions for the sake of introductions. We operate: we find clients, we open partnerships, we run plans to live — and we report the numbers honestly, including the ones that aren't there yet.",
    img: "https://images.pexels.com/photos/7964146/pexels-photo-7964146.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1300",
    statValue: "90 days",
    statText: "Typical Cohort Sprint window.",
    principles: [
      {
        id: "pr1",
        n: "01",
        title: "Earn when you earn",
        copy: "Our incentives are tied to outcomes, not activity. If your numbers don't move, neither do ours.",
      },
      {
        id: "pr2",
        n: "02",
        title: "Honest before clever",
        copy: "We say what we haven't proven yet. No borrowed case studies, no invented logos.",
      },
      {
        id: "pr3",
        n: "03",
        title: "Operators, not brokers",
        copy: "We run the plan alongside you until it's live — then we keep measuring it.",
      },
    ],
  },
  insights: [
    {
      id: "i1",
      title: "The next decade of tech training is a partnerships decade",
      category: "Market Notes",
      date: "March 2026",
      read: "7 min read",
      img: "https://images.pexels.com/photos/7640435/pexels-photo-7640435.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1100",
      excerpt:
        "Seats are getting cheap. What isn't cheap is the relationship that fills the seats — and that's where the next decade of margin is hiding.",
      body: `Seats are getting cheaper. Every month another cohort, another bootcamp, another certification lands in the same crowded middle — six weeks, a capstone project, a certificate, a discount code. When the product flattens, the distribution becomes the business. And for tech training houses in Nigeria and across Africa, the most durable distribution channel is not ads. It is the partnership.

This is a strong opinion piece. We hold it because everything we see in the rooms we sit in points the same way — and we are writing it down now, before we have our own case studies, so that the writing stands as a claim to be tested rather than a trophy.

## The buyer is changing

Five years ago the buyer of a tech cohort was mostly an individual — a student, a career switcher, a self-funder paying for a seat. Today the fastest-growing buyer is the institution: the bank that wants to retrain its operations desk, the telco that needs 200 engineers upskilled in a quarter, the government program that is measuring outcomes rather than attendance.

Institutions buy differently. They don't buy seats, they buy outcomes. They don't trust a landing page, they trust a reference from another institution. And they don't sign on a demo, they sign after a pilot that survived their procurement process. That is a relationship business, not an ads business.

## What partnerships actually do

A partnership, done properly, does three things a marketing budget cannot. First, it gives you a buyer's trust by association — an institution introduced by an institution it already works with is in a different room from one that read your brochure. Second, it gives you repetition: a channel partner sells your cohort every year without you paying for every seat. Third, it gives you data on the demand you can't see — a partner sitting inside an industry can tell you which roles are about to be hired in volume, months before the job boards move.

## The honest part

Most training houses treat partnerships as an occasional PR event: a signing ceremony, a press release, a handshake photo, and then silence. That is not a partnership, that is a poster. A real partnership has a joint number it is accountable for — a count of seats filled, a count of placements, a revenue line — and a cadence where both sides look at that number together.

We are writing this now, deliberately, because we do not yet have our own numbers to show you. When the first Tech Portal figures land, this page will link to a case note written with real numbers. Until then, take the opinion at face value or not at all — the point is that the map is being drawn in public.

## The move we'd make this year

If you run a tech training house, we would do three things in the next two quarters. Pick one institution segment and get to know its buying cycle in detail. Convert one existing client into a reference you can bring into rooms with its name. And open one partnership where the two of you share a number, not a press release.

The seats will keep commoditizing. The relationships will not. That gap is where the next decade of margin is.`,
      featured: true,
      highlight: true,
    },
    {
      id: "i2",
      title: "Selling a cohort is selling an outcome, not a seat",
      category: "Growth Playbooks",
      date: "February 2026",
      read: "5 min read",
      img: "https://images.pexels.com/photos/7693700/pexels-photo-7693700.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1100",
      excerpt:
        "Corporate buyers don't purchase 40 seats. They purchase 40 people who can do the job next quarter. Structure the conversation accordingly.",
      body: `A common failure in corporate sales for training houses: the deck leads with the seat. Duration, curriculum, instructor bios, price per head. The buyer's problem was never the curriculum. Their problem is that a team can't do the work it's supposed to do, and they are buying a fix.

## Rephrase the offer

When a bank's data lead says they need 60 people who can work in SQL and Python, the product you are selling is not a cohort. It is "sixty of your analysts, production-ready in sixteen weeks, with the evidence to show it." The cohort is the delivery mechanism. Say it as a mechanism, not as the headline.

## What to put in the first conversation

Three things, in this order: the outcome you will be measured on (placement rate, assessment pass rate, a skills delta you can show before and after), the proof you have for it (even if the proof is small — small and real beats large and borrowed), and the structure that de-risks it for the buyer (pilot size, milestone payments, a walk-away point).

Notice what's missing: the full curriculum. That comes later, when they are comparing you against the alternative.

## The pricing consequence

Pricing per seat is a retail frame. It invites the buyer to negotiate your unit cost. Pricing per outcome — per team, per placement band, per verified skill — is a business frame, and it's the frame institutions are used to. We don't pretend seat pricing is wrong for every deal. It's the frame that quietly turns a strategic purchase into a commodity comparison.

We'll publish what this looks like in our own pipelines as the sprints run. Until then, start with the rephrasing: read your next sales conversation out loud and count how many times you said "seat." Then cut the number in half.`,
      featured: false,
      highlight: true,
    },
    {
      id: "i3",
      title: "How institutions actually buy training",
      category: "Partnership Strategy",
      date: "February 2026",
      read: "6 min read",
      img: "https://images.pexels.com/photos/7433839/pexels-photo-7433839.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1100",
      excerpt:
        "The person you met is not the person who signs. A field map of the institutional buying cycle, from first call to funded pilot.",
      body: `Institutional buyers have a process, and the process is a defense. The first job in any institutional sale is to find the shape of the process before you are inside it.

## Who is actually in the room

There are usually four people, and your materials should address each one separately. The sponsor — the person who felt the gap and asked for a fix; they will fight for you internally but have no budget. The economic buyer — who controls the line; they care about cost per outcome and risk, not curriculum. Procurement — who will test your documentation, insurance, data handling and references with a diligence. And the end users — the people who will sit in the cohort; if they resent the program, nothing else matters.

Most training house decks are written for exactly one of these four. Usually the end user.

## The pilot is the real product

Institutions rarely buy the full program in one signature. They buy a pilot: twenty seats, one cohort, a defined evaluation. Write the pilot like a product — fixed scope, fixed timeline, a pre-agreed definition of success, and a written next step if it succeeds. The pilot is where you earn the relationship; the full program is where you earn the revenue.

## What slows it down

Three things stall institutional deals. Vague success criteria — "build capacity" cannot be procured. Missing documentation — standard contracts, data handling statements, references in writing. And silence between stages — institutional buyers plan in quarters; if you disappear for six weeks, the slot gets filled by someone who didn't.

Cadence is a feature. A monthly one-page status to the economic buyer, even when nothing has changed, is the cheapest trust you will ever buy.`,
      featured: false,
      highlight: true,
    },
    {
      id: "i4",
      title: "Plans die in week three. A field guide to running them anyway.",
      category: "Execution",
      date: "January 2026",
      read: "5 min read",
      img: "https://images.pexels.com/photos/7433869/pexels-photo-7433869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1100",
      excerpt:
        "The plan was right. The operating system around it was empty. What we run to keep a plan alive past the honeymoon.",
      body: `Most business plans don't fail because the thinking is wrong. They fail because the thinking was never attached to an operating rhythm. The plan is a noun. Execution is a verb with a calendar.

## The week-three cliff

Week one runs on decisions and energy. Week three runs on follow-through, and follow-through dies in exactly three places: nobody owns the next action, the review meeting became a status report instead of a decision meeting, and the uncomfortable data got scheduled "for next month."

## The cadence we run

One page, one hour, once a week. The page has four lines: the number we said we'd move last week and what it actually did; the single decision that was made; the single decision that was dodged; the one action for the next week with one name on it. If a line can't be filled, that's the finding.

A plan that doesn't produce a number to move is not a plan, it's a mood.

## Kill criteria are a feature

The healthiest plans we run are the ones with written kill criteria — the line where this initiative stops and resources move elsewhere. Teams treat kill criteria as defeat. In practice, teams with kill criteria move faster on everything else, because they know the downside is bounded.

Plans die in week three when they are run like they will be rescued. Run them like they have to survive on their own schedule, and most of them get the rest of their lives.`,
      featured: false,
      highlight: false,
    },
    {
      id: "i5",
      title: "What the data actually says about Nigeria's tech training market",
      category: "Market Notes",
      date: "December 2025",
      read: "8 min read",
      img: "https://images.pexels.com/photos/7433874/pexels-photo-7433874.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1100",
      excerpt:
        "Every deck in this market quotes the same four numbers. Here's what's defensible, what's marketing, and what we genuinely don't know yet.",
      body: `Every pitch deck in the Nigerian tech training space quotes the same numbers: the graduate count, the youth unemployment rate, the number of training providers, the salary of a fresh developer. None of these four numbers answers the question that determines whether a training business survives, which is: who is paying, and how much are they paying?

So let's be precise about what the data can and can't support.

## What's defensible

Demand for digital skills in the Nigerian economy is real and structural — it shows up in hiring postings, in the expansion of fintech and telco back offices, and in government programs that have moved from rhetoric to funded cohorts. The supply of entry-level graduates, by every available count, has outgrown the entry-level jobs. That gap is not a marketing problem. It's the single most important fact in the market.

## What's mostly marketing

The provider counts ("200+ bootcamps in Lagos") are unverifiable and therefore meaningless. The "salary outcomes" in course pages are self-reported by the course that stands to gain. And the "global demand" charts are usually global data with no Nigeria in them. None of this is said to be cynical — it's said to set a bar for what deserves to be cited in a serious plan.

## What we genuinely don't know

The size of the institutional budget for workforce upskilling in Nigeria. Nobody publishes it. We have a working hypothesis — that it is large enough for the next decade of growth and small enough that the players who understand procurement will win — but a hypothesis is not a case study, and we will label it as such until we can put real pipeline data next to it.

## Why this note exists

We wrote it because the space is short of writing that distinguishes the three tiers: defensible, marketing, and unknown. If a training house runs its plan on tier-two numbers, it doesn't need better marketing, it needs a correction. If it runs on tier one and admits its tier three, it can be planned around.

We'll update this note as our own cohort data comes in. A market note written with the market's data is useful. One written with your data is worth acting on.`,
      featured: false,
      highlight: false,
    },
    {
      id: "i6",
      title: "Client acquisition before your product is ready",
      category: "Growth Playbooks",
      date: "November 2025",
      read: "4 min read",
      img: "https://images.pexels.com/photos/10375908/pexels-photo-10375908.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1100",
      excerpt:
        "The first cohort is the riskiest one. Here's how to de-risk it by selling it before it exists — without ever over-promising.",
      body: `The first cohort of any new program is the riskiest one you will ever run: full cost, zero proof, maximum pressure. The teams that survive it are rarely the ones with the best curriculum. They're the ones that started selling before the product was ready — carefully.

## What "selling before ready" actually means

It doesn't mean open enrolment. It means a buyer map: the ten to twenty institutions most likely to buy the outcome you're building, named and researched before launch. For each one, one paragraph: who the sponsor is, what the gap is, what would make them run a pilot. That document is the product's first asset, and it should exist before the syllabus is final.

## The pilot conversation

With the map done, the first conversations are not sales calls, they're design consultations: "We're building X for buyers like you — would you be the first to run it as a pilot at a defined scope and price?" Some will say no. That's data, not rejection. The ones that say yes are signing up for outcomes, and the conversation teaches you exactly what to build.

## The line you don't cross

There is a difference between pre-selling and over-promising, and it lives in one place: the definition of success. Pre-sell the outcome you are confident the pilot can be measured against, and put the measurement in writing. If you can't define what success looks like, you're not pre-selling, you're hoping.

The first cohort is not your product. It's your evidence. Run it as evidence, and the second cohort sells itself.`,
      featured: false,
      highlight: false,
    },
  ],
  testimonials: [
    {
      id: "q1",
      quote:
        "We won't print a result we haven't shipped. When the first Tech Portal numbers land, this space becomes the case note, written with real numbers, for real decisions.",
      name: "The Autonomy Team",
      role: "Founding note · replaced by our first client result",
      metrics: [
        { value: "100%", label: "outcome-aligned economics" },
        { value: "0", label: "invented results" },
      ],
      active: true,
    },
  ],
};
