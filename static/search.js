let dict = {
  'zh': {
    'not-found': '找不到相符的内容或信息',
    'try-again': '请输入其他关键字重试。',
    'loading-search': '正在加载搜索索引',
    'plz-wait': '请稍候……',
    'loaded': '搜索索引加载完成',
    'you-can-search': '输入关键字即可搜索。',
    'load-error': '搜索加载失败',
    'check-network': '请刷新后重试。'
  },
  'en': {
    'not-found': 'Nothing found',
    'try-again': 'Try to search again with another keyword.',
    'loading-search': 'Initializing Search',
    'plz-wait': 'Please wait...',
    'loaded': 'Search Initialisation Complete',
    'you-can-search': 'You can type to search now.',
    'load-error': 'Search Initialisation Failed',
    'check-network': 'Please try to refresh the page and try again.'
  }
};

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
  const TERM_WEIGHT = 40;
  const NORMAL_WORD_WEIGHT = 2;
  const FIRST_WORD_WEIGHT = 8;
  const TEASER_MAX_WORDS = 30;

  var stemmedTerms = terms.map(function (w) {
    return window.elasticlunr.stemmer(w.toLowerCase());
  });
  var termFound = false;
  var index = 0;
  var weighted = []; // contains elements of ["word", weight, index_in_document]

  // split in sentences, then words
  var sentences = body.toLowerCase().split('. ');

  for (var i in sentences) {
    var words = sentences[i].split(' ');
    var value = FIRST_WORD_WEIGHT;

    for (var j in words) {
      var word = words[j];

      if (word.length > 0) {
        for (var k in stemmedTerms) {
          if (window.elasticlunr.stemmer(word).startsWith(stemmedTerms[k])) {
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
  for (let i = 0; i < windowSize; i++) {
    curSum += weighted[i][1];
  }
  windowWeights.push(curSum);

  for (let i = 0; i < weighted.length - windowSize; i++) {
    curSum -= weighted[i][1];
    curSum += weighted[i + windowSize][1];
    windowWeights.push(curSum);
  }

  // If we didn't find the term, just pick the first window
  var maxSumIndex = 0;
  if (termFound) {
    var maxFound = 0;
    // backwards
    for (let i = windowWeights.length - 1; i >= 0; i--) {
      if (windowWeights[i] > maxFound) {
        maxFound = windowWeights[i];
        maxSumIndex = i;
      }
    }
  }

  var teaser = [];
  var startIndex = weighted[maxSumIndex][2];
  for (let i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
    let word = weighted[i];
    if (startIndex < word[2]) {
      // missing text from index to start of `word`
      teaser.push(body.substring(startIndex, word[2]));
      startIndex = word[2];
    }

    // add <em/> around search terms
    if (word[1] === TERM_WEIGHT) {
      teaser.push('<b>');
    }
    startIndex = word[2] + word[0].length;
    teaser.push(body.substring(word[2], startIndex));

    if (word[1] === TERM_WEIGHT) {
      teaser.push('</b>');
    }
  }
  teaser.push('…');
  return teaser.join('');
}

function createSearchResult(title, context, href) {
  let item = document.createElement('a');
  item.classList.add('search-result');
  item.href = href;
  let title_span = document.createElement('span');
  title_span.classList.add('title');
  title_span.innerHTML = title;
  let context_span = document.createElement('span');
  context_span.classList.add('context');
  context_span.innerHTML = context; 

  item.appendChild(title_span);
  item.appendChild(context_span);
  return item;
}

function searchText() {
  // If the box is empty
  if (search_bar.value === '') {
    search_results.innerHTML = '';
    return;
  }

  // Then load the index
  let index = window.elasticlunr.Index.load(window.searchIndex);
  // Then do the search
  let results = index.search(search_bar.value, options);

  // First remove the old results
  search_results.innerHTML = '';

  if (results.length === 0) {
    let sorry = createSearchResult(dict[lang]['not-found'], dict[lang]['try-again'], '#');
    search_results.appendChild(sorry);
    return;
  }

  for (const i of results) {
    // Get some teaser
    let teaser = makeTeaser(i.doc.body, search_bar.value.split(' '));
    // Finally, add new results
    let item = createSearchResult(i.doc.title, teaser, i.ref);
    search_results.appendChild(item);
  }
}

let options = {
  bool: 'AND',
  fields: {
    title: {boost: 2},
    body: {boost: 1},
  }
};
let search_bar = document.getElementById('search-bar');
let search_results = document.getElementById('search-results');
// We only supports en by now
// let lang = document.documentElement.lang;
let lang = 'en';
let search_index_loading = false;
search_bar.addEventListener('input', debounce(searchText, 200));
search_bar.addEventListener('focus', () => {
  // If already loading, then do nothing
  if (search_index_loading) {
    return;
  }
    
  // Load searchIndex on demand
  if (!window.searchIndex) {
    let imported = document.createElement('script');
    imported.src = '/search_index.' + lang + '.js';
    document.head.appendChild(imported);
    search_index_loading = true;

    // Wait until searchIndex is loaded
    let pending = createSearchResult(dict[lang]['loading-search'], dict[lang]['plz-wait'], '#');
    search_results.appendChild(pending);

    imported.onload = function() {
      let loaded = createSearchResult(dict[lang]['loaded'], dict[lang]['you-can-search'], '#');
      search_results.innerHTML = '';
      search_results.appendChild(loaded);
      setTimeout(searchText, 1500);
    };

    imported.onerror = function(message) {
      // eslint-disable-next-line no-console
      console.error(message);
      let load_error = createSearchResult(dict[lang]['load-error'], dict[lang]['check-network'], '#');
      search_results.innerHTML = '';
      search_results.appendChild(load_error);
    };

    return;
  }
});
