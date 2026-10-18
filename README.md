# Toolbox banner

My technical toolbox as one page, in plain HTML, CSS and JavaScript (no framework).

* **Live page:** https://mat2m10.github.io. Hover a tool to see where I used it. Tools with a green
  dot open the GitHub repo that uses them.
* **LinkedIn banner:** `banner.png` (1584 × 396) is rendered from the same page with `?banner`.

## How it works

* `toolbox.js` holds the data: groups, tools, a note per tool and an optional repo. It builds the
  cards, draws the wiring between groups as SVG elbows, shows tooltips and scales the 1584 × 396
  stage to the window.
* `style.css` covers the blueprint grid background, the cards and tiles, and the banner mode.
* Icons are from [Simple Icons](https://simpleicons.org), stored in `assets/icons/`.

## Render the banner

```bash
chrome --headless=new --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1584,396 --screenshot=banner.png "file:///path/to/index.html?banner"
```

The bottom-left corner stays empty because LinkedIn puts the profile photo there.
