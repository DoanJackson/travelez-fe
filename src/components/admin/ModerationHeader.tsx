interface ModerationHeaderProps {
  pendingCount: number
  resolvedCount: number
}

export function ModerationHeader({ pendingCount, resolvedCount }: ModerationHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-white px-10 pb-6 pt-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Content Moderation
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {pendingCount} pending · {resolvedCount} resolved
      </p>
    </div>
  )
}
