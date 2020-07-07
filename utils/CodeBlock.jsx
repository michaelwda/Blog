import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import a11yDark from '@styles/a11y-dark';

export default class CodeBlock extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  }

  static defaultProps = {
    language: 'null',
  }

  render() {
    const { language, value } = this.props;

    return (
      <SyntaxHighlighter language={language} style={a11yDark}>
        {value}
      </SyntaxHighlighter>
    );
  }
}