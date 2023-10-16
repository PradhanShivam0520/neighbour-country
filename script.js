"use strict";

const countriescontainer = document.querySelector(".countries");
const whereamI = document.querySelector(".btn-country");

// const res = fetch('https://restcountries.com/v2/name/portugal');
// console.log(res);

const rendercountry = function (data, classname = "", vark = "") {
  const html = `
       <article class="country ${classname}" style="${vark}">
           <img class="country__img" src="${data.flag}" alt="flag" />
           <div class="country__data">
               <h3 class="country__name">${data.nativeName}</h3>
               <h4 class="country__region">${data.region}</h4>
               <p class="country__row"><span>👫</span>${(
                 data.population / 1000000
               ).toFixed(1)}M people</p>
               <p class="country__row"><span>🗣️</span>${
                 data.languages[0].name
               }</p>
               <p class="country__row"><span>💰</span>${
                 data.currencies[0].name
               } (${data.currencies[0].symbol})</p>
           </div>
       </article>
    `;
  countriescontainer.insertAdjacentHTML("beforeend", html);
  countriescontainer.style.opacity = 1;
};

const inserterrormsg = (err) => {
  console.log(err);
  const msg = `${err.message} (${err.status})`;
  countriescontainer.insertAdjacentText("afterend", msg);
};

const getJSON = (url, mesg) => {
  return fetch(url).then((response) => {
    // console.log(response);
    if (!response.ok) throw new Error(`${mesg}`);

    return response.json();
  });
};

const getcountry = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, "country not found")
    .then((info) => {
      // console.log(info);
      const data = info[info.length - 1];
      rendercountry(data);

      const neighbour = data.borders[6];
      if (!neighbour) throw new Error("neighbour not found");

      return getJSON(
        `https://restcountries.com/v2/name/${neighbour}`,
        `neighbourcountry[${neighbour.name}] not found`
      );
    })
    .then((info) => {
      // console.log(info);
      const data = info[info.length - 1];
      rendercountry(data, "neighbour", "--i : 0.9");
      const neighbour = data.borders[2];
      if (!neighbour) throw new Error("neighbour not found");

      return getJSON(
        `https://restcountries.com/v2/name/${neighbour}`,
        `neighbourcountry[${neighbour.name}] not found`
      );
    })
    .then((info) => {
      // console.log(info);
      const data = info[info.length - 1];
      rendercountry(data, "neighbour", "--i : 0.8");
    })
    .catch((err) => {
      console.log(`Something went wrong . ${err.message}`);
      inserterrormsg(err);
    });
};

whereamI.addEventListener("click", (e) => {
  e.preventDefault();
  getcountry("india");
});
