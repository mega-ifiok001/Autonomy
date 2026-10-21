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
  const cities = hero.cities
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-navy-950 text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
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

        {/* Stronger overlay on mobile to improve readability */}
        <div className="absolute inset-0 bg-navy-950/65 sm:bg-gradient-to-r sm:from-navy-950 sm:via-navy-950/75 sm:to-navy-950/20 lg:via-navy-950/60 lg:to-navy-950/10" />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950/90 to-transparent" />

        <div className="noise-layer" />
      </div>

      {/* Responsive content */}
      <div className="relative mx-auto flex min-h-[auto] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:min-h-[85vh] sm:px-8 sm:pb-24 sm:pt-36 lg:min-h-[92vh] lg:pt-40">
        <p className="hero-fade max-w-full text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-brand-300 [overflow-wrap:anywhere] sm:text-xs sm:tracking-[0.34em]">
          <ScrambleText text={hero.eyebrow} delay={200} />
        </p>

        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.25rem,9vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.035em] sm:mt-6 sm:text-6xl sm:leading-[1.02] lg:text-[72px]">
          <span className="block">
            <Words words={line1} startDelay={250} />
          </span>
          <span className="mt-1 block sm:mt-0">
            <Words
              words={line2}
              startDelay={250 + line1.length * 110 + 120}
            />
          </span>
        </h1>

        <p
          className="hero-fade mt-5 max-w-xl text-sm leading-7 text-white/85 sm:mt-7 sm:text-lg sm:leading-relaxed sm:text-brand-100/85"
          style={{ animationDelay: "1150ms" }}
        >
          {hero.sub}
        </p>

        {/* Full-width buttons on mobile */}
        <div
          className="hero-fade mt-7 flex w-full flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center sm:mt-10 sm:gap-4"
          style={{ animationDelay: "1300ms" }}
        >
          <a
            href="#contact"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-brand-500 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-[0_18px_40px_-14px_rgba(47,102,242,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_24px_48px_-14px_rgba(47,102,242,0.95)] min-[420px]:w-auto sm:px-8 sm:py-4 sm:text-[15px]"
          >
            {hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href="#how"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/30 px-5 py-3.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 min-[420px]:w-auto sm:px-8 sm:py-4 sm:text-[15px]"
          >
            {hero.ctaSecondary}
          </a>
        </div>

        {/* City list wraps cleanly on small screens */}
        <div
          className="hero-fade mt-10 flex flex-wrap items-center gap-x-3 gap-y-3 text-[10px] font-medium leading-relaxed tracking-[0.12em] text-brand-200/75 sm:mt-14 sm:gap-x-6 sm:gap-y-2 sm:text-[12px] sm:tracking-[0.18em] sm:text-brand-200/60"
          style={{ animationDelay: "1480ms" }}
        >
          <span className="hidden h-px w-10 bg-brand-300/40 min-[360px]:block" />

          {cities.map((c, i) => (
            <span key={`${c}-${i}`} className="flex items-center gap-3 sm:gap-6">
              {i > 0 && (
                <span className="h-1 w-1 shrink-0 rounded-full bg-brand-300/50" />
              )}
              <span className="break-words">{c}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Desktop scroll cue */}
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