let setPokemonsCount = 50;

document.addEventListener('DOMContentLoaded', function () {
    loadPokemon();
});

/**
 * Fetches a Pokémon's data from the API.
 *
 * @param {number} count - The Pokémon number to fetch.
 * @returns {Promise<Object>} The Pokémon data.
 */
async function getPokemon(count) {
    let url = `https://pokeapi.co/api/v2/pokemon/${count}`;
    let response = await fetch(url);
    return await response.json();
}

/**
 * Fetches a Pokémon species' data from the API.
 *
 * @param {number} count - The Pokémon species number to fetch.
 * @returns {Promise<Object>} The Pokémon species data.
 */
async function getPokemonSpecies(count) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${count}`;
    let response = await fetch(url);
    return await response.json();
}

/**
 * Loads and displays the initial set of Pokémon.
 */
async function loadPokemon() {
    document.getElementById('loadingScreen').style.display = 'flex';

    for (let count = 1; count <= setPokemonsCount; count++) {
        let pokemon = await getPokemon(count);
        let loadingImageElement = document.getElementById('loadingImage');
        loadingImageElement.src = pokemon['sprites']['other']['home']['front_default'];
        await waitForImageToLoad(loadingImageElement);
        await showPokemon(count);
        checkSpanCount(count);
    }
    document.getElementById('loadingScreen').style.display = 'none';
}

/**
 * Loads and displays additional Pokémon.
 *
 * @param {number} i - The starting index for loading more Pokémon.
 */
async function loadMorePokemons(i) {
    let number = i + 1;
    document.getElementById('loadingScreen').style.display = 'flex';

    for (let count = number; count <= setPokemonsCount; count++) {
        let pokemon = await getPokemon(count);
        let loadingImageElement = document.getElementById('loadingImage');
        loadingImageElement.src = pokemon['sprites']['other']['home']['front_default'];
        await waitForImageToLoad(loadingImageElement);
        await showPokemon(count);
        checkSpanCount(count);
    }
    document.getElementById('loadingScreen').style.display = 'none';
}

/**
 * Triggers the loading of more Pokémon by increasing the count.
 */
function renderMorePokemons() {
    count = setPokemonsCount;
    setPokemonsCount = setPokemonsCount + 50;
    loadMorePokemons(count);
}

/**
 * Waits for an image to fully load.
 *
 * @param {HTMLImageElement} imgElement - The image element to wait for.
 * @returns {Promise<void>} A promise that resolves when the image is loaded.
 */
function waitForImageToLoad(imgElement) {
    return new Promise(function (resolve) {
        imgElement.onload = function () {
            resolve();
        };
    });
}

/**
 * Displays detailed information about a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to show details for.
 */
async function showDetailsFromPokemon(count) {
    document.body.style.cssText = 'overflow: hidden !important; padding-right: 8px !important;';
    await renderDetails(count);
    pokemonTypeDetails(count);
    showStats(count);
    document.getElementById('showDetails').classList.remove('d-none');
}

/**
 * Renders the detailed view for a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to render details for.
 */
async function renderDetails(count) {
    let detailsContent = document.getElementById('showDetails');
    let pokemon = await getPokemon(count);
    let pokemonSpecies = await getPokemonSpecies(count);

    detailsContent.innerHTML = /*html*/`
        <div>${renderArrowLeft(count)}</div>
        <div id="pokeBoxDetails${count}" class="pokeBoxDetails shadowDetails" onclick="stop(event)">
            <div class="contentBoxDetails">
                <div class="namePlusIdBox">
                    <span class="nameDetails">${pokemonSpecies['names'][5]['name']}</span>
                    <span style="margin-top: 5px">#${String(pokemon.id).padStart(3, '0')}</span>
                </div>
                <div id="elementLimit${count}" class="elementBoxDetails">
                </div>
                <img class="pokemonImgDetails" src="${pokemon.sprites.other.home.front_default}">
                <div id="infoBox" class="infoBox">
                    <div class="tabs">
                        <button id="about" class="tab" onclick="showAbout(${count})">About</button>
                        <button id="stats" class="tab" onclick="showStats(${count})">Base Stats</button>
                        <button id="evolution" class="tab" onclick="showShiny(${count})">Shiny</button>
                        <button id="moves" class="tab" onclick="showMoves(${count})">Moves</button>
                        <div class="underline"></div>
                    </div>
                    <div id="statsDiv" class="statsDiv d-none">
                        <div id="statsElements" class="statsElementsBox titleDetails"></div>
                        <div id="statsNumber" class="statsElementsBox"></div>
                        <div id="statsLine" class="statsElementsBox statsLine"></div>
                    </div>
                    <div id="aboutDiv" class="aboutDiv d-none">
                        <div id="titleName" class="statsElementsBox"></div>
                        <div id="infoTxt" class="statsElementsBox"></div>
                    </div>
                    <div id="shinyDiv" class="shinyDivLoad d-none">
                        <div id="loadingScreen2" class="loadingScreen2">
                            <svg class="spinner" width="50px" height="50px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30">
                                </circle>
                            </svg>
                            <img id="loadingImage2">
                        </div>
                        <div id="loadShinyContain" class="loadShinyContain d-none">
                            <div class="imgPlusTitleShiny">
                                <span class="lookTxt">Look Standard</span>
                                <img id="imgDefault" class="imgShinyDiv"></img>
                            </div>
                            <div class="imgPlusTitleShiny">
                                <span class="lookTxt">Look Shiny</span>
                                <img id="imgShiny" class="imgShinyDiv"></img>
                            </div>
                        </div>
                    </div>
                    <div id="movesDiv" class="movesContain"></div>
                    <div id="flavorDiv" class="flavorDiv">
                        <div id="flavorTxt"></div>
                    </div>
                </div>
            </div>
        </div>
        <div>${renderArrowRight(count)}</div>
    `;
}

/**
 * Renders the right arrow button for navigation.
 *
 * @param {number} count - The current Pokémon count.
 * @returns {string} The HTML string for the right arrow button.
 */
function renderArrowRight(count) {
    let isDisabled = count < setPokemonsCount ? '' : 'disabled';
    let arrowRight = /*html*/`
        <button id="rightBtn" class="arrowRight" onclick="goOn(event,${count})" ${isDisabled}>
            <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                <path d="M 14 3.5 L 35 35 L 14 66.5" stroke="black" fill="none" stroke-width="5.25" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
        </button>
    `;

    return arrowRight;
}

/**
 * Renders the left arrow button for navigation.
 *
 * @param {number} count - The current Pokémon count.
 * @returns {string} The HTML string for the left arrow button.
 */
function renderArrowLeft(count) {
    let isDisabled = count === 1 ? 'disabled' : '';
    let arrowLeft = /*html*/`
        <button id="leftBtn" class="arrowLeft" onclick="back(event,${count})" ${isDisabled}>
            <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                <path d="M 56 3.5 L 35 35 L 56 66.5" stroke="black" fill="none" stroke-width="5.25" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
        </button>
    `;
    return arrowLeft;
}

/**
 * Navigates to the next Pokémon's details.
 *
 * @param {Event} event - The event object.
 * @param {number} count - The current Pokémon count.
 */
function goOn(event, count) {
    event.stopPropagation();

    if (count < setPokemonsCount) {
        showDetailsFromPokemon(count + 1);
    }
}

/**
 * Navigates to the previous Pokémon's details.
 *
 * @param {Event} event - The event object.
 * @param {number} count - The current Pokémon count.
 */
function back(event, count) {
    event.stopPropagation();

    if (count <= setPokemonsCount) {
        showDetailsFromPokemon(count - 1);
    }
}

/**
 * Displays the "About" section for a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to show details for.
 */
async function showAbout(count) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${count}`;
    let response = await fetch(url);
    let pokemonSpecies = await response.json();

    activateTabAbout();
    renderTitleNames();
    renderInfoTxt(count);
    resetAbout();
    showFlavor(pokemonSpecies);
}

