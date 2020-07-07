
export default function Header() {
  return (
    <>
      <footer>
            <div className="myname">Michael Davis</div>
            <div className="websiteLink"> <a href='https://www.michaelwda.com'>michaelwda.com</a></div>
            <div className="currentYear">{new Date().getFullYear()}</div>
      </footer>
      <style jsx>{`
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        footer a {
            margin-right: 10px;
            margin-left: 10px;
        }
        .myname{
        }
        @media(max-width:600px){
          footer {
            flex-direction:column;
          }
        }

      `}</style>
  </>
  )
}