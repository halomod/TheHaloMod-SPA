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
