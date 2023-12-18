export const metadata = {
  title: 'PostMasterHub',
  description: 'Post smarter, not harder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

