import { apiFetch } from "./api";

export function getCars() {
  return apiFetch("/cars");
}

export function createCar(car) {
  return apiFetch("/cars", {
    method: "POST",
    body: JSON.stringify(car),
  });
}
