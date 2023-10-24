/**
 * Implement your converter function here.
 */
const diyOnicConverter = (textContentContainerSelector) => {
  const container = document.querySelector(textContentContainerSelector);
  console.log('Performing bionic reading conversion on:', container);

  // Get all <p> tags in the container and process them.
  const paragraphs = container.querySelectorAll('p');
  paragraphs.forEach((paragraph) => naiveProcessNode(paragraph));
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

// For ease of development, automatically run this on page load
window.addEventListener('load', () => {
  diyOnicConverter('body');
});

// Allow global access so that this can be executed from the console.
window.diyOnicConverter = diyOnicConverter;
