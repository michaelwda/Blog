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
        font-size: 1.2rem;
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
        font-size: 2rem;
    }
    h2 {
        font-size: 1.5rem;
    }
    h3 {
        font-size: 1rem;
    }

    a {
        color: rgb(83, 126, 162);
    }
    .content {
        padding: 1rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .title {
        font-size: 2rem;
        margin: 0;
    }
    .subtitle {
    font-size: 1rem;
    font-style: italic;
    margin:0;
    padding: 0;
    }

`