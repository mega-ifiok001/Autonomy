import { type ReactNode, useMemo, useState } from "react";
import {
  type Audience,
  type Insight,
  type Service,
  type SiteData,
  type Stat,
  type Step,
  type Testimonial,
  ICON_OPTIONS,
  INSIGHT_CATEGORIES,
  PARTNER_STYLES,
  uid,
} from "../../lib/store";
import {
  AddButton,
  Area,
  Card,
  Check,
  Field,
  Num,
  SaveBar,
  Sel,
  clone,
} from "./widgets";

export type TabProps = { data: SiteData; onSave: (next: SiteData) => void };

function TabShell({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[22px] font-extrabold text-ink">{title}</h2>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">{desc}</p>
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------- hero ---------------------------------- */

export function TabHero({ data, onSave }: TabProps) {
  const [d, setD] = useState(() => clone(data.hero));
  const dirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(data.hero), [d, data.hero]);
  return (
    <TabShell title="Hero" desc="The opening statement on the landing page. Line one and line two form the two headline lines.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow" value={d.eyebrow} onChange={(v) => setD({ ...d, eyebrow: v })} />
        <Field label="Cities (comma separated)" value={d.cities} onChange={(v) => setD({ ...d, cities: v })} />
        <Field label="Headline — line one" value={d.line1} onChange={(v) => setD({ ...d, line1: v })} />
        <Field label="Headline — line two" value={d.line2} onChange={(v) => setD({ ...d, line2: v })} />
      </div>
      <Area label="Subline" rows={2} value={d.sub} onChange={(v) => setD({ ...d, sub: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary button" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
        <Field label="Secondary button" value={d.ctaSecondary} onChange={(v) => setD({ ...d, ctaSecondary: v })} />
      </div>
      <Field label="Hero image URL" value={d.img} onChange={(v) => setD({ ...d, img: v })} />
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, hero: d })} />
    </TabShell>
  );
}

/* -------------------------------- contacts --------------------------------- */

export function TabContacts({ data, onSave }: TabProps) {
  const [d, setD] = useState(() => clone(data.contacts));
  const dirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(data.contacts), [d, data.contacts]);
  return (
    <TabShell title="Contacts" desc="Everything in the contact section: details, offices and the call-to-action copy.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" value={d.email} onChange={(v) => setD({ ...d, email: v })} />
        <Field label="Phone" value={d.phone} onChange={(v) => setD({ ...d, phone: v })} />
        <Field label="Panel heading" value={d.title} onChange={(v) => setD({ ...d, title: v })} />
        <Field label="Button label" value={d.button} onChange={(v) => setD({ ...d, button: v })} />
      </div>
      <Area label="Panel intro" rows={3} value={d.sub} onChange={(v) => setD({ ...d, sub: v })} />
      <div className="space-y-4">
        {d.offices.map((o) => (
          <Card key={o.id} onRemove={() => setD({ ...d, offices: d.offices.filter((x) => x.id !== o.id) })}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" value={o.city} onChange={(v) => setD({ ...d, offices: d.offices.map((x) => (x.id === o.id ? { ...x, city: v } : x)) })} />
              <Field label="Address / line" value={o.line} onChange={(v) => setD({ ...d, offices: d.offices.map((x) => (x.id === o.id ? { ...x, line: v } : x)) })} />
            </div>
          </Card>
        ))}
        <AddButton label="Add office" onClick={() => setD({ ...d, offices: [...d.offices, { id: uid(), city: "New city", line: "Address line" }] })} />
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, contacts: d })} />
    </TabShell>
  );
}

/* --------------------------------- services -------------------------------- */

export function TabServices({ data, onSave }: TabProps) {
  const [d, setD] = useState<Service[]>(() => clone(data.services));
  const dirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(data.services), [d, data.services]);
  const set = (id: string, patch: Partial<Service>) =>
    setD(d.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  return (
    <TabShell title="Core Services" desc="The four disciplines. Four services render in a row on desktop; more wrap into two columns.">
      <div className="space-y-4">
        {d.map((s) => (
          <Card key={s.id} title={s.title || "Untitled service"} onRemove={() => setD(d.filter((x) => x.id !== s.id))}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" value={s.title} onChange={(v) => set(s.id, { title: v })} />
              <Sel
                label="Icon"
                value={s.icon}
                onChange={(v) => set(s.id, { icon: v as Service["icon"] })}
                options={ICON_OPTIONS.map((o) => ({ value: o.key, label: o.label }))}
              />
            </div>
            <div className="mt-4">
              <Area label="Description" rows={2} value={s.copy} onChange={(v) => set(s.id, { copy: v })} />
            </div>
            <div className="mt-4">
              <Field label="Detail line (shown on hover)" value={s.detail} onChange={(v) => set(s.id, { detail: v })} />
            </div>
          </Card>
        ))}
        <AddButton label="Add service" onClick={() => setD([...d, { id: uid(), icon: "nodes", title: "New service", copy: "What we do and why it matters.", detail: "" }])} />
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, services: d })} />
    </TabShell>
  );
}

