const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Language toggler elements
const languageToggler = document.getElementById("language-toggler");
const body = document.body;

// Theme toggler elements
const themeToggler = document.getElementById("theme-toggler");

async function searchWikipedia(query, language) {
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `https://${language}.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error("Failed to fetch search results from Wikipedia API.");
  }

  const json = await response.json();
  return json;
}

function displayResults(results, language) {
  // Remove the loading spinner
  searchResults.innerHTML = "";

  results.forEach((result) => {
    const url = `https://${language}.wikipedia.org/?curid=${result.pageid}`;
    const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title} </a>`;
    const urlLink = `<a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>`;

    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `
        <h3 class="result-title">${titleLink}</h3>
        ${urlLink}
        <p class="result-snippet">${result.snippet}</p>
        `;

    searchResults.appendChild(resultItem);
  });
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "<p>Please enter a valid search term.</p>";
    return;
  }

  searchResults.innerHTML = "<div class='spinner'>Loading...</div>";

  try {
    const language = body.classList.contains("english") ? "en" : "tr";
    const results = await searchWikipedia(query, language);

    if (results.query.searchinfo.totalhits === 0) {
      searchResults.innerHTML = "<p>No results found.</p>";
    } else {
      displayResults(results.query.search, language);
    }
  } catch (error) {
    console.error(error);
    searchResults.innerHTML = "<p>An error occurred while searching. Please try again later.</p>";
  }
});

// Event listener for the theme toggler
themeToggler.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  if (body.classList.contains("dark-theme")) {
    themeToggler.textContent = "Dark";
    themeToggler.style.background = "#fff";
    themeToggler.style.color = "#333";
  } else {
    themeToggler.textContent = "Light";
    themeToggler.style.border = "2px solid #ccc";
    themeToggler.style.color = "#333";
  }
});

// Event listener for the language toggler
languageToggler.addEventListener("click", () => {
  body.classList.toggle("english");
  if (body.classList.contains("english")) {
    languageToggler.textContent = "Switch to Turkish";
  } else {
    languageToggler.textContent = "Switch to English";
  }
});
