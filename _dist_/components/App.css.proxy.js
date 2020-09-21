
const code = ".App {\n  text-align: center;\n}\n\n.App-logo {\n  height: 40vmin;\n  pointer-events: none;\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  .App-logo {\n    animation: App-logo-spin infinite 20s linear;\n  }\n}\n\n.App-keys {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.App-keys-row {\n  display: flex;\n  flex-direction: row;\n  margin-bottom: 20px;\n}\n\n.App-key {\n  background-color: white;\n  width: 100px;\n  height: 100px;\n  margin-right: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2em;\n  color: black;\n  text-shadow: 2px 2px white;\n}\n\n.App-key.last-active {\n  background-color: teal;\n}\n\n.App-key.was-active {\n  background-color: blue;\n}\n\n.App-key.target {\n  background-color: yellow;\n}\n\n.App-key.active {\n  background-color: black;\n}\n\n.App-key.last-active.target {\n  background-color: green !important;\n}\n\n.App-header {\n  background-color: #cecece;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: calc(10px + 2vmin);\n  color: black;\n}\n\n.App-link {\n  color: #61dafb;\n}\n\n@keyframes App-logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n";

const styleEl = document.createElement("style");
const codeEl = document.createTextNode(code);
styleEl.type = 'text/css';

styleEl.appendChild(codeEl);
document.head.appendChild(styleEl);