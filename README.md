# Unicode Range

Generate CSS unicode-range from a font file.

You can find the app at [unicode-range.ooooo.page](https://unicode-range.ooooo.page).

## Command line usage

1. Install [bun](https://bun.sh/docs/installation).

2. Install the project:

    ```shell
    $ bun i
    ```

3. Run the executable and follow the help:

    ```shell
    $ ./unicode-range --help

    Usage: unicode-range [options] <path>

    Generate the CSS property unicode-range from a TTF, OTF or WOFF font.

    Arguments:
      path              path to a TTF, OTF or WOFF file

    Options:
      --exclude <path>  exclude glyphs from another TTF, OTF or WOFF file
      -h, --help        display help for command
    ```
