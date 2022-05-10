import React, { PureComponent } from 'react';
import _ from 'lodash';
import Mark from 'mark.js';
import { TRIAGRAM_HIGHLIGHT_PERCENTAGE_THRESHOLD, LIST_OF_QUALIFIERS, UNBOLD_KEYWORDS } from '../../consts';
import nlp from 'compromise'
import ndates from 'compromise-dates'
import nnumbers from 'compromise-numbers'
nlp.extend(ndates)
nlp.extend(nnumbers)

export default class TrigramHighlighter extends PureComponent {
  getLowestCharacterTrigramCounts = (text, trigrams) => {
    const highlightChars = new Array(text.length);
    trigrams.forEach((tri) => {
      const re = new RegExp(tri.words.split('\n').map(_.escapeRegExp).join('[^a-z0-9$]+'), 'ig');

      text.replace(re, (match, index) => {
        for (let i = index; i < index + match.length; i += 1) {
          highlightChars[i] = Math.min(highlightChars[i] || tri.count, tri.count);
        }
        return match;
      });
    });

    return highlightChars;
  }

  getTextWithUnusualPhrasesHighlighted = (text, highlightChars, unHighlightChars, minCount, threshold) => text.split('').map(_.escape).map((c, i) => {
    if (highlightChars[i] === undefined || unHighlightChars[i]) {
      return c;
    }

    const countPercentage = ((highlightChars[i] - minCount) * 100) / (threshold - minCount);
    const highlightValue = countPercentage >= TRIAGRAM_HIGHLIGHT_PERCENTAGE_THRESHOLD ? 255 : Math.round(countPercentage * 2);
    if (highlightValue < 255) return `<span style="background-color: rgb(255,255,${highlightValue});">${c}</span>`;
    return `<span style="background: transparent">${c}</span>`;
  }).join('')

  getHTML(unusualPhrases, text, trigrams) {
    if (!trigrams || !trigrams.length || !text) {
      return { __html: _.escape(text || '') };
    }

    const min = _.minBy(trigrams, 'count').count;
    const { maxCount } = unusualPhrases;
    // eslint-disable-next-line no-mixed-operators
    const threshold = ((unusualPhrases.percentage * (maxCount - min) / 100)) + min;

    const highlightChars = this.getLowestCharacterTrigramCounts(text, trigrams.filter((t) => t.count < threshold));
    const unHighlightChars = this.getLowestCharacterTrigramCounts(text, trigrams.filter((t) => t.count >= threshold));

    return { __html: this.getTextWithUnusualPhrasesHighlighted(text, highlightChars,unHighlightChars, min, threshold) };
  }

  componentDidUpdate() {
   if (document.querySelector('div.PreWrapped.clause-highlight-text')) {
	    const instance = new Mark('div.PreWrapped.clause-highlight-text');
      const clause_text = this.props.text;
      const first_text = clause_text.split(' ')[0];

      const text = nlp(this.props.text)
      const date_array = text.dates().out('array')
      const duration_array = text.durations().out('array')
      const time_array = text.times().out('array')
      let number_array = text.numbers().out('array')
      const money_array = text.money().out('array')

      // Remove the number if it is in the first text
      if (number_array.length >= 1 && number_array[0] ==  first_text){
        number_array.shift()
      }

      // Date 
      instance.mark(date_array, {
        acrossElements: true,
	      separateWordSearch: false,
	      className: 'keyword-bold',
      })
      // Number
      instance.mark(number_array, {
        acrossElements: true,
	      separateWordSearch: false,
	      className: 'keyword-bold',
      })
      // Money
      instance.mark(money_array, {
        acrossElements: true,
	      separateWordSearch: false,
	      className: 'keyword-bold',
      })
      // Time
      instance.mark(time_array, {
        acrossElements: true,
	      separateWordSearch: false,
	      className: 'keyword-bold',
      })
      // Duration
      instance.mark(duration_array, {
        acrossElements: true,
        separateWordSearch: false,
        className: 'keyword-bold',
      })

      // unbold number after keywords
      let keyword_string = UNBOLD_KEYWORDS.join('|');
      const regexstr = '(' + keyword_string + ')+\\s?\\d+(\\.\\d+)?\.?';
      const re = new RegExp(regexstr, 'gmi');

      instance.markRegExp(re, {
        acrossElements: true,
	      separateWordSearch: false,
	      className: 'keyword-normal',
      })

      // bold qualifiers
      instance.mark(LIST_OF_QUALIFIERS, {
        accuracy: "exactly",
        acrossElements: true,
	      separateWordSearch: false,
	      className: 'keyword-bold',
	    });
	  }
  }

  render() {
    const {
      unusualPhrases, text, trigrams, ...rest
    } = this.props;

    return (
      <div
        className="PreWrapped clause-highlight-text"
        dangerouslySetInnerHTML={this.getHTML(unusualPhrases, text, trigrams)}
        {...rest}
      />
    );
  }
}
