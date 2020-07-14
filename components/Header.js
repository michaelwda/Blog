import Link from 'next/link'

export default function Header() {
  return (
    <>
    <header className="header">
      <nav className="nav" role="navigation" aria-label="main navigation">
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/projects">
          <a>Projects</a>
        </Link>
        <Link href="/static/Resume.pdf" as="/static/Resume.pdf">
          <a>Resume</a>
        </Link>
      </nav>
    </header>
    <style jsx>{`
         header {
          width: 100%;
          height: 100px;
          border-bottom: 1px solid #eaeaea;
          display: flex;      
          justify-content: center;
          align-items: center;
        }
        nav {
          width: 100%;
          max-width: 1200px;
          font-weight: bold;
          font-size: 1.3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        nav a {
          margin-right: 30px;
          color: rgb(83, 126, 162);
          text-decoration: none;
        }
        nav a:hover {
          text-decoration: underline;
        }

        @media(max-width:500px){
          nav {           
            flex-direction:column;
          }
          header {
            padding-top:1rem;
            padding-bottom: 1rem;
          }
        }
    `}
    </style>
  </>
  )
}