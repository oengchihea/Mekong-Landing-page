// Import all CSS files
import "../styles/global.css"
import "../styles/components/header.css"
import "../styles/components/footer.css"
import "../styles/pages/home.css"

// Import section CSS files
import "../styles/components/sections/about.css"
import "../styles/components/sections/contact.css"
import "../styles/components/sections/gallery.css"
import "../styles/components/sections/hero.css"
import "../styles/components/sections/menu.css"
import "../styles/components/sections/testimonials.css"

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
