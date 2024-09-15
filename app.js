console.log("test");
console.log(document);

let cookieCount = 0;
let cookiesPerSecond = 1;
let alert_interval = null;
// const purchaseSound = new Audio("./sounds/ping.mp3");
loadCookiesData();

const cookieCountElement = document.getElementById("cookie-count");
const cookiesPerSecondElement = document.getElementById("cookies-per-second");
const myMiningBtn = document.getElementById("image-button");

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  localStorage.clear();
  cookieCount = 0;
  cookieCountElement.textContent = `Cookie Count: ${cookieCount}`;
  cookiesPerSecond = 1;
  cookiesPerSecondElement.textContent = `Cookies per Second: ${cookiesPerSecond}`;
});
setInterval(() => {
  cookieCount += cookiesPerSecond;
  cookieCountElement.textContent = `Cookie Count: ${cookieCount}`;
  cookiesPerSecondElement.textContent = `Cookies per Second: ${cookiesPerSecond}`;
  saveData();
}, 1000);

function handleClick(myMiningBtn) {
  cookieCount += cookiesPerSecond;
  cookieCountElement.textContent = `Cookie Count: ${cookieCount}`;
  console.log("Clicked");
}
myMiningBtn.addEventListener("click", handleClick);

let shopUpgrades = [];
async function getShopUpgradesAPI() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const data = await response.json();
  return data;
}

const shopUpgradesElement = document.getElementById("shop-upgrades");
function getShopUpgrades(idContent, nameContent, costContent, increaseContent) {
  const ID = document.createElement("div");
  const Name = document.createElement("div");
  const Cost = document.createElement("div");
  const Increase = document.createElement("div");

  ID.textContent = idContent;
  Name.textContent = nameContent;
  Cost.textContent = costContent;
  Increase.textContent = increaseContent;

  const shop_upgrade_item = document.createElement("div");
  const shop_buy_button = document.createElement("button");
  shop_buy_button.textContent = "BUY";
  // shop_buy_button.setAttribute()
  shop_upgrade_item.setAttribute("class", "shop-line");
  shop_upgrade_item.appendChild(ID),
    shop_upgrade_item.appendChild(Name),
    shop_upgrade_item.appendChild(Cost),
    shop_upgrade_item.appendChild(Increase);
  shop_upgrade_item.appendChild(shop_buy_button);

  shop_buy_button.addEventListener("click", () => {
    console.log("cost=", costContent);
    console.log("increase=", increaseContent);
    console.log(cookieCount);

    let current_cost = parseInt(costContent);
    if (cookieCount > current_cost) {
      cookieCount = cookieCount - current_cost;
      cookiesPerSecond = cookiesPerSecond + parseInt(increaseContent);
      savePurchase(idContent, nameContent, costContent, increaseContent);
    } else {
      document.getElementById("alert").style.display = "block";

      if (alert_interval !== null) {
        clearInterval(alert_interval);
      }
  
      alert_interval = setInterval(() => {
        document.getElementById("alert").style.display = "none";
      }, 3000);
    }
  });
  return shop_upgrade_item;
}

function savePurchase(id, name, cost, increase) {
  let purchases = [];
  let previous_purchases = localStorage.getItem("purchases");
  if(previous_purchases) {
    purchases = JSON.parse(previous_purchases)
  }

  let new_purchase = {
    id: id,
    name: name,
    cost: cost,
    increase: increase,
    purchase_date: new Date(),
  };
  purchases.push(new_purchase)
  
  localStorage.setItem("purchases", JSON.stringify(purchases));
}

async function displayShopUpgrades() {
  const shopUpgrades = await getShopUpgradesAPI();
  shopUpgrades.forEach((upgrade) => {
    const shop_line_item = getShopUpgrades(
      upgrade.id,
      upgrade.name,
      upgrade.cost,
      upgrade.increase
    );
    shopUpgradesElement.appendChild(shop_line_item);
  });
}
displayShopUpgrades();

function saveData() {
  localStorage.setItem("cookieCount", cookieCount);
  localStorage.setItem("cookiesPerSecond", cookiesPerSecond);
}

function loadCookiesData() {
  let storedCookieCount = localStorage.getItem("cookieCount");
  if (storedCookieCount) {
    cookieCount = parseInt(storedCookieCount);
  }

  let storedCookiesPerSecond = localStorage.getItem("cookiesPerSecond");
  if (storedCookiesPerSecond) {
    cookiesPerSecond = parseInt(storedCookiesPerSecond);
  }
}


//received help from my brother