/* ------------------------------ partners & numbers -------------------------- */

export function TabPartners({ data, onSave }: TabProps) {
  const [d, setD] = useState(() => clone({ partners: data.partners, stats: data.stats }));
  const dirty = useMemo(
    () =>
      JSON.stringify(d.partners) !== JSON.stringify(data.partners) ||
      JSON.stringify(d.stats) !== JSON.stringify(data.stats),
    [d, data.partners, data.stats]
  );
  return (
    <TabShell title="Partners & Numbers" desc="The “In partnership with” marquee and the count-up stats band.">
      <p className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">In partnership with</p>
      <div className="space-y-3">
        {d.partners.map((p) => (
          <div key={p.id} className="flex flex-wrap items-end gap-3 rounded-xl border border-cloud bg-white p-4">
            <div className="min-w-[200px] flex-1">
              <Field
                label="Name"
                value={p.name}
                onChange={(v) => setD({ ...d, partners: d.partners.map((x) => (x.id === p.id ? { ...x, name: v } : x)) })}
              />
            </div>
            <div className="min-w-[190px] flex-1">
              <Sel
                label="Wordmark style"
                value={String(p.style)}
                onChange={(v) => setD({ ...d, partners: d.partners.map((x) => (x.id === p.id ? { ...x, style: Number(v) } : x)) })}
                options={PARTNER_STYLES.map((s, i) => ({ value: String(i), label: s.label }))}
              />
            </div>
            <button type="button" onClick={() => setD({ ...d, partners: d.partners.filter((x) => x.id !== p.id) })} className="pb-1 text-[12px] font-bold text-slate-400 hover:text-red-500">
              Remove
            </button>
          </div>
        ))}
        <AddButton label="Add partner" onClick={() => setD({ ...d, partners: [...d.partners, { id: uid(), name: "New Partner", style: 0 }] })} />
      </div>

      <p className="pt-4 text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">Numbers (stats band)</p>
      <div className="space-y-3">
        {d.stats.map((s: Stat) => (
          <div key={s.id} className="flex flex-wrap items-end gap-3 rounded-xl border border-cloud bg-white p-4">
            <div className="w-20">
              <Field label="Prefix" value={s.prefix} onChange={(v) => setD({ ...d, stats: d.stats.map((x) => (x.id === s.id ? { ...x, prefix: v } : x)) })} />
            </div>
            <div className="w-24">
              <Num label="Value" step={0.1} value={s.value} onChange={(v) => setD({ ...d, stats: d.stats.map((x) => (x.id === s.id ? { ...x, value: v } : x)) })} />
            </div>
            <div className="w-24">
              <Field label="Suffix" value={s.suffix} onChange={(v) => setD({ ...d, stats: d.stats.map((x) => (x.id === s.id ? { ...x, suffix: v } : x)) })} />
            </div>
            <div className="w-24">
              <Sel label="Decimals" value={String(s.decimals)} onChange={(v) => setD({ ...d, stats: d.stats.map((x) => (x.id === s.id ? { ...x, decimals: Number(v) } : x)) })} options={[{ value: "0", label: "0" }, { value: "1", label: "1" }]} />
            </div>
            <div className="min-w-[180px] flex-1">
              <Field label="Label" value={s.label} onChange={(v) => setD({ ...d, stats: d.stats.map((x) => (x.id === s.id ? { ...x, label: v } : x)) })} />
            </div>
            <button type="button" onClick={() => setD({ ...d, stats: d.stats.filter((x) => x.id !== s.id) })} className="pb-1 text-[12px] font-bold text-slate-400 hover:text-red-500">
              Remove
            </button>
          </div>
        ))}
        <AddButton label="Add number" onClick={() => setD({ ...d, stats: [...d.stats, { id: uid(), prefix: "", value: 0, suffix: "", decimals: 0, label: "New stat" }] })} />
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, partners: d.partners, stats: d.stats })} />
    </TabShell>
  );
}

