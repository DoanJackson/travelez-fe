import { Button } from "@/components/ui/button"

interface Photo {
  id: number;
  url: string;
}

interface MobilePhotosSectionProps {
  photos: Photo[];
}

export function MobilePhotosSection({ photos }: MobilePhotosSectionProps) {
  if (photos.length === 0) return null;

  return (
    <div className="lg:hidden mt-8 pt-8 border-t">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Photos from travelers
        </h3>
        <p className="text-sm text-gray-600">Real views from recent visits</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {photos.slice(0, 4).map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-200"
          >
            <img
              src={photo.url}
              alt="Traveler photo"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full">
        View all photos
      </Button>
    </div>
  )
}
