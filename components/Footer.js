import Link from 'next/link'

export default function Header() {
  return (
    <>
      <footer>
            Michael Davis {new Date().getFullYear()}
      </footer>
      <style jsx>{`
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
            padding: 0 5px;
            height: 1rem;
        }
      `}</style>
  </>
  )
}