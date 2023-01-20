import { ReactNode } from "react"

interface CustomIframeProps {
  children?: ReactNode;
  [x: string]: any;
}

export default function CustomIframe({
  children,
  ...props
} : CustomIframeProps) {

  return (
    <iframe {...props}>
      {children}
    </iframe>
  )
}