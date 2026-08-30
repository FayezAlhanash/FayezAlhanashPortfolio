import { useEffect, useRef, useState } from 'react'
import './App.css'

const project = {
  title: 'Big4 Restaurant System',
  description:
    'Big4 is an all-in-one restaurant management platform that brings daily operations into one connected system. It helps restaurant teams manage sales, orders, kitchen workflows, tables, menus, inventory, staff, reports, and permissions from a clear, role-based workspace.',
  role: 'Frontend developer, UI designer, API integration',
  tech: ['React', 'Vite', 'Realtime', 'Stripe'],
  features: ['Cashier POS flow', 'Kitchen order tracking', 'Manager reports', 'Role permissions'],
}

const additionalProjects = [
  { title: 'Kitchen order tracking', eyebrow: 'Operations flow', image: '/projects/kitchen.png', description: 'A focused workspace for kitchen teams to move every order from queue to ready.' },
  { title: 'Menu builder', eyebrow: 'Product interface', image: '/projects/menu-builder.png', description: 'A clear content system for managing menu items, prices, modifiers, and availability.' },
  { title: 'Tables management', eyebrow: 'Restaurant workflow', image: '/projects/tables.png', description: 'Fast table states and active order context designed for busy floor teams.' },
]

const heroSlides = [
  {
    image: '/hero-art.jpg',
    overlay: 'linear-gradient(90deg, rgba(28,12,10,.72) 0%, rgba(28,12,10,.38) 48%, rgba(28,12,10,.1) 100%)',
    bar: ['#241619', '#5b2a24', '#98492f'],
    spots: ['rgba(204,61,39,.62)', 'rgba(157,42,29,.5)', 'rgba(236,78,39,.44)', 'rgba(188,53,33,.48)', 'rgba(232,102,48,.42)', 'rgba(181,45,29,.32)'],
    cards: ['#f4e7e1', '#f9f0eb', '#f1e0d9', '#dec9c0', '#f8eee9', '#f5f0ed'],
    label: 'Warm mountain',
  },
  {
    image: '/mountains.jpg',
    overlay: 'linear-gradient(90deg, rgba(7,22,28,.7) 0%, rgba(15,34,40,.38) 48%, rgba(28,43,46,.12) 100%)',
    bar: ['#16282d', '#29474d', '#46666a'],
    spots: ['rgba(45,112,125,.45)', 'rgba(61,92,99,.42)', 'rgba(111,154,153,.34)', 'rgba(37,83,91,.42)', 'rgba(157,113,76,.28)', 'rgba(74,121,125,.3)'],
    cards: ['#dce9ed', '#edf3f4', '#d4e3e7', '#b9d0d3', '#e6f0f2', '#e7eef0'],
    label: 'Cool mountain',
  },
  {
    image: '/beauty-scene.jpg',
    overlay: 'linear-gradient(90deg, rgba(9,24,54,.72) 0%, rgba(41,39,79,.4) 48%, rgba(221,76,112,.12) 100%)',
    bar: ['#101f42', '#283768', '#9b486b'],
    spots: ['rgba(47,86,153,.48)', 'rgba(219,74,116,.42)', 'rgba(255,126,110,.38)', 'rgba(73,65,135,.44)', 'rgba(213,75,113,.34)', 'rgba(48,91,153,.36)'],
    cards: ['#eadfea', '#f7e5ec', '#ded9ec', '#d2b4c7', '#f2e5ed', '#e8e1ef'],
    label: 'Pink sky mountain',
  },
]

function RevealImage({ src, alt }) {
  const imageRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const image = imageRef.current
    if (!image) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -8% 0px' })

    observer.observe(image)
    return () => observer.disconnect()
  }, [])

  return <img ref={imageRef} className={`reveal-image${isVisible ? ' is-visible' : ''}`} src={src} alt={alt} loading="lazy" decoding="async" />
}

function ScrollScaleText({ as: Tag = 'h2', className = '', children }) {
  const textRef = useRef(null)

  useEffect(() => {
    let frameId

    const updateScale = () => {
      frameId = undefined
      const element = textRef.current
      if (!element) return

      const { top } = element.getBoundingClientRect()
      const start = window.innerHeight * 0.95
      const end = window.innerHeight * 0.28
      const progress = Math.min(1, Math.max(0, (start - top) / (start - end)))
      element.style.setProperty('--scroll-scale', (0.94 + progress * 0.06).toFixed(3))
    }

    const onScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateScale)
    }

    updateScale()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return <Tag ref={textRef} className={`scroll-scale ${className}`}>{children}</Tag>
}

