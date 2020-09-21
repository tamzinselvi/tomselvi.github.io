import React, { useEffect, useState } from '../../web_modules/react.js';
import './App.css.proxy.js';
import config from '../config.js';
import { Keys, useSteno, strokesToText, keysFromChars, keyToChar } from '../steno/index.js';
import { Stenograph } from './Stenograph.js';
const entries = Object.keys(config.dictionaries[0]);

const findRandomEntry = () => {
  const randomEntry = entries[Math.round(Math.random() * (entries.length - 1))];
  const val = config.dictionaries[0][randomEntry];

  if (randomEntry.indexOf('/') !== -1 || randomEntry.indexOf('-') !== -1) {
    return findRandomEntry();
  }

  return {
    chars: randomEntry,
    text: val
  };
};

function App({}) {
  const [down, setDown] = useState({});
  const [nextTarget, setNextTarget] = useState(findRandomEntry());
  const {
    state,
    onKeyDown,
    onKeyUp
  } = useSteno();
  const targetText = state.strokes.length && strokesToText([state.strokes[state.strokes.length - 1]]) || "";

  if (nextTarget.text === targetText) {
    setNextTarget(findRandomEntry());
  }

  useEffect(() => {
    const kd = ev => {
      const char = ev.key;
      const matches = Object.keys(config.keymap).filter(key => {
        const chars = config.keymap[key];
        return chars.reduce((prev, curr) => prev || curr === char, false);
      });
      matches.forEach(key => {
        if (!down[key]) {
          console.log("down", key, config, down);
          onKeyDown(key);
          down[key] = true;
          setDown(down);
        }
      });
    };

    const ku = ev => {
      const char = ev.key;
      const matches = Object.keys(config.keymap).filter(key => {
        const chars = config.keymap[key];
        return chars.reduce((prev, curr) => prev || curr === char, false);
      });
      matches.forEach(key => {
        if (down[key]) {
          console.log("up", key, config);
          onKeyUp(key);
          down[key] = false;
          setDown(down);
        }
      });
    };

    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  });

  const isTargetKey = (chars, key) => {
    const targetKeys = keysFromChars(chars);
    return targetKeys.indexOf(key) !== -1;
  };

  const renderKey = key => /*#__PURE__*/React.createElement("div", {
    className: `App-key${isTargetKey(nextTarget.chars, key) ? ' target' : ''}${state.keys[key].lastActive ? ' last-active' : ''}${state.keys[key].wasActive ? ' was-active' : ''}${state.keys[key].active ? ' active' : ''}`,
    key: key
  }, keyToChar[key]);

  const topRow = /*#__PURE__*/React.createElement("div", {
    className: "App-keys-row"
  }, [Keys.InitialS, Keys.InitialT, Keys.InitialP, Keys.InitialH, Keys.Star, Keys.FinalF, Keys.FinalP, Keys.FinalL, Keys.FinalT, Keys.FinalD].map(key => renderKey(key)));
  const middleRow = /*#__PURE__*/React.createElement("div", {
    className: "App-keys-row"
  }, [Keys.InitialS, Keys.InitialK, Keys.InitialW, Keys.InitialR, Keys.Star, Keys.FinalR, Keys.FinalB, Keys.FinalG, Keys.FinalS, Keys.FinalZ].map(key => renderKey(key)));
  const bottomRow = /*#__PURE__*/React.createElement("div", {
    className: "App-keys-row"
  }, [Keys.InitialA, Keys.InitialO, Keys.FinalE, Keys.FinalU].map(key => renderKey(key)));
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement("header", {
    className: "App-header"
  }, /*#__PURE__*/React.createElement(Stenograph, {
    nextTarget: nextTarget,
    state: state
  }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: ".5em",
      textDecoration: 'underline'
    }
  }, "Target"), " ", /*#__PURE__*/React.createElement("br", null), nextTarget.text, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: ".5em",
      textDecoration: 'underline'
    }
  }, "Entry"), " ", /*#__PURE__*/React.createElement("br", null), targetText || /*#__PURE__*/React.createElement("i", null, "no-entry"))));
}

export default App;