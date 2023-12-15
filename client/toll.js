document.addEventListener("DOMContentLoaded", function () {
  const tollForm = document.getElementById("tollForm");
  const tollResult = document.getElementById("tollResult");
  const tollAmount = document.getElementById("tollAmount");

  tollForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const vehicleType = document.getElementById("vehicleType").value;
    const distanceTraveled = document.getElementById("distanceTraveled").value;
  });
});
