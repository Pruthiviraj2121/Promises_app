let isOrderAccepted = true;
let isValetFound = true;
let hasResturantSeenyourOrder = false;
let resturantTimer = null;
let valetTimer = null;
let valeDeliverytTimer = null;
let isOrderDelivered = false;

//To bootup the Zomato-app
window.addEventListener("load", function () {
  this.document
    .getElementById("acceptOrder")
    .addEventListener("click", function () {
      askResturantToAcceptOrReject();
    });

  this.document
    .getElementById("findValet")
    .addEventListener("click", function () {
      startSearchingForValets();
    });

  this.document
    .getElementById("deliverOrder")
    .addEventListener("click", function () {
      setTimeout(() => {
        isOrderDelivered = true;
      }, 6000);
    });

  checkIFOrderAcceptedFromResturant()
    .then((res) => {
      console.log("Update from resturant", res);
      if (isOrderAccepted) startPreparingOrder();
      //step-3 Order rejected
      else alert("Sorry resturant didn't accepted your order");
    })
    .catch((err) => {
      console.error(err);
      alert("Something went wrong! Please try again later");
    });
});
//step-1 cheking whether resturant accepted order or not
//Here promise is used as zomato promised that order is placed the resolve and reject is upon the resturant
function askResturantToAcceptOrReject() {
  //callbck
  setTimeout(() => {
    isOrderAccepted = confirm("Should resturant accept order?");
    hasResturantSeenyourOrder = true;
  }, 1000);
}

//step-2 cheking if order accepted from resturant or not
function checkIFOrderAcceptedFromResturant() {
  return new Promise((resolve, reject) => {
    resturantTimer = setInterval(() => {
      console.log("Cheking if order accepted or not");
      if (!hasResturantSeenyourOrder) return;

      if (isOrderAccepted) resolve(true);
      else resolve(false);

      clearInterval(resturantTimer);
    }, 2000);
  });
}
//Promise - then,catch. Callback - resolve, reject
//Types of promise -
// 1.Promise.all - promise.all calls all operations parallely and if any of operaton shows error then whole promise will show error
// 2.Promise.allsetteled - Here the operations which are failed are not executed but the rest are executed
// 3.Promise.race - first promise to complete- whether resolved or rejected
// 4.Promise.any - first promise to be resolved/fulfilled

//step-4 start preparing
function startPreparingOrder() {
  Promise.allSettled([
    updateOrderStatus(),
    updateMapView(),
    checkIfValetAssigned(),
    checkIfOrderDelieverd(),
  ])
    .then((res) => {
      console.log(res);
      setTimeout(() => {
        alert("How was your food?");
      }, 2000);
    })
    .catch((err) => {
      console.log(err);
    });
}

//Helper Functions - Pure functions means only do a particular work no extra works
function updateOrderStatus() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById("currentStatus").innerText = isOrderDelivered
        ? "Order Delivered"
        : "Preparing your order";
      resolve("status updated");
    }, 1500);
  });
}

function updateMapView() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById("mapview").style.opacity = "1";
      resolve("map initialised");
    }, 1000);
  });
}

function startSearchingForValets() {
  const valetsPromises = [];
  for (let i = 0; i < 5; i++) {
    valetsPromises.push(getRandomDriver());
  }
  console.log(valetsPromises);

  Promise.any(valetsPromises)
    .then((selecedValet) => {
      console.log("Selected a valet :", selecedValet);
      isValetFound = true;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getRandomDriver() {
  return new Promise((resolve, reject) => {
    const timeout = Math.random() * 1000;
    setTimeout(() => {
      resolve("Valet :- " + timeout);
    }, timeout);
  });
}

function checkIfValetAssigned() {
  return new Promise((resolve, reject) => {
    valetTimer = setInterval(() => {
      console.log("Searching for valet");
      if (isValetFound) {
        updateValetDetails();
        resolve("updated valet details");
        clearTimeout(valetTimer);
      }
    }, 1000);
  });
}

function checkIfOrderDelieverd() {
  return new Promise((resolve, reject) => {
    valetDeliveryTimer = setInterval(() => {
      console.log("Is order deliver by valet");
      if (isOrderDelivered) {
        resolve("Order delivered valet details");
        updateOrderStatus();
        clearTimeout(valetDeliveryTimer);
      }
    }, 1000);
  });
}

function updateValetDetails() {
  const findingDriverElement = document.getElementById("finding-driver");
  if (findingDriverElement) {
    findingDriverElement.classList.add("none");
    const foundDriverElement = document.getElementById("found-driver");
    if (foundDriverElement) {
      foundDriverElement.classList.remove("none");
      const callElement = document.getElementById("call");
      if (callElement) {
        callElement.classList.remove("none");
      }
    }
  }
}
