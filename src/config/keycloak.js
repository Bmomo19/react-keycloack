import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081",
  realm: "app-test",
  clientId: "app-test-id",
});

// Petit hack pour suivre l'init
(keycloak)._initialized = false;

export default keycloak;
