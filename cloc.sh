
cloc --exclude-dir=$(tr '\n' ',' < .clocignore) --exclude-ext=csv,json,toml,md,svg,html .