function jumpToSection(event, id) {
  event.preventDefault()
  const target = document.getElementById(id)
  const header = document.querySelector('.site-header')
  if (!target) return

  const offset = (header?.offsetHeight ?? 0) + 18
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset)
  window.scrollTo({ top, behavior: 'auto' })
  window.history.replaceState(null, '', `#${id}`)
}

function App() {
  const [activeHero, setActiveHero] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showMobileNotice, setShowMobileNotice] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const currentHero = heroSlides[activeHero]

  useEffect(() => {
    if (!isAutoPlaying) return undefined

    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroSlides.length)
    }, 9000)
    return () => window.clearInterval(timer)
  }, [isAutoPlaying])

  useEffect(() => {
    const isSmallScreen = window.matchMedia('(max-width: 980px)').matches
    const wasDismissed = window.sessionStorage.getItem('mobile-notice-dismissed')
    if (isSmallScreen && !wasDismissed) setShowMobileNotice(true)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsPageLoading(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  const closeMobileNotice = () => {
    window.sessionStorage.setItem('mobile-notice-dismissed', 'true')
    setShowMobileNotice(false)
  }

  return (
    <>
      {isPageLoading && <div className="page-loader" role="status" aria-label="Loading portfolio"><div className="page-loader-mark">F</div><p>Fayez Alhanash</p><span className="page-loader-line"><i /></span><small>Loading selected work</small></div>}
      <main className="portfolio" style={{ '--bar-a': currentHero.bar[0], '--bar-b': currentHero.bar[1], '--bar-c': currentHero.bar[2], '--spot-1': currentHero.spots[0], '--spot-2': currentHero.spots[1], '--spot-3': currentHero.spots[2], '--spot-4': currentHero.spots[3], '--spot-5': currentHero.spots[4], '--spot-6': currentHero.spots[5], '--card-a': currentHero.cards[0], '--card-b': currentHero.cards[1], '--card-c': currentHero.cards[2], '--card-border': currentHero.cards[3], '--role-card': currentHero.cards[4], '--media-card': currentHero.cards[5] }}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Fayez Alhanash home"><span className="brand-mark">F</span><span className="brand-name"><strong>Fayez</strong><span>Alhanash</span></span></a>
        <nav aria-label="Main navigation">
          <a className="active" href="#work" onClick={(event) => jumpToSection(event, 'work')}>Work</a>
          <a href="#about" onClick={(event) => jumpToSection(event, 'about')}>About</a>
          <a href="#approach" onClick={(event) => jumpToSection(event, 'approach')}>Approach</a>
        </nav>
        <div className="header-social" aria-label="Contact and social links">
          <a className="social-link" href="https://www.linkedin.com/in/fayez-alhanash-2aa2453a2/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.35 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.57 20.45h3.56V9H3.57v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" /></svg>
          </a>
          <a className="social-link" href="https://github.com/FayezAlhanash" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.76.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3Z" /></svg>
          </a>
          <a className="header-email" href="mailto:fayez.alhanash2005@gmail.com">fayez.alhanash2005@gmail.com</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-backgrounds" aria-hidden="true">
          {heroSlides.map((slide, index) => <div className={`hero-background${index === activeHero ? ' is-active' : ''}`} key={slide.image} style={{ backgroundImage: `${slide.overlay}, url(${slide.image})` }} />)}
        </div>
        <button className={`theme-toggle${isAutoPlaying ? ' is-on' : ''}`} type="button" onClick={() => setIsAutoPlaying((current) => !current)} aria-pressed={isAutoPlaying} aria-label={`${isAutoPlaying ? 'Turn off' : 'Turn on'} automatic theme changes`}><span className="theme-toggle-track"><span /></span><span>Auto themes</span><strong>{isAutoPlaying ? 'On' : 'Off'}</strong></button>
        <div className="hero-copy">
          <p className="eyebrow">Frontend developer · React</p>
          <ScrollScaleText as="h1">Interfaces that make complex work feel simple.</ScrollScaleText>
          <p className="intro">I design and build thoughtful digital products with React, creating clear, reliable interfaces and polished experiences for real users.</p>
          <a className="text-link" href="#work" onClick={(event) => { event.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>Explore selected work <span>↓</span></a>
        </div>
        <div className="hero-note"><strong>More coming soon</strong></div>
      </section>

      <section className="work-section" id="work">
        <div className="section-intro">
          <div><p className="eyebrow">Selected work</p><ScrollScaleText>Large interface showcases, built around real screens.</ScrollScaleText></div>
          <p>Space for the work to be inspected, with the context a reviewer needs beside it.</p>
        </div>

        <article className="featured-project">
          <div className="project-media"><RevealImage src="/projects/dashboard.png" alt="Big4 restaurant dashboard interface" /></div>
          <div className="project-details">
            <p className="eyebrow">Featured project</p>
            <ScrollScaleText as="h3">Big4 Restaurant System</ScrollScaleText>
            <p className="project-description">{project.description}</p>
            <div className="role-card"><span>My role</span><strong>{project.role}</strong></div>
            <div className="pill-row" aria-label="Technologies used">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
            <ul className="feature-list">{project.features.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="project-actions">
              <a className="button button-secondary" href="https://github.com/FayezAlhanash/RestaurantReact.git" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
            </div>
          </div>
        </article>

        <div className="project-grid" aria-label="More work">
          {additionalProjects.map((item) => <article className="project-card" key={item.title}>
            <div className="project-card-media"><RevealImage src={item.image} alt={`${item.title} interface preview`} /></div>
            <div className="project-card-copy"><p className="eyebrow">{item.eyebrow}</p><ScrollScaleText as="h3">{item.title}</ScrollScaleText><p>{item.description}</p></div>
          </article>)}
        </div>

        <div className="more-work-heading">
          <div>
            <p className="eyebrow">More interfaces</p>
            <ScrollScaleText>See the full Big4 interface system.</ScrollScaleText>
            <p>Explore the complete project and discover how every restaurant role connects in one product.</p>
          </div>
          <a className="project-link" href="https://github.com/FayezAlhanash/RestaurantReact.git" target="_blank" rel="noreferrer">Open the Big4 project on GitHub <span>↗</span></a>
        </div>
      </section>

      <section className="about-section" id="about">
        <p className="eyebrow">About the work</p>
        <div className="about-layout">
          <ScrollScaleText>Frontend developer crafting polished products from the first pixel to the final detail.</ScrollScaleText>
          <div>
            <p>I build complete digital experiences with React, combining clean interfaces, reliable APIs, and thoughtful product thinking to make complex work feel simple.</p>
            <div className="about-links" aria-label="Contact links">
              <a href="https://www.linkedin.com/in/fayez-alhanash-2aa2453a2/" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.35 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.57 20.45h3.56V9H3.57v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" /></svg>LinkedIn <span>↗</span></a>
              <a href="https://github.com/FayezAlhanash" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.76.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3Z" /></svg>GitHub <span>↗</span></a>
              <a href="mailto:fayez.alhanash2005@gmail.com"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.5-.5a.5.5 0 0 0-.3.1L12 10.84 19.8 5.1a.5.5 0 0 0-.3-.1h-15Zm15.5 2.08-7.41 5.45a1 1 0 0 1-1.18 0L4 7.08v11.42c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V7.08Z" /></svg>Email <span>↗</span></a>
              <a href="https://t.me/fayezalhanash" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.7 3.3 18.4 20c-.25 1.18-.91 1.47-1.85.92l-5.08-3.74-2.45 2.36c-.27.27-.5.5-1.03.5l.37-5.18 9.43-8.52c.41-.37-.09-.58-.64-.21L5.5 13.85.52 12.29c-1.08-.34-1.1-1.08.23-1.58L20.2 3.02c.9-.33 1.69.21 1.5.28Z" /></svg>Telegram <span>↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer" id="approach"><span>Fayez Alhanash · Frontend developer</span><a className="phone-link" href="tel:+963935352733">+963 935 352 733</a></footer>
      </main>
      {showMobileNotice && <div className="mobile-notice-backdrop" role="presentation"><section className="mobile-notice" role="dialog" aria-modal="true" aria-labelledby="mobile-notice-title"><button className="mobile-notice-close" type="button" onClick={closeMobileNotice} aria-label="Close notice">×</button><span className="mobile-notice-icon">↗</span><p className="eyebrow">Quick note</p><h2 id="mobile-notice-title">For a better experience, use a PC.</h2><p>This portfolio is designed to be viewed on a larger screen.</p><button className="mobile-notice-action" type="button" onClick={closeMobileNotice}>Continue anyway</button></section></div>}
    </>
  )
}

export default App
