"use client";

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-800 rounded-xl shimmer" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-800 rounded shimmer w-1/3" />
          {lines > 1 && <div className="h-4 bg-slate-800 rounded shimmer w-1/2" />}
          {lines > 2 && <div className="h-4 bg-slate-800 rounded shimmer w-1/4" />}
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl shimmer" />
            <div className="h-4 bg-slate-800 rounded shimmer w-16" />
          </div>
          <div className="h-8 bg-slate-800 rounded shimmer w-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-slate-800 rounded shimmer ${i === 0 ? "w-2/3" : i === lines - 1 ? "w-1/2" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonMedicineCard() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-slate-800 rounded-xl shimmer" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 bg-slate-800 rounded shimmer w-32" />
            <div className="h-5 bg-slate-800 rounded shimmer w-20" />
          </div>
          <div className="h-4 bg-slate-800 rounded shimmer w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 bg-slate-800 rounded-full shimmer w-20" />
            <div className="h-6 bg-slate-800 rounded-full shimmer w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
