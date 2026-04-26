export const metadata = {
  title: "ColorStack @ Cal State LA",
  description: "ColorStack board application system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
