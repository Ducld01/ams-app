// Reference: https://github.com/RouninMedia/Obfuscate-Deobfuscate

export const obfuscator = (
  codeStr: string,
  recursionNumber: number = 5
): string => {
  let stringSegments;
  let obfuscatedStringSegments: string[] = [];

  if (codeStr.length > 99) {
    const regex = new RegExp("(.{99})", "g");
    stringSegments = codeStr.replace(regex, "$1#").split("#");
  } else {
    stringSegments = [codeStr];
  }

  for (let s = 0; s < stringSegments.length; s++) {
    let stringSegment = stringSegments[s];

    if (stringSegment.length < 4) {
      stringSegment += " [(...)]";
    }

    let obfuscatedArray = stringSegment.split("");

    for (let i = 0; i < recursionNumber; i++) {
      for (let j = 0; j < obfuscatedArray.length; j++) {
        // Sử dụng Buffer để mã hóa Base64 thay vì window.btoa
        obfuscatedArray[j] = Buffer.from(obfuscatedArray[j]).toString("base64");
        obfuscatedArray[j] = obfuscatedArray[j].replace(/\=/g, "");
        obfuscatedArray[j] = obfuscatedArray[j].split("").reverse().join("");
      }
    }

    let obfuscatedStringSegment = obfuscatedArray.join("");
    let stringSegmentLength = stringSegment.length
      .toString()
      .padStart(2, "0")
      .split("");

    let obfuscatedStringSegmentWithKey = "";
    obfuscatedStringSegmentWithKey += obfuscatedStringSegment.substr(0, 6);
    obfuscatedStringSegmentWithKey += stringSegmentLength[1];
    obfuscatedStringSegmentWithKey += obfuscatedStringSegment.substr(
      6,
      obfuscatedStringSegment.length - 12
    );
    obfuscatedStringSegmentWithKey += stringSegmentLength[0];
    obfuscatedStringSegmentWithKey += obfuscatedStringSegment.substr(
      obfuscatedStringSegment.length - 6
    );

    obfuscatedStringSegments[s] = obfuscatedStringSegmentWithKey;
  }

  return obfuscatedStringSegments.join("_");
};

export function deobfuscate(obfuscatedString: string) {
  let stringSegments: string[] = [];
  let obfuscatedStringSegments: string[] = obfuscatedString.split("_");

  for (let s = 0; s < obfuscatedStringSegments.length; s++) {
    let obfuscatedStringSegment = obfuscatedStringSegments[s];

    let blockCount = parseInt(
      obfuscatedStringSegment.substr(-7, 1) +
        obfuscatedStringSegment.substr(6, 1)
    );
    obfuscatedStringSegment =
      obfuscatedStringSegment.substr(0, 6) +
      obfuscatedStringSegment.substr(7, obfuscatedStringSegment.length - 14) +
      obfuscatedStringSegment.substr(obfuscatedStringSegment.length - 6);

    const regex = new RegExp(
      "(.{" + obfuscatedStringSegment.length / blockCount + "})",
      "g"
    );
    let obfuscatedArray = obfuscatedStringSegment
      .replace(regex, "$1|")
      .split("|");
    obfuscatedArray.pop();

    while (obfuscatedArray[0].split("").length > 1) {
      for (let i = 0; i < obfuscatedArray.length; i++) {
        obfuscatedArray[i] = obfuscatedArray[i].split("").reverse().join("");
        obfuscatedArray[i] = window.atob(obfuscatedArray[i]);
        obfuscatedArray[i] = obfuscatedArray[i].replace(/\=/g, "");
      }
    }

    let stringSegment = obfuscatedArray.join("");
    stringSegment = stringSegment.replace(" [(...)]", "");
    stringSegments[s] = stringSegment;
  }

  return stringSegments.join("");
}

export const generateSelfDeObfuscatingAndRunningCodeStr = (
  obfuscatedString: string
) => {
  const runningCodeStr = `(function(_0x5634cf) {  
        let _0x4d6656 = [];
        let _0x3e01a3 = _0x5634cf.split('_');
        for (let _0x200b9d = 0x0; _0x200b9d < _0x3e01a3.length; _0x200b9d++) {
            let _0x2af939 = _0x3e01a3[_0x200b9d],
                _0x165699 = parseInt(_0x2af939.substr(-0x7, 0x1) + _0x2af939.substr(0x6, 0x1));
            _0x2af939 = _0x2af939.substr(0x0, 0x6) + _0x2af939.substr(0x7, _0x2af939.length - 0xe) + _0x2af939.substr(_0x2af939.length - 0x6);
            const _0x451aa7 = new RegExp('(.{' + _0x2af939.length / _0x165699 + '})', 'g');
            let _0x5d6262 = _0x2af939.replace(_0x451aa7, '$1|').split('|');
            _0x5d6262.pop();
            while (_0x5d6262[0x0].split('').length > 0x1) {
                for (let _0xa792d = 0x0; _0xa792d < _0x5d6262.length; _0xa792d++) {
                    _0x5d6262[_0xa792d] = _0x5d6262[_0xa792d].split('').reverse().join('');
                    _0x5d6262[_0xa792d] = window.atob(_0x5d6262[_0xa792d]);
                }
            }
            let _0x27efef = _0x5d6262.join('');
            _0x27efef = _0x27efef.replace('\\x20[(...)]', '');
            _0x4d6656[_0x200b9d] = _0x27efef;
        }
        return _0x4d6656.join('');
    })('${obfuscatedString}')`;

  return `eval(eval("${runningCodeStr}"))`.replaceAll('"', "`");
};
