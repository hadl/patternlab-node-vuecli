const { resolve } = require('path');
const fs = require('fs-extra');
const { warn, done } = require('@vue/cli-shared-utils');
const patternlabCore = require('@pattern-lab/core');
const plConfig = require('../patternlab-config.json');

const contentBaseDir = resolve('./', plConfig.paths.public.root);
const pluginName = 'PatternlabPlugin';

class PatternlabPlugin {
  constructor() {
    this.patternlab = patternlabCore(plConfig);
    this.firstRun = true;
  }

  apply(compiler) {
    // fix html webpack plugin error child compilation failed
    // due to missing index.html inside the content base dir
    // because patternlab build not finished before html plugin init :(
    // create index.html
    fs.ensureFileSync(resolve(contentBaseDir, 'index.html'));

    compiler.hooks.done.tap(pluginName, () => {
      if (this.firstRun) {
        this.firstRun = false;
        this.buildPatternlab();
      }
    });
  }

  buildPatternlab() {
    const { cleanPublic } = plConfig;
    const options = {
      cleanPublic,
      watch: true,
    };

    if (!this.patternlab.isBusy()) {
      try {
        this.patternlab.build(options)
          .then(() => {
            done('Patternlab build complete');
          })
          .catch((error) => {
            warn(`Patternlab build error: ${error}`);
          });
      } catch (e) {
        warn(`Patternlab build error: ${e}`);
      }
    }
  }
}

module.exports = PatternlabPlugin;
