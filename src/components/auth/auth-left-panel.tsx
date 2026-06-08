"use client"

import { useEffect, useState } from "react"

const slides = [
  "/vn-1.avif",
  "/vn-2.avif",
  "/vn-3.avif",
  "/vn-4.avif",
  "/vn-5.avif",
]

export function AuthLeftPanel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Slide indicator dots */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full bg-white transition-all duration-300 ${
              i === current ? "w-6 opacity-100" : "w-2 opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
