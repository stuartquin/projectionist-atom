'use babel';

import { CompositeDisposable, File } from 'atom';

export default {
  subscriptions: null,
  config: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that project
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'projectionist-atom:open': () => this.project(),
      'projectionist-atom:open-split': () => this.project('down'),
      'projectionist-atom:open-split-vert': () => this.project('right')
    }));

    atom.packages.onDidActivatePackage((pack) => {
      if (pack.name === 'ex-mode') {
        Ex = pack.mainModule.provideEx()
        Ex.registerCommand('AV', () => {
          this.project('right')
        })
        Ex.registerCommand('AT', () => {
          this.project()
        })
        Ex.registerCommand('AS', () => {
          this.project('down')
        })
      }
    })
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {}
  },

  getProjectionRegex(projection) {
    let escaped = projection.replace(new RegExp('/', 'g'), '\\/')
    escaped = escaped.replace(new RegExp('\\.', 'g'), '\\.')
    escaped = escaped.replace('*', '(.*)')
    return new RegExp(escaped);
  },

  getAlternateFile(path, projections) {
    const paths = Object.keys(projections)
    let match
    let projection

    paths.forEach((p) => {
      let m = this.getProjectionRegex(p).exec(path)
      if (m) {
        match = m
        projection = projections[p]
      }
    });

    if (projection && match && match.length > 1) {
      return projection.alternate.replace("{}", match[1])
    }
  },

  project(splitDir) {
    const basePath = atom.project.getDirectories()[0].path
    const currentPath = atom.workspace.getActiveTextEditor().getPath()
    const configFile = new File(`${basePath}/.projections.json`)

    let config = {
      activatePane: true
    }

    if (splitDir) {
      config.split = splitDir
    }

    configFile.read(true).then((contents) => {
      const alternate = this.getAlternateFile(currentPath, JSON.parse(contents));
      if (alternate) {
        atom.workspace.open(`${basePath}/${alternate}`, config)
      }
    })
  }

};
