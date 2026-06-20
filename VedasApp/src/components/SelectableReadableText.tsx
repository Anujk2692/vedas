import React, {useCallback, useRef} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import {useTextTranslate} from '../context/TextTranslateContext';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
}

export function SelectableReadableText({text, style}: Props) {
  const {setSelectedText} = useTextTranslate();
  const lastSelection = useRef('');

  const handleSelectionChange = useCallback(
    (event: {nativeEvent: {selection: {start: number; end: number}}}) => {
      const {start, end} = event.nativeEvent.selection;
      if (end > start) {
        const selected = text.slice(start, end).trim();
        if (selected.length >= 2) {
          lastSelection.current = selected;
          setSelectedText(selected);
        }
      }
    },
    [setSelectedText, text],
  );

  return (
    <TextInput
      value={text}
      editable={false}
      multiline
      scrollEnabled={false}
      selectTextOnFocus={false}
      showSoftInputOnFocus={false}
      caretHidden
      contextMenuHidden={false}
      onSelectionChange={handleSelectionChange}
      style={[styles.base, Platform.OS === 'android' && styles.android, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: undefined,
  },
  android: {
    textAlignVertical: 'top',
  },
});
