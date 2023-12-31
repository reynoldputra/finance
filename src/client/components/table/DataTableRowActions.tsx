import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { Button } from "@client/components/ui/button"
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@client/components/ui/dropdown-menu"
import { ReactNode } from "react"


interface DataTableRowActionsProps{
  children : ReactNode
}

export function DataTableRowActions({
  children
}: DataTableRowActionsProps) {

  return (
    <DropdownPrimitive.Root>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {children}
      </DropdownMenuContent>
    </DropdownPrimitive.Root>
  )
}

