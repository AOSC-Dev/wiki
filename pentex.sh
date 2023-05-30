#!/bin/bash

##############################################################################
# Get the `pentex` script from https://github.com/neruthes/pentex
##############################################################################

##############################################################################
#   ./pentex.sh all
#           Build PDF artifacts for all Markdown files.
#   ./pentex.sh content/1.md content/2.md
#           Build multiple artifacts at once.
##############################################################################


EXTRA_ARGS=(
    -V "fontsize:10pt"
    -V "geometry:textwidth=43em,vmargin=25mm"
    --pdf-engine-opt="--shell-escape"
)

mkdir -p .dist/pdf

function remove_header() {
    fn="$1"
    line_num=$(grep -n -m 2 '+++' "$fn" | tail -n 1 | cut -d ':' -f 1)
    # Remove all lines up to and including the second occurrence of "+++"
    sed "1,${line_num}d" "$fn"
}

function makepdf() {
    mdpath="$1"
    pdfpath="$(sed 's|^content|.dist/pdf|' <<< "$mdpath.pdf")"
    url_base="https://wiki.aosc.io/$(cut -d/ -f2- <<< "$mdpath" | sed 's|.md$|/|')"
    mkdir -p "$(dirname "$pdfpath")"
    md_title="$(grep -m1 'title = ' "$mdpath" | sed 's|^title = ||' | tr -d '"')"
    H=.pentex/std.H.tex pentex <(
        remove_header "$mdpath"
    ) --shift-heading-level-by=0 -o "$pdfpath" \
        -V title:"$md_title" \
        -V url-base:"$url_base" \
        "${EXTRA_ARGS[@]}"
}



case $1 in
    all)
        find content -name '*.md' -type f | while read -r fn; do
            makepdf "$fn"
        done
        exit 0
        ;;
esac



if [[ -e "$2" ]]; then
    for fn in "$@"; do
        makepdf "$fn"
    done
else
    makepdf "$1"
fi


