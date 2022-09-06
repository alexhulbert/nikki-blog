import React from 'react';
import PropTypes from 'prop-types';
import { WidgetPreviewContainer } from 'netlify-cms-ui-default';
import { parse, HtmlGenerator } from 'latex.js'

const generator = new HtmlGenerator({ hyphenate: false })
function parseLatex(latex) {
  console.log('PARSING LATEX!!!')
  return parse(latex, { generator }).htmlDocument().documentElement.outerHTML
}

function CodePreview(props) {
  return (
    <WidgetPreviewContainer>
      <div dangerouslySetInnerHTML={{ __html: "<pre>Test!</pre>" }} />
    </WidgetPreviewContainer>
  );
}

CodePreview.propTypes = {
  value: PropTypes.node,
};

export default CodePreview;
