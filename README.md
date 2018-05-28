# piff

This extension provides support for the Piff Language

## Features

* Syntax Highlighting
* Formatting
* Auto Transpiling *.piff => *.php

## Extension Settings

In order to get the most out of piff we recommend you apply these settings to your workspace:

```json
{
  "formatOnSave": true,
  "*.php": {
    "when": "$(basename).piff"
  }
}
```

## Known Issues

None atm, it's still early days.

## Release Notes

### 0.0.1

Initial release of piff vscode support 


-----------------------------------------------------------------------------------------------------------

