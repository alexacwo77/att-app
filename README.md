# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# Below are the versions of software used for this part:
Node.js: 18.20.2

npm: 10.5.0

npx: 10.5.0

nvm: 1.2.2

Mysql: 10.4.11-MariaDB

The client currently starts at http://localhost:5174/ and the relevant port (5174) is added in .env file for CLIENT_URL variable.
The backend runs at 8080 port (see PORT variable in the .env file), and the web application sends requests to this port (as defined in API variable in /src/services/api.js in the web application).
