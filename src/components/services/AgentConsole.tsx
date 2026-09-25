/**
 * Hero figure for AI agent development: one agent run, step by step. Each line is a
 * capability the page itself names (tools, RAG, evals, guardrails, observability,
 * cost monitoring, human-in-the-loop). Pure CSS sequencing; static when motion is reduced.
 */
const LINES = [
  { k: 'goal', t: 'Qualify an inbound lead from WhatsApp' },
  { k: 'tool', t: 'retrieve → private knowledge base (RAG)' },
  { k: 'tool', t: 'reason → pick next action' },
  { k: 'tool', t: 'act → update CRM · book appointment' },
  { k: 'eval', t: 'evals passed · guardrails ok' },
  { k: 'obs', t: 'observability · cost & token dashboard' },
  { k: 'hitl', t: 'high-stakes? → human-in-the-loop' },
]

const TAG: Record<string, string> = { goal: 'GOAL', tool: 'STEP', eval: 'EVAL', obs: 'LOG', hitl: 'HITL' }

export function AgentConsole() {
  return (
    <div className="agent-console relative overflow-hidden rounded-[18px] border border-stage-line bg-stage text-stage-ink shadow-[var(--shadow-float)]">
      <div className="flex items-center justify-between border-b border-stage-line px-5 py-3">
        <span className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="t-label text-stage-ink-2">agent · production run</span>
        </span>
        <span className="t-label text-stage-ink-2">model-agnostic</span>
      </div>
      <ol className="grid gap-2.5 px-5 py-5 font-label text-[0.78rem]">
        {LINES.map((l, i) => (
          <li key={l.t} className="ac-line flex items-start gap-3" style={{ ['--i' as string]: i }}>
            <span className="w-11 shrink-0 text-teal">{TAG[l.k]}</span>
            <span className="text-stage-ink">{l.t}</span>
            <span className="ac-ok ml-auto text-teal">✓</span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-3 border-t border-stage-line">
        {[
          ['Prototype', '7 days'],
          ['Production', '7 weeks'],
          ['You own', 'code · prompts'],
        ].map(([a, b]) => (
          <div key={a} className="border-r border-stage-line px-5 py-4 last:border-r-0">
            <p className="t-label text-stage-ink-2">{a}</p>
            <p className="mt-1 text-[0.95rem] font-semibold">{b}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
