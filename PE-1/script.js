// Simulated search results
const searchResults = [
    {
        title: "Result 1",
        description: "Description for result 1.",
        link: "https://www.example.com/result1"
    },
    {
        title: "Result 2",
        description: "Description for result 2.",
        link: "https://www.example.com/result2"
    },
    {
        title: "Result 3",
        description: "Description for result 3.",
        link: "https://www.example.com/result3"
    }
];

// Get the search query from the URL
const params = new URLSearchParams(window.location.search);
const query = params.get('q');

// Display the search query
document.getElementById('search-query').textContent = `Results for: "${query}"`;

// Get the results container
const resultsContainer = document.getElementById('results-container');

// Check if there are any results
if (searchResults.length > 0) {
    searchResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `<h2><a href="${result.link}" target="_blank">${result.title}</a></h2><p>${result.description}</p>`;
        resultsContainer.appendChild(resultItem);
    });
} else {
    document.getElementById('no-results').classList.remove('hidden');
} c