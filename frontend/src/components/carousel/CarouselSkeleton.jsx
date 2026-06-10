/**
 * CarouselSkeleton
 * Renders a shimmer placeholder horizontal scrollbar while the first page of videos loads.
 */
export default function CarouselSkeleton({ count = 5 }) {
  return (
    <div className="flex gap-4 overflow-x-hidden py-3 px-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden flex-shrink-0"
          style={{
            width: 220,
            aspectRatio: '9/16',
            backgroundColor: '#1a1a19',
          }}
        >
          {/* Main area */}
          <div className="shimmer w-full h-full opacity-60" />
        </div>
      ))}
    </div>
  );
}
