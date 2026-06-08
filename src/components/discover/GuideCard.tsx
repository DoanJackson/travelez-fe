import { motion } from "framer-motion"
import { BookOpen, Users, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Guide } from "@/types/discover"

interface GuideCardProps {
  guide: Guide
  index?: number
  href?: string
}

export function GuideCard({ guide, index = 0, href = "#" }: GuideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={href}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={guide.imageUrl}
              alt={guide.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="h-4 w-4" />
              <span>Guide</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {guide.readTime}
              </div>
            </div>

            <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
              {guide.title}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2">
              {guide.description}
            </p>

            {guide.author && (
              <div className="flex items-center gap-2 pt-2 text-sm">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{guide.author}</span>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
