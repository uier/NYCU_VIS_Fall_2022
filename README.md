# NYCU VIS Fall 2022

✨[DEMO WEBSITE HERE](https://uier.github.io/nycu-vis-fall-2022/index.html)✨

## Develop `index.html`

`index.html` is the entry of the website which displaying the assignments, for developing it, make sure to run the following command to produce the css by [tailwindcss CLI](https://tailwindcss.com/blog/standalone-cli)

### Development build with watcher
```
./tailwindcss -o index.css --watch
```
### Production build
```
./tailwindcss -o index.css --minify
```