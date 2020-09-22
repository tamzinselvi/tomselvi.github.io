import React, { useEffect, useState } from '../../web_modules/react.js';
import './App.css.proxy.js';
import config from '../config.js';
import { Keys, useSteno, strokesToText, keysFromChars, keyToChar } from '../steno/index.js';
import { Stenograph } from './Stenograph.js';
const entries = Object.keys(config.dictionaries[0]);

const findRandomEntry = difficulty => {
  const randomEntry = entries[Math.round(Math.random() * (entries.length - 1))];
  const val = config.dictionaries[0][randomEntry];

  if (!new RegExp(`^[a-zA-Z]{${difficulty}}$`).test(randomEntry)) {
    return findRandomEntry(difficulty);
  }

  return {
    chars: randomEntry,
    text: val
  };
};

function App({}) {
  const [down, setDown] = useState({});
  const [difficulty, setDifficulty] = useState(3);
  const [nextTarget, setNextTarget] = useState(findRandomEntry(difficulty));
  const [showTarget, setShowTarget] = useState(true);
  const [showCombinations, setShowCombinations] = useState(true);
  const [showKeys, setShowKeys] = useState(true);
  const {
    state,
    onKeyDown,
    onKeyUp
  } = useSteno();
  const targetText = state.strokes.length && strokesToText([state.strokes[state.strokes.length - 1]]) || "";

  if (nextTarget.text === targetText) {
    setNextTarget(findRandomEntry(difficulty));
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

  const onChangeDifficulty = e => setDifficulty(parseInt(e.target.value));

  const onChangeShowTarget = e => setShowTarget(e.target.checked);

  const onChangeShowKeys = e => setShowKeys(e.target.checked);

  const onChangeShowCombinations = e => setShowCombinations(e.target.checked);

  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement("div", {
    className: "App-controls"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "difficulty"), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    onChange: onChangeDifficulty,
    type: "range",
    min: "3",
    max: "12",
    value: difficulty
  }), " ", /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "show target"), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    onChange: onChangeShowTarget,
    type: "checkbox",
    checked: showTarget
  }), " ", /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "show keys"), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    onChange: onChangeShowKeys,
    type: "checkbox",
    checked: showKeys
  }), " ", /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "show combinations"), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    onChange: onChangeShowCombinations,
    type: "checkbox",
    checked: showCombinations
  }), " ", /*#__PURE__*/React.createElement("br", null))), /*#__PURE__*/React.createElement("header", {
    className: "App-header"
  }, /*#__PURE__*/React.createElement(Stenograph, {
    nextTarget: nextTarget,
    state: state,
    showTarget: showTarget,
    showKeys: showKeys,
    showCombinations: showCombinations
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