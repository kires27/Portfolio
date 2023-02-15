const chocos = document.getElementById("chocos");
const project_list = document.getElementById("project-list");
const project_cards = document.getElementById("project-cards");

const url = "https://api.github.com/users/kire27/repos";

fetchJsonData(url, project_list, project_cards);

async function fetchJsonData(jsonUrl, listParent, cardParent) {
    const response = await fetch(jsonUrl);
    const data = await response.json();

    const fileResponse = await fetch("../res/addInfo.json");
    const fileData = await fileResponse.json();

    buildList(data, listParent);
    BuildCards(data, fileData, cardParent);
}

function buildList(data, listParent) {
    if (!data) parentEl.style.display = "none";
    console.log(data);

    chocos.innerText = data.length;

    for (let key in data) {
        let anchor = document.createElement("a");
        Object.assign(anchor, {
            text: data[key].name,
            href: "#" + data[key].name,
        });
        listParent.appendChild(anchor);
    }
}

function BuildCards(data, fileData, cardParent) {
    if (!data) parentEl.style.display = "none";
    // console.log(fileData["Alimeli"]["webpage"]);

    for (let key in data) {
        for (let kez in fileData) {
            if ((data[key].name = fileData[data[key].name])) {
                let name = data[key];
                let webpage = fileData[data[key].name];
                console.log(name);
                let card = `
                <div>
                    <a class="wlink" href="https://www.domath.haam.space">DoMath</a>
                    <a class="githl" href="https://github.com/kire27/basic-math-problem-generator">
                        <img class="githt cat5" src="./res/gh.png" alt="haam">
                    </a>
                </div>
                `;

                cardParent.innerHTML += card;
            }
        }
    }
}
