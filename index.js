const hpDiv = document.querySelector(".hp");
const attackDiv = document.querySelector(".attack");
const dfDiv = document.querySelector(".defense");
const spAtkDiv = document.querySelector(".spc-atk");
const SpdefDiv = document.querySelector(".sp-def");
const speedDiv = document.querySelector(".speed");
const form = document.querySelector(".container-input");

const formValor = form.elements["input"];
let tempoNoFilter;

import { consts } from "./contantes.js";
import { constsAfterSearchPoke } from "./contantes.js";

async function SearchName() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`;
  const response = await fetch(url).then((response) => response.json());
  consts.result = response.results.map((pokemon) => pokemon.name);
}

async function fetchPokemon() {
  const offset = (consts.currentPage - 1) * consts.perPage;
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${consts.perPage}&offset=${offset}`;

  const response = await fetch(url).then((response) => response.json());

  const promisses = response.results.map(
    async (urls) => await fetch(urls.url).then((res) => res.json())
  );
  const resultado = await Promise.all(promisses);
  consts.fetchdata = [...consts.fetchdata, ...resultado];
  resultado.forEach((pokemon) => {
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
  clearTimeout(consts.timeoutId);
  if (formValor.value.length >= 1) {
    consts.PokeThatIWillSearch = formValor.value.toLowerCase();

    async function fetchAfterSearch() {
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${consts.PokeThatIWillSearch}`;
        const response = await fetch(url).then((response) => response.json());

        consts.left.style.display = "block";
        consts.searchSide.classList.add("active");
        consts.searchSide.style.width = "80%";
        consts.searchSide.style.height = "";
        consts.containerErro.style.height = 0;
        consts.catchSpan.style.width = 0;
        consts.catchSpan.textContent = "";
        consts.quadradoErro.classList.remove("active");
        consts.containerSearch.style.height = "100%";

        const totalNames = document.querySelector(".container-total");
        const h1Name = document.querySelector(".namePoke");
        const name = response.name;
        h1Name.innerHTML = name;
        const h1Number = document.querySelector(".numberPoke");
        const number = response.id + ".";
        h1Number.innerHTML = number;
        const weight = response.weight;
        const height = response.height;

        consts.typesTotal.innerHTML = "";
        const types = response.types.map((type) => type.type.name);
        types.map((item) => {
          const p = document.createElement("p");
          p.innerHTML = item;
          p.className = `paragrafo-search ${p.textContent} `;
          consts.typesTotal.append(p);
        });
        totalNames.innerHTML = `${h1Number.outerHTML}  ${h1Name.outerHTML} `;
        const img = response.sprites.other.home.front_default;
        consts.imgSearch.src = img;
        const firstType = response.types[0].type.name;
        const btnOpenModal = document.createElement("button");
        btnOpenModal.textContent = "Mais Detalhes";
        btnOpenModal.className = `btn-openModal ${firstType}`;
        consts.btnContainer.innerHTML = btnOpenModal.outerHTML;

        const btnOpenEventListener = document.querySelector(".btn-openModal");
        btnOpenEventListener.addEventListener("click", openModalInformation);
        function openModalInformation() {
          consts.modalInformation.style.display = "block";
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
          const h2Ability = document.createElement("h2");
          h2Ability.textContent = "Habilidades:";
          h2Ability.classList.add("h2-abilities");

          consts.abilityModalOverlay.innerHTML = h2Ability.outerHTML;
          response.abilities.forEach(({ ability }) => {
            const btnAbility = document.createElement("button");
            btnAbility.classList.add("btn-ability");
            btnAbility.textContent = ability.name;
            consts.abilityModalOverlay.appendChild(btnAbility);
          });

          consts.windowInformationPokemon.innerHTML =
            h2Windowabout.outerHTML +
            consts.windowWeight.outerHTML +
            consts.windowheight.outerHTML +
            consts.windowScreenTypes.outerHTML;
          formValor.value = "";
        }
      } catch (error) {
        consts.left.style.display = "none";

        consts.containerSearch.style.height = 0;
        consts.searchSide.classList.remove("active");
        consts.searchSide.style.width = 0;
        consts.containerErro.style.height = "100%";
        consts.imgCatch.style.height = "100%";
        consts.catchSpan.style.height = "9%";
        consts.containerErro.style.opacity = 1;
        consts.catchSpan.textContent = "Pokemon não encontrado";

        consts.quadradoErro.classList.add("active");

        console.log(error);
        consts.timeoutId = setTimeout(() => {
          consts.containerErro.style.height = 0;
          consts.imgCatch.style.height = 0;
          consts.catchSpan.style.height = 0;
          consts.catchSpan.textContent = "";

          consts.quadradoErro.classList.remove("active");
        }, 3000);
      }
    }
    formValor.value = "";
    fetchAfterSearch();
  }
}

consts.closeInformationModal.addEventListener("click", btnCloseModal);
function btnCloseModal() {
  consts.modalInformation.style.display = "none";
}

for (let i = 0; i < consts.btnTypes.length; i++) {
  const btnType = document.createElement("button");
  btnType.className = `btn-types ${consts.btnTypes[i]}`;
  btnType.textContent = consts.btnTypes[i];
  btnType.addEventListener("click", (e) => {
    const dataFiltrado = consts.fetchdata.filter((pokemon) => {
      const filtrandoOsPokemon = pokemonFiltrar(pokemon.types).find((type) => {
        return type === consts.btnTypes[i].toLowerCase();
      });

      return filtrandoOsPokemon;
    });

    consts.pokedex.innerHTML = "";

    dataFiltrado.forEach((pokemonData) => {
      consts.pokedex.append(doCards(pokemonData));
    });
  });

  consts.typeContainer.append(btnType);
}
const btnTop = document.querySelector(".btn-top");
btnTop.addEventListener("click", backStart);
function backStart(event) {
  event.preventDefault();
  consts.h2Container.scrollIntoView({ behavior: "smooth" }, true);
}

function doCards(pokemon) {
  const divImg = document.createElement("div");
  divImg.className = "card-image-container";

  const tipoNome = pokemonType(pokemon.types);
  const li = document.createElement("li");

  li.className = `card ${tipoNome}`;
  li.id = `${pokemon.name}`;
  li.setAttribute("data-type", pokemon.id);

  const avatarPokemon = document.createElement("img");
  avatarPokemon.src = consts.imagemPoke.src =
    pokemon.sprites.other.dream_world.front_default;
  avatarPokemon.className = "card-image";
  divImg.append(avatarPokemon);

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

  li.append(divImg, tituloPokemon, TipagemDosPokemons, botaoInformacao);
  return li;
}

consts.fecharButton.addEventListener("click", fecharModal);

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

  function verificarClique() {
    fecharModal();
  }

  hpDiv.innerHTML = consts.mensagem1.outerHTML + hp;
  attackDiv.innerHTML = consts.mensagem2.outerHTML + atk;
  dfDiv.innerHTML = consts.mensagem3.outerHTML + def;
  spAtkDiv.innerHTML = consts.mensagem4.outerHTML + spAtk;
  SpdefDiv.innerHTML = consts.mensagem5.outerHTML + spDef;
  speedDiv.innerHTML = consts.mensagem6.outerHTML + speed;
  consts.peso.textContent = `Peso: ${pokemon.weight / 10} kilos`;
  consts.altura.textContent = `Altura: ${pokemon.height / 10} m`;
  newTitulo.classList.add("modal-title");
  newTitulo.textContent = `${id}. ${name}`;

  pokemon.types.forEach(({ type }) => {
    const tipagemNome = document.createElement("p");
    tipagemNome.textContent = type.name;
    tipagemNome.className = `types-container ${type.name}`;
    typesDiv.append(tipagemNome);
  });

  const h2Ability = document.createElement("h2");
  h2Ability.textContent = "Habilidades:";
  h2Ability.classList.add("h2-abilities");
  consts.abilitiescontainer.innerHTML = h2Ability.outerHTML;
  pokemon.abilities.forEach(({ ability }) => {
    const btnAbility = document.createElement("button");
    btnAbility.classList.add("btn-ability");
    btnAbility.textContent = ability.name;
    consts.abilitiescontainer.appendChild(btnAbility);
  });
  consts.containerPoke.innerHTML =
    consts.statusContainer.outerHTML + consts.abilitiescontainer.outerHTML;

  consts.pokemonSobre.innerHTML =
    newTitulo.outerHTML + consts.containerSvg.outerHTML + typesDiv.outerHTML;
  consts.imagemPoke.src = pokemon.sprites.other.dream_world.front_default;
  consts.modalOverlay.style.display = "block";
}

function fecharModal() {
  consts.modalOverlay.style.display = "none";
}

const noPokeFiltrado = document.createElement("div");
const insideNoFilter = document.createElement("div");
const h1noPokeFilter = document.createElement("h2");
const imgNoFilter = document.createElement("img");

function pokemonFiltrar(pokemonType) {
  const tiponomes = pokemonType.map((type) => type.type.name);
  return tiponomes;
}

const informationLoading = document.querySelector(".modal-informationLoading");
informationLoading.addEventListener("click", loadingModalOverlay);
function loadingModalOverlay() {
  informationLoading.style.display = "none";
}
const btnType = document.querySelectorAll(".container-types button");
btnType.forEach((button) => {
  button.addEventListener("click", filtrarBtnListener);

  function filtrarBtnListener() {
    clearTimeout(tempoNoFilter);
    consts.pokedex.classList = "pokedex";
    const dataFiltrado = consts.fetchdata.filter((pokemon) => {
      const filtrandoOsPokemon = pokemonFiltrar(pokemon.types).find((type) => {
        return type === button.textContent.toLowerCase();
      });
      return filtrandoOsPokemon;
    });

    if (dataFiltrado.length < 1) {
      noPokeFiltrado.style.display = "block";
      h1noPokeFilter.textContent =
        "sem pokemons para serem filtrado desse tipo";
      imgNoFilter.src =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/54.png";
      insideNoFilter.classList.add("container-semFiltrar");
      insideNoFilter.classList.add("active");
      h1noPokeFilter.classList.add(".mensage-semFiltro");
      imgNoFilter.classList.add("imagem-semFiltro");
      insideNoFilter.innerHTML =
        h1noPokeFilter.outerHTML + imgNoFilter.outerHTML;
      noPokeFiltrado.innerHTML = insideNoFilter.outerHTML;
      noPokeFiltrado.classList.add("container-noPoke");
      consts.pokedex.classList.add("mid");
      consts.pokedex.innerHTML = noPokeFiltrado.outerHTML;
      tempoNoFilter = setTimeout(() => {
        consts.pokedex.innerHTML = "";
      }, 2000);
      return insideNoFilter;
    } else {
      consts.pokedex.innerHTML = "";

      dataFiltrado.forEach((pokemonData) => {
        consts.pokedex.append(doCards(pokemonData));
      });
    }
  }
});

const backToNormal = document.createElement("button");
backToNormal.classList.add("btn-carregar");
backToNormal.textContent = "Carregar mais";
consts.containerBack.innerHTML = backToNormal.outerHTML;
const buttonCarregar = document.querySelector(".btn-carregar");
buttonCarregar.addEventListener("click", (button) => {
  clearTimeout(tempoNoFilter);
  const noFilterPokemon = document.querySelector(".container-noPoke");
  if (noFilterPokemon) {
    noFilterPokemon.style.display = "none";
  }

  consts.currentPage++;
  button.preventDefault();
  const start = consts.currentPage - 1 * consts.perPage;
  const end = start + consts.perPage;
  const pageData = consts.fetchdata.slice(start, end);
  consts.pokedex.classList.remove("mid");

  pageData.forEach((pokemon) => {
    const li = doCards(pokemon);
    consts.pokedex.appendChild(li);
  });

  fetchPokemon();
});

SearchName();
fetchPokemon();