/* ---------------------------------- about ---------------------------------- */

export function TabAbout({ data, onSave }: TabProps) {
  const [d, setD] = useState(() => clone(data.about));
  const dirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(data.about), [d, data.about]);
  return (
    <TabShell title="About" desc="The about section: heading, story, image, floating stat and the principles list.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow" value={d.eyebrow} onChange={(v) => setD({ ...d, eyebrow: v })} />
        <Field label="Image URL" value={d.img} onChange={(v) => setD({ ...d, img: v })} />
      </div>
      <Field label="Heading" value={d.heading} onChange={(v) => setD({ ...d, heading: v })} />
      <Area label="Paragraph one" rows={3} value={d.p1} onChange={(v) => setD({ ...d, p1: v })} />
      <Area label="Paragraph two" rows={3} value={d.p2} onChange={(v) => setD({ ...d, p2: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Floating stat value" value={d.statValue} onChange={(v) => setD({ ...d, statValue: v })} />
        <Field label="Floating stat text" value={d.statText} onChange={(v) => setD({ ...d, statText: v })} />
      </div>
      <div className="space-y-4">
        {d.principles.map((p) => (
          <Card key={p.id} title={p.title || "Principle"} onRemove={() => setD({ ...d, principles: d.principles.filter((x) => x.id !== p.id) })}>
            <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
              <Field label="Number" value={p.n} onChange={(v) => setD({ ...d, principles: d.principles.map((x) => (x.id === p.id ? { ...x, n: v } : x)) })} />
              <Field label="Title" value={p.title} onChange={(v) => setD({ ...d, principles: d.principles.map((x) => (x.id === p.id ? { ...x, title: v } : x)) })} />
            </div>
            <div className="mt-4">
              <Area label="Copy" rows={2} value={p.copy} onChange={(v) => setD({ ...d, principles: d.principles.map((x) => (x.id === p.id ? { ...x, copy: v } : x)) })} />
            </div>
          </Card>
        ))}
        <AddButton label="Add principle" onClick={() => setD({ ...d, principles: [...d.principles, { id: uid(), n: String(d.principles.length + 1).padStart(2, "0"), title: "New principle", copy: "Why it matters." }] })} />
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, about: d })} />
    </TabShell>
  );
}

/* --------------------------------- process --------------------------------- */

export function TabProcess({ data, onSave }: TabProps) {
  const [d, setD] = useState<Step[]>(() => clone(data.steps));
  const dirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(data.steps), [d, data.steps]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= d.length) return;
    const next = [...d];
    [next[i], next[j]] = [next[j], next[i]];
    setD(next);
  };
  return (
    <TabShell title="How It Works" desc="The steps in the “How it works” section — one sentence each. Step numbers are automatic.">
      <div className="space-y-4">
        {d.map((s, i) => (
          <Card
            key={s.id}
            title={`Step ${String(i + 1).padStart(2, "0")} — ${s.title || "Untitled"}`}
            onRemove={() => setD(d.filter((x) => x.id !== s.id))}
          >
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Field label="Title" value={s.title} onChange={(v) => setD(d.map((x) => (x.id === s.id ? { ...x, title: v } : x)))} />
              </div>
              <button type="button" onClick={() => move(i, -1)} className="mb-0.5 rounded-lg border border-cloud px-3 py-2.5 text-[13px] font-bold text-slate-400 hover:text-brand-600" aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} className="mb-0.5 rounded-lg border border-cloud px-3 py-2.5 text-[13px] font-bold text-slate-400 hover:text-brand-600" aria-label="Move down">↓</button>
            </div>
            <div className="mt-4">
              <Area label="One sentence" rows={2} value={s.copy} onChange={(v) => setD(d.map((x) => (x.id === s.id ? { ...x, copy: v } : x)))} />
            </div>
          </Card>
        ))}
        <AddButton label="Add step" onClick={() => setD([...d, { id: uid(), title: "New step", copy: "One sentence describing the step." }])} />
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, steps: d })} />
    </TabShell>
  );
}

/* ------------------------------- audience & models -------------------------- */

