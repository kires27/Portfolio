const amount = document.getElementById("amount");
const project_list = document.getElementById("project-list");
const project_cards = document.getElementById("project-cards");
const footer = document.getElementById("footerC");

const arr_left = document.getElementById("arr-left");
const arr_right = document.getElementById("arr-right");
const arr_top = document.getElementById("arr-top");

const filter = document.getElementById("list-filter")

const url = "https://api.github.com/users/kires27/repos";

// TODO scroll project_cards when side buttons are held

console.log(
    window.innerWidth
);

project_list.onclick = (e) => {
    const name = e.target.innerHTML;
    const object = document.getElementById(name);
    const orgProp = "none";

    if(!object) return;

    object.style.boxShadow = "inset 0 0 1.5px 2px rgb(0, 35, 190)";
    object.style.transitionDuration = "1s"
    
    setTimeout(() => {
        object.style.boxShadow = orgProp;
    }, 1500);
}

arr_top.onclick = () => {
    window.scroll(0, -window.scrollY);
}

arr_left.onclick = () => {
    project_cards.scrollBy(-285, 0);
}

arr_right.onclick = () => {
    project_cards.scrollBy(285, 0);
}

window.onresize = () => {
    if(window.innerWidth < 700) project_cards.scroll(0, 0);
}  

footer.innerText = `© ${new Date().getFullYear()} kkire apps`;

fetchJsonData(url, project_list, project_cards);

filter.oninput = () => {
    filterCards(filter.value, project_cards);
}

function filterCards(filter, project_cards) {
    const tags = project_cards.querySelectorAll('[class=card-languages]')
    const allTags = project_cards.querySelectorAll('[id=clg]')
    const filterLow = filter.toLowerCase();

    let allLanguages = [];

    // get all languages into allLanguages array
    for (let lg of allTags) {
        if (!allLanguages.includes(lg.innerText.toLowerCase())) 
            allLanguages.push(lg.innerText.toLowerCase());
    }

    for (let tag=0; tag<tags.length; tag++) {

        // check if the allLanguages contains word from input
        if (!allLanguages.includes(filterLow)) {
            (project_cards.children[tag]).classList.remove("filtered")
            continue
        };
        
        let languages = [];

        // get card languages into array
        for (let lg=0; lg<tags[tag].children.length; lg++) {
            languages.push(
                tags[tag].children[lg].innerText.toLowerCase()
            )
        }

        if(!(languages.includes(filterLow))) {
            (project_cards.children[tag]).classList.add("filtered")
        } else {
            (project_cards.children[tag]).classList.remove("filtered")
        }
    }

}

async function fetchJsonData(jsonUrl, listParent, cardParent) {
    const response = await fetch(jsonUrl);
    const data = await response.json();

    BuildSkeletonCard(data.length, cardParent);
    BuildList(data, listParent);
    BuildCards(data);
}

function BuildList(data, listParent) {
    if (!data) {
        listParent.innerText = "Data not found!";
        return;
    }
    console.log(data);

    amount.innerText = data.length;

    for (let key in data) {
        let anchor = document.createElement("a");
        let hr = document.createElement("hr");

        Object.assign(anchor, {
            text: data[key].name,
            href: "#" + data[key].name,
        });
        listParent.appendChild(anchor);
    }
}

async function BuildCards(data) {
    if (!data) return;

    for (let key in data) {
        const rel_res = await fetch(data[key]["releases_url"].slice(0, -5));
        const rel_data = await rel_res.json();

        const lan_res = await fetch(data[key]["languages_url"]);
        const lan_data = await lan_res.json();

        let xData = {
            name: data[key]["name"],
            size: Math.round((data[key]["size"]/1024)*10)/10,
            homepage: data[key]["homepage"],
            created: String(new Date(data[key]["created_at"])).split(" "),
            html: data[key]["html_url"],
            description: data[key]["description"],
            topics: "",
            releases: rel_data[0]?.name == undefined ? "none" : rel_data[0]?.name,
            languages: "",
        };

        for (let topic in data[key]["topics"]) {
            xData.topics += `<span>${data[key]["topics"][topic]}</span>`;
        }

        for (let [key, value] of Object.entries(lan_data)) {
            xData.languages += `<span id="clg">${key}</span>`;
        }

        let card = `
        <div id="${xData.name}" class="card">
            <div class="card-source">
                <a ${xData.homepage ? `href="${xData.homepage}"` : ""} 
                    class="card-name">${xData.name}</a>
                
                    <a href="${xData.html}">
                    <img src="./res/icons/github.svg" alt="haam">
                </a>   
            </div>
            
            <div class="card-created">
                <div>
                    ${xData.created[2]}. ${xData.created[1]} ${xData.created[3]}
                </div>
                
                <div class="card-releases">
                    <div>release: ${xData.releases}</div>
                    <div class="card-size">${xData.size}MB</div>
                </div>
            </div>

            <div class="card-description">${xData.description}</div>
            <div class="card-languages">${xData.languages}</div>
            <div class="card-topics">${xData.topics}</div>
        </div>
        `;

        document.getElementById(`skeleton${Number(key)}`)
        .replaceWith(stringToHTML(card));
    }
}

function BuildSkeletonCard(amount, cardParent) {
    for(let i=0; i<amount; i++) {
        cardParent.innerHTML += `
            <div id="skeleton${i}" class="skeleton-card">
                <div class="skelet1"></div>
                <div class="skelet2"></div>
                <div class="skelet3"></div>
            </div>
        `
    }
}

const stringToHTML = (str) => {
	var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body.firstChild;
};
