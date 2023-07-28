import { cn } from "@client/lib/cn";
import { FunctionComponent, ReactNode } from "react";

interface GridProps {
  contentStart?: boolean;
  children: ReactNode;
  className?: string;
  screenHeight?: boolean;
  [key: string]: any;
}

const Grid: FunctionComponent<GridProps> = ({
  contentStart = true,
  children,
  className,
  screenHeight = true,
  ...rest
}) => {
  const baseCN = `
    grid

    grid-cols-4
    gap-x-[16px]
    px-[16px]

    sm:px-[24px]
    sm:grid-cols-4
    sm:gap-x-[20px]

    md:grid-cols-12
    md:px-[40px]
    md:gap-[16px]

    xl:grid-cols-12
    xl:px-[100px]
    xl:gap-[20px]

    relative
    ${contentStart ? "place-content-start" : "place-content-center"}

    ${screenHeight ? "min-h-screen" : ""}
  `;

  return (
    <>
      <div className={cn(className, baseCN)} {...rest}>
        {children}
      </div>
    </>
  );
};

export default Grid;
