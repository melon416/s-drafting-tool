import React, { PureComponent } from 'react';
import DiffMatchPatch from 'diff-match-patch';

const WORD_BOUNDARY_PATTERN = /\W/;

function indexOfWordBoundary(target, startIndex) {
  const n = target.length;
  for (let i = startIndex; i < n; i += 1) {
    if (WORD_BOUNDARY_PATTERN.test(target[i])) {
      return i;
    }
  }
  return -1;
}

function tokenize(text, callback) {
  let wordStart = 0;
  let wordEnd = -1;
  while (wordEnd < text.length - 1) {
    wordEnd = indexOfWordBoundary(text, wordStart);
    if (wordEnd !== -1) {
      if (wordStart !== wordEnd) {
        const word = text.substring(wordStart, wordEnd);
        callback(word);
      }
      const punct = text[wordEnd];
      callback(punct);
      wordStart = wordEnd + 1;
    } else {
      const word = text.substring(wordStart, text.length);
      callback(word);
      wordEnd = text.length;
      break;
    }
  }
}

function diffWordsToChars(text1, text2) {
  const wordArray = [];
  const wordHash = {};

  wordArray[0] = '';

  const diffLinesToWordsMunge = (text) => {
    let chars = '';
    let wordArrayLength = wordArray.length;
    tokenize(text, (word) => {
      // eslint-disable-next-line no-prototype-builtins
      if (wordHash.hasOwnProperty ? wordHash.hasOwnProperty(word)
        : (wordHash[word] !== undefined)) {
        chars += String.fromCharCode(wordHash[word]);
      } else {
        chars += String.fromCharCode(wordArrayLength);
        wordHash[word] = wordArrayLength;
        // eslint-disable-next-line no-plusplus
        wordArray[wordArrayLength++] = word;
      }
    });
    return chars;
  };

  const chars1 = diffLinesToWordsMunge(text1);
  const chars2 = diffLinesToWordsMunge(text2);
  return { chars1, chars2, lineArray: wordArray };
}

function diffWordMode(differ, text1, text2) {
  const { chars1, chars2, lineArray } = diffWordsToChars(text1, text2);
  const diffs = differ.diff_main(chars1, chars2, false);
  // eslint-disable-next-line no-underscore-dangle
  differ.diff_charsToLines_(diffs, lineArray);
  return diffs;
}

function getDiffs(text1, text2, improveReadability) {
  const differ = new DiffMatchPatch();

  if (improveReadability) {
    const diffs = diffWordMode(differ, text1, text2);

    differ.diff_cleanupSemantic(diffs);
    return diffs;
  }
  return differ.diff_main(text1, text2);
}

export default class DiffHighlighter extends PureComponent {
  generateHTMLDiff = (diffs) => diffs.map(([op, text], i) => {
    switch (op) {
      case DiffMatchPatch.DIFF_INSERT:
        return <ins key={i} className="PreWrapped">{text}</ins>;
      case DiffMatchPatch.DIFF_DELETE:
        return <del key={i} className="PreWrapped">{text}</del>;
      case DiffMatchPatch.DIFF_EQUAL:
        return <span key={i} className="PreWrapped">{text}</span>;
      default:
        return null;
    }
  })

  render() {
    const { originalText, text, improveReadability } = this.props;

    if (!originalText || !text) {
      return <div className="PreWrapped">{text}</div>;
    }

    const diffs = getDiffs(originalText.trim(), text.trim(), improveReadability);

    return this.generateHTMLDiff(diffs);
  }
}
