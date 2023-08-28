import MenuLayer from './menu'
import '../styles/globals.css'


export default function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="en">
      <body>
        <MenuLayer />
        <div className="paddingTop"></div>
        {children}
      </body>
    </html>
  )
}