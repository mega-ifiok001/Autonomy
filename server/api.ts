import { prisma } from "./db";
import {
  DEFAULT_DATA,
  type Inquiry,
  type InquiryInput,
  type SiteData,
} from "../src/lib/content";

/* -------------------------------------------------------------------------- */
/*  Map the database into the SiteData shape the frontend consumes.           */
/* -------------------------------------------------------------------------- */

export async function getSite(): Promise<SiteData> {
  const [hero, contact, about, settings, services, partners, stats, steps, audiences, engagements, principles, insights, testimonials, offices] =
    await Promise.all([
      prisma.hero.findUnique({ where: { id: "main" } }),
      prisma.contact.findUnique({ where: { id: "main" } }),
      prisma.about.findUnique({ where: { id: "main" } }),
      prisma.settings.findUnique({ where: { id: "main" } }),
      prisma.service.findMany({ orderBy: { order: "asc" } }),
      prisma.partner.findMany({ orderBy: { order: "asc" } }),
      prisma.stat.findMany({ orderBy: { order: "asc" } }),
      prisma.step.findMany({ orderBy: { order: "asc" } }),
      prisma.audience.findMany({ orderBy: { order: "asc" } }),
      prisma.engagement.findMany(),
      prisma.principle.findMany({ orderBy: { order: "asc" } }),
      prisma.insight.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.office.findMany({ orderBy: { order: "asc" } }),
    ]);

  const D = DEFAULT_DATA;
  const engA = engagements.find((e) => e.key === "sprint");
  const engB = engagements.find((e) => e.key === "staged");

  return {
    hero: {
      eyebrow: hero?.eyebrow ?? D.hero.eyebrow,
      line1: hero?.line1 ?? D.hero.line1,
      line2: hero?.line2 ?? D.hero.line2,
      sub: hero?.sub ?? D.hero.sub,
      ctaPrimary: hero?.ctaPrimary ?? D.hero.ctaPrimary,
      ctaSecondary: hero?.ctaSecondary ?? D.hero.ctaSecondary,
      cities: hero?.cities ?? D.hero.cities,
      img: hero?.img ?? D.hero.img,
    },
    contacts: {
      email: contact?.email ?? D.contacts.email,
      phone: contact?.phone ?? D.contacts.phone,
      title: contact?.title ?? D.contacts.title,
      sub: contact?.sub ?? D.contacts.sub,
      button: contact?.button ?? D.contacts.button,
      offices: offices.map((o) => ({ id: o.id, city: o.city, line: o.line })),
    },
    services: services.map((s) => ({
      id: s.id,
      icon: s.icon as SiteData["services"][number]["icon"],
      title: s.title,
      copy: s.copy,
      detail: s.detail,
    })),
    partners: partners.map((p) => ({ id: p.id, name: p.name, style: p.style })),
    stats: stats.map((s) => ({
      id: s.id,
      prefix: s.prefix,
      value: s.value,
      suffix: s.suffix,
      decimals: s.decimals,
      label: s.label,
    })),
    steps: steps.map((s) => ({ id: s.id, title: s.title, copy: s.copy })),
    audience: audiences.map((a) => ({ id: a.id, title: a.title, copy: a.copy, badge: a.badge })),
    models: {
      a: { id: "m1", title: engA?.title ?? D.models.a.title, copy: engA?.copy ?? D.models.a.copy },
      b: { id: "m2", title: engB?.title ?? D.models.b.title, copy: engB?.copy ?? D.models.b.copy },
      note: settings?.modelsNote ?? D.models.note,
    },
    about: {
      eyebrow: about?.eyebrow ?? D.about.eyebrow,
      heading: about?.heading ?? D.about.heading,
      p1: about?.p1 ?? D.about.p1,
      p2: about?.p2 ?? D.about.p2,
      img: about?.img ?? D.about.img,
      statValue: about?.statValue ?? D.about.statValue,
      statText: about?.statText ?? D.about.statText,
      principles: principles.map((p) => ({ id: p.id, n: p.n, title: p.title, copy: p.copy })),
    },
    insights: insights.map((i) => ({
      id: i.id,
      title: i.title,
      category: i.category,
      date: i.date,
      read: i.read,
      img: i.img,
      excerpt: i.excerpt,
      body: i.body,
      featured: i.featured,
      highlight: i.highlight,
    })),
    testimonials: testimonials.map((t) => ({
      id: t.id,
      quote: t.quote,
      name: t.name,
      role: t.role,
      metrics: [
        { value: t.metricAValue, label: t.metricALabel },
        { value: t.metricBValue, label: t.metricBLabel },
      ],
      active: t.active,
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  Persist a full SiteData payload (the admin console sends the whole site). */
/* -------------------------------------------------------------------------- */

export async function putSite(input: SiteData): Promise<void> {
  // Enforce invariants: exactly one featured insight, at most one active testimonial.
  const featuredId = input.insights.find((i) => i.featured)?.id;
  const activeId = input.testimonials.find((t) => t.active)?.id;
  const insights = input.insights.map((i) => ({ ...i, featured: i.id === featuredId }));
  const testimonials = input.testimonials.map((t) => ({ ...t, active: t.id === activeId }));

  await prisma.$transaction(async (tx) => {
    await tx.hero.upsert({
      where: { id: "main" },
      update: { ...input.hero },
      create: { id: "main", ...input.hero },
    });

    await tx.contact.upsert({
      where: { id: "main" },
      update: {
        email: input.contacts.email,
        phone: input.contacts.phone,
        title: input.contacts.title,
        sub: input.contacts.sub,
        button: input.contacts.button,
      },
      create: {
        id: "main",
        email: input.contacts.email,
        phone: input.contacts.phone,
        title: input.contacts.title,
        sub: input.contacts.sub,
        button: input.contacts.button,
      },
    });

    await tx.about.upsert({
      where: { id: "main" },
      update: {
        eyebrow: input.about.eyebrow,
        heading: input.about.heading,
        p1: input.about.p1,
        p2: input.about.p2,
        img: input.about.img,
        statValue: input.about.statValue,
        statText: input.about.statText,
      },
      create: {
        id: "main",
        eyebrow: input.about.eyebrow,
        heading: input.about.heading,
        p1: input.about.p1,
        p2: input.about.p2,
        img: input.about.img,
        statValue: input.about.statValue,
        statText: input.about.statText,
      },
    });

    await tx.settings.upsert({
      where: { id: "main" },
      update: { modelsNote: input.models.note },
      create: { id: "main", modelsNote: input.models.note },
    });

    // ---- replaceable lists ----
    await tx.office.deleteMany({});
    await tx.office.createMany({
      data: input.contacts.offices.map((o, i) => ({ id: o.id, city: o.city, line: o.line, order: i, contactId: "main" })),
    });

    await tx.service.deleteMany({});
    await tx.service.createMany({
      data: input.services.map((s, i) => ({ id: s.id, icon: s.icon, title: s.title, copy: s.copy, detail: s.detail, order: i })),
    });

    await tx.partner.deleteMany({});
    await tx.partner.createMany({
      data: input.partners.map((p, i) => ({ id: p.id, name: p.name, style: p.style, order: i })),
    });

    await tx.stat.deleteMany({});
    await tx.stat.createMany({
      data: input.stats.map((s, i) => ({ id: s.id, prefix: s.prefix, value: s.value, suffix: s.suffix, decimals: s.decimals, label: s.label, order: i })),
    });

    await tx.step.deleteMany({});
    await tx.step.createMany({
      data: input.steps.map((s, i) => ({ id: s.id, title: s.title, copy: s.copy, order: i })),
    });

    await tx.audience.deleteMany({});
    await tx.audience.createMany({
      data: input.audience.map((a, i) => ({ id: a.id, title: a.title, copy: a.copy, badge: a.badge, order: i })),
    });

    await tx.principle.deleteMany({});
    await tx.principle.createMany({
      data: input.about.principles.map((p, i) => ({ id: p.id, n: p.n, title: p.title, copy: p.copy, order: i, aboutId: "main" })),
    });

    await tx.engagement.upsert({ where: { key: "sprint" }, update: { title: input.models.a.title, copy: input.models.a.copy }, create: { key: "sprint", title: input.models.a.title, copy: input.models.a.copy } });
    await tx.engagement.upsert({ where: { key: "staged" }, update: { title: input.models.b.title, copy: input.models.b.copy }, create: { key: "staged", title: input.models.b.title, copy: input.models.b.copy } });

    // ---- insights: preserve createdAt / updatedAt for surviving ids ----
    const existing = await tx.insight.findMany();
    await tx.insight.deleteMany({});
    await tx.insight.createMany({
      data: insights.map((i) => {
        const prev = existing.find((x) => x.id === i.id);
        return {
          id: i.id,
          title: i.title,
          category: i.category,
          date: i.date,
          read: i.read,
          img: i.img,
          excerpt: i.excerpt,
          body: i.body,
          featured: i.featured,
          highlight: i.highlight,
          published: true,
          createdAt: prev?.createdAt ?? new Date(),
          updatedAt: prev?.updatedAt ?? new Date(),
        };
      }),
    });

    // ---- testimonials: preserve timestamps too ----
    const existingT = await tx.testimonial.findMany();
    await tx.testimonial.deleteMany({});
    await tx.testimonial.createMany({
      data: testimonials.map((t) => {
        const prev = existingT.find((x) => x.id === t.id);
        return {
          id: t.id,
          quote: t.quote,
          name: t.name,
          role: t.role,
          metricAValue: t.metrics[0]?.value ?? "",
          metricALabel: t.metrics[0]?.label ?? "",
          metricBValue: t.metrics[1]?.value ?? "",
          metricBLabel: t.metrics[1]?.label ?? "",
          active: t.active,
          createdAt: prev?.createdAt ?? new Date(),
          updatedAt: prev?.updatedAt ?? new Date(),
        };
      }),
    });
  });
}

/* -------------------------------------------------------------------------- */
/*  First-run seed: create singletons + default content if the DB is empty.   */
/* -------------------------------------------------------------------------- */

export async function ensureDefaults(): Promise<void> {
  const hero = await prisma.hero.findUnique({ where: { id: "main" } });
  if (hero) return;
  await putSite(JSON.parse(JSON.stringify(DEFAULT_DATA)) as SiteData);
  console.log("[autonomy] empty database — seeded with default content");
}

/* -------------------------------------------------------------------------- */
/*  Inquiries (contact form submissions)                                      */
/* -------------------------------------------------------------------------- */

type InquiryRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  offering: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

const toInquiry = (i: InquiryRow): Inquiry => ({
  id: i.id,
  name: i.name,
  email: i.email,
  company: i.company,
  offering: i.offering,
  message: i.message,
  read: i.read,
  createdAt: i.createdAt.getTime(),
});

export async function getInquiries(): Promise<Inquiry[]> {
  const rows = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toInquiry);
}

export async function createInquiry(input: InquiryInput & { id?: string }): Promise<void> {
  await prisma.inquiry.create({
    data: {
      id: input.id || undefined,
      name: input.name,
      email: input.email,
      company: input.company,
      offering: input.offering,
      message: input.message,
    },
  });
}

export async function setInquiryRead(id: string, read: boolean): Promise<void> {
  await prisma.inquiry.update({ where: { id }, data: { read } });
}

export async function deleteInquiry(id: string): Promise<void> {
  await prisma.inquiry.delete({ where: { id } });
}
