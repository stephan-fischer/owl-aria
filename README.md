# Owl-Aria
An Owl Carousel v2 accessibility layer

## Authorship

Written by [Stephan Fischer](mailto:stephan@mrfischer.de)

## License

### Commercial license

If you want to use owl-aria to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license.

## Requirements

* jQuery
* Owl Carousel v2

## Installation

In the `<head>` of your page, after you set up your jQuery, Owl Carousel and jquery-throttle-debounce `<script>` items, add the following:

```html
<script type="text/javascript" src="owl.carousel.aria.min.js"></script>
```

## Features

* Adds WAI-ARIA visibility and role hinting attributes
* Adds keyboard navigation (arrow keys for previous/next, enter keys on controls)
* Controls the focus of each element within the carousel, for a correct tabindex sequence
* Works with nested carousels

## Usage

Once you've installed the accessibility layer plugin, it gets used automatically when you instantiate Owl Carousel.
