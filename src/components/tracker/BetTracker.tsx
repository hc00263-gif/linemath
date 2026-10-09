"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { parseOdds } from "@/lib/odds/convert";
import { formatAmerican, formatCurrency } from "@/lib/odds/format";
import { betsToCsv, parseBetsCsv } from "@/lib/tracker/csv";
import { betClv, betProfit, cumulativeSeries, groupStats, oddsRange, summarize } from "@/lib/tracker/stats";
import { getServerSnapshot, getSnapshot, newBetId, saveBets, subscribe } from "@/lib/tracker/store";
import { BET_TYPES, Bet, BetResult, SPORTS } from "@/lib/tracker/types";
import { BankrollChart } from "./BankrollChart";

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";
const RESULT_LABEL: Record<BetResult, string> = { pending: "Pending", win: "Win", loss: "Loss", push: "Push" };

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function money(value: number): string {
  return `${value >= 0 ? "+" : "−"}${formatCurrency(Math.abs(value))}`;
}

function percent(value: number | null): string {
  return value === null ? "—" : `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}%`;
}

function Tone({ value, children }: { value: number | null; children: React.ReactNode }) {
  const cls = value === null || value === 0 ? "text-ink" : value > 0 ? "text-positive" : "text-negative";
  return <span className={cls}>{children}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-ink-dim">
      {label}
      {children}
    </label>
  );
}