/**
 * Renders the informational text for a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to render information for.
 */
async function renderInfoTxt(count) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${count}`;
    let response = await fetch(url);
    let pokemonSpecies = await response.json();
    let pokemon = await getPokemon(count);
    let formattedHeight = (pokemon['height'] / 10).toFixed(2) + ' <span style="text-transform: none">cm</span>';
    let formattedWeight = (pokemon['weight'] / 10).toFixed(2) + ' <span style="text-transform: none">kg</span>';

    document.getElementById('infoTxt').innerHTML = /*html*/`
        <span class="textTransform">${pokemon['name']}</span>
        <span class="textTransform">${pokemonSpecies['color']['name']}</span>
        <span class="textTransform">${pokemonSpecies['genera'][7]['genus']}</span>
        <span class="textTransform">${pokemonSpecies['habitat']['name']}</span>
        <span class="textTransform">${formattedHeight}</span>
        <span class="textTransform">${formattedWeight}</span>
    `;
}

/**
 * Renders the titles for the Pokémon details.
 */
function renderTitleNames() {
    document.getElementById('titleName').innerHTML = /*html*/`
    <span class="titleDetails">Name (en):</span>
    <span class="titleDetails">Color:</span>
    <span class="titleDetails">Species:</span>
    <span class="titleDetails">Habitat:</span>
    <span class="titleDetails">Height:</span>
    <span class="titleDetails">Weight:</span>
