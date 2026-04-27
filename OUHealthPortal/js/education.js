/* ============================================================
   FILE: education.js
   PURPOSE: Page specific behavior for education.html. Wires
            up the topic search input and the topic category
            cards so that both can filter the article list
            below.
   ============================================================
   Filtering is purely client side. Each article row carries
   its category in a data-topic attribute and its visible
   text is matched against the search term. The two filters
   are AND-combined: an article must match the search term
   AND the active topic to remain visible.
   ============================================================ */


/* ------------------------------------------------------------
   SECTION 1: Element References and Filter State
   ------------------------------------------------------------ */
const searchInput = document.getElementById('topic-search-input');
const topicCards  = document.querySelectorAll('.topic-card');
const articleRows = document.querySelectorAll('.article-row');
const emptyState  = document.getElementById('articles-empty');

/* Active topic filter. The empty string means "all topics". */
let activeTopic = '';


/* ------------------------------------------------------------
   SECTION 2: Topic Card Click Handler
   ------------------------------------------------------------
   Clicking a topic card toggles it as the active filter.
   Clicking the same card a second time clears the filter
   so the user can return to the full article list.
   ------------------------------------------------------------ */
topicCards.forEach(card => {
    card.addEventListener('click', function () {
        const topic = card.dataset.topic;

        if (activeTopic === topic) {
            /* Toggle off if the same card is clicked again. */
            activeTopic = '';
            card.classList.remove('active-topic');
        } else {
            activeTopic = topic;
            topicCards.forEach(c => c.classList.remove('active-topic'));
            card.classList.add('active-topic');
        }

        applyFilters();
    });
});


/* ------------------------------------------------------------
   SECTION 3: Search Input Handler
   ------------------------------------------------------------ */
searchInput.addEventListener('input', applyFilters);


/* ------------------------------------------------------------
   SECTION 4: Combined Filter Application
   ------------------------------------------------------------
   Walks every article row and toggles its hidden attribute
   based on whether it matches both the active topic filter
   and the current search term.
   ------------------------------------------------------------ */
function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    articleRows.forEach(row => {
        const topicMatch  = !activeTopic || (row.dataset.topic === activeTopic);
        const text        = row.textContent.toLowerCase();
        const searchMatch = !term || text.includes(term);

        const matches = topicMatch && searchMatch;
        row.hidden = !matches;
        if (matches) visibleCount++;
    });

    emptyState.hidden = visibleCount > 0;
}