function Breakdown({ title, rows }: { title: string; rows: ReturnType<typeof groupStats> }) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-xl border border-line bg-surface">
      <h3 className="border-b border-line px-4 py-2.5 text-sm font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-ink-dim">
            <tr>
              <th className="px-4 py-2 font-medium">Group</th>
              <th className="px-2 py-2 text-right font-medium">Bets</th>
              <th className="px-2 py-2 text-right font-medium">Record</th>
              <th className="px-2 py-2 text-right font-medium">Profit</th>
              <th className="px-4 py-2 text-right font-medium">ROI</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-line">
                <td className="px-4 py-2 font-sans">{row.key}</td>
                <td className="px-2 py-2 text-right">{row.bets}</td>
                <td className="px-2 py-2 text-right">
                  {row.wins}-{row.losses}
                </td>
                <td className="px-2 py-2 text-right">
                  <Tone value={row.profit}>{money(row.profit)}</Tone>
                </td>
                <td className="px-4 py-2 text-right">
                  <Tone value={row.roi}>{percent(row.roi)}</Tone>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BetTracker() {
  const bets = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const fileRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState(today);
  const [sport, setSport] = useState("NFL");
  const [type, setType] = useState("Spread");
  const [description, setDescription] = useState("");
  const [oddsText, setOddsText] = useState("-110");
  const [stakeText, setStakeText] = useState("");
  const [closingText, setClosingText] = useState("");
  const [result, setResult] = useState<BetResult>("pending");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const summary = summarize(bets);
  const series = cumulativeSeries(bets);
  const rows = [...bets].sort((a, b) => b.date.localeCompare(a.date));

  function addBet(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);
    let odds: number;
    try {
      odds = parseOdds(oddsText, "american").american;
    } catch {
      setError("Enter odds like -110 or +150.");
      return;
    }
    const stake = Number(stakeText);
    if (!Number.isFinite(stake) || stake <= 0) {
      setError("Enter a stake greater than 0.");
      return;
    }
    let closingOdds: number | undefined;
    if (closingText.trim() !== "") {
      try {
        closingOdds = parseOdds(closingText, "american").american;
      } catch {
        setError("Closing odds must look like -110 or +150, or be left blank.");
        return;
      }
    }
    setError(null);
    const bet: Bet = { id: newBetId(), date, sport, type, description: description.trim(), odds, stake, result, ...(closingOdds !== undefined ? { closingOdds } : {}) };
    saveBets([...bets, bet]);
    setDescription("");
    setStakeText("");
    setClosingText("");
    setResult("pending");
  }

  function setBetResult(id: string, next: BetResult) {
    saveBets(bets.map((b) => (b.id === id ? { ...b, result: next } : b)));
  }

  function removeBet(id: string) {
    saveBets(bets.filter((b) => b.id !== id));
  }

  function exportCsv() {
    const blob = new Blob([betsToCsv(bets)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `linemath-bets-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const parsed = parseBetsCsv(await file.text());
    if (parsed.bets.length > 0) saveBets([...bets, ...parsed.bets.map((b) => ({ ...b, id: newBetId() }))]);
    const added = `${parsed.bets.length} bet${parsed.bets.length === 1 ? "" : "s"} imported`;
    const skipped = parsed.skipped > 0 ? `, ${parsed.skipped} skipped` : "";
    setNotice(`${added}${skipped}.${parsed.problems.length ? " " + parsed.problems.join(" ") : ""}`);
  }

  function clearAll() {
    if (window.confirm(`Delete all ${bets.length} bets from this browser? This cannot be undone.`)) saveBets([]);
  }

  const stats: { label: string; value: React.ReactNode }[] = [
    { label: "Profit", value: <Tone value={summary.profit}>{summary.staked > 0 ? money(summary.profit) : "—"}</Tone> },
    { label: "ROI", value: <Tone value={summary.roi}>{percent(summary.roi)}</Tone> },
    { label: "Record", value: `${summary.wins}-${summary.losses}${summary.pushes ? `-${summary.pushes}` : ""}` },
    { label: "Win rate", value: summary.winPercent === null ? "—" : `${summary.winPercent.toFixed(1)}%` },
    { label: "Avg CLV", value: <Tone value={summary.avgClv}>{percent(summary.avgClv)}</Tone> },
    { label: "Pending", value: String(summary.pending) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-4">
            <div className="text-xs font-medium text-ink-dim">{s.label}</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <BankrollChart series={series} />

      <form onSubmit={addBet} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4" aria-label="Add a bet">
        <h2 className="text-sm font-semibold">Add a bet</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Sport">
            <select value={sport} onChange={(e) => setSport(e.target.value)} className={inputClass}>
              {SPORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Bet type">
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              {BET_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Result">
            <select value={result} onChange={(e) => setResult(e.target.value as BetResult)} className={inputClass}>
              {(Object.keys(RESULT_LABEL) as BetResult[]).map((r) => (
                <option key={r} value={r}>
                  {RESULT_LABEL[r]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
          <Field label="Description (optional)">
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Chiefs -3.5" className={inputClass} />
          </Field>
          <Field label="Odds (American)">
            <input value={oddsText} onChange={(e) => setOddsText(e.target.value)} inputMode="numeric" className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Stake ($)">
            <input value={stakeText} onChange={(e) => setStakeText(e.target.value)} inputMode="decimal" placeholder="100" className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Closing odds (optional)">
            <input value={closingText} onChange={(e) => setClosingText(e.target.value)} inputMode="numeric" placeholder="-120" className={`${inputClass} font-mono`} />
          </Field>
        </div>
        {error && (
          <p role="alert" className="text-sm text-negative">
            {error}
          </p>
        )}
        <button type="submit" className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-[filter] hover:brightness-110">
          Add bet
        </button>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <Breakdown title="By sport" rows={groupStats(bets, (b) => b.sport)} />
        <Breakdown title="By bet type" rows={groupStats(bets, (b) => b.type)} />
        <Breakdown title="By odds range" rows={groupStats(bets, (b) => oddsRange(b.odds))} />
      </div>

      <div className="rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <h2 className="text-sm font-semibold">Bet log ({bets.length})</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md border border-line px-2.5 py-1.5 font-medium hover:border-accent/50">
              Import CSV
            </button>
            <button type="button" onClick={exportCsv} disabled={bets.length === 0} className="rounded-md border border-line px-2.5 py-1.5 font-medium hover:border-accent/50 disabled:opacity-40">
              Export CSV
            </button>
            <button type="button" onClick={clearAll} disabled={bets.length === 0} className="rounded-md border border-line px-2.5 py-1.5 font-medium text-negative hover:border-negative/50 disabled:opacity-40">
              Delete all
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={importCsv} className="hidden" aria-label="Import bets from a CSV file" />
          </div>
        </div>
        {notice && (
          <p role="status" className="border-b border-line px-4 py-2 text-xs text-ink-dim">
            {notice}
          </p>
        )}
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-dim">No bets yet. Add one above or import a CSV.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-ink-dim">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-2 py-2 font-medium">Bet</th>
                  <th className="px-2 py-2 text-right font-medium">Odds</th>
                  <th className="px-2 py-2 text-right font-medium">Stake</th>
                  <th className="px-2 py-2 font-medium">Result</th>
                  <th className="px-2 py-2 text-right font-medium">Profit</th>
                  <th className="px-2 py-2 text-right font-medium">CLV</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {rows.map((bet) => {
                  const clv = betClv(bet);
                  return (
                    <tr key={bet.id} className="border-t border-line">
                      <td className="px-4 py-2 whitespace-nowrap">{bet.date}</td>
                      <td className="px-2 py-2 font-sans">
                        <div>{bet.description || "—"}</div>
                        <div className="text-xs text-ink-dim">
                          {bet.sport} · {bet.type}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-right">{formatAmerican(bet.odds)}</td>
                      <td className="px-2 py-2 text-right">{formatCurrency(bet.stake)}</td>
                      <td className="px-2 py-2">
                        <select
                          value={bet.result}
                          onChange={(e) => setBetResult(bet.id, e.target.value as BetResult)}
                          aria-label={`Result for ${bet.description || bet.date}`}
                          className="rounded-md border border-line bg-surface px-1.5 py-1 font-sans text-xs text-ink"
                        >
                          {(Object.keys(RESULT_LABEL) as BetResult[]).map((r) => (
                            <option key={r} value={r}>
                              {RESULT_LABEL[r]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 text-right">
                        {bet.result === "win" || bet.result === "loss" ? <Tone value={betProfit(bet)}>{money(betProfit(bet))}</Tone> : "—"}
                      </td>
                      <td className="px-2 py-2 text-right">{clv === null ? "—" : <Tone value={clv}>{percent(clv)}</Tone>}</td>
                      <td className="px-4 py-2 text-right">
                        <button type="button" onClick={() => removeBet(bet.id)} aria-label={`Delete bet ${bet.description || bet.date}`} className="text-xs text-ink-dim hover:text-negative">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-ink-dim">
        Your bets are saved only in this browser on this device — LineMath never receives them. Clearing site data deletes them, so use Export CSV to keep a backup.
      </p>
    </div>
  );
}
