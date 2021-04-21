/**
 * Processes a latex string from the server into something that MathJax
 * will happily accept 😁.
 *
 * @param {string} string the string to turn into a proper latex string
 * which can be processed
 * @returns {string} the output string to be provided to MathJax
 */
export default function processLatexString(rawLatex) {
  return rawLatex
    .trim()
    .split(/\$/g)
    .reduce((label, string, index) => {
      if (index % 2 === 0) {
        return `${label}\\textrm{${string}}`;
      }
      return label + string;
      // Uses an empty string as the second argument to reduce so that it uses
      // that as the starting point instead of the first array value.
    }, '');
}

/**
 * Strings that correspond directly to some converted value in HTML. Currently
 * these are written in-order, so once one is found, it will convert it and
 * continue. This is important because the word "beta" contains "eta" for
 * example.
 */
const directHTMLConversionStrings = {
  alpha: 'α',
  beta: 'β',
  delta: 'δ',
  gamma: 'γ',
  phi: 'φ',
  eta: 'η',
};

/**
 * Gets an auto-generated HTML title from a parameter key, or null if no
 * conversion should take place. This should be overwritten by what is in
 * `parameter_properties.js` if a plain name or HTML name exists already by
 * whatever function uses this function.
 *
 * @param {string} parameterKey the key of the parameter to auto-generate an
 * HTML string for
 * @returns {string | null} the html string or null if no html string should
 * be generated
 */
export function getHtmlFromKey(parameterKey) {
  let returnString = parameterKey;
  let generated = false;

  const subScriptRegex = /^[a-zA-Z0-9]+_[a-zA-Z0-9]+$/;
  if (subScriptRegex.test(returnString)) {
    generated = true;
    returnString = `${returnString.replace('_', '<sub>')}</sub>`;
  }

  Object.entries(directHTMLConversionStrings).forEach(([matchString, convertedString]) => {
    if (parameterKey.includes(matchString)) {
      generated = true;
      returnString = returnString.replace(matchString, convertedString);
    }
  });

  if (generated) {
    return returnString;
  }
  return null;
}