export function TabAudience({ data, onSave }: TabProps) {
  const [aud, setAud] = useState<Audience[]>(() => clone(data.audience));
  const [mod, setMod] = useState(() => clone(data.models));
  const dirty = useMemo(
    () => JSON.stringify(aud) !== JSON.stringify(data.audience) || JSON.stringify(mod) !== JSON.stringify(data.models),
    [aud, mod, data.audience, data.models]
  );
  return (
    <TabShell title="Audience & Models" desc="“Who we serve” cards and the two engagement models, including the outcome-aligned economics note.">
      <p className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">Who we serve</p>
      <div className="space-y-4">
        {aud.map((a, i) => (
          <Card key={a.id} title={a.title || "Audience"} accent={i === 0} onRemove={() => setAud(aud.filter((x) => x.id !== a.id))}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" value={a.title} onChange={(v) => setAud(aud.map((x) => (x.id === a.id ? { ...x, title: v } : x)))} />
              <Field label="Badge (optional)" value={a.badge} onChange={(v) => setAud(aud.map((x) => (x.id === a.id ? { ...x, badge: v } : x)))} />
            </div>
            <div className="mt-4">
              <Area label="Copy" rows={2} value={a.copy} onChange={(v) => setAud(aud.map((x) => (x.id === a.id ? { ...x, copy: v } : x)))} />
            </div>
            {i === 0 && <p className="mt-3 text-[12px] text-slate-400">The first card is highlighted on the site.</p>}
          </Card>
        ))}
        <AddButton label="Add audience" onClick={() => setAud([...aud, { id: uid(), title: "New audience", copy: "Who they are and what they need.", badge: "" }])} />
      </div>

      <p className="pt-4 text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">Engagement models</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {[mod.a, mod.b].map((m) => (
          <Card key={m.id} title={m.title || "Model"}>
            <Field label="Title" value={m.title} onChange={(v) => setMod(mod.a.id === m.id ? { ...mod, a: { ...mod.a, title: v } } : { ...mod, b: { ...mod.b, title: v } })} />
            <div className="mt-4">
              <Area label="Copy" rows={3} value={m.copy} onChange={(v) => setMod(mod.a.id === m.id ? { ...mod, a: { ...mod.a, copy: v } } : { ...mod, b: { ...mod.b, copy: v } })} />
            </div>
          </Card>
        ))}
      </div>
      <Area label="Economics note" rows={2} value={mod.note} onChange={(v) => setMod({ ...mod, note: v })} />
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, audience: aud, models: mod })} />
    </TabShell>
  );
}

/* --------------------------------- insights -------------------------------- */

export function TabInsights({ data, onSave }: TabProps) {
  const [d, setD] = useState<Insight[]>(() => clone(data.insights));
  const dirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(data.insights), [d, data.insights]);
  const set = (id: string, patch: Partial<Insight>) =>
    setD(d.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  return (
    <TabShell
      title="Insights"
      desc="Write and manage the insights library. “Featured” is the big piece at the top of the insights page (one at a time). “Highlight” picks what shows on the landing page — choose up to three."
    >
      {d.filter((i) => i.highlight).length > 3 && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700">
          More than three insights are highlighted — only the first three appear on the landing page.
        </p>
      )}
      <div className="space-y-5">
        {d.map((ins) => (
          <Card
            key={ins.id}
            accent={ins.featured}
            title={
              <span className="flex flex-wrap items-center gap-2">
                {ins.title || "Untitled insight"}
                {ins.featured && (
                  <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-[10px] font-bold text-white">FEATURED</span>
                )}
                {ins.highlight && (
                  <span className="rounded-full bg-mist px-2.5 py-0.5 text-[10px] font-bold text-slate-500">LANDING PAGE</span>
                )}
              </span>
            }
            onRemove={() => setD(d.filter((x) => x.id !== ins.id))}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Title" value={ins.title} onChange={(v) => set(ins.id, { title: v })} />
              </div>
              <Sel label="Category" value={ins.category} onChange={(v) => set(ins.id, { category: v })} options={INSIGHT_CATEGORIES.map((c) => ({ value: c, label: c }))} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date" value={ins.date} onChange={(v) => set(ins.id, { date: v })} />
                <Field label="Read time" value={ins.read} onChange={(v) => set(ins.id, { read: v })} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Image URL" value={ins.img} onChange={(v) => set(ins.id, { img: v })} />
              </div>
            </div>
            <div className="mt-4">
              <Area label="Excerpt (shown on cards)" rows={2} value={ins.excerpt} onChange={(v) => set(ins.id, { excerpt: v })} />
            </div>
            <div className="mt-4">
              <Area
                label="Full article body (blank line = new paragraph, start a line with ## for a subheading)"
                rows={12}
                mono
                value={ins.body}
                onChange={(v) => set(ins.id, { body: v })}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Check
                label="Featured on insights page"
                hint="The big piece at the top — only one at a time"
                checked={ins.featured}
                onChange={(v) => {
                  if (v) setD(d.map((x) => ({ ...x, featured: x.id === ins.id })));
                  else set(ins.id, { featured: false });
                }}
              />
              <Check
                label="Highlight on landing page"
                hint="Shown in “From the desk” (up to three)"
                checked={ins.highlight}
                onChange={(v) => set(ins.id, { highlight: v })}
              />
            </div>
          </Card>
        ))}
        <AddButton
          label="New insight"
          onClick={() =>
            setD([
              ...d,
              {
                id: uid(),
                title: "Untitled insight",
                category: INSIGHT_CATEGORIES[0],
                date: "Today",
                read: "5 min read",
                img: "https://images.pexels.com/photos/7640435/pexels-photo-7640435.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1100",
                excerpt: "A short, honest summary of the piece.",
                body: "Start writing here.\n\n## A subheading\n\nWrite the piece in public, before the case studies.",
                featured: false,
                highlight: false,
              },
            ])
          }
        />
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, insights: d })} />
    </TabShell>
  );
}

