/**
 * Implement your converter function here.
 */
const diyOnicConverter = (textContentContainerSelector) => {
  const container = document.querySelector(textContentContainerSelector);
  console.log('Performing bionic reading conversion on:', container);

  // Get all <p> tags in the container and process them.
  const paragraphs = container.querySelectorAll('p');

  // Naive implementation
  // paragraphs.forEach((paragraph) => naiveProcessNode(paragraph));

  // HTML-aware implementation
  const replacementQueue = [];
  paragraphs.forEach((paragraph) => processNode(paragraph, replacementQueue));

  // This is convoluted, but I found that if I replaced the text
  // nodes as I encountered them within processNode, the iterator
  // would break. So instead, I collect all the text nodes that need
  // to be replaced and perform the replacement action after parsing
  // the entire tree.
  replacementQueue.forEach(([node, replacement]) =>
    node.replaceWith(...replacement)
  );
};

/**
 * Initial naive implementation. Ignores HTML tags and just processes
 * words from node.textContent
 */
const naiveProcessNode = (node) => {
  const words = node.textContent.split(/\s+/);
  node.innerHTML = words.map((word) => naiveProcessWord(word)).join(' ');
};

/**
 * Takes a string and returns HTML string which highlights the first
 * three characters
 */
const naiveProcessWord = (word, highlightChars = 3) => {
  const toHighlight = word.slice(0, highlightChars);
  const theRest = word.slice(highlightChars);
  return `<span class='bonic-word' style='font-weight: bold;'>${toHighlight}</span>${theRest}`;
};

/**
 * More sophisticated implementation. Attempts to preserve HTML tags
 * and surrounding whitespace
 */
const processNode = (node, replacementQueue) => {
  if (node.nodeType === Node.TEXT_NODE) {
    replacementQueue.push([node, processTextNode(node)]);
  } else if (node.childNodes.length > 0) {
    node.childNodes.forEach((child) => processNode(child, replacementQueue));
  }
};

/**
 * Takes in a text node, finds the words, replaces them with
 * highlighted versions, and returns values compatible with
 * `Element.replaceWith`.
 *
 * Returns an array of DOM nodes or strings that will replace the
 * content.
 */
const processTextNode = (node, highlightChars = 3) => {
  const wordSegments = node.textContent.split(/(\w+)/);

  return wordSegments.reduce((processed, segment) => {
    // return whitespace as-is
    if (!segment.match(/\w+/)) {
      processed.push(segment);
    } else {
      const toHighlight = segment.slice(0, highlightChars);
      const theRest = segment.slice(highlightChars);
      processed.push(wrapHighlightedSegment(toHighlight), theRest);
    }
    return processed;
  }, []);
};

/**
 * Takes a string and wraps it in a span with stylings that will make
 * the content bold.
 */
const wrapHighlightedSegment = (segment) => {
  const span = document.createElement('span');
  span.classList.add('bonic-word-segment');
  span.style.fontWeight = 'bold';
  span.textContent = segment;
  return span;
};

// For ease of development, automatically run this on page load
// window.addEventListener('load', () => {
//   // diyOnicConverter('.test-content');
//   diyOnicConverter('body');
// });

// Allow global access so that this can be executed from the console.
window.diyOnicConverter = diyOnicConverter;
