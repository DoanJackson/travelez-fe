"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Images } from "lucide-react"

interface PoiHeroGalleryProps {
  images: string[]
  altText: string
}

export function PoiHeroGallery({ images, altText }: PoiHeroGalleryProps) {
  const [showAllImages, setShowAllImages] = useState(false)

  const handleViewAll = () => {
    setShowAllImages(true)
    // In a real app, this would open a lightbox/modal
    console.log("View all images modal")
  }

  return (
    <>
      {/* Desktop/Tablet Grid Layout */}
      <div className="hidden sm:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-[7fr_3fr] gap-2 h-[320px] sm:h-[380px] lg:h-[450px] rounded-2xl overflow-hidden"
        >
          {/* Large main image on left (70%) */}
          <div className="relative group overflow-hidden">
            <Image
              src={images[0]}
              alt={`${altText} - Main view`}
              fill
              className="object-cover hero-kenburns"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Two or three stacked thumbnails on right (30%) */}
          <div className="flex flex-col gap-2 relative">
            <div className="relative flex-1 group overflow-hidden">
              <Image
                src={images[1]}
                alt={`${altText} - View 2`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="relative flex-1 group overflow-hidden">
              <Image
                src={images[2]}
                alt={`${altText} - View 3`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              
              {/* View All Button Overlay */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleViewAll}
                className="absolute bottom-3 right-3 gap-2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg"
              >
                <Images className="h-4 w-4" />
                View all photos
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {images.slice(0, 5).map((image, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden border-0">
                  <div className="relative h-[280px]">
                    <Image
                      src={image}
                      alt={`${altText} - View ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAll}
          className="w-full mt-3 gap-2"
        >
          <Images className="h-4 w-4" />
          View all {images.length} images
        </Button>
      </div>
    </>
  )
}
