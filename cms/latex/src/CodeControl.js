import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ClassNames } from '@emotion/core';
import { Map } from 'immutable';
import { uniq, isEqual, isEmpty } from 'lodash';
import uuid from 'uuid/v4';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import CodeMirror from 'codemirror';
import 'codemirror/mode/stex/stex';
import codeMirrorStyles from 'codemirror/lib/codemirror.css';
import materialTheme from 'codemirror/theme/material.css';

// TODO: relocate as a utility function
function getChangedProps(previous, next, keys) {
  const propNames = keys || uniq(Object.keys(previous), Object.keys(next));
  const changedProps = propNames.reduce((acc, prop) => {
    if (previous[prop] !== next[prop]) {
      acc[prop] = next[prop];
    }
    return acc;
  }, {});
  if (!isEmpty(changedProps)) {
    return changedProps;
  }
}

const styleString = `
  padding: 0;
`;

function valueToOption(val) {
  if (typeof val === 'string') {
    return { value: val, label: val };
  }
  return { value: val.name, label: val.label || val.name };
}

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
    lastKnownValue: this.props.value,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.state, nextState) || this.props.classNameWrapper !== nextProps.classNameWrapper
    );
  }

  getKeyMapOptions = () => {
    return Object.keys(CodeMirror.keyMap)
      .sort()
      .filter(keyMap => ['emacs', 'vim', 'sublime', 'default'].includes(keyMap))
      .map(keyMap => ({ value: keyMap, label: keyMap }));
  };

  handleChange(newValue) {
    this.setState({ lastKnownValue: newValue });
    this.props.onChange(newValue);
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
              onChange={(editor, data, newValue) => this.handleChange(newValue)}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>
        )}
      </ClassNames>
    );
  }
}
