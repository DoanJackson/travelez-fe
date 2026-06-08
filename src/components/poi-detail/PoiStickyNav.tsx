"use client"

import { useEffect, useState } from "react"

interface PoiStickyNavProps {
  sections: Array<{ id: string; label: string }>
}

export function PoiStickyNav({ sections }: PoiStickyNavProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after hero section
      setIsSticky(window.scrollY > 400)

      // Find active section based on scroll position
      const sectionElements = sections.map((section) =>
        document.getElementById(section.id)
      )

      const currentSection = sectionElements.find((el) => {
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 120 && rect.bottom >= 120
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <nav
      className={`bg-white border-b border-gray-200 transition-all duration-200 ${
        isSticky ? "sticky top-16 z-30 shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`whitespace-nowrap text-sm font-semibold transition-all pb-1 border-b-3 ${
                activeSection === section.id
                  ? "text-pink-600 border-pink-600 border-b-[3px]"
                  : "text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
