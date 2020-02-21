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

// const TWITTER = {
//     NAME: 'twitter',
//     KEY: 'FUDLiha2oOHYKBtRzppQ6NaQV',
//     BASE_URL: 'https://api.twitter.com/1.1/search/tweets.json'
// };

function formatListenQueryParams(listenParams) {
    const listenQueryItems = Object.keys(listenParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(listenParams[key])}`)
    return listenQueryItems.join('&');
}

function formatNytQueryParams(nytParams) {
    const nytQueryItems = Object.keys(nytParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(nytParams[key])}`)
    return nytQueryItems.join('&');
}

// function formatTwitterQueryParams(twitterParams) {
//     const twitterQueryItems = Object.keys(twitterParams)
//     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(twitterParams[key])}`)
//     return twitterQueryItems.join('&');
// }

function getPodcasts(query) {
    const listenParams = {
        q: query
    }; 

    const listenQueryString = formatListenQueryParams(listenParams);
    const listenURL = LISTEN.BASE_URL + '?' + listenQueryString;


    console.log(listenURL);

    fetch(listenURL, {
        headers: {
            "X-ListenAPI-Key": 'e57ee78b69e946798d7031a2901389f5'
        },
      })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then(responseJson => displayListenResults(responseJson))
    .catch(error => {
        console.log(error);
        $('#js-error-message').text(`Something went wrong: ${error}`);
    });
}

function getArticles(query) {
    const nytParams = {
        q: query,
        "api-key": NYT.KEY
    }

    const nytQueryString = formatNytQueryParams(nytParams);
    const nytURL = NYT.BASE_URL + '?' + nytQueryString;

    console.log(nytURL);

    fetch(nytURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then(responseJson => displayNytResults(responseJson))
    .catch(error => {
        $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
}

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

function displayListenResults(responseJson) {
    console.log(responseJson);
    $('#listen-results-list').empty();

    for (let i=0; i < responseJson.results.length; i++) {
        $('#listen-results-list').append(
            `<li class="podcast"><h4>${responseJson.results[i].title_highlighted}</h4>
                <img src="${responseJson.results[i].image}" class="pod-img">
                <audio src="${responseJson.results[i].audio}" controls class="pod-audio"></audio>
            </li>`
        )
    }
    $('#results').removeClass('hidden');
}

function displayNytResults(responseJson) {
    console.log(responseJson);
    $('#nyt-results-list').empty();

    for (let i=0; i < responseJson.response.docs.length; i++) {
        $('#nyt-results-list').append(
            `<li class="newspaper"><h4><a href="${responseJson.response.docs[i].web_url}" target="_blank"> ${responseJson.response.docs[i].headline.main}</a></h4>
                <p>${responseJson.response.docs[i].abstract}</p>
            </li>`
        )
    }
    $('#results').removeClass('hidden');
} 

// funciton displayTwitterResults(responseJson) {
    // $('#twitter-results-list').empty();

    // for (let i=0; i < responseJson.length; i++) {
    //     $('#twitter-results-list').append(
    //         `<li><h4>${responseJson[i]}</h4>
    //             <h4>
    //         </li>`
    //     )
    // }

// }


function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const infoInput = $('#js-info').val();
        const maxResults = $('#js-max-results').val();
        getPodcasts(infoInput);
        getArticles(infoInput, maxResults);
        // getTweets(infoInput, maxResults);
    });
}

$(watchForm);