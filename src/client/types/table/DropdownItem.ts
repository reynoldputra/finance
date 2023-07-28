import { IconProps } from "@radix-ui/react-icons/dist/types"

export interface DropdownItem {
  value : string
  label : string
}

export interface DropdownItemWithLogo extends DropdownItem {
  icon : React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
}
