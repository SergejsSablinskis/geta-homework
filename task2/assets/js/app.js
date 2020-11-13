class ApiConnector {
    // http://www.omdbapi.com/?i=tt3896198&apikey=52c2b83
    url = "";
    apiKey = "";
    searchParams = "s=2020";
    fullUrl = "";
    page = 1;
    total = 0;
    pageSize = 10;

    constructor(url = "http://www.omdbapi.com/", apiKey = "52c2b83") {
        this.apiKey = apiKey;
        this.url = url;
        this.setup()
    }

    setup() {
        this.fullUrl = `${this.url}?apiKey=${this.apiKey}&${this.searchParams}&page=${this.page}`;
    }

    fetch(page) {
        if (page) {
            this.page = page;
            this.setup();
        }

        return fetch(this.fullUrl).then(response => response.json()).then((data) => {
            this.total = parseInt(data.totalResults);
            return data;
        });
    }

    setSearchParams(params) {
        this.searchParams = params;
    }

    getMaxPagesCount() {
        return Math.ceil(this.total / this.pageSize);
    }
}

class App {
    apiConnector = new ApiConnector();
    
    container = document.getElementById("main");
    paginatorContainer = document.getElementById("pages");

    preparePageContent(page = null) {
        this.apiConnector.fetch(page).then((response) => {
            console.log("API responded: ", response);
            let currentHtml = "";
            response.Search.forEach(item => {
                currentHtml += this.prepareItemCard(item);
            });
            this.container.innerHTML = currentHtml;
            this.preparePaginator(this.apiConnector.getMaxPagesCount())
        })
    }

    prepareItemCard(item) {
        return `<div class="card">
                    <h3>${item.Title}</h3>
                    ${item.Poster !== "N/A"? '<img src="'+ item.Poster + '"/>' : ''}
                    <p>${item.Type}</p>
                </div>`
    }

    preparePaginator(maxPages) {
        let paginatorHtml = "";
        for(let i = 1; i <= maxPages; i++) {
            paginatorHtml += `<span class="paginator-button" onClick="app.onPageClicked(${i})">${i}</span>`;
        }
        this.paginatorContainer.innerHTML = paginatorHtml;
    }

    onPageClicked(page) {
        this.preparePageContent(page);
    }
}

let app = new App();
app.preparePageContent();