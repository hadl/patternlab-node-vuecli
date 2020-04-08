# patternlab-node-vuecli
My first try to make patternlab node V3 with Twig, Vue-Cli-Service and Webpack work together.

Thank you, https://github.com/Comcast/patternlab-edition-node-webpack for your inspiration!!!


# Note
**This repo is for personal use.**

Please, keep that in mind if you are nerdy enough and going to use it - who knows :)

The complete process is coupled to the Vue-Cli-Service - this is not a Webpack only wrapper for Patternlab.

---

For me, the important things (which work) are:  
<small>Currently i did not do a lot of tests due to heavy debugging :)</small>

* Start Dev with `vue-cli-service serve`  
* Webpack Dev Server runs Patternlab with Twig Templates and not only the Vue public HTML document
* HMR for JS and CSS
    * Code Splitting / Vue Async Components loading seams to work
* Import Twig files in Twig files

Currently not working, but nice to have:
* Delete, move or rename of patterns will not correctly recomplile / remove them from the "frontend"  
    * They will be gone after restart of `serve` task

---

## Patternlab Node  
https://github.com/pattern-lab/patternlab-node

## Vue CLI  
https://github.com/vuejs/vue-cli

Used Vue settings to create project:
```
{
  "useConfigFiles": true,
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-router": {
      "historyMode": false
    },
    "@vue/cli-plugin-eslint": {
      "config": "airbnb",
      "lintOn": [
        "save"
      ]
    }
  },
  "cssPreprocessor": "node-sass"
}
``` 
