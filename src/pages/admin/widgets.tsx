import { type ReactNode, useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { CheckIcon } from "../../components/Icons";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-cloud bg-mist/50 px-3.5 py-2.5 text-[14px] text-ink transition-all outline-none placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,102,242,0.12)]"
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 4,
  mono = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1.5 w-full resize-y rounded-lg border border-cloud bg-mist/50 px-3.5 py-2.5 text-[14px] leading-relaxed text-ink transition-all outline-none placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,102,242,0.12)]",
          mono && "font-mono text-[12.5px]"
        )}
      />
    </label>
  );
}

export function Num({
  label,
  value,
  onChange,
  step = 1,
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">{label}</span>
      <input
        type="number"
        step={step}
        min={min}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full rounded-lg border border-cloud bg-mist/50 px-3.5 py-2.5 text-[14px] text-ink transition-all outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,102,242,0.12)]"
      />
    </label>
  );
}

export function Sel({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-cloud bg-mist/50 px-3 py-2.5 text-[14px] text-ink transition-all outline-none focus:border-brand-500 focus:bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Check({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group flex w-fit items-center gap-3 rounded-lg border border-cloud bg-white px-3.5 py-2.5 text-left transition-colors hover:border-brand-300"
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
          checked ? "border-brand-500 bg-brand-500 text-white" : "border-slate-300 bg-white text-transparent"
        )}
      >
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
      <span>
        <span className="block text-[13px] font-bold text-ink">{label}</span>
        {hint && <span className="block text-[11.5px] text-slate-400">{hint}</span>}
      </span>
    </button>
  );
}

export function Card({
  title,
  children,
  onRemove,
  accent = false,
}: {
  title?: ReactNode;
  children: ReactNode;
  onRemove?: () => void;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-5",
        accent ? "border-brand-300 ring-1 ring-brand-100" : "border-cloud"
      )}
    >
      {(title || onRemove) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-display text-[13.5px] font-bold text-ink">{title}</p>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[12px] font-bold text-slate-400 transition-colors hover:text-red-500"
            >
              Remove
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-400 px-5 py-2.5 text-[13px] font-bold text-brand-600 transition-all hover:border-solid hover:bg-brand-50"
    >
      <span className="text-[15px] leading-none">+</span> {label}
    </button>
  );
}

export function SaveBar({
  dirty,
  onSave,
}: {
  dirty: boolean;
  onSave: () => void;
}) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => setSaved(false), 2200);
    return () => window.clearTimeout(t);
  }, [saved]);
  return (
    <div className="sticky bottom-4 z-10 mt-8 flex items-center gap-4 rounded-2xl border border-cloud bg-white/95 p-4 shadow-[0_20px_50px_-24px_rgba(8,21,48,0.4)] backdrop-blur">
      <button
        type="button"
        disabled={!dirty}
        onClick={() => {
          onSave();
          setSaved(true);
        }}
        className={cn(
          "rounded-full px-7 py-3 text-[14px] font-semibold text-white transition-all",
          dirty
            ? "bg-brand-500 shadow-[0_14px_30px_-12px_rgba(47,102,242,0.8)] hover:-translate-y-0.5 hover:bg-brand-600"
            : "cursor-not-allowed bg-slate-300"
        )}
      >
        {saved ? "Saved ✓" : "Save changes"}
      </button>
      <p className="text-[12.5px] text-slate-400">
        {dirty ? "Unsaved changes" : "Everything is saved"}
      </p>
    </div>
  );
}

export function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}
