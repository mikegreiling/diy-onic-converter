# diy-onic-converter
Coding challenge to make your own (DIY) “bionic reading converter.”

## Notes:

- The naive initial implementation discards all HTML and operates on
  the string returned by `node.textContent`. I have left it in the
  source, but its usage is commented out.
- The HTML-aware implementation of this function will process the DOM
  tree and generate a queue of replacements for each text node.
  - **NOTE:** This implementation is messier than I would like, but I
    encountered an unexpected issue where utilizing `node.replaceWith`
    on my text nodes would mess up the parent's childNodes iterator
    and the remaining nodes would fail to get processed. By que-ing
    up all of the `replaceWith` actions and performing the replacement
    at the end, I was able to achieve what I needed, but I _normally_
    do not like mutating function props, and the code structure is
    less than ideal.

## Limitations:

- Currently the function does not take into account words that have
  multiple segments in adjacent nodes. For instance:
    ```
    <span style="color: blue;">H</span>ello World!
    ```
  - In this case, ideally, the `H` within the span and `el` within 
    the adjacent text node would be made bold, but currently these
    nodes are treated as separate words.
  - To accomplish this, I may make note of whether the last-processed
    word was less than the length of the highlight range, and note
    whether there exists no whitespace or block-level element between
    them to continue the highlight action across two nodes.

- Currently punctuation and unicode characters are not properly
  recognized. The `μ` symbol, for instance ought to be recognized
  as part of a word, but we're currently naively matching on `/\w+/`

## How to use this:

As per the exercise instructions, run `npm start` and visit
`localhost: 8080`. Open the developer console and run the following:

```
diyOnicConverter('body');
```

### To run this on another arbitrary website:

1. Visit a webpage like [https://en.wikipedia.org/wiki/Aardvark](https://en.wikipedia.org/wiki/Aardvark)
2. Highlight and copy the entire contents of `public/diy-onic-converter.js` into your clipboard.
3. Open the developer console on the webpage.
4. Paste the contents of the diy-onic-converter into the console and hit <kbd>Enter</kbd>.
5. Type `diyOnicConverter('body')` and hit <kbd>Enter</kbd> again.
6. Observe the changes to the website.

I have tested this on several wikipedia articles and it seems to work as expected.
