import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@repo/ui/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { value?: number }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("relative h-1 w-full overflow-hidden rounded-full bg-foreground/10", className)}
      {...props}
    >
      <ProgressPrimitive.Track className="h-full w-full">
        <ProgressPrimitive.Indicator
          className="h-full bg-foreground/60 transition-all duration-300 ease-out"
          style={{ width: `${value ?? 0}%` }}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
