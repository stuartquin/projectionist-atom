# projectionist-atom package

Atom implementation of the brilliant
[vim-projectionist](https://github.com/tpope/vim-projectionist) by Tim Pope

Projections are maps from file path globs to sets of properties. Projections
are defined in a `.projections.json` file at the top level of your project.

## Features
* Open mapped alternate files based on standard projectionist config
* Support for ex-mode bindings when available
* More projectionist features coming soon

## Example

With the following directory structure
```
/my-project
|-.projections.json
|- app
  |-models
    |-user.py
|-tests
  |-test_user.py
```

And `.projections.json`:

```
{
  "app/models/*.py": {                   # Glob to match file open in editor
    "alternate": "app/tests/test_{}.py"  # File to load as alternate
  }
}
```

If we open the 'my-project' folder in atom and are editing `users.py`
we can use the Command Palette and type `Projectionist` to open the corresponding
test file in a tab (Ctrl-Alt-a), split (Ctrl-Alt-s) or vertical-split (Ctrl-Alt-v).

If [ex-mode](https://atom.io/packages/ex-mode) is installed vim-like commands
are available - `:AT`, `:AS` and `:AV` for tab, split and vertical-split

In alternate fileds, `{}` will be replaced by the portion of the glob matched
by the `*`.  
