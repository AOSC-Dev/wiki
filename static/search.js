let index = elasticlunr.Index.load(window.searchIndex)

let options = {
    bool: "AND",
    fields: {
        title: {boost: 2},
        body: {boost: 1},
    }
};

//var results = index.search("ciel", options)

const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

let search_bar = document.getElementById("search-bar")
let search_results = document.getElementById("search-results")
search_bar.addEventListener("input", debounce(searchText, 500))

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
    let results = index.search(search_bar.value, options)
    console.log(results.length)

    // First remove the old results
    search_results.innerHTML = ''
    if (search_bar.value == "") {
        // Do nothing
        return
    }
    if (results.length == 0) {
        let sorry = createSearchResult("Nothing found", "", "#")
        search_results.appendChild(sorry)
        return
    }

    for (const i of results) {
        // Then add new results
        let item = createSearchResult(i.doc.title, 'blah', i.ref)
        search_results.appendChild(item)
    }
}
