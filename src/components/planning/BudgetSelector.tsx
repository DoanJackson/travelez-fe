"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface BudgetSelectorProps {
  value: number | null
  currency: 'VND' | 'USD'
  onValueChange: (value: number) => void
  onCurrencyChange: (currency: 'VND' | 'USD') => void
}

// Currency configs
const currencyConfig = {
  VND: {
    min: 500_000,
    max: 100_000_000,
    step: 500_000,
    default: 5_000_000,
    format: (n: number) => n.toLocaleString('vi-VN'),
    symbol: 'VND',
  },
  USD: {
    min: 100,
    max: 10_000,
    step: 50,
    default: 500,
    format: (n: number) => n.toLocaleString('en-US'),
    symbol: '$',
  },
}

export default function BudgetSelector({
  value,
  currency,
  onValueChange,
  onCurrencyChange,
}: BudgetSelectorProps) {
  const config = currencyConfig[currency]
  const currentValue = value || config.default

  const handleSliderChange = (values: number[]) => {
    onValueChange(values[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(e.target.value.replace(/[^0-9]/g, ""))
    if (!isNaN(numValue) && numValue >= config.min && numValue <= config.max) {
      onValueChange(numValue)
    }
  }

  const handleCurrencyChange = (newCurrency: 'VND' | 'USD') => {
    onCurrencyChange(newCurrency)
  }

  const formatDisplay = (num: number) => {
    if (currency === 'VND') {
      return config.format(num)
    } else {
      return config.format(num)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-xl text-gray-700">What is your budget per person?</h3>
        
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            {currency === 'USD' && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-700">
                $
              </span>
            )}
            <Input
              type="text"
              value={formatDisplay(currentValue)}
              onChange={handleInputChange}
              className={`text-center text-2xl font-semibold h-14 ${
                currency === 'USD' ? 'pl-8' : ''
              }`}
              style={{ width: '200px' }}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={currency === 'VND' ? 'default' : 'outline'}
              onClick={() => handleCurrencyChange('VND')}
              className={currency === 'VND' ? 'bg-pink-500 hover:bg-pink-600' : ''}
            >
              VND
            </Button>
            <Button
              variant={currency === 'USD' ? 'default' : 'outline'}
              onClick={() => handleCurrencyChange('USD')}
              className={currency === 'USD' ? 'bg-pink-500 hover:bg-pink-600' : ''}
            >
              USD
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Slider
          min={config.min}
          max={config.max}
          step={config.step}
          value={[currentValue]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{currency === 'VND' ? '500K' : '$100'}</span>
          <span>{currency === 'VND' ? '100M' : '$10,000'}</span>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-sm text-center text-gray-500">
        {currency === 'VND' 
          ? 'Most travelers spend around 800,000–1,500,000 VND per day'
          : 'Most travelers spend around $30–60 per day'
        }
      </p>
    </div>
  )
}
