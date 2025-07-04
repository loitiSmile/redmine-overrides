# Redmine Overrides

This repository provides a collection of custom UI overrides for AW Redmine.

## Installation
### For humans :
1. Download Tampermonkey's extension:
   - For firefox : https://addons.mozilla.org/fr/firefox/addon/tampermonkey/
   - For Chrome/Chromium : https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
2. Follow Tampermonkey's extension setup instructions.
3. Go to Tampermonkey > Dashboard > Utilities > Import from URL
4. Import UserScript from :
  - v1 (local-compute) : https://raw.githubusercontent.com/loitiSmile/redmine-overrides/master/tampermonkey-v1.js
  - v2 (github-fetch) : https://raw.githubusercontent.com/loitiSmile/redmine-overrides/master/tampermonkey-v2.js
5. Go to Redmine for changes to take effect.

### For devs :
1. Clone this repository :
    ```bash
    git clone https://github.com/loitiSmile/redmine-overrides.git
    ```
2. Download Tampermonkey's extension:
   - For firefox : https://addons.mozilla.org/fr/firefox/addon/tampermonkey/
   - For Chrome/Chromium : https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
3. Follow Tampermonkey's extension setup instructions.
4. Go to Tampermonkey > Dashboard > Utilities > Import from URL
5. Import UserScript from :
  - v1 (local-compute) : https://raw.githubusercontent.com/loitiSmile/redmine-overrides/master/tampermonkey-v1.js
  - v2 (github-fetch) : https://raw.githubusercontent.com/loitiSmile/redmine-overrides/master/tampermonkey-v2.js
6. Go to Redmine for changes to take effect.

## Auto-update
Go to Tampermonkey > Dashboard > Settings > Userscript Update > Check Interval, and select : "Every Day"

## Compatibility

- Designed for use with Redmine 5.x (please check the compatibility version for each override).
- May require adjustments for major Redmine upgrades.

## Contributing

Contributions and feedback are welcome! Please open an issue or submit a pull request with your improvements or suggestions.

## License

This repository is distributed under the MIT License. See https://github.com/loitiSmile/redmine-overrides?tab=GPL-3.0-1-ov-file#readme for details.

## Disclaimer

These overrides are provided as-is. Always back up your data and test changes thoroughly before applying them to a production Redmine instance.

---

Maintained by [loitiSmile](https://github.com/loitiSmile)