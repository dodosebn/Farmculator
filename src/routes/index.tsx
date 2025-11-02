import IntroSentence from '@/components/home/introSentence'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {return (
 <div>
  <IntroSentence />
 </div>
  )
}
