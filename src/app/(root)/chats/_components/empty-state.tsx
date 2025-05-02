import { MessageSquare } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}
