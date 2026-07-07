// Words cycled under the logo ("Trendplates is ___"). Edit freely.
export const DESCRIPTORS = [
  "Culture",
  "Discovery",
  "Momentum",
  "Community",
  "Movement",
  "Signal",
  "Reach",
  "Energy",
  "Organic",
  "Attention",
  "Growth",
  "Creative",
];

// Our proprietary systems (not "services"). `system` is the Trendplates name,
// `tag` is the plain-English kicker so people still know what it is.
export const SERVICES = [
  {
    system: "Movement Engine",
    tag: "Fan pages · Influencer seeding · Clippers",
    desc: "The network that puts your music in front of the right communities and lets the scene do the sharing. Not posting — engineering the conditions for a record to spread.",
  },
  {
    system: "Catalogue Reactivation",
    tag: "Archive · Repurposing · Rediscovery",
    desc: "We mine deep catalogues and archive content, then recut it for today's feeds — turning back catalogue into fresh discovery, new fans and new income.",
  },
  {
    system: "Participation Systems",
    tag: "Filters · Templates · Sounds",
    desc: "TikTok and Snapchat activations, AR filters, CapCut templates and sounds built to be copied — handing fans a way to take part and carry your record for you.",
  },
  {
    system: "Digital Artefacts",
    tag: "Sites · Release drops · Apps",
    desc: "Web experiences, drops and apps for artists and labels, designed with the craft and edge electronic audiences actually expect.",
  },
  {
    system: "Signal Systems",
    tag: "AI workflows · Velocity",
    desc: "Quietly powerful AI workflows that help your team create, repurpose and move at the speed the feed demands — without ever feeling like a robot made it.",
  },
  {
    system: "Live Amplification",
    tag: "Festivals · Tours · Moments",
    desc: "Your live strategy becomes the catalyst for your short-form social. We make every set and every show the one people wish they hadn't missed.",
  },
];

// Headline metrics. Big typography, count-up on scroll.
// ⚠️ Only the first number is confirmed real. REPLACE the others with your
// actual figures before this goes live — placeholders are marked below.
export const METRICS = [
  { to: 70000, suffix: "+", label: "fan-created posts on a single sound" }, // real
  { to: 40, suffix: "M+", label: "organic views generated", placeholder: true },
  { to: 500, suffix: "+", label: "creators activated", placeholder: true },
  { to: 60, suffix: "+", label: "labels & artists worked with", placeholder: true },
];

// Featured case study — curiosity, not the full method.
export const CASE_STUDY = {
  kicker: "Field Report — 001",
  question:
    "How did one campaign generate over 70,000 fan-created posts on a single sound?",
  body: "No ad spend. No paid placements. Just the right creators, the right communities and a format built to be copied. The rest, we'll tell you in person.",
  cta: "Get in touch to find out",
};

// Manifesto contrasts. Left wins.
export const PHILOSOPHY = {
  statement:
    "Records don't break because of ad spend. They break through communities, creators, fan pages, culture and momentum.",
  contrasts: [
    { a: "Fans", b: "Ads" },
    { a: "Communities", b: "Reach" },
    { a: "Culture", b: "Algorithms" },
    { a: "Momentum", b: "Campaigns" },
  ],
};

// Artist / client quotes. Leave empty and the section won't render.
// Add real ones only — e.g. { quote: "…", name: "…", role: "Label / Artist" }.
export const TESTIMONIALS = [];

// Who we work with. Rendered in the "Who We Work With" section.
export const AUDIENCES = [
  {
    title: "Labels",
    desc: "From independents to majors, we grow release campaigns and rosters through organic reach instead of ad budgets.",
  },
  {
    title: "Artists",
    desc: "We build the fan communities and content engines that turn listeners into a movement around your music.",
  },
  {
    title: "Management",
    desc: "A specialist organic-growth partner that plugs into your team and runs the social and discovery side end to end.",
  },
  {
    title: "Festivals",
    desc: "Year-round culture and momentum, not just an on-sale spike, keeping your brand and lineup in the conversation.",
  },
  {
    title: "Catalogue Owners",
    desc: "We turn dormant catalogues into living, discoverable assets through smart repurposing and fan-led reach.",
  },
];

// Floating wordmarks around the edges of the hero.
// TODO: replace with your real client / artist / label names (or swap the
// FloatingLogos component to render <img> logos instead of text).
export const CLIENTS = [
  "ARTIST",
  "LABEL",
  "STUDIO",
  "RECORDS",
  "MGMT",
  "COLLECTIVE",
  "PRESS",
  "RADIO",
  "FESTIVAL",
  "PUBLISHING",
  "DISTRO",
  "PRODUCER",
];
