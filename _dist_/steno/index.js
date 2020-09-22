import { useReducer } from '../../web_modules/react.js';
import config from '../config.js';
export let Keys;

(function (Keys) {
  Keys["Num"] = "Num";
  Keys["InitialS"] = "S-";
  Keys["InitialT"] = "T-";
  Keys["InitialK"] = "K-";
  Keys["InitialP"] = "P-";
  Keys["InitialW"] = "W-";
  Keys["InitialH"] = "H-";
  Keys["InitialR"] = "R-";
  Keys["InitialA"] = "A-";
  Keys["InitialO"] = "O-";
  Keys["Star"] = "*";
  Keys["FinalE"] = "-E";
  Keys["FinalU"] = "-U";
  Keys["FinalF"] = "-F";
  Keys["FinalR"] = "-R";
  Keys["FinalP"] = "-P";
  Keys["FinalB"] = "-B";
  Keys["FinalL"] = "-L";
  Keys["FinalG"] = "-G";
  Keys["FinalT"] = "-T";
  Keys["FinalS"] = "-S";
  Keys["FinalD"] = "-D";
  Keys["FinalZ"] = "-Z";
  Keys["NoOp"] = "no-op";
  Keys["Arpeggiate"] = "arpeggiate";
})(Keys || (Keys = {}));

export const keyToChar = {
  [Keys.Num]: "#",
  [Keys.InitialS]: "S",
  [Keys.InitialT]: "T",
  [Keys.InitialK]: "K",
  [Keys.InitialP]: "P",
  [Keys.InitialW]: "W",
  [Keys.InitialH]: "H",
  [Keys.InitialR]: "R",
  [Keys.InitialA]: "A",
  [Keys.InitialO]: "O",
  [Keys.Star]: "*",
  [Keys.FinalE]: "E",
  [Keys.FinalU]: "U",
  [Keys.FinalF]: "F",
  [Keys.FinalR]: "R",
  [Keys.FinalP]: "P",
  [Keys.FinalB]: "B",
  [Keys.FinalL]: "L",
  [Keys.FinalG]: "G",
  [Keys.FinalT]: "T",
  [Keys.FinalS]: "S",
  [Keys.FinalD]: "D",
  [Keys.FinalZ]: "Z",
  [Keys.NoOp]: "!",
  [Keys.Arpeggiate]: "~"
};
export const keysFromChars = chars => {
  const rStenoOrder = /(#)?(S)?(T)?(K)?(P)?(W)?(H)?(R)?(A)?(O)?(\*)?(E)?(U)?(F)?(R)?(P)?(B)?(L)?(G)?(T)?(S)?(D)?(Z)?/;
  const keyOrder = [Keys.Num, Keys.InitialS, Keys.InitialT, Keys.InitialK, Keys.InitialP, Keys.InitialW, Keys.InitialH, Keys.InitialR, Keys.InitialA, Keys.InitialO, Keys.Star, Keys.FinalE, Keys.FinalU, Keys.FinalF, Keys.FinalR, Keys.FinalP, Keys.FinalB, Keys.FinalL, Keys.FinalG, Keys.FinalT, Keys.FinalS, Keys.FinalD, Keys.FinalZ];
  const match = rStenoOrder.exec(chars);
  const keys = [];
  if (!match) return keys;
  keyOrder.forEach((key, i) => {
    if (match[i + 1]) {
      keys.push(keyOrder[i]);
    }
  });
  return keys;
};
var StenoActionType;

(function (StenoActionType) {
  StenoActionType[StenoActionType["KeyDown"] = 0] = "KeyDown";
  StenoActionType[StenoActionType["KeyUp"] = 1] = "KeyUp";
})(StenoActionType || (StenoActionType = {}));

const initialState = {
  keys: {},
  strokes: []
};
Object.values(Keys).forEach(key => initialState.keys[key] = {
  active: false,
  wasActive: false,
  lastActive: false
});

const reducer = (state, action) => {
  const {
    keys,
    strokes
  } = state;

  if (action.data?.key && !keys[action.data.key]) {
    return state;
  }

  switch (action.type) {
    case StenoActionType.KeyDown:
      if (action.data?.key) {
        keys[action.data.key].active = true;
        keys[action.data.key].wasActive = true;
      }

      return { ...state,
        keys
      };

    case StenoActionType.KeyUp:
      if (action.data?.key) {
        keys[action.data.key].active = false;
        const isKeyActive = Object.values(keys).reduce((prev, curr) => prev || curr.active, false);

        if (!isKeyActive) {
          let stroke = [];
          Object.keys(keys).forEach(key => keys[key].lastActive = false);
          Object.keys(keys).filter(key => keys[key].wasActive).forEach(key => {
            stroke.push(key);
            keys[key].wasActive = false;
            keys[key].lastActive = true;
          });
          strokes.push(stroke);
        }
      }

      return { ...state,
        keys,
        strokes
      };

    default:
      return state;
  }
};

const strokeToChars = stroke => stroke.map(key => keyToChar[key]).join("");

export const strokesToText = strokes => {
  const chars = strokes.map(stroke => strokeToChars(stroke)).join("/");
  return config.dictionaries[0][chars];
};
export const useSteno = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onKeyDown = key => dispatch({
    type: StenoActionType.KeyDown,
    data: {
      key
    }
  });

  const onKeyUp = key => dispatch({
    type: StenoActionType.KeyUp,
    data: {
      key
    }
  });

  return {
    state,
    onKeyDown,
    onKeyUp
  };
};