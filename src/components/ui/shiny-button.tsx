"use client"

import React from "react"
import Link from "next/link"
import { motion, useReducedMotion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

const animationProps: MotionProps = {
  initial: { "--x": "100%" },
  animate: { "--x": "-100%" },
  whileTap: { scale: 0.98 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
  },
}

const MotionLink = motion.create(Link)

interface ShinyButtonProps extends Omit<React.ComponentProps<typeof Link>, keyof MotionProps>, MotionProps {
  children: React.ReactNode
  className?: string
}

export const ShinyButton = React.forwardRef<
  HTMLAnchorElement,
  ShinyButtonProps
>(({ children, className, ...props }, ref) => {
  const reducedMotion = useReducedMotion()

  return (
    <MotionLink
      ref={ref}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-[0_0_20px_#39c7ff55]",
        className
      )}
      {...(reducedMotion ? { initial: false } : animationProps)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          backgroundImage: "linear-gradient(105deg,transparent 34%,rgba(255,255,255,.1) 43%,rgba(255,255,255,.38) 50%,rgba(255,255,255,.1) 57%,transparent 66%)",
          backgroundSize: "250% 100%",
          backgroundPosition: "var(--x) 0",
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2 text-inherit">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/20"
      />
    </MotionLink>
  )
})

ShinyButton.displayName = "ShinyButton"
