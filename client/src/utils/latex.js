import processLatexString from './stringUtils';

/**
 * Creates a Latex SVG from the provided string using `$`s as delmiters.
 *
 * @param {string} inputLatex the input string to generate the rendered latex
 * @returns {SVGElement} the rendered SVG element
 */
const latex2svg = (inputLatex) => {
  // Get the MathJax obect, which is inserted in the `public/index.html` file
  const { MathJax } = window;

  const correctedString = processLatexString(inputLatex);

  // Use the first child because the parent has unneeded extra fluff
  return MathJax.tex2svg(correctedString, { display: true })
    .firstChild;
};

export default latex2svg;
