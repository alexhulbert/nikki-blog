import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ClassNames } from '@emotion/core';
import uuid from 'uuid/v4';
import { debounce } from 'lodash';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import 'codemirror/mode/stex/stex';
import codeMirrorStyles from 'codemirror/lib/codemirror.css';
import materialTheme from 'codemirror/theme/material.css';
import { HtmlGenerator, parse } from 'latex.js'

const generator = new HtmlGenerator({ hyphenate: false })
function compileLatex(latex) {
  const base = window.location.origin + '/latex/'
  generator.reset();
  try {
    return parse(latex || '', { generator }).htmlDocument(base).documentElement.innerHTML;
  } catch (e) {
    console.error(e)
    console.log(latex)
    return "<p>syntax error</p>"
  }
}


const styleString = `
  padding: 0;
`;

export default class CodeControl extends React.Component {
  static propTypes = {
    field: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.node,
    forID: PropTypes.string.isRequired,
    classNameWrapper: PropTypes.string.isRequired,
    widget: PropTypes.object.isRequired,
  };

  state = {
    isActive: false,
    codeMirrorKey: uuid(),
    lastKnownValue: this.props.value ? JSON.parse(this.props.value).latex : '',
  };

  handleChange(newValue) {
    this.setState({ lastKnownValue: newValue });
    console.log('Compiling Latex')
    let html = ''
    try {
      html = compileLatex(newValue)
    } catch (e) {
      console.error('Syntax Error: ' + e)
    }
    this.props.onChange(JSON.stringify({
      latex: newValue, html
    }));
  }

  handleFocus = () => {
    this.props.setActiveStyle();
    this.setActive();
  };

  handleBlur = () => {
    this.setInactive();
    this.props.setInactiveStyle();
  };

  setActive = () => this.setState({ isActive: true });
  setInactive = () => this.setState({ isActive: false });

  render() {
    const { classNameWrapper, forID, isNewEditorComponent } = this.props;
    const { codeMirrorKey, lastKnownValue } = this.state;

    return (
      <ClassNames>
        {({ css, cx }) => (
          <div
            className={cx(
              classNameWrapper,
              css`
                ${codeMirrorStyles};
                ${materialTheme};
                ${styleString};
              `,
            )}
          >
            <ReactCodeMirror
              key={codeMirrorKey}
              id={forID}
              className={css`
                height: 100%;
                border-radius: 0 3px 3px;
                overflow: hidden;

                .CodeMirror {
                  height: auto !important;
                  cursor: text;
                  min-height: 300px;
                }

                .CodeMirror-scroll {
                  min-height: 300px;
                }
              `}
              options={{
                lineNumbers: true,
                extraKeys: {
                  'Shift-Tab': 'indentLess',
                  Tab: 'indentMore'
                },
                theme: 'material',
                mode: 'text/x-stex',
                keyMap: 'default',
                viewportMargin: Infinity,
              }}
              detach={true}
              editorDidMount={cm => {
                this.cm = cm;
                if (isNewEditorComponent) {
                  this.handleFocus();
                }
              }}
              value={lastKnownValue}
              onChange={debounce((editor, data, newValue) => this.handleChange(newValue), 500)}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>
        )}
      </ClassNames>
    );
  }
}
