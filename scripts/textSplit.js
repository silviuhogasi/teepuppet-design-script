//
// Working code starts here
// Organize text and create a HTML design
// ------------------------




//
// Below are all the simple methods
//

function setTextLines(text, keyword, mainTextTransform, secondTextTransform, imageLink) {
        var list = text.split("*")
        var lines = 0;
        var fontList = ["mainFont", "secondFont"];
        var randomFont = fontList[Math.floor(Math.random() * fontList.length)];
        var onlyOneFont = Math.random() < 0.5;
        var hasImage = Math.random() < 0.5;

        for (var key=list.length; key--;) {
            if (list[key].indexOf(keyword)>=0) break;
        }

        // console.log(list)
        const randomStyle = list[Math.floor(Math.random() * list.length)];

        list.forEach(function (text) {
            lines = lines + 1;

            var div = document.createElement("div");
            div.classList.add("textLine");

            var node = document.createTextNode(text);
            var para = document.createElement("p")
            var span = document.createElement("span");
            var fontSpan = document.createElement("span")
            fontSpan.classList.add("font");
            fontSpan.appendChild(node)
            span.classList.add("inner");
            span.appendChild(fontSpan)
            para.classList.add("outer");
            para.appendChild(span);
            div.appendChild(para);

            var element = document.getElementById("design");
            element.appendChild(div);

            if ((/[tidfhlkb0-9]/g).test(text)) {
                div.classList.add("ascent");
            } 
            if ((/[ygjp]/g).test(text)) {
                div.classList.add("descent");
            }

            if (onlyOneFont) {
                div.classList.add(randomFont)
                if (randomFont.includes("main")) {
                    div.classList.add(mainTextTransform);
                } else {
                    div.classList.add(secondTextTransform);
                }
                div.classList.add('oneFont');
            } else {
                if (isEven(key)) {
                    div.classList.add("mainFont");
                    div.classList.add(mainTextTransform);
                } else {
                    div.classList.add("secondFont");
                    div.classList.add(secondTextTransform);
                }
                key = key + 1;
            }
        });
        return new Promise((resolve, reject) => {

        if(hasImage) {
            addImage(lines, imageLink).then(function() { 
                
                console.log('Image Added') 
                resolve()
            },)
            // resolve()    
        } else {
            
            resolve()
            console.log('No Image Resolve')
        }
        
        
    });

}

// Get a random value between to numbers
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//random color 
function randomColor(gender) {
    if(gender == "Male") {
        var h = Math.round(getRandomArbitrary(10, 250))
        var s = Math.round(getRandomArbitrary(80, 100)); // saturation 30-100%
        var l = Math.round(getRandomArbitrary(50, 80)); // lightness 30-70%
        console.log("Male", h, s, l)
        return 'hsl(' + h + ',' + s + '%,' + l + '%)';
    }
    var h = Math.round(getRandomArbitrary(1, 360)); // color hue between 1 and 360
    var s = Math.round(getRandomArbitrary(80, 100)); // saturation 30-100%
    var l = Math.round(getRandomArbitrary(50, 90)); // lightness 30-70%
    
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

// Count number of words
function countWords(str) {
    return str.trim().split(" ").length;
}

//check if number is even
function isEven(n) {
    return n % 2 == 0;
}

// Converts .svg-convert element to svg object


let addImage = function(lines, imageLink) {
    return new Promise(function(resolve, reject) {
    // "Producing Code" (May take some time)
    linePosition = lines / 2
    fetch(imageLink)
    .then(res => res.text())
    .then(data => {
        const parser = new DOMParser();
        const img = parser.parseFromString(data, 'image/svg+xml').querySelector('svg');
        img.classList.add('convert')
        console.log('Has an Image')
        console.log(img)

        if (lines <= 2) {
            var element = document.getElementById("design").getElementsByTagName("div")[0]

            element.parentNode.insertBefore(img, element)
            console.log('less than 2')

        } else {

            if (isEven(linePosition)) {
                var position = [0, linePosition][Math.floor(Math.random() * [0, linePosition].length)];
                var element = document.getElementById("design").getElementsByTagName("div")[position]
                element.parentNode.insertBefore(img, element)
                console.log(position)
                element.classList.add(position)
                console.log('even')
            } else {
                var position = [0, Math.round(linePosition - 1)][Math.floor(Math.random() * [0, Math.round(
                    linePosition - 1)].length)];

                var element = document.getElementById("design").getElementsByTagName("div")[position]
                element.parentNode.insertBefore(img, element)
                 element.classList.add(position)
                console.log('not even')
            }
        }
        
      })
      .finally(res => resolve())
    
    //   resolve(); // when successful
    //   reject();  // when error
    });
}

function addVariable(gender) {
    return new Promise((resolve, reject) => {
        var main = randomColor(gender)
        var accent = randomColor(gender)
        var style = document.getElementsByTagName("STYLE")[0]
        style.appendChild(document.createTextNode(
            "\
            body{\
            --main-color: "+ main + ";\
            --second-color: "+ accent + ";\
            }"));
        document.head.appendChild(style);
        resolve()
    });
}

// Loads fonts and adds all the style variables
function loadFont(mainName, secondName, mainURL, secondURL) {

    return new Promise((resolve, reject) => {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(
            "\
            @font-face {\
            font-family: '" + mainName + "';\
            src: url('" + mainURL + "') format('truetype');\
            font-weight: normal;\
            font-style: normal;\
            font-display: swap;\
            }\
            @font-face {\
            font-family: '" + secondName + "';\
            src: url('" + secondURL + "') format('truetype');\
            font-weight: normal;\
            font-style: normal;\
            font-display: swap;\
            }\
            "
        ));
        document.head.appendChild(style);

       
        WebFont.load({
            classes: false,
            custom: {
                families: [mainName, secondName],
            },
            active: function () {
                //when fonts loaded
                const mainMetrics = FontMetrics({
                    fontFamily: mainName,
                    origin: 'baseline'
                });

                //Get font metrics
                const secondMetrics = FontMetrics({
                    fontFamily: secondName,
                    origin: 'baseline'
                });

                style.appendChild(document.createTextNode("\
                        :root {\
                            --main-font:'" + mainName + "';\
                            --mf-capitalHeight:" + Math.abs(mainMetrics.capHeight) + ";\
                            --mf-xHeight:" + Math.abs(mainMetrics.xHeight) + ";\
                            --mf-descender:" + Math.abs(mainMetrics.descent) + ";\
                            --mf-ascender:" + Math.abs(mainMetrics.ascent) + ";\
                            --mf-top:" + Math.abs(mainMetrics.top) + ";\
                            --mf-bottom:" + Math.abs(mainMetrics.bottom) + ";\
                            --mf-linegap: 0;\
                            --second-font: '" + secondName + "';\
                            --sf-capitalHeight:" + Math.abs(secondMetrics.capHeight) + ";\
                            --sf-xHeight:" + Math.abs(secondMetrics.xHeight) + ";\
                            --sf-descender:" + Math.abs(secondMetrics.descent) + ";\
                            --sf-ascender: " + Math.abs(secondMetrics.ascent) + ";\
                            --sf-top: " + Math.abs(secondMetrics.top) + ";\
                            --sf-bottom: " + Math.abs(secondMetrics.bottom) + ";\
                            --sf-linegap: 0;\
                            }\
                            "));
                document.head.appendChild(style);
                console.log('Fonts loaded and added to <head>')

                resolve({
                    main: mainMetrics,
                    second: secondMetrics
                })
            }
        });

    })

}


// Scale text to fit screen
function scaleText() {
    return new Promise((resolve, reject) => {
        textFit(document.getElementById("design"), {
            alignVert: false, // if true, textFit will align vertically using css tables
            alignHoriz: false, // if true, textFit will set text-align: center
            multiLine: false, // if true, textFit will not set white-space: no-wrap
            detectMultiLine: false, // disable to turn off automatic multi-line sensing
            minFontSize: 6,
            maxFontSize: 800,
            reProcess: true, // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance
            widthOnly: false, // if true, textFit will fit text to element width, regardless of text height
            alignVertWithFlexbox: true, // if true, textFit will use flexbox for vertical alignment
        });
        console.log('scale')
        resolve()
    });
}

function randomStyle() {
    return new Promise(function(resolve, reject) {
    var isOn = Math.random() < 0.7
    console.log(isOn)
    var style = {
        width: ['alt-small', 'main-small'],
        highlight: ['highlight-odd', 'highlight-even', 'highlight-all'],
        color: ['mainColor', 'secondColor', 'alt-secondColor', 'alt-mainColor', 'whiteColor'],
        custom: ['skewYTop', 'skewYDown', 'skewXLeft', 'skewXRight', 'skewOdd', 'skewEven'],
        square: ['square', 'circle']
        
    }

    if (isOn) {
        setStyle(style.highlight, 0.5); //done
        setStyle(style.square, 0.5);
        setStyle(style.color, 0.5);
        setStyle(style.custom, 0.5); // done
    }

    resolve()
});

}

function setStyle(list, random) {
    var isOn = Math.random() < random

    if (isOn) {
        const randomStyle = list[Math.floor(Math.random() * list.length)];
        var element = document.getElementById("mainContainer");
        element.classList.add(randomStyle);
 }
}
