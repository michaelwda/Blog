import Link from 'next/link'

export default function Header() {
  return (
    <>
      <footer>
            Michael Davis - <a href='https://www.michaelwda.com'>michaelwda.com</a> - {new Date().getFullYear()}
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
        footer a {
            margin-right: 10px;
            margin-left: 10px;
        }
      `}</style>
  </>
  )
}