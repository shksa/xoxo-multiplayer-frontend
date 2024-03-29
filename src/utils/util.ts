const StandardHTMLColorNames = [
  "AliceBlue",
  "AntiqueWhite",
  "Aqua",
  "Aquamarine",
  "Azure",
  "Beige",
  "Bisque",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "GoldenRod",
  "Gray",
  "Grey",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed ",
  "Indigo ",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenRodYellow",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen"
  ]

function shuffleArray(array: Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const ModernColors = [
"#edd9c0",
"#c9d8c5",
"#a8b6bf",
"#7d4627",
"#6ed3cf",
"#9068be",
"#e62739",
"#9ad3de",
"#89bdd3",
"#fae596",
"#3fb0ac",
"#173e43",
"#e6cf8b",
"#b56969",
"#22264b",
"#98dafc",
"#daad86",
"#312c32",
"#1d2120",
"#5a5c51",
"#ba9077",
"#bcd5d1",
"#729f98",
"#283018",
"#aa863a",
"#c2d4d8",
"#b0aac2",
"#6534ff",
"#62bcfa",
"#fccdd3",
"#bbc4ef",
"#dbc3d0",
"#5e0231",
"#c7a693",
"#856046",
"#e6af4b",
"#e05038",
"#f2cbbc",
"#334431",
"#300032",
"#06000a",
"#c43235",
"#16174f",
"#963019",
"#262216",
"#97743a",
"#30231d",
"#c7ad88",
"#935347",
"#252839",
"#f2b632",
"#bccbde",
"#c2dde6",
"#e6e9f0",
"#431c5d",
"#e05915",
"#cdd422",
]

const colorNameGenerator = (function* (colorsArray: Array<string>) {
  let i = 0
  shuffleArray(colorsArray)
  while (i < colorsArray.length){
    yield colorsArray[i]
    i += 1
    if (i === colorsArray.length) {
      i = 0
      shuffleArray(colorsArray)
    }
  }
})(ModernColors)

export const getNewColor = () => colorNameGenerator.next().value

const setColor = (elementRef: React.RefObject<any>) => () => {
  if (elementRef.current) {
    elementRef.current.style.backgroundColor = getNewColor()
  }
}

export const ChangeColors = 
  (timeInMs: number, ...elementRefs: Array<React.RefObject<any>>) => 
    elementRefs.map(elementRef => setInterval(setColor(elementRef), timeInMs))