`;
}

/**
 * Resets the "About" section visibility.
 */
function resetAbout() {
    document.getElementById('statsDiv').classList.add('d-none');
    document.getElementById('shinyDiv').classList.add('d-none');
    document.getElementById('movesDiv').classList.add('d-none');
    document.getElementById('aboutDiv').classList.remove('d-none');
}

/**
 * Displays the flavor text for a specific Pokémon.
 *
 * @param {Object} pokemonSpecies - The Pokémon species data.
 */
function showFlavor(pokemonSpecies) {
    if (pokemonSpecies['flavor_text_entries'] && pokemonSpecies['flavor_text_entries'][81] && pokemonSpecies['flavor_text_entries'][81]['flavor_text']) {
        document.getElementById('flavorTxt').innerHTML = /*html*/`
        <span class="flavorTxt">${pokemonSpecies['flavor_text_entries'][81]['flavor_text']}</span>
    `;
    } else if (pokemonSpecies['flavor_text_entries'] && pokemonSpecies['flavor_text_entries'][71] && pokemonSpecies['flavor_text_entries'][71]['flavor_text']) {
        document.getElementById('flavorTxt').innerHTML = /*html*/`
        <span class="flavorTxt">${pokemonSpecies['flavor_text_entries'][71]['flavor_text']}</span>
    `;
    }
}

/**
 * Displays the stats for a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to show stats for.
 */
async function showStats(count) {
    let pokemonSpecies = await getPokemonSpecies(count);
    let pokemon = await getPokemon(count);

    activateTabStats();
    resetStats();
    showFlavor(pokemonSpecies);

    for (let i = 0; i < pokemon['stats'].length; i++) {
        let stats = pokemon['stats'][i];

        document.getElementById('statsElements').innerHTML +=/*html*/`
            <span>${stats['stat']['name']}</span>
        `;

        document.getElementById('statsNumber').innerHTML +=/*html*/`
            <span>${stats['base_stat']}</span>
        `;

        checkLength(stats);
    }
}

/**
 * Resets the stats section visibility.
 */
function resetStats() {
    document.getElementById('aboutDiv').classList.add('d-none');
    document.getElementById('shinyDiv').classList.add('d-none');
    document.getElementById('movesDiv').classList.add('d-none');
    document.getElementById('statsDiv').classList.remove('d-none');

    document.getElementById('statsElements').innerHTML = '';
    document.getElementById('statsNumber').innerHTML = '';
    document.getElementById('statsLine').innerHTML = '';
}

/**
 * Displays the shiny version of a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to show the shiny version for.
 */
async function showShiny(count) {
    let pokemon = await getPokemon(count);
    let pokemonSpecies = await getPokemonSpecies(count);
    let loadingImageElement = document.getElementById('imgShiny');

    activateTabEvolution();
    resetShiny();
    showFlavor(pokemonSpecies);

    loadingImageElement.src = pokemon['sprites']['other']['home']['front_shiny'];

    await waitForImageToLoad(loadingImageElement);
    document.getElementById('imgDefault').src = `${pokemon['sprites']['other']['home']['front_default']}`;
    document.getElementById('loadingScreen2').classList.add('d-none');
    document.getElementById('loadShinyContain').classList.remove('d-none');
    document.getElementById('shinyDiv').classList.remove('shinyDivLoad');
    document.getElementById('shinyDiv').classList.add('shinyDiv');
}

/**
 * Resets the shiny section visibility.
 */
function resetShiny() {
    document.getElementById('statsDiv').classList.add('d-none');
    document.getElementById('aboutDiv').classList.add('d-none');
    document.getElementById('movesDiv').classList.add('d-none');
    document.getElementById('shinyDiv').classList.remove('d-none');
}

/**
 * Displays the moves for a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to show moves for.
 */
async function showMoves(count) {
    let pokemon = await getPokemon(count);
    let pokemonSpecies = await getPokemonSpecies(count);

    activateTabMoves();
    resetMoves();
    showFlavor(pokemonSpecies);

    for (i = 0; i < pokemon.moves.length; i++) {

        document.getElementById('movesDiv').innerHTML += /*html*/`
            <span class="moveTxt">${pokemon['moves'][i]['move']['name']}</span>
        `;
    }
}

/**
 * Resets the moves section visibility.
 */
function resetMoves() {
    document.getElementById('aboutDiv').classList.add('d-none');
    document.getElementById('shinyDiv').classList.add('d-none');
    document.getElementById('statsDiv').classList.add('d-none');
    document.getElementById('movesDiv').classList.remove('d-none');
}

/**
 * Checks the length of the stats and updates the progress bar.
 *
 * @param {Object} stats - The stats object of a Pokémon.
 */
function checkLength(stats) {
    checkHigher50(stats);
    checkLower50(stats);
    check50(stats);
}

/**
 * Checks if the stats are higher than 50 and updates the progress bar.
 *
 * @param {Object} stats - The stats object of a Pokémon.
 */
function checkHigher50(stats) {
    if (stats['base_stat'] < 50) {
        document.getElementById('statsLine').innerHTML +=/*html*/`
            <div class="progressBar">
                <div style="height: 100%; background-color: #e03c3c; width:${stats['base_stat']}%;"></div>
            </div>
        `;
    }
}

/**
 * Checks if the stats are lower than 50 and updates the progress bar.
 *
 * @param {Object} stats - The stats object of a Pokémon.
 */
function checkLower50(stats) {
    if (stats['base_stat'] > 50) {
        document.getElementById('statsLine').innerHTML +=/*html*/`
            <div class="progressBar">
                <div style="height: 100%; background-color: #4caf50; width:${stats['base_stat']}%;"></div>
            </div>
        `;
    }
}

/**
 * Checks if the stats are equal to 50 and updates the progress bar.
 *
 * @param {Object} stats - The stats object of a Pokémon.
 */
function check50(stats) {
    if (stats['base_stat'] === 50) {
        document.getElementById('statsLine').innerHTML +=/*html*/`
            <div class="progressBar">
                <div style="height: 100%; background-color: #d38e28; width:${stats['base_stat']}%;"></div>
            </div>
        `;
    }
}

/**
 * Activates the "About" tab.
 */
function activateTabAbout() {
    let tab = document.getElementById('about');
    let underline = document.querySelector('.underline');

    underline.style.width = `${tab.offsetWidth * 0.8}px`;
    underline.style.left = `${tab.offsetLeft + (tab.offsetWidth * 0.1)}px`;
}

/**
 * Activates the "Stats" tab.
 */
function activateTabStats() {
    let tab = document.getElementById('stats');
    let underline = document.querySelector('.underline');

    underline.style.width = `${tab.offsetWidth * 0.8}px`;
    underline.style.left = `${tab.offsetLeft + (tab.offsetWidth * 0.1)}px`;
}

/**
 * Activates the "Evolution" tab.
 */
function activateTabEvolution() {
    let tab = document.getElementById('evolution');
    let underline = document.querySelector('.underline');

    underline.style.width = `${tab.offsetWidth * 0.8}px`;
    underline.style.left = `${tab.offsetLeft + (tab.offsetWidth * 0.1)}px`;
}

/**
 * Activates the "Moves" tab.
 */
function activateTabMoves() {
    let tab = document.getElementById('moves');
    let underline = document.querySelector('.underline');

    underline.style.width = `${tab.offsetWidth * 0.8}px`;
    underline.style.left = `${tab.offsetLeft + (tab.offsetWidth * 0.1)}px`;
}

/**
 * Displays a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to show.
 */
async function showPokemon(count) {
    let pokemon = await getPokemon(count);
    let pokemonSpecies = await getPokemonSpecies(count);
    let content = document.getElementById('content');

    content.innerHTML += /*html*/`
        <div id="pokeBox${count}" onclick="showDetailsFromPokemon(${count})" class="pokeBox shadow">
            <div class="contentBox">
                <span class="h2">${pokemonSpecies['names'][5]['name']}</span>
                <div id="elementLimit${count}" class="elementBox justifyCenter">
                </div>
                <img class="pokemonImg" src="${pokemon['sprites']['other']['home']['front_default']}">
            </div>
        </div>
    `;
    pokemonType(count);
}

/**
 * Displays the type(s) of a specific Pokémon.
 *
 * @param {number} count - The Pokémon number to show type(s) for.
 */
async function pokemonType(count) {
    let pokemon = await getPokemon(count);

    for (let j = 0; j < pokemon['types'].length; j++) {
        document.getElementById(`elementLimit${count}`).innerHTML +=/*html*/`
            <span class="elementTxt">${pokemon['types'][j]['type']['name']}</span>
        `;
        document.getElementById(`pokeBox${count}`).classList.add(`${pokemon['types'][0]['type']['name']}`);
    }
}

/**
 * Displays the type(s) of a specific Pokémon in the details view.
 *
 * @param {number} count - The Pokémon number to show type(s) for.
 */
async function pokemonTypeDetails(count) {
    let pokemon = await getPokemon(count);

    for (let j = 0; j < pokemon['types'].length; j++) {
        document.getElementById(`elementLimit${count}`).innerHTML +=/*html*/`
            <span class="elementTxt">${pokemon['types'][j]['type']['name']}</span>
        `;
        document.getElementById(`pokeBoxDetails${count}`).classList.add(`${pokemon['types'][0]['type']['name']}Details`);
    }
}

/**
 * Handles the key down event for searching Pokémon.
 */
function handleKeyDown() {
    let value = document.getElementById('searchPokemon').value.toLowerCase();

    for (let count = 0; count <= setPokemonsCount; count++) {
        let pokemonBox = document.getElementById(`pokeBox${count}`);
        if (!pokemonBox) continue;
        let h2Element = pokemonBox.querySelector('.h2');
        if (!h2Element) continue;
        let pokemonName = h2Element.textContent.toLowerCase();
        if (pokemonName.includes(value)) {
            pokemonBox.style.display = '';
        } else {
            pokemonBox.style.display = 'none';
        }
    }
}

/**
 * Checks the number of type elements and updates the layout.
 *
 * @param {number} i - The Pokémon number to check.
 */
function checkSpanCount(i) {
    const elementBox = document.getElementById(`elementLimit${i}`);
    const spanCount = elementBox.querySelectorAll('.elementTxt').length;

    if (spanCount > 3) {
        elementBox.classList.remove('justifyCenter');
        elementBox.classList.add('scroll');
    } else {
        elementBox.classList.add('justifyCenter');
        elementBox.classList.remove('scroll');
    }
}

/**
 * Stops event propagation.
 *
 * @param {Event} event - The event object.
 */
function stop(event) {
    event.stopPropagation();
}

/**
 * Hides the Pokémon details view.
 */
function removeDetails() {
    document.getElementById('showDetails').classList.add('d-none');
    document.body.style.cssText = 'overflow: auto !important;';
}