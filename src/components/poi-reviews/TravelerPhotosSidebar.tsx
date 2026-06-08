import { Button } from "@/components/ui/button"

interface Photo {
  id: number;
  url: string;
}

interface TravelerPhotosSidebarProps {
  photos: Photo[];
}

export function TravelerPhotosSidebar({ photos }: TravelerPhotosSidebarProps) {
  if (photos.length === 0) return null;

  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Photos from travelers
        </h3>
        <p className="text-sm text-gray-600">Real views from recent visits</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-200"
          >
            <img
              src={photo.url}
              alt="Traveler photo"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full">
        View all photos
      </Button>
    </aside>
  )
}
