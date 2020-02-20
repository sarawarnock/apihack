'use strict'

const LISTEN = {
    NAME: 'listen',   
    KEY: 'e57ee78b69e946798d7031a2901389f5',
    BASE_URL: 'https://listen-api.listennotes.com/api/v2/search'
};

const NYT = {
    NAME: 'nyt',    
    KEY: 'KLWp52KrvKQrPKPs239XECGJiLHILcRQ',
    BASE_URL: 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
};

const TWITTER = {
    NAME: 'twitter',
    KEY: 'FUDLiha2oOHYKBtRzppQ6NaQV',
    BASE_URL: 'https://api.twitter.com/1.1/search/tweets.json'
};

function formatListenQueryParams() {
    const listenQueryItems = Object.keys(listenParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(listenParams[key])}`)
    return listenQueryItems.join('&');
}

// function formatNytQueryParams() {
//     const nytQueryItems = Object.keys(nytParams)
//     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(nytParams[key])}`)
//     return nytQueryItems.join('&');
// }

// function formatTwitterQueryParams() {
//     const twitterQueryItems = Object.keys(twitterParams)
//     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(twitterParams[key])}`)
//     return twitterQueryItems.join('&');
// }

function getPodcasts(query, maxResults=5) {
    const listenParams = {
        api_key: LISTEN.KEY,
        q: query,
        maxResults
    };

    const listenQueryString = formatListenQueryParams(listenParams);
    const listenURL = LISTEN.BASE_URL + '?' + listenQueryString;


    console.log(listenURL);

    fetch(listenURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
        $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
}

// function getArticles(query, maxResults=10) {
//     const nytParams = {
//         api_key: NYT.KEY,
//         q: query,
//         maxResults
//     }

//     const nytQueryString = formatNytQueryParams(nytParams);
//     const nytURL = NYT.BASE_URL + '?' + nytQueryString;

//     console.log(nytURL);

//     fetch(nytURL)
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         }
//         throw new Error (response.statusText);
//     })
//     .then(responseJson => displayResults(responseJson))
//     .catch(error => {
//         $('#js-error-message').text(`Something went wrong: ${error.message}`);
//     });
// }

// function getTweets(query, maxResults=20) {
//     const twitterParams = {
//         api_key: TWITTER.KEY,
//         q: query,
//         count: maxResults
//     }

//     const twitterQueryString = formatTwitterQueryParams(twitterParams);
//     const twitterURL = TWITTER.BASE_URL + '?' + twitterQueryString;

//     console.log(twitterURL);

//     fetch(twitterURL)
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         }
//         throw new Error (response.statusText);
//     })
//     .then(responseJson => displayResults(responseJson))
//     .catch(error => {
//         $('#js-error-message').text(`Something went wrong: ${error.message}`);
//     });
// }

function displayResults(responseJson) {
    console.log(responseJson);

    $('#nyt-results-list').empty();
    $('#twitter-results-list').empty();
    $('#listen-results-list').empty();

    // for (let i=0; i < responseJson.length; i++) {
    //     $('#nyt-results-list').append(
    //         `<li><<h4>${responseJson[i].headline}</h4>
    //             <h5>${responseJson[i].byline}</h5>
    //             <p>${responseJson[i].multimedia.url}</p>
    //         </li>`
    //     )
    // }

    // for (let i=0; i < responseJson.length; i++) {
    //     $('#twitter-results-list').append(
    //         `<li><h4>${responseJson[i]}</h4>
    //             <h4>
    //         </li>`
    //     )
    // }

    for (let i=0; i < responseJson.length; i++) {
        $('#listen-results-list').append(
            `<li><<h4>${responseJson.results[i].title_highlighted}</h4>
                <h4><${responseJson.results[i].image}</h4>
                <h4><${responseJson.results[i].audio}</h4>
            </li>`
        )
    }

    $('#results').removeClass('hidden');
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const infoInput = $('#js-info').val();
        const maxResults = $('#js-max-results').val();
        getPodcasts(infoInput, maxResults);
        // getArticles(infoInput, maxResults);
        // getTweets(infoInput, maxResults);
    });
}

$(watchForm);