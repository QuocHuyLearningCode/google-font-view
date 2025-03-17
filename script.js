const fonts = {
    Poppins: "Poppins",
    Roboto: "Roboto",
    "Open Sans": "Open+Sans",
    "Noto Sans Japanese": "Noto+Sans+Japanese",
    Montserrat: "Montserrat",
    Lato: "Lato",
    Inter: "Inter",
    "Roboto Condensed": "Roboto+Condensed",
    "Roboto Mono": "Roboto+Mono",
    Oswald: "Oswald",
    Raleway: "Raleway",
    "Nunito Sans": "Nunito+Sans",
    Nunito: "Nunito",
    Ubuntu: "Ubuntu",
    Rubik: "Rubik",
    "Playfair Display": "Playfair+Display",
    Merriweather: "Merriweather",
    "Noto Sans Korean": "Noto+Sans+Korean",
    "Roboto Slab": "Roboto+Slab",
    "PT Sans": "PT+Sans",
    Kanit: "Kanit",
    "Work Sans": "Work+Sans",
    Mulish: "Mulish",
    Lora: "Lora",
    "DM Sans": "DM+Sans",
    "Noto Sans Traditional Chinese": "Noto+Sans+Traditional+Chinese",
    "Fira Sans": "Fira+Sans",
    Quicksand: "Quicksand",
    Barlow: "Barlow",
    Inconsolata: "Inconsolata",
    Manrope: "Manrope",
    "Hind Siliguri": "Hind+Siliguri",
    Heebo: "Heebo",
    "Titillium Web": "Titillium+Web",
    "IBM Plex Sans": "IBM+Plex+Sans",
    "PT Serif": "PT+Serif",
    "Noto Serif": "Noto+Serif",
    Karla: "Karla",
    "Bebas Neue": "Bebas+Neue",
    "Nanum Gothic": "Nanum+Gothic",
    "Schibsted Grotesk": "Schibsted+Grotesk",
    "Libre Franklin": "Libre+Franklin",
    Outfit: "Outfit",
    "Noto Color Emoji": "Noto+Color+Emoji",
    "Josefin Sans": "Josefin+Sans",
    Jost: "Jost",
    "Libre Baskerville": "Libre+Baskerville",
    "Source Sans 3": "Source+Sans+3",
    Mukta: "Mukta"
};

$(document).ready(function () {
    let activeElement = $(".text-area h1"); // Select h1 by default
    let loadedFonts = new Set();
    let elementStyles = new Map();
    let googleFontLinks = new Set();

    function updateCSSOutput() {
        let cssOutput = "";
        googleFontLinks.forEach((link) => {
            cssOutput += `@import url('${link}');\n`;
        });
        $(".text-area h1, .text-area h2, .text-area p").each(function () {
            let tag = $(this).prop("tagName").toLowerCase();
            let styles = $(this).attr("style");
            if (styles) {
                cssOutput += `${tag} { ${styles} }\n`;
            }
        });
        $("#cssOutput").text(cssOutput);
    }

    function applyStoredStyles(element) {
        $(".text-area h1, .text-area h2, .text-area p").removeClass("active-element");
        element.addClass("active-element");
        let styles = elementStyles.get(element[0]) || {};
        $("#fontSize").val(styles["font-size"] || element.css("font-size"));
        $("#fontWeight").val(styles["font-weight"] || element.css("font-weight"));
        $("#textColor").val(styles["color"] || rgbToHex(element.css("color")));
        $("#fontSelector").val(styles["font-family"] || element.css("font-family"));

        $("#styleItalic").toggleClass("active", styles["font-style"] === "italic");
        $("#alignLeft").toggleClass("active", styles["text-align"] === "left");
        $("#alignCenter").toggleClass("active", styles["text-align"] === "center");
        $("#alignRight").toggleClass("active", styles["text-align"] === "right");
        $("#alignJustify").toggleClass("active", styles["text-align"] === "justify");
    }

    // Convert RGB to HEX (for color picker)
    function rgbToHex(rgb) {
        let result = rgb.match(/\d+/g);
        return result
            ? `#${(
                (1 << 24) +
                (parseInt(result[0]) << 16) +
                (parseInt(result[1]) << 8) +
                parseInt(result[2])
            )
                .toString(16)
                .slice(1)
                .toUpperCase()}`
            : "#000000";
    }

    $(".text-area h1, .text-area h2, .text-area p").on("click", function () {
        activeElement = $(this);
        applyStoredStyles(activeElement);
    });

    function updateStyle(property, value) {
        if (activeElement) {
            activeElement.css(property, value);
            let styles = elementStyles.get(activeElement[0]) || {};
            styles[property] = value;
            elementStyles.set(activeElement[0], styles);
            updateCSSOutput();
        }
    }

    $("#fontSize").on("change", function () {
        updateStyle("font-size", $(this).val());
    });

    $("#fontWeight").on("change", function () {
        updateStyle("font-weight", $(this).val());
    });

    $("#textColor").on("input", function () {
        updateStyle("color", $(this).val());
    });

    $("#alignLeft, #alignCenter, #alignRight, #alignJustify").on(
        "click",
        function () {
            let alignment = $(this).attr("id").replace("align", "").toLowerCase();
            updateStyle("text-align", alignment);
            $(".alignment-btn").removeClass("active");
            $(this).addClass("active");
        }
    );

    $("#styleItalic").on("click", function () {
        if (activeElement) {
            activeElement.toggleClass("font-italic");
            let styles = elementStyles.get(activeElement[0]) || {};
            styles["font-style"] = activeElement.hasClass("font-italic")
                ? "italic"
                : "normal";
            elementStyles.set(activeElement[0], styles);
            updateCSSOutput();
            $(this).toggleClass("active");
        }
    });

    $("#fontSelector").on("change", function () {
        if (activeElement) {
            let font = $(this).val();
            let fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(
                / /g,
                "+"
            )}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap`;
            if (!loadedFonts.has(font)) {
                $("head").append(
                    `<link rel="stylesheet" href="${fontUrl}" class="dynamic-font">`
                );
                loadedFonts.add(font);
                googleFontLinks.add(fontUrl);
            }
            updateStyle("font-family", `"${font}"`);
        }
    });

    // Append CSS output
    $("#main").append(
        '<div id="cssOutputContainer"><h4>Generated CSS</h4><pre id="cssOutput"></pre></div>'
    );

    // Apply default styles
    $(".text-area h1").css({
        "font-family": "Poppins",
        "font-size": "48px",
        "font-weight": "600",
        color: "#000"
    });
    $(".text-area h2").css({
        "font-family": "Poppins",
        "font-size": "32px",
        "font-weight": "600",
        color: "#333"
    });
    $(".text-area p").css({
        "font-family": "Poppins",
        "font-size": "18px",
        color: "#666"
    });

    // Select h1 by default
    applyStoredStyles(activeElement);
    updateCSSOutput();
});