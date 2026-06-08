export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 animate-pulse">
          <div className="flex gap-6">
            <div className="size-[88px] rounded-full bg-gray-200 shrink-0" />
            <div className="grow space-y-3 pt-1">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
