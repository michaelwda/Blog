import css from 'styled-jsx/css'

export default css.global
`
     
    html,
    body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
        sans-serif;
    color: #445566;
    }
    
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
     font-weight: bold;
    }

    h1 {
        font-size: 3rem;
    }
    h2 {
        font-size: 2rem;
    }
    h3 {
        font-size: 1.5rem;
    }

    a {
        color: #00a395;
    }
    .content {
        padding: 2rem 20px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
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
    
`