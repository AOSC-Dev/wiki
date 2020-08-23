// This file is mainly taken from https://github.com/getzola/zola/blob/master/docs/static/search.js

function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

// Taken from mdbook
// The strategy is as follows:
// First, assign a value to each word in the document:
//  Words that correspond to search terms (stemmer aware): 40
//  Normal words: 2
//  First word in a sentence: 8
// Then use a sliding window with a constant number of words and count the
// sum of the values of the words within the window. Then use the window that got the
// maximum sum. If there are multiple maximas, then get the last one.
// Enclose the terms in <b>.
function makeTeaser(body, terms) {
  var TERM_WEIGHT = 40;
  var NORMAL_WORD_WEIGHT = 2;
  var FIRST_WORD_WEIGHT = 8;
  var TEASER_MAX_WORDS = 30;

  var stemmedTerms = terms.map(function (w) {
    return elasticlunr.stemmer(w.toLowerCase());
  });
  var termFound = false;
  var index = 0;
  var weighted = []; // contains elements of ["word", weight, index_in_document]

  // split in sentences, then words
  var sentences = body.toLowerCase().split(". ");

  for (var i in sentences) {
    var words = sentences[i].split(" ");
    var value = FIRST_WORD_WEIGHT;

    for (var j in words) {
      var word = words[j];

      if (word.length > 0) {
        for (var k in stemmedTerms) {
          if (elasticlunr.stemmer(word).startsWith(stemmedTerms[k])) {
            value = TERM_WEIGHT;
            termFound = true;
          }
        }
        weighted.push([word, value, index]);
        value = NORMAL_WORD_WEIGHT;
      }

      index += word.length;
      index += 1;  // ' ' or '.' if last word in sentence
    }

    index += 1;  // because we split at a two-char boundary '. '
  }

  if (weighted.length === 0) {
    return body;
  }

  var windowWeights = [];
  var windowSize = Math.min(weighted.length, TEASER_MAX_WORDS);
  // We add a window with all the weights first
  var curSum = 0;
  for (var i = 0; i < windowSize; i++) {
    curSum += weighted[i][1];
  }
  windowWeights.push(curSum);

  for (var i = 0; i < weighted.length - windowSize; i++) {
    curSum -= weighted[i][1];
    curSum += weighted[i + windowSize][1];
    windowWeights.push(curSum);
  }

  // If we didn't find the term, just pick the first window
  var maxSumIndex = 0;
  if (termFound) {
    var maxFound = 0;
    // backwards
    for (var i = windowWeights.length - 1; i >= 0; i--) {
      if (windowWeights[i] > maxFound) {
        maxFound = windowWeights[i];
        maxSumIndex = i;
      }
    }
  }

  var teaser = [];
  var startIndex = weighted[maxSumIndex][2];
  for (var i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
    var word = weighted[i];
    if (startIndex < word[2]) {
      // missing text from index to start of `word`
      teaser.push(body.substring(startIndex, word[2]));
      startIndex = word[2];
    }

    // add <em/> around search terms
    if (word[1] === TERM_WEIGHT) {
      teaser.push("<b>");
    }
    startIndex = word[2] + word[0].length;
    teaser.push(body.substring(word[2], startIndex));

    if (word[1] === TERM_WEIGHT) {
      teaser.push("</b>");
    }
  }
  teaser.push("…");
  return teaser.join("");
}

function createSearchResult(title, context, href) {
    let item = document.createElement('a')
    item.classList.add("search-result")
    item.href = href
    let title_span = document.createElement('span')
    title_span.classList.add("title")
    title_span.innerHTML = title
    let context_span = document.createElement('span')
    context_span.classList.add('context')
    context_span.innerHTML = context 

    item.appendChild(title_span)
    item.appendChild(context_span)
    return item
}

function searchText(event) {
    // If the box is empty
    if (search_bar.value == "") {
        search_results.innerHTML = ''
        return
    }

    let results = index.search(search_bar.value, options)

    // First remove the old results
    search_results.innerHTML = ''

    if (results.length == 0) {
        let sorry = createSearchResult("Nothing found", "", "#")
        search_results.appendChild(sorry)
        return
    }

    for (const i of results) {
        // First let's get a preview of the first occurence
        let firstIndex = i.doc.body.toLowerCase().search(search_bar.value)
        // Then get some teaser
        let teaser = makeTeaser(i.doc.body, search_bar.value.split(" "))
        // Finally, add new results
        let item = createSearchResult(i.doc.title, teaser, i.ref)
        search_results.appendChild(item)
    }
}

let index = elasticlunr.Index.load(window.searchIndex)
let options = {
    bool: "AND",
    fields: {
        title: {boost: 2},
        body: {boost: 1},
    }
};
let search_bar = document.getElementById("search-bar")
let search_results = document.getElementById("search-results")
search_bar.addEventListener("input", debounce(searchText, 500))
