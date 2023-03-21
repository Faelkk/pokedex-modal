const modalWindow = document.querySelector(".modal-window");
const imagemPoke = document.querySelector(".imagem-poke");
const pokemonSobre = document.querySelector(".pokemon-sobre");
const nomePokemon = document.querySelector(".modal-title");
const modalOverlay = document.querySelector(".modal-overlay");
const fecharButton = document.querySelector(".modal-close-button");
const containerSvg = document.querySelector(".container-svg");
const peso = document.querySelector(".peso");
const altura = document.querySelector(".altura");
const hpDiv = document.querySelector(".hp");
const attackDiv = document.querySelector(".attack");
const dfDiv = document.querySelector(".defense");
const spAtkDiv = document.querySelector(".spc-atk");
const SpdefDiv = document.querySelector(".sp-def");
const speedDiv = document.querySelector(".speed");
const spanHp = document.createElement("span");
const spanAtk = document.createElement("span");
const spanDef = document.createElement("span");
const spanSpatk = document.createElement("span");
const spanSpDef = document.createElement("span");
const spanSpeed = document.createElement("span");
const mensagem1 = document.querySelector(".mensagem-poke1");
const mensagem2 = document.querySelector(".mensagem-poke2");
const mensagem3 = document.querySelector(".mensagem-poke3");
const mensagem4 = document.querySelector(".mensagem-poke4");
const mensagem5 = document.querySelector(".mensagem-poke5");
const mensagem6 = document.querySelector(".mensagem-poke6");
const containerPoke = document.querySelector(".container-poke");
const statusContainer = document.querySelector(".status-container");
const abilityName = document.querySelector(".habilidades-name");
const form = document.querySelector(".container-input");
const formValor = form.elements["input"];
const h2Container = document.querySelector(".h2-container");
const typeContainer = document.querySelector(".container-types");
const containerBack = document.querySelector(".container-back");
const imgCatch = document.querySelector(".img-catch");
const containerErro = document.querySelector(".catch-erro");
const quadradoErro = document.querySelector(".catch-quadrado");
const searchSide = document.querySelector(".search-side");
const catchSpan = document.querySelector(".catch-span");
const left = document.querySelector(".left");
const perPage = 20;
const btnContainer = document.querySelector(".btn-cont");
const typesTotal = document.querySelector(".types-search");

import { consts } from "./contantes.js";
import { constsAfterSearchPoke } from "./contantes.js";
import { constDoCards } from "./contantes.js";

let fetchdata = [];
let result;
let currentPage = 1;
let PokeThatIWillSearch;
let timeoutId;

async function SearchName() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`;
  const renpose = await fetch(url).then((response) => response.json());
  result = renpose.results.map((pokemon) => pokemon.name);
}

async function fetchPokemon() {
  const offset = (currentPage - 1) * perPage;
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${perPage}&offset=${offset}`;

  const response = await fetch(url).then((response) => response.json());

  const promisses = response.results.map(
    async (urls) => await fetch(urls.url).then((res) => res.json())
  );
  const result = await Promise.all(promisses);
  fetchdata = [...fetchdata, ...result];
  result.forEach((pokemon) => {
    const li = doCards(pokemon);
    consts.pokedex.appendChild(li);
  });
}
function pokemonType(pokemonType) {
  const tiponomes = pokemonType.map((type) => type.type.name);
  const tipoClass = tiponomes[0];
  return tipoClass;
}

