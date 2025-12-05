## Changes

You can find the complete Chartlets changelog 
[here](https://github.com/bcdev/chartlets/blob/main/CHANGES.md). 

## Reporting

If you have suggestions, ideas, feature requests, or if you have identified
a malfunction or error, then please 
[post an issue](https://github.com/bcdev/chartlets/issues). 

## Contributions

The Chartlets project welcomes contributions of any form
as long as you respect our 
[code of conduct](https://github.com/bcdev/chartlets/blob/main/CODE_OF_CONDUCT.md)
and follow our 
[contribution guide](https://github.com/bcdev/chartlets/blob/main/CONTRIBUTING.md).

If you'd like to submit code or documentation changes, we ask you to provide a 
pull request (PR) 
[here](https://github.com/bcdev/chartlets/pulls). 
For code and configuration changes, your PR must be linked to a 
corresponding issue. 

## Development

To set up the Python development environment, with repository root as 
current working directory:

```bash
cd chartlets.py
pip install .[dev,doc]
```

### Testing and Coverage

Chartlets uses [pytest](https://docs.pytest.org/) for unit-level testing 
and coverage analysis for its Python code.

```bash
cd chartlets.py
pytest --cov=chartlets tests
```

### Coding Style

Chartlets' Python code is formatted by [black](https://black.readthedocs.io/).

```bash
cd chartlets.py
black .
```

Chartlets' TypeScript code is formatted by 
[prettier](https://prettier.io/).

```bash
cd chartlets.js/packages/lib
prettier -w .
```

### Documentation

Chartlets' documentation is built using the [mkdocs](https://www.mkdocs.org/) tool.

```bash
cd chartlets.py
pip install .[doc]
cd ..
```

With repository root as current working directory:

```bash
# Write
mkdocs serve

# Publish
mkdocs build
mkdocs gh-deploy
```

## Release on GitHub

This describes the release process for chartlets.

- Check issues in progress, close any open issues that have been fixed.
- Make sure that all unit tests pass and that test coverage is 100% (or as near to 100% as practicable).
- In `chartlets.py/chartlets/version.py`, `chartlets.js/packages/lib/package.json` and `chartlets.js/packages/demo/package.json` remove the .dev suffix from version name.
- Make sure `CHANGES.md` is complete in both `chartlets.js` and `chartlets.py`. Remove the suffix (in development) from the last version headline.
- Push changes to either main or a new maintenance branch and merge (see above).
- Await results from Github Action workflow.
- Go to `chartlets/releases` and press button `“Draft a new Release”`.
    - Tag version is: `v${version}` (with a “v” prefix)
    - Release title is: `${version}` (without a “v” prefix)
    - Paste latest changes from `CHANGES.md` into field `“Describe this release”`
    - Press `“Publish release”` button
- After the release on GitHub, the Github Actions CI would run to publish both
  `chartlets.py` to `PyPi` and `chartlets.js` to `npm`.
- Create a new maintenance branch (see above)
- In `chartlets.py/chartlets/version.py`, `chartlets.js/packages/lib/package.json` and `chartlets.js/packages/demo/package.json` increase version number and append a .dev0 suffix to the version name so that it is still PEP-440 compatible.
- In `CHANGES.md` add a new version headline and attach (in development) to it.
- Push changes to either main or a new maintenance branch (see above).
- Activate new doc version on mkdocs


## License

Chartlets is open source made available under the terms and conditions of the 
[MIT License](https://github.com/bcdev/chartlets/blob/main/LICENSE).

Copyright © 2024 Brockmann Consult Development
