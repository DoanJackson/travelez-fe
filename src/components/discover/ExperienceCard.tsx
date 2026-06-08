import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Experience } from "@/types/discover";
import { useState } from "react";

interface ExperienceCardProps {
  experience: Experience;
  index?: number;
  href?: string;
}

export function ExperienceCard({
  experience,
  index = 0,
  href = "#",
}: ExperienceCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
          <div className="relative h-48 overflow-hidden">
            {experience.imageUrl && !imgError ? (
              <Image
                src={experience.imageUrl}
                alt={experience.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
              {experience.title}
            </h3>

            {/* <p className="text-sm text-gray-600 line-clamp-2">
              {experience.description}
            </p> */}

            <div className="flex items-center gap-2 pt-2 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-gray-900">
                  {experience.rating}
                </span>
              </div>
              <span className="text-gray-500">
                ({experience.reviewCount} reviews)
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
