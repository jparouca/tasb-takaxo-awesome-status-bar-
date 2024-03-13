# start
install ags by compiling to waylnad or x11 following their docs
git clone this repo to ~/.config/ags and start with either ags daemon or ags -c ~/.config/ags

# types config
if suggestions don't work, first make sure
you have TypeScript LSP working in your editor

if you do not want typechecking only suggestions

```json
// tsconfig.json
"checkJs": false
```

types are symlinked to:
/usr/share/com.github.Aylur.ags/types
