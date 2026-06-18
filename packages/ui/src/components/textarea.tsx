import * as React from "react"

import { cn } from "@repo/ui/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
