import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function SkyflixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      className={cn("w-auto", props.className)}
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="30"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        fontFamily="Inter, sans-serif"
      >
        SKY<tspan fill="hsl(var(--primary))">FLIX</tspan>
      </text>
    </svg>
  );
}