/* ------------------------------- testimonials ------------------------------- */

export function TabTestimonials({ data, onSave }: TabProps) {
  const [d, setD] = useState<Testimonial[]>(() => clone(data.testimonials));
  const dirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(data.testimonials), [d, data.testimonials]);
  const set = (id: string, patch: Partial<Testimonial>) =>
    setD(d.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <TabShell title="Testimonials" desc="The quote band on the landing page. Mark one as active to show it. When the first real results land, add the client quote there.">
      <div className="space-y-5">
        {d.map((t) => (
          <Card key={t.id} accent={t.active} title={t.name || "Untitled"} onRemove={() => setD(d.filter((x) => x.id !== t.id))}>
            <Area label="Quote" rows={4} value={t.quote} onChange={(v) => set(t.id, { quote: v })} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={t.name} onChange={(v) => set(t.id, { name: v })} />
              <Field label="Role / line" value={t.role} onChange={(v) => set(t.id, { role: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Metric A value" value={t.metrics[0]?.value ?? ""} onChange={(v) => set(t.id, { metrics: [{ value: v, label: t.metrics[0]?.label ?? "" }, t.metrics[1] ?? { value: "", label: "" }] })} />
                <Field label="Metric A label" value={t.metrics[0]?.label ?? ""} onChange={(v) => set(t.id, { metrics: [{ value: t.metrics[0]?.value ?? "", label: v }, t.metrics[1] ?? { value: "", label: "" }] })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Metric B value" value={t.metrics[1]?.value ?? ""} onChange={(v) => set(t.id, { metrics: [t.metrics[0] ?? { value: "", label: "" }, { value: v, label: t.metrics[1]?.label ?? "" }] })} />
                <Field label="Metric B label" value={t.metrics[1]?.label ?? ""} onChange={(v) => set(t.id, { metrics: [t.metrics[0] ?? { value: "", label: "" }, { value: t.metrics[1]?.value ?? "", label: v }] })} />
              </div>
            </div>
            <div className="mt-4">
              <Check
                label="Active on the landing page"
                hint="Only one testimonial shows at a time"
                checked={t.active}
                onChange={(v) => {
                  if (v) setD(d.map((x) => ({ ...x, active: x.id === t.id })));
                  else set(t.id, { active: false });
                }}
              />
            </div>
          </Card>
        ))}
        <AddButton
          label="Add testimonial"
          onClick={() =>
            setD([
              ...d,
              { id: uid(), quote: "The client's words, in their own voice.", name: "Name", role: "Title, Company", metrics: [{ value: "", label: "" }, { value: "", label: "" }], active: d.length === 0 },
            ])
          }
        />
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave({ ...data, testimonials: d })} />
    </TabShell>
  );
}
