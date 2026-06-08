"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Bell, Share2, MapPin } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CityHeroCarouselProps {
  cityName: string
  images: string[]
  tags: string[]
  placesCount: number
  reviewsCount: number
  isSaved: boolean
  isFollowed: boolean
  onSave: () => void
  onFollow: () => void
  onShare: () => void
}

export function CityHeroCarousel({
  cityName,
  images,
  tags,
  placesCount,
  reviewsCount,
  isSaved,
  isFollowed,
  onSave,
  onFollow,
  onShare,
}: CityHeroCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  return (
    <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentImage]}
            alt={cityName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Carousel Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImage
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Hero Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="absolute bottom-8 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {cityName}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {placesCount} places
                </span>
                <span>{reviewsCount} reviews</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onSave}
                  className={`rounded-full ${isSaved ? "text-pink-600" : ""}`}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onFollow}
                  className={`rounded-full ${isFollowed ? "text-pink-600" : ""}`}
                >
                  <Bell className={`h-5 w-5 ${isFollowed ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onShare}
                  className="rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
