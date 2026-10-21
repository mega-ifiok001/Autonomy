import { ScrambleText } from "../lib/motion";
import { useSite } from "../lib/store";
import { ArrowRight } from "./Icons";

function Words({ words, startDelay }: { words: string[]; startDelay: number }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="word-mask">
            <span
              className="word-rise"
              style={{ animationDelay: `${startDelay + i * 110}ms` }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const { data } = useSite();
  const { hero } = data;
  const line1 = hero.line1.split(" ").filter(Boolean);
  const line2 = hero.line2.split(" ").filter(Boolean);
  const cities = hero.cities.split(",").map((c) => c.trim()).filter(Boolean);

  return (
    <section id="top" className="relative overflow-hidden bg-navy-950 text-white">
      {/* layered backdrop */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_82%_18%,#16386f_0%,#0a1c3f_46%,#050d1e_100%)]" />
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
          <img
            src={hero.img}
            alt="Modern glass skyscraper rising against a blue sky"
            className="kenburns h-full w-full object-cover object-[68%_center]"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 20%, black 55%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 20%, black 55%)",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/60 to-navy-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-950/70 to-transparent" />
        <div className="noise-layer" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-28 pt-40 sm:px-8">
        <p className="hero-fade text-[11px] font-bold tracking-[0.34em] text-brand-300 sm:text-xs">
          <ScrambleText text={hero.eyebrow} delay={200} />
        </p>

        <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[72px]">
          <span className="block">
            <Words words={line1} startDelay={250} />
          </span>
          <span className="block">
            <Words words={line2} startDelay={250 + line1.length * 110 + 120} />
          </span>
        </h1>

        <p
          className="hero-fade mt-7 max-w-xl text-base leading-relaxed text-brand-100/85 sm:text-lg"
          style={{ animationDelay: "1150ms" }}
        >
          {hero.sub}
        </p>

        <div
          className="hero-fade mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "1300ms" }}
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand-500 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_18px_40px_-14px_rgba(47,102,242,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_24px_48px_-14px_rgba(47,102,242,0.95)]"
          >
            {hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center rounded-full border border-white/30 px-8 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10"
          >
            {hero.ctaSecondary}
          </a>
        </div>

        <div
          className="hero-fade mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-medium tracking-[0.18em] text-brand-200/60"
          style={{ animationDelay: "1480ms" }}
        >
          <span className="h-px w-10 bg-brand-300/40" />
          {cities.map((c, i) => (
            <span key={c} className="flex items-center gap-6">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-brand-300/50" />}
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="hero-fade absolute bottom-8 right-8 hidden flex-col items-center gap-3 lg:flex"
        style={{ animationDelay: "1700ms" }}
      >
        <span className="text-[10px] font-semibold tracking-[0.3em] text-brand-200/50 [writing-mode:vertical-lr]">
          SCROLL
        </span>
        <span className="block h-14 w-px overflow-hidden bg-white/15">
          <span className="cue-line block h-full w-full bg-brand-400" />
        </span>
      </div>
    </section>
  );
}
