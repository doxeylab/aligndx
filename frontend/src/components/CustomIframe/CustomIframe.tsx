export default function CustomIframe ({
  children,
  ...props
}) {

  return (
    <iframe {...props}>
      {children}
    </iframe>
  )
}