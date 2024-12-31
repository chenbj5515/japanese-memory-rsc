'use client'

import { useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AudioPlayerProps {
  src: string
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const togglePlay = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="rounded-full w-8 h-8 p-0"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <audio
        id="audio-player"
        src={src}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  )
}