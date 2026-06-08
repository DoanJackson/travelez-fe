"use client"

import { Button } from "@/components/ui/button"

interface ToggleOptionProps {
  label: string
  helperText?: string
  value: boolean | null
  onChange: (value: boolean) => void
}

export default function ToggleOption({ label, helperText, value, onChange }: ToggleOptionProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-gray-700 font-medium">{label}</p>
      {helperText && (
        <p className="text-sm text-gray-500 text-center max-w-md">{helperText}</p>
      )}
      <div className="flex gap-3">
        <Button
          variant={value === true ? "default" : "outline"}
          className={value === true ? "bg-pink-500 hover:bg-pink-600" : ""}
          onClick={() => onChange(true)}
        >
          Yes
        </Button>
        <Button
          variant={value === false ? "default" : "outline"}
          onClick={() => onChange(false)}
        >
          No
        </Button>
      </div>
    </div>
  )
}
