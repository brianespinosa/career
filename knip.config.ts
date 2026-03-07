import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreDependencies: [
    // Required peer dependency of @visx/xychart, which is bundled inside the
    // @visx/visx meta-package. .yarnrc.yml enforces peer deps as errors (YN0002),
    // so removing it breaks yarn install. No direct source import exists because
    // only individual @visx/* sub-packages are imported.
    '@react-spring/web',

    // Code imports individual @visx/* sub-packages (e.g. @visx/shape, @visx/scale),
    // all of which are installed via the @visx/visx meta-package. knip cannot
    // correlate sub-package import paths with the meta-package entry in package.json.
    '@visx/*',

    // Imported via @import url('normalize.css') in src/app/global.scss.
    // knip does not parse SCSS files, so the reference is invisible to static analysis.
    'normalize.css',
  ],

  ignoreBinaries: [
    // External system binary (Miller — https://miller.readthedocs.io). Used in the
    // `em` and `ic` npm scripts to convert CSV data files to JSON. Not an npm
    // package; must be installed separately on the host machine.
    'mlr',

    // Invoked via npx in the lefthook sort-package-json pre-commit hook.
    // Not installed as a project dependency — npx fetches it on demand.
    'sort-package-json',
  ],
};

export default config;