form.addEventListener("submit", PegarValue);
function PegarValue(event) {
  event.preventDefault();
  clearTimeout(timeoutId);
  if (formValor.value.length >= 1) {
    PokeThatIWillSearch = formValor.value.toLowerCase();

    async function fetchAfterSearch() {
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${PokeThatIWillSearch}`;
        const urlObj = new URL(url);
        const caminho = urlObj.pathname;
        console.log(caminho);
        const response = await fetch(url).then((response) => response.json());

        const containerTotal1 = document.querySelector(".container-total");
        const typeSearch = document.querySelector(".types-search");
        const btnCont = document.querySelector(".btn-cont");
        left.style.display = "blockw";
        searchSide.classList.add("active");
        searchSide.style.width = "80%%";
        searchSide.style.height = "100%";
        containerErro.style.height = 0;
        catchSpan.style.width = 0;
        catchSpan.textContent = "";
        quadradoErro.classList.remove("active");
        consts.containerSearch.style.height = "100%";

        const abilities = response.abilities.map(
          (ability) => ability.ability.name
        );
        const totalNames = document.querySelector(".container-total");
        const h1Name = document.querySelector(".namePoke");
        const name = response.name;
        h1Name.innerHTML = name;
        const h1Number = document.querySelector(".numberPoke");
        const number = response.id + ".";
        h1Number.innerHTML = number;
        const weight = response.weight;
        const height = response.height;

        typesTotal.innerHTML = "";
        const types = response.types.map((type) => type.type.name);
        types.map((item) => {
          const p = document.createElement("p");
          p.innerHTML = item;
          p.className = `paragrafo-search ${p.textContent} `;
          typesTotal.append(p);
        });
        totalNames.innerHTML = `${h1Number.outerHTML}  ${h1Name.outerHTML} `;
        const img = response.sprites.other.home.front_default;
        consts.imgSearch.src = img;
        const firstType = response.types[0].type.name;
        const btnOpenModal = document.createElement("button");
        btnOpenModal.textContent = "Mais Detalhes";
        btnOpenModal.className = `btn-openModal ${firstType}`;
        btnContainer.innerHTML = btnOpenModal.outerHTML;

        const btnOpenEventListener = document.querySelector(".btn-openModal");
        btnOpenEventListener.addEventListener("click", openModalInformation);
        function openModalInformation() {
          modalInformation.style.display = "block";
          consts.windowImgPoke.src = img;
          const h2Windowabout = document.createElement("h2");
          h2Windowabout.classList.add("h2Window");
          h2Windowabout.textContent = `${number} ${name}`;
          consts.spanWindowWeight.textContent = `Peso: ${weight / 10} kilos`;
          consts.spanWindowHeight.textContent = `Altura: ${height / 10} m`;
          consts.windowWeight.innerHTML = consts.spanWindowWeight.outerHTML;
          consts.windowheight.innerHTML = consts.spanWindowHeight.outerHTML;

          const hpBaseStat = response.stats.find(
            (stat) => stat.stat.name === "hp"
          ).base_stat;
          const attackBaseStat = response.stats.find(
            (stat) => stat.stat.name === "attack"
          ).base_stat;
          const defBaseStat = response.stats.find(
            (stat) => stat.stat.name === "defense"
          ).base_stat;
          const spAtkBaseStat = response.stats.find(
            (stat) => stat.stat.name === "special-attack"
          ).base_stat;
          const spdefBaseStat = response.stats.find(
            (stat) => stat.stat.name === "special-defense"
          ).base_stat;
          const SpeedBaseStat = response.stats.find(
            (stat) => stat.stat.name === "speed"
          ).base_stat;

          constsAfterSearchPoke.spanHp.innerHTML = hpBaseStat;
          constsAfterSearchPoke.hpDiv.innerHTML = `${constsAfterSearchPoke.mensagemLoading1.outerHTML} ${constsAfterSearchPoke.spanHp.outerHTML}`;
          constsAfterSearchPoke.spanAtk.innerHTML = attackBaseStat;
          constsAfterSearchPoke.attackDiv.innerHTML = `${constsAfterSearchPoke.mensagemLoading2.outerHTML} ${constsAfterSearchPoke.spanAtk.outerHTML}`;
          constsAfterSearchPoke.spanDef.innerHTML = defBaseStat;
          constsAfterSearchPoke.dfDiv.innerHTML = `${constsAfterSearchPoke.mensagemLoading3.outerHTML} ${constsAfterSearchPoke.spanDef.outerHTML}`;
          constsAfterSearchPoke.spanSpatk.innerHTML = spAtkBaseStat;
          constsAfterSearchPoke.spAtkDiv.innerHTML = `${constsAfterSearchPoke.mensagemLoading4.outerHTML} ${constsAfterSearchPoke.spanSpatk.outerHTML}`;
          constsAfterSearchPoke.spanDef.innerHTML = spdefBaseStat;
          constsAfterSearchPoke.SpdefDiv.innerHTML = `${constsAfterSearchPoke.mensagemLoading5.outerHTML} ${constsAfterSearchPoke.spanDef.outerHTML}`;
          constsAfterSearchPoke.spanSpeed.innerHTML = SpeedBaseStat;
          constsAfterSearchPoke.speedDiv.innerHTML = `${constsAfterSearchPoke.mensagemLoading6.outerHTML} ${constsAfterSearchPoke.spanSpeed.outerHTML}`;

          consts.windowScreenTypes.innerHTML = "";
          response.types.forEach(({ type }) => {
            const pWindowAbout = document.createElement("p");
            pWindowAbout.textContent = type.name;
            pWindowAbout.className = `pLoadingMore ${type.name}`;
            consts.windowScreenTypes.appendChild(pWindowAbout);
          });

          consts.windowInformationPokemon.innerHTML =
            h2Windowabout.outerHTML +
            consts.windowWeight.outerHTML +
            consts.windowheight.outerHTML +
            consts.windowScreenTypes.outerHTML;
          formValor.value = "";
        }
      } catch (error) {
        left.style.display = "none";

        consts.containerSearch.style.height = 0;
        searchSide.classList.remove("active");
        searchSide.style.width = 0;
        containerErro.style.height = "100%";
        imgCatch.style.height = "100%";
        catchSpan.style.height = "9%";
        containerErro.style.opacity = 1;
        catchSpan.textContent = "Pokemon nao encontrado";

        quadradoErro.classList.add("active");

        console.log(error);
        timeoutId = setTimeout(() => {
          containerErro.style.height = 0;
          imgCatch.style.height = 0;
          catchSpan.style.height = 0;
          catchSpan.textContent = "";

          quadradoErro.classList.remove("active");
        }, 3000);
      }
    }
    formValor.value = "";
    fetchAfterSearch();
  }
}

const modalInformation = document.querySelector(".modal-informationLoading");

const closeInformationModal = document.querySelector(".btn-screen");
closeInformationModal.addEventListener("click", btnCloseModal);
function btnCloseModal() {
  modalInformation.style.display = "none";
}
const btnTypes = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

for (let i = 0; i < btnTypes.length; i++) {
  const btnType = document.createElement("button");
  btnType.className = `btn-types ${btnTypes[i]}`;
  btnType.textContent = btnTypes[i];
  btnType.addEventListener("click", (e) => {
    const dataFiltrado = fetchdata.filter((pokemon) => {
      const filtrandoOsPokemon = pokemonFiltrar(pokemon.types).find((type) => {
        return type === btnTypes[i].toLowerCase();
      });

      return filtrandoOsPokemon;
    });
    const pokedex = document.querySelector('[data-js="Pokedex"]');

    pokedex.innerHTML = "";

    dataFiltrado.forEach((pokemonData) => {
      pokedex.append(doCards(pokemonData));
    });
  });

  consts.typeContainer.append(btnType);
}
const btnTop = document.querySelector(".btn-top");
btnTop.addEventListener("click", backStart);
function backStart(event) {
  event.preventDefault();
  console.log("oi");
  consts.h2Container.scrollIntoView({ behavior: "smooth" }, true);
}

function doCards(pokemon) {
  const tipoNome = pokemonType(pokemon.types);
  const li = document.createElement("li");
  li.className = `card ${tipoNome}`;
  li.id = `${pokemon.name}`;
  li.setAttribute("data-type", pokemon.id);
  const avatarPokemon = document.createElement("img");
  avatarPokemon.src = imagemPoke.src =
    pokemon.sprites.other.dream_world.front_default;
  avatarPokemon.className = "card-image";

  const tituloPokemon = document.createElement("h2");
  tituloPokemon.innerText = `${pokemon.id} . ${pokemon.name}`;
  tituloPokemon.className = "card-title";

  const TipagemDosPokemons = document.createElement("div");
  TipagemDosPokemons.className = "card-subtitle";
  pokemon.types.forEach(({ type }) => {
    const tipagemNome = document.createElement("p");
    tipagemNome.textContent = type.name;
    TipagemDosPokemons.append(tipagemNome);
    tipagemNome.className = type.name;
  });

  const botaoInformacao = document.createElement("button");
  botaoInformacao.className = `btn ${tipoNome}`;
  botaoInformacao.setAttribute("data-type", tipoNome);
  botaoInformacao.textContent = "Sobre o pokemon";
  botaoInformacao.addEventListener("click", (e) => {
    abrirModal(pokemon);
  });

  li.append(avatarPokemon, tituloPokemon, TipagemDosPokemons, botaoInformacao);
  return li;
}

fecharButton.addEventListener("click", fecharModal);

function abrirModal(pokemon) {
  const typesDiv = document.createElement("div");
  typesDiv.classList.add("types-container");
  const newTitulo = document.createElement("h2");
  const id = pokemon.id;
  const name = pokemon.name;
  const statsPokemon = pokemon.stats.map((item) => item);
  const [hp, atk, def, spAtk, spDef, speed] = statsPokemon.map(
    (stat) => stat.base_stat
  );
  consts.modalOverlay.addEventListener("click", verificarClique);

  function verificarClique(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    if (
      mouseX < modalWindow.offsetLeft ||
      mouseX > modalWindow.offsetLeft + modalWindow.offsetWidth ||
      mouseY < modalWindow.offsetTop ||
      mouseY > modalWindow.offsetTop + modalWindow.offsetHeight
    ) {
      fecharModal();
    }
  }

  hpDiv.innerHTML = mensagem1.outerHTML + hp;
  attackDiv.innerHTML = mensagem2.outerHTML + atk;
  dfDiv.innerHTML = mensagem3.outerHTML + def;
  spAtkDiv.innerHTML = mensagem4.outerHTML + spAtk;
  SpdefDiv.innerHTML = mensagem5.outerHTML + spDef;
  speedDiv.innerHTML = mensagem6.outerHTML + speed;
  peso.textContent = `Peso: ${pokemon.weight / 10} kilos`;
  altura.textContent = `Altura: ${pokemon.height / 10} m`;
  newTitulo.classList.add("modal-title");
  newTitulo.textContent = `${id}. ${name}`;

  pokemon.types.forEach(({ type }) => {
    const tipagemNome = document.createElement("p");
    tipagemNome.textContent = type.name;
    tipagemNome.className = `types-container ${type.name}`;
    typesDiv.append(tipagemNome);
  });

  pokemonSobre.innerHTML =
    newTitulo.outerHTML + containerSvg.outerHTML + typesDiv.outerHTML;
  imagemPoke.src = pokemon.sprites.other.dream_world.front_default;
  modalOverlay.style.display = "block";
}

function fecharModal() {
  consts.modalOverlay.style.display = "none";
}

function pokemonFiltrar(pokemonType) {
  const tiponomes = pokemonType.map((type) => type.type.name);
  return tiponomes;
}

const btnType = document.querySelectorAll(".container-types button");
btnType.forEach((button) => {
  button.addEventListener("click", filtrarBtnListener);
  function filtrarBtnListener() {
    const dataFiltrado = fetchdata.filter((pokemon) => {
      const filtrandoOsPokemon = pokemonFiltrar(pokemon.types).find((type) => {
        return type === button.textContent.toLowerCase();
      });
      return filtrandoOsPokemon;
    });
    const pokedex = document.querySelector('[data-js="Pokedex"]');

    pokedex.innerHTML = "";

    dataFiltrado.forEach((pokemonData) => {
      pokedex.append(doCards(pokemonData));
    });
  }
});

const backToNormal = document.createElement("button");
backToNormal.classList.add("btn-carregar");
backToNormal.textContent = "Carregar mais";
consts.containerBack.innerHTML = backToNormal.outerHTML;
const buttonCarregar = document.querySelector(".btn-carregar");
buttonCarregar.addEventListener("click", (button) => {
  currentPage++;
  button.preventDefault();
  const start = currentPage - 1 * perPage;
  const end = start + perPage;
  const pageData = fetchdata.slice(start, end);
  pageData.forEach((pokemon) => {
    const li = doCards(pokemon);
    consts.pokedex.appendChild(li);
  });

  fetchPokemon();
});

SearchName();
fetchPokemon();
