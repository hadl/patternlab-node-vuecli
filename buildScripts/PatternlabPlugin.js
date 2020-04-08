const globby = require('globby');
const minimatch = require('minimatch');
const { resolve, join } = require('path');
const fs = require('fs-extra');
const { info, warn } = require('@vue/cli-shared-utils');
const patternlabCore = require('@pattern-lab/core');

const VueService = process.VUE_CLI_SERVICE;

const plConfig = require('../patternlab-config.json');
const contentBaseDir = join(VueService.context, plConfig.paths.public.root);

class PatternlabPlugin {
  constructor() {
    this.pluginName = 'PatternlabPlugin';
    this.startTime = Date.now();
    this.prevTimestamps = new Map();
    this.patternlab = patternlabCore(plConfig);
    this.PlPatternPath = resolve(VueService.context, plConfig.paths.source.patterns);

    // fix html webpack plugin error child compilation failed
    // due to missing index.html inside the content base dir
    // because patternlab build not finished before html plugin init :(
    // create index.html
    fs.ensureFileSync(join(contentBaseDir, 'index.html'));
  }

  apply(compilation) {
    this.initHooks(compilation);
  }

  initHooks(compilation) {
    if (compilation.hooks) {
      compilation.hooks.afterCompile.tap(this.pluginName, this.addPatternLabFiles.bind(this));
      compilation.hooks.watchRun.tap(this.pluginName, this.watchRun.bind(this));
    }
  }

  addPatternLabFiles(compilation) {
    const patternFiles = this.getPatternlabFiles();
    patternFiles.forEach(item => {
      compilation.fileDependencies.add(item);
    });
    info('addPatternLabFiles', 'aftercompile');

    if (compilation.contextDependencies && !compilation.contextDependencies.has(this.PlPatternPath)) {
      compilation.contextDependencies.add(this.PlPatternPath);
    }
  }

  getPatternlabFiles() {
    const allWatchFiles = this.getWatchFileGlobs();

    const files = [];
    allWatchFiles.forEach(globPath => {
      const patternFiles = globby
        .sync(globPath);
      patternFiles.forEach(item => {
        files.push(item);
      });
    });

    return files;
  }

  getWatchFileGlobs() {
    const supportedTemplateExtensions = this.patternlab.getSupportedTemplateExtensions();
    const templateFilePaths = supportedTemplateExtensions.map(
      function (extension) {
        return `${plConfig.paths.source.patterns}**/*${extension}`;
      }
    );

    // pattern lab watch file globs
    const watchFiles = [
      ...templateFilePaths,
      `${plConfig.paths.source.patterns}**/*.(json|md|yaml|yml)`,
      `${plConfig.paths.source.data}**/*.(json|md|yaml|yml)`,
      `${plConfig.paths.source.meta}**/*`,
      `${plConfig.paths.source.annotations}**/*`
    ]
      .map(el => VueService.context + (el.startsWith('.') ? el.substr(1) : el));

    return watchFiles;
  }

  matchesWatchFileGlob(paths = []) {
    const globs = this.getWatchFileGlobs();
    let matches = [];
    for (let globIndex = 0; globIndex < globs.length; globIndex++) {
      matches = minimatch.match(paths, globs[globIndex]);
      if (!!matches.length) {
        break;
      }
    }

    return !!matches.length;
  }

  watchRun(compilation, callback) {
    info('watchRun');
    const changedFiles = Array.from(compilation.fileTimestamps.keys()).filter(
      watchfile => {
        return (
          (this.prevTimestamps.get(watchfile) || this.startTime)
          < (compilation.fileTimestamps.get(watchfile) || Infinity)
        );
      }
    );

    const hasChangedPLSourceFiles = !!changedFiles.length && this.matchesWatchFileGlob(changedFiles);
    const removedFiles = Array.from(compilation.removedFiles);
    const hasDeletedPLSourceFiles = !!removedFiles.length && this.matchesWatchFileGlob(removedFiles);

    if (hasChangedPLSourceFiles || hasDeletedPLSourceFiles) {
      this.buildPatternlab();
    }

    this.prevTimestamps = compilation.fileTimestamps;

    if (callback) { callback(); }
  }

  buildPatternlab() {
    const { cleanPublic } = plConfig;
    const options = { 'cleanPublic': cleanPublic };

    if (!this.patternlab.isBusy()) {
      try {
        this.patternlab.build(options)
          .then(r => {
            info('Patternlab build complete');
